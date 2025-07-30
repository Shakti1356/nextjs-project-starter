import { getUserTransactions, saveTransaction, getUserById } from '../lib/db';
import { getCurrentUser } from './auth';

// Simulate API delay
const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 300));

export const getTransactions = async () => {
  try {
    await simulateApiDelay();
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    const data = getUserTransactions(currentUser.id);
    
    return {
      success: true,
      transactions: data.transactions,
      balance: data.balance,
      accountNumber: data.accountNumber,
      message: 'Transactions fetched successfully'
    };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transaction data. Please try again.');
  }
};

export const addTransaction = async ({ beneficiary, amount, remarks }) => {
  try {
    await simulateApiDelay();
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: 'User not authenticated. Please login again.'
      };
    }
    
    // Validate input
    if (!beneficiary || beneficiary.trim().length === 0) {
      return {
        success: false,
        message: 'Beneficiary account number is required.'
      };
    }
    
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return {
        success: false,
        message: 'Please enter a valid amount greater than 0.'
      };
    }
    
    if (numericAmount < 1) {
      return {
        success: false,
        message: 'Minimum transfer amount is ₹1.'
      };
    }
    
    if (numericAmount > 100000) {
      return {
        success: false,
        message: 'Maximum transfer amount is ₹1,00,000 per transaction.'
      };
    }
    
    // Check if beneficiary account number is valid format
    const accountNumberRegex = /^[A-Z]{2}\d{10,12}$/;
    if (!accountNumberRegex.test(beneficiary.trim())) {
      return {
        success: false,
        message: 'Invalid account number format. Please use format: AN1234567890'
      };
    }
    
    // Prevent self-transfer
    if (beneficiary.trim() === currentUser.accountNumber) {
      return {
        success: false,
        message: 'Cannot transfer to your own account.'
      };
    }
    
    const result = saveTransaction({
      beneficiary: beneficiary.trim(),
      amount: numericAmount,
      remarks: remarks ? remarks.trim() : '',
      userId: currentUser.id
    });
    
    if (result.success) {
      return {
        success: true,
        message: `₹${numericAmount.toLocaleString('en-IN')} transferred successfully to ${beneficiary}`,
        newBalance: result.newBalance,
        transactionId: `TXN${Date.now()}`
      };
    } else {
      return {
        success: false,
        message: result.message || 'Transaction failed. Please try again.'
      };
    }
  } catch (error) {
    console.error('Transaction error:', error);
    return {
      success: false,
      message: 'Transaction failed due to system error. Please try again later.'
    };
  }
};

export const getAccountBalance = async () => {
  try {
    await simulateApiDelay();
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    const user = getUserById(currentUser.id);
    if (!user) {
      throw new Error('User account not found');
    }
    
    return {
      success: true,
      balance: user.balance,
      accountNumber: user.accountNumber,
      message: 'Balance fetched successfully'
    };
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw new Error('Failed to fetch account balance. Please try again.');
  }
};

export const getTransactionHistory = async (limit = 10, offset = 0) => {
  try {
    await simulateApiDelay();
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    const data = getUserTransactions(currentUser.id);
    const transactions = data.transactions.slice(offset, offset + limit);
    
    return {
      success: true,
      transactions,
      total: data.transactions.length,
      hasMore: offset + limit < data.transactions.length,
      message: 'Transaction history fetched successfully'
    };
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    throw new Error('Failed to fetch transaction history. Please try again.');
  }
};

// Validate beneficiary account (mock validation)
export const validateBeneficiary = async (accountNumber) => {
  try {
    await simulateApiDelay();
    
    // Mock validation - in real app, this would check with bank's database
    const accountNumberRegex = /^[A-Z]{2}\d{10,12}$/;
    
    if (!accountNumberRegex.test(accountNumber)) {
      return {
        valid: false,
        message: 'Invalid account number format'
      };
    }
    
    // Mock some valid account numbers
    const validAccounts = [
      'AN1234567890',
      'AN9876543210',
      'AN5555666677',
      'AN1111222233'
    ];
    
    const isValid = validAccounts.includes(accountNumber) || Math.random() > 0.3;
    
    return {
      valid: isValid,
      message: isValid ? 'Valid account number' : 'Account number not found',
      beneficiaryName: isValid ? 'John Doe' : null
    };
  } catch (error) {
    console.error('Error validating beneficiary:', error);
    return {
      valid: false,
      message: 'Unable to validate account number'
    };
  }
};
