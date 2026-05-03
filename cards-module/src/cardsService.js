// HDFC Cards Service
// Provides card-related operations

const CardsService = {
  // Get all cards
  getCards() {
    return [
      { id: 1, cardNumber: '452201XXXXXX1234', type: 'Credit Card', name: 'HDFC Regalia', limit: 500000, available: 425000, dueDate: '2026-05-25', status: 'Active', network: 'Visa', image: '💳' },
      { id: 2, cardNumber: '452201XXXXXX5678', type: 'Credit Card', name: 'HDFC MoneyBack+', limit: 150000, available: 125000, dueDate: '2026-05-28', status: 'Active', network: 'Mastercard', image: '💳' },
      { id: 3, cardNumber: '452201XXXXXX9012', type: 'Debit Card', name: 'HDFC EasyShop', limit: 50000, available: 35000, status: 'Active', network: 'Visa', image: '💳' },
      { id: 4, cardNumber: '452201XXXXXX3456', type: 'Credit Card', name: 'HDFC Infinia', limit: 1000000, available: 850000, dueDate: '2026-05-20', status: 'Active', network: 'Mastercard', image: '💳' }
    ];
  },

  // Get card by ID
  getCardById(id) {
    const cards = this.getCards();
    return cards.find(card => card.id === id);
  },

  // Get credit cards only
  getCreditCards() {
    return this.getCards().filter(card => card.type === 'Credit Card');
  },

  // Get debit cards only
  getDebitCards() {
    return this.getCards().filter(card => card.type === 'Debit Card');
  },

  // Get total credit limit
  getTotalLimit() {
    return this.getCreditCards().reduce((sum, card) => sum + card.limit, 0);
  },

  // Get total available
  getTotalAvailable() {
    return this.getCreditCards().reduce((sum, card) => sum + card.available, 0);
  },

  // Format card number
  formatCardNumber(cardNo) {
    return cardNo.replace(/(\d{4})/g, '$1 ').trim();
  },

  // Mask card number
  maskCardNumber(cardNo) {
    return cardNo.slice(0, 4) + ' XXXX XXXX ' + cardNo.slice(-4);
  },

  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }
};

export default CardsService;