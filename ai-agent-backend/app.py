import logging
import os
import re
from dataclasses import dataclass
from math import sqrt
from types import SimpleNamespace
from typing import Iterator, List, Optional

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic_ai import Agent, Embedder
from sqlalchemy.orm import Session

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DummyAgent:
    def _extract_question(self, prompt: str) -> str:
        match = re.search(r"Question\s*:\s*(.+)$", prompt, re.IGNORECASE | re.DOTALL)
        if match:
            return match.group(1).strip().lower()
        return prompt.lower()

    def run_sync(self, prompt: str) -> SimpleNamespace:
        lower = self._extract_question(prompt)
        if "balance" in lower:
            return SimpleNamespace(output="Demo: your current balance is approximately ₹125,480.50.")
        if "support" in lower or "ticket" in lower:
            return SimpleNamespace(output="Demo: raise a support ticket from the Help section or call 1800-123-4567.")
        if "payment" in lower or "schedule" in lower:
            return SimpleNamespace(output="Demo: schedule a payment using the payments dashboard and choose a future date.")
        if "loan" in lower:
            return SimpleNamespace(output="Demo: check the Loans section for application status and required documents.")
        if "card" in lower:
            return SimpleNamespace(output="Demo: change your card limit from Card Services after uploading any required documents.")
        return SimpleNamespace(output="Demo: I am running in fallback mode. Please ask about banking tasks like balance, support, payments, loans, or cards.")


class DummyEmbedder:
    def _vectorize(self, text: str) -> List[float]:
        normalized = text.lower()
        keywords = [
            'balance', 'support', 'ticket', 'payment', 'schedule', 'loan',
            'card', 'transfer', 'statement', 'account', 'document', 'status'
        ]
        vector = [1.0 if keyword in normalized else 0.0 for keyword in keywords]
        tokens = re.findall(r"\w+", normalized)
        vector.append(float(len(tokens)))
        return vector

    def embed_sync(self, inputs: str | List[str], *, input_type: str, settings=None):
        if isinstance(inputs, list):
            return SimpleNamespace(data=[self._vectorize(text) for text in inputs])
        return SimpleNamespace(data=self._vectorize(inputs))

    async def embed(self, inputs: str | List[str], *, input_type: str, settings=None):
        return self.embed_sync(inputs, input_type=input_type, settings=settings)

    def embed_query_sync(self, query: str, *, settings=None):
        return SimpleNamespace(data=self._vectorize(query))

    async def embed_query(self, query: str, *, settings=None):
        return self.embed_query_sync(query, settings=settings)

from database import Base, SessionLocal, engine
from models import Document
from schemas import ChatRequest, ChatResponse
from seed_data import INITIAL_DOCUMENTS


def cosine_similarity(a: List[float], b: List[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = sqrt(sum(x * x for x in a))
    norm_b = sqrt(sum(y * y for y in b))
    return dot / (norm_a * norm_b) if norm_a and norm_b else 0.0


@dataclass
class DocumentRecord:
    title: str
    content: str
    embedding: List[float]


db_available = True
in_memory_documents: List[DocumentRecord] = []

load_dotenv()

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "").strip()
DEMO_MODE = os.environ.get("DEMO_MODE", "false").strip().lower() in {"true", "1", "yes"}
INVALID_KEY_VALUES = {"your_key_here", "your_openai_api_key_here", "your_key*here", ""}
HAS_OPENAI_KEY = OPENAI_API_KEY not in INVALID_KEY_VALUES
USE_API_MODE = not DEMO_MODE and HAS_OPENAI_KEY

AI_MODEL = os.environ.get("AI_MODEL", "openai:gpt-3.5-turbo")
EMBEDDING_MODEL = os.environ.get("EMBEDDING_MODEL", "openai:text-embedding-3-large")
TOP_K = int(os.environ.get("TOP_K", "3"))

if DEMO_MODE:
    logger.info("AI backend running in demo mode because DEMO_MODE=true was set.")
elif not HAS_OPENAI_KEY:
    logger.warning("OPENAI_API_KEY is missing or appears to be a placeholder. Falling back to demo mode.")

app = FastAPI(title="AI Agent Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent: Agent | None = None
embedder: Embedder | None = None


def get_db() -> Iterator[Optional[Session]]:
    if not db_available:
        yield None
        return

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_agent() -> Agent | DummyAgent:
    global agent
    if agent is None:
        if USE_API_MODE:
            try:
                agent = Agent(AI_MODEL)
            except Exception as exc:
                logger.warning("Failed to initialize OpenAI agent, falling back to demo mode: %s", exc)
                agent = DummyAgent()
        else:
            agent = DummyAgent()
    return agent


def get_embedder() -> Embedder | DummyEmbedder:
    global embedder
    if embedder is None:
        if USE_API_MODE:
            try:
                embedder = Embedder(EMBEDDING_MODEL)
            except Exception as exc:
                logger.warning("Failed to initialize OpenAI embedder, falling back to demo mode: %s", exc)
                embedder = DummyEmbedder()
        else:
            embedder = DummyEmbedder()
    return embedder


def build_prompt(question: str, docs: List[Document]) -> str:
    if not docs:
        return f"Answer the question directly and clearly: {question}"

    context = "\n\n".join([f"{doc.title}: {doc.content}" for doc in docs])
    return (
        "You are a helpful banking assistant. Use the referenced documents below to answer the user's question. "
        "If the answer cannot be derived from the documents, say you do not have enough information.\n\n"
        f"Reference documents:\n{context}\n\nQuestion: {question}\nAnswer:"
    )


async def seed_documents(db: Optional[Session]) -> None:
    if db_available and db is not None:
        existing = db.query(Document).count()
        if existing > 0:
            return

    if not db_available:
        if in_memory_documents:
            return

        embedder_instance = get_embedder()
        for item in INITIAL_DOCUMENTS:
            try:
                embedding_result = await embedder_instance.embed(
                    item["content"], input_type="document"
                )
            except Exception as exc:
                logger.warning("Embedding failed during startup; using demo embedder instead: %s", exc)
                embedder_instance = DummyEmbedder()
                embedding_result = await embedder_instance.embed(
                    item["content"], input_type="document"
                )
            embedding = getattr(embedding_result, "data", embedding_result)
            in_memory_documents.append(DocumentRecord(
                title=item["title"],
                content=item["content"],
                embedding=embedding,
            ))
        return

    embedder_instance = get_embedder()
    for item in INITIAL_DOCUMENTS:
        try:
            embedding_result = await embedder_instance.embed(
                item["content"], input_type="document"
            )
        except Exception as exc:
            logger.warning("Embedding failed during startup; using demo embedder instead: %s", exc)
            embedder_instance = DummyEmbedder()
            embedding_result = await embedder_instance.embed(
                item["content"], input_type="document"
            )
        embedding = getattr(embedding_result, "data", embedding_result)
        document = Document(
            title=item["title"],
            content=item["content"],
            embedding=embedding,
        )
        db.add(document)

    db.commit()


def search_documents(db: Optional[Session], query_vector: List[float], top_k: int = TOP_K) -> List[DocumentRecord]:
    if db_available and db is not None:
        return (
            db.query(Document)
            .order_by(Document.embedding.cosine_distance(query_vector))
            .limit(top_k)
            .all()
        )

    scored = [
        (doc, cosine_similarity(query_vector, doc.embedding))
        for doc in in_memory_documents
    ]
    scored.sort(key=lambda item: item[1], reverse=True)
    return [doc for doc, _ in scored[:top_k]]


@app.on_event("startup")
async def on_startup() -> None:
    global db_available
    try:
        Base.metadata.create_all(bind=engine)
    except Exception:
        db_available = False

    if db_available:
        try:
            with SessionLocal() as db:
                await seed_documents(db)
        except Exception:
            db_available = False
            await seed_documents(None)
    else:
        await seed_documents(None)


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok"}


def _extract_embedding(result):
    return getattr(result, "data", result)


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest, db: Optional[Session] = Depends(get_db)) -> ChatResponse:
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    
    embedder_instance = get_embedder()
    query_vector = _extract_embedding(embedder_instance.embed_query_sync(request.question))
    top_docs = search_documents(db, query_vector)

    prompt = build_prompt(request.question, top_docs)
    result = get_agent().run_sync(prompt)

    answer = getattr(result, "output", None) or str(result)
    source_titles = [doc.title for doc in top_docs]

    return ChatResponse(answer=answer.strip(), source_documents=source_titles)
