// HDFC Loans Service
// Provides loan-related operations

const LoansService = {
  // Get all loans
  getLoans() {
    return [
      { id: 1, loanNumber: 'LN5012345678', type: 'Home Loan', amount: 2500000, emi: 21500, tenure: 240, rate: 8.5, branch: 'Mumbai Main', status: 'Active', startDate: '2022-01-15', balance: 1850000 },
      { id: 2, loanNumber: 'LN5012345679', type: 'Car Loan', amount: 1200000, emi: 24500, tenure: 60, rate: 9.5, branch: 'Delhi Central', status: 'Active', startDate: '2023-06-01', balance: 850000 },
      { id: 3, loanNumber: 'LN5012345680', type: 'Personal Loan', amount: 500000, emi: 12500, tenure: 48, rate: 12.5, branch: 'Bangalore South', status: 'Active', startDate: '2024-02-10', balance: 420000 },
      { id: 4, loanNumber: 'LN5012345681', type: 'Education Loan', amount: 800000, emi: 9500, tenure: 120, rate: 7.5, branch: 'Chennai East', status: 'Active', startDate: '2023-09-01', balance: 680000 }
    ];
  },

  // Get loan by ID
  getLoanById(id) {
    const loans = this.getLoans();
    return loans.find(loan => loan.id === id);
  },

  // Get total loan amount
  getTotalLoanAmount() {
    const loans = this.getLoans();
    return loans.reduce((sum, loan) => sum + loan.amount, 0);
  },

  // Get total outstanding
  getTotalOutstanding() {
    const loans = this.getLoans();
    return loans.reduce((sum, loan) => sum + loan.balance, 0);
  },

  // Format loan number
  formatLoanNumber(loanNo) {
    return loanNo.replace(/(\d{4})/g, '$1 ').trim();
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

export default LoansService;