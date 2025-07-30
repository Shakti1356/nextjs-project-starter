// In-memory database simulation for ArthaNidhi Payment Bank
const db = {
  users: [
    {
      id: 1,
      username: 'demo_user',
      email: 'demo@arthanidhi.com',
      password: 'demo123',
      accountNumber: 'AN001234567890',
      balance: 25000
    }
  ],
  transactions: [
    {
      id: 1,
      userId: 1,
      date: '2024-01-15',
      description: 'Initial Deposit',
      amount: 25000,
      type: 'credit',
      beneficiary: 'Self'
    },
    {
      id: 2,
      userId: 1,
      date: '2024-01-20',
      description: 'Online Purchase',
      amount: -1500,
      type: 'debit',
      beneficiary: 'Amazon India'
    },
    {
      id: 3,
      userId: 1,
      date: '2024-01-25',
      description: 'Salary Credit',
      amount: 50000,
      type: 'credit',
      beneficiary: 'TechCorp India Pvt Ltd'
    }
  ]
};

// User management functions
export const findUser = (email) => {
  try {
    return db.users.find(user => user.email === email);
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
};

export const createUserInDb = ({ username, email, password }) => {
  try {
    const newUser = {
      id: Date.now(),
      username,
      email,
      password,
      accountNumber: `AN${Date.now()}`,
      balance: 10000 // Starting balance for new users
    };
    db.users.push(newUser);
    
    // Add initial transaction for new user
    const initialTransaction = {
      id: Date.now() + 1,
      userId: newUser.id,
      date: new Date().toISOString().split('T')[0],
      description: 'Account Opening Bonus',
      amount: 10000,
      type: 'credit',
      beneficiary: 'ArthaNidhi Payment Bank'
    };
    db.transactions.push(initialTransaction);
    
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
};

// Transaction management functions
export const getUserTransactions = (userId = 1) => {
  try {
    const user = db.users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const userTransactions = db.transactions
      .filter(txn => txn.userId === userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return {
      transactions: userTransactions,
      balance: user.balance,
      accountNumber: user.accountNumber
    };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return { transactions: [], balance: 0, accountNumber: '' };
  }
};

export const saveTransaction = ({ beneficiary, amount, remarks, userId = 1 }) => {
  try {
    const numericAmount = parseFloat(amount);
    const user = db.users.find(u => u.id === userId);
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return { success: false, message: 'Invalid amount' };
    }
    
    if (numericAmount > user.balance) {
      return { success: false, message: 'Insufficient balance' };
    }
    
    // Create new transaction
    const newTransaction = {
      id: Date.now(),
      userId: userId,
      date: new Date().toISOString().split('T')[0],
      description: `Transfer to ${beneficiary}${remarks ? ` - ${remarks}` : ''}`,
      amount: -numericAmount,
      type: 'debit',
      beneficiary: beneficiary
    };
    
    // Update user balance
    user.balance -= numericAmount;
    
    // Add transaction to database
    db.transactions.push(newTransaction);
    
    return { 
      success: true, 
      message: 'Transfer completed successfully',
      newBalance: user.balance 
    };
  } catch (error) {
    console.error('Error saving transaction:', error);
    return { success: false, message: 'Transaction failed due to system error' };
  }
};

// Get user by ID
export const getUserById = (userId) => {
  try {
    return db.users.find(user => user.id === userId);
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
};

// Update user balance
export const updateUserBalance = (userId, newBalance) => {
  try {
    const user = db.users.find(u => u.id === userId);
    if (user) {
      user.balance = newBalance;
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating user balance:', error);
    return false;
  }
};

// Get all users (for admin purposes)
export const getAllUsers = () => {
  try {
    return db.users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      accountNumber: user.accountNumber,
      balance: user.balance
    }));
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
};
