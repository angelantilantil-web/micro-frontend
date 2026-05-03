import React, { useState, useEffect } from 'react';
import './styles.css';

// Event Bus for cross-module communication
const EventBus = window.EventBus || {
  listeners: {},
  subscribe(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  },
  publish(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
};

// Sample card data
const sampleCards = [
  { id: 1, cardNumber: '452201XXXXXX1234', type: 'Credit Card', name: 'HDFC Regalia', limit: 500000, available: 425000, dueDate: '2026-05-25', status: 'Active', network: 'Visa', image: '💳' },
  { id: 2, cardNumber: '452201XXXXXX5678', type: 'Credit Card', name: 'HDFC MoneyBack+', limit: 150000, available: 125000, dueDate: '2026-05-28', status: 'Active', network: 'Mastercard', image: '💳' },
  { id: 3, cardNumber: '452201XXXXXX9012', type: 'Debit Card', name: 'HDFC EasyShop', limit: 50000, available: 35000, status: 'Active', network: 'Visa', image: '💳' },
  { id: 4, cardNumber: '452201XXXXXX3456', type: 'Credit Card', name: 'HDFC Infinia', limit: 1000000, available: 850000, dueDate: '2026-05-20', status: 'Active', network: 'Mastercard', image: '💳' }
];

export default function CardsApp() {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

  // Initialize cards from shared store
  useEffect(() => {
    if (window.EventBus && window.EventBus.getCards) {
      const initialCards = window.EventBus.getCards();
      setCards(initialCards.length > 0 ? initialCards : sampleCards);
      setError(null);
    } else {
      setCards(sampleCards);
    }
    
    const unsubscribe = EventBus.subscribe('card:updated', (data) => {
      setCards(data.items || []);
    });

    return () => unsubscribe();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatCardNumber = (cardNo) => {
    return cardNo.replace(/(\d{4})/g, '$1 ').trim();
  };

  const maskCardNumber = (cardNo) => {
    return cardNo.slice(0, 4) + ' XXXX XXXX ' + cardNo.slice(-4);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCard(null);
  };

  const getTotalLimit = () => {
    return cards.filter(c => c.type === 'Credit Card').reduce((sum, card) => sum + card.limit, 0);
  };

  const getTotalAvailable = () => {
    return cards.filter(c => c.type === 'Credit Card').reduce((sum, card) => sum + card.available, 0);
  };

  const getCardGradient = (index) => {
    const gradients = [
      'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      'linear-gradient(135deg, #4a1c40 0%, #6b2c5b 100%)',
      'linear-gradient(135deg, #0f3460 0%, #16537e 100%)',
      'linear-gradient(135deg, #2d132c 0%, #4a1942 100%)'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="cards-container">
      <div className="module-header">
        <h1>💳 My Cards</h1>
        <p>Manage your HDFC Bank cards</p>
      </div>

      {/* Card Summary Cards */}
      <div className="card-summary">
        <div className="summary-card total">
          <span className="summary-icon">💰</span>
          <div className="summary-content">
            <h3>Total Credit Limit</h3>
            <p className="summary-amount">{formatCurrency(getTotalLimit())}</p>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon">📊</span>
          <div className="summary-content">
            <h3>Available</h3>
            <p className="summary-amount">{formatCurrency(getTotalAvailable())}</p>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon">📋</span>
          <div className="summary-content">
            <h3>Total Cards</h3>
            <p className="summary-count">{cards.length}</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Cards List */}
      <div className="cards-list">
        <h2>All Cards</h2>
        <div className="cards-grid">
          {cards.map((card, index) => (
            <div 
              key={card.id} 
              className="card-item"
              onClick={() => handleCardClick(card)}
            >
              <div 
                className="card-visual"
                style={{ background: getCardGradient(index) }}
              >
                <div className="card-type-label">{card.type}</div>
                <div className="card-network">{card.network}</div>
                <div className="card-number">{maskCardNumber(card.cardNumber)}</div>
                <div className="card-holder">{card.name}</div>
                <div className="card-expiry">
                  {card.dueDate ? `Due: ${card.dueDate}` : 'Valid Card'}
                </div>
              </div>
              <div className="card-info">
                <div className="card-name">{card.name}</div>
                {card.type === 'Credit Card' && (
                  <div className="card-limit-info">
                    <div className="limit-row">
                      <span>Limit</span>
                      <span>{formatCurrency(card.limit)}</span>
                    </div>
                    <div className="limit-row">
                      <span>Available</span>
                      <span className="available">{formatCurrency(card.available)}</span>
                    </div>
                    <div className="limit-bar">
                      <div 
                        className="limit-fill" 
                        style={{ width: `${(card.available / card.limit) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                <div className={`card-status ${card.status.toLowerCase()}`}>
                  {card.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card Detail Modal */}
      {showModal && selectedCard && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Card Details</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Card Number</span>
                <span className="detail-value">{formatCardNumber(selectedCard.cardNumber)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Card Name</span>
                <span className="detail-value">{selectedCard.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Card Type</span>
                <span className="detail-value">{selectedCard.type}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Network</span>
                <span className="detail-value">{selectedCard.network}</span>
              </div>
              {selectedCard.type === 'Credit Card' && (
                <>
                  <div className="detail-row">
                    <span className="detail-label">Credit Limit</span>
                    <span className="detail-value highlight">{formatCurrency(selectedCard.limit)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Available</span>
                    <span className="detail-value">{formatCurrency(selectedCard.available)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Due Date</span>
                    <span className="detail-value">{selectedCard.dueDate}</span>
                  </div>
                </>
              )}
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span className={`detail-value status ${selectedCard.status.toLowerCase()}`}>
                  {selectedCard.status}
                </span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary">Block Card</button>
              <button className="btn btn-secondary" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
    </div>
  );
}