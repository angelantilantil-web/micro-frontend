import React, { useState } from 'react';
import './styles.css';

const mockQA = [
  {
    question: 'What is my current account balance?',
    answer: 'Your current account balance is ₹125,480.50.'
  },
  {
    question: 'How can I raise a support ticket?',
    answer: 'You can raise a support ticket through the Help section or contact our support desk at 1800-123-4567.'
  },
  {
    question: 'Can I schedule a payment for next week?',
    answer: 'Yes, payments can be scheduled using the payments dashboard. Choose the date and confirm before submitting.'
  }
];

const suggestedQuestions = mockQA.map(item => item.question);

function findMockAnswer(query) {
  const normalized = query.trim().toLowerCase();
  const match = mockQA.find(item =>
    item.question.toLowerCase().includes(normalized) || normalized.includes(item.question.toLowerCase())
  );
  return match ? match.answer : null;
}

const hardcodedAnswerMap = [
  {
    keywords: ['balance', 'current account', 'available funds', 'available balance'],
    answer: 'Your current account balance is ₹125,480.50.'
  },
  {
    keywords: ['support', 'ticket', 'raise', 'help'],
    answer: 'You can raise a support ticket through the Help section or contact our support desk at 1800-123-4567.'
  },
  {
    keywords: ['payment', 'schedule', 'due date', 'pay'],
    answer: 'Yes, payments can be scheduled using the payments dashboard. Choose the date and confirm before submitting.'
  },
  {
    keywords: ['loan', 'application', 'documents', 'status'],
    answer: 'Check the Loans section for application status and required documents.'
  },
  {
    keywords: ['card', 'limit', 'credit card', 'debit card'],
    answer: 'You can change your card limit from Card Services after uploading any required documents.'
  }
];

export default function AIAgentApp() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I am your AI Assistant. Ask me a question or choose one of the suggested prompts.' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const getHardcodedAnswer = query => {
    const normalized = query.trim().toLowerCase();

    for (const item of hardcodedAnswerMap) {
      if (item.keywords.some(keyword => normalized.includes(keyword))) {
        return item.answer;
      }
    }

    const answer = findMockAnswer(query);
    return answer || 'Demo: I do not have a matching hardcoded answer yet.';
  };

  const sendMessage = async (customQuestion = null) => {
    const trimmed = (customQuestion ?? inputValue).trim();
    if (!trimmed) {
      return;
    }

    const userMessage = { role: 'user', text: trimmed };
    setMessages(prev => [...prev, userMessage, { role: 'bot', text: 'Thinking...' }]);
    setInputValue('');

    const botAnswer = getHardcodedAnswer(trimmed);
    setMessages(prev => [...prev.slice(0, -1), { role: 'bot', text: botAnswer }]);

    // API integration is currently disabled for static demo mode.
    /*
    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
      });

      if (!response.ok) {
        throw new Error('Backend request failed');
      }

      const data = await response.json();
      const botAnswer = data.answer || 'Sorry, I could not answer that right now.';
      setMessages(prev => [...prev.slice(0, -1), { role: 'bot', text: botAnswer }]);
    } catch (error) {
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          role: 'bot',
          text: 'Unable to reach the AI backend. Please make sure the backend is running on http://localhost:8000.',
        },
      ]);
    }
    */
  };

  const handleInputKeyDown = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestedQuestion = suggestion => {
    setInputValue(suggestion);
    sendMessage(suggestion);
  };

  return (
    <div className="ai-module-container">
      <div className="ai-module-header">
        <h1>AI Agent Chatbot</h1>
        <p>Ask questions and receive static demo responses served from frontend data only.</p>
      </div>

      <div className="demo-mode-banner">
        Static demo mode enabled — all answers are served from frontend data only.
      </div>

      <div className="ai-suggestions">
        <span>Try one of these:</span>
        <div className="suggestion-buttons">
          {suggestedQuestions.map((question, index) => (
            <button key={index} type="button" onClick={() => handleSuggestedQuestion(question)}>
              {question}
            </button>
          ))}
        </div>
      </div>

      <div className="chat-panel">
        <div className="chat-history">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${message.role === 'user' ? 'chat-user' : 'chat-bot'}`}
            >
              <div className="chat-role">{message.role === 'user' ? 'You' : 'AI Assistant'}</div>
              <div className="chat-text">{message.text}</div>
            </div>
          ))}
        </div>

        <form className="chat-input-bar" onSubmit={event => {
          event.preventDefault();
          sendMessage();
        }}>
          <textarea
            value={inputValue}
            onChange={event => setInputValue(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Type your question here..."
            rows={2}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}
