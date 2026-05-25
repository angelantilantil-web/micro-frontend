# AI Agent Backend

This backend provides a FastAPI chatbot API backed by PostgreSQL + pgvector retrieval and Pydantic AI for answer generation.

## Overview

- `POST /chat` accepts a user question
- It computes an embedding using `pydantic-ai`
- It performs nearest-neighbor search in PostgreSQL `pgvector`
- It generates a response using `pydantic-ai` and supporting context

## Requirements

- Python 3.11+ or compatible
- PostgreSQL with pgvector extension enabled
- `OPENAI_API_KEY` environment variable for OpenAI access

## Setup

1. Install dependencies:
   ```bash
   python -m pip install -r requirements.txt
   ```

2. Create a PostgreSQL database and enable pgvector:
   ```sql
   CREATE DATABASE ai_agent;
   \c ai_agent
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

3. Set environment variables:
   - `DATABASE_URL` (example: `postgresql+psycopg2://postgres:postgres@localhost:5432/ai_agent`)
   - `OPENAI_API_KEY`
   - Optionally `AI_MODEL` and `EMBEDDING_MODEL`

4. Run the service:
   ```bash
   python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000
   ```

## Frontend integration

Point your AI module at `http://localhost:8000/chat` and send JSON `{ "question": "..." }`.

## Notes

- The first startup seeds example banking knowledge documents.
- CORS is enabled for local development.
