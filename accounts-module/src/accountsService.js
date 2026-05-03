// HDFC Accounts Service
// Provides account-related operations

const AccountsService = {
  // Get all accounts
  getAccounts() {
    return [
      { id: 1, accountNumber: '501234567890', type: 'Savings', balance: 125000.50, branch: 'Mumbai Main', ifsc: 'HDFC0000001', status: 'Active' },
      { id: 2, accountNumber: '501234567891', type: 'Current', balance: 2500000.00, branch: 'Delhi Central', ifsc: 'HDFC0000002', status: 'Active' },
      { id: 3, accountNumber: '501234567892', type: 'Fixed Deposit', balance: 500000.00, branch: 'Bangalore South', ifsc: 'HDFC0000003', status: 'Active' },
      { id: 4, accountNumber: '501234567893', type: 'Savings', balance: 75000.25, branch: 'Chennai East', ifsc: 'HDFC0000004', status: 'Active' }
    ];
  },

  // Get account by ID
  getAccountById(id) {
    const accounts = this.getAccounts();
    return accounts.find(acc => acc.id === id);
  },

  // Get total balance
  getTotalBalance() {
    const accounts = this.getAccounts();
    return accounts.reduce((sum, acc) => sum + acc.balance, 0);
  },

  // Format account number
  formatAccountNumber(accNo) {
    return accNo.replace(/(\d{4})/g, '$1 ').trim();
  },

  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }
};

export default AccountsService;