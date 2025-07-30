import { findUser, createUserInDb } from '../lib/db';

// Simulate API delay
const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 500));

export const loginUser = async ({ email, password }) => {
  try {
    await simulateApiDelay();
    
    const user = findUser(email);
    if (user && user.password === password) {
      // Store user session in localStorage
      const userSession = {
        id: user.id,
        username: user.username,
        email: user.email,
        accountNumber: user.accountNumber,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      localStorage.setItem('userToken', `token_${user.id}_${Date.now()}`);
      
      return { 
        success: true, 
        data: { user: userSession },
        message: 'Login successful'
      };
    }
    
    return { 
      success: false, 
      message: "Invalid email or password. Please try again." 
    };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      message: "An error occurred during login. Please try again later." 
    };
  }
};

export const signupUser = async ({ username, email, password }) => {
  try {
    await simulateApiDelay();
    
    // Check if user already exists
    const existingUser = findUser(email);
    if (existingUser) {
      return { 
        success: false, 
        message: "An account with this email already exists." 
      };
    }
    
    // Validate input
    if (!username || username.length < 3) {
      return { 
        success: false, 
        message: "Username must be at least 3 characters long." 
      };
    }
    
    if (!email || !email.includes('@')) {
      return { 
        success: false, 
        message: "Please enter a valid email address." 
      };
    }
    
    if (!password || password.length < 6) {
      return { 
        success: false, 
        message: "Password must be at least 6 characters long." 
      };
    }
    
    // Create new user
    const newUser = createUserInDb({ username, email, password });
    
    if (newUser) {
      // Store user session in localStorage
      const userSession = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        accountNumber: newUser.accountNumber,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      localStorage.setItem('userToken', `token_${newUser.id}_${Date.now()}`);
      
      return { 
        success: true, 
        data: { user: userSession },
        message: 'Account created successfully! Welcome to ArthaNidhi Payment Bank.'
      };
    }
    
    return { 
      success: false, 
      message: "Failed to create account. Please try again." 
    };
  } catch (error) {
    console.error('Signup error:', error);
    return { 
      success: false, 
      message: "An error occurred during signup. Please try again later." 
    };
  }
};

export const logoutUser = () => {
  try {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userToken');
    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, message: 'Error during logout' };
  }
};

export const getCurrentUser = () => {
  try {
    const userString = localStorage.getItem('currentUser');
    const token = localStorage.getItem('userToken');
    
    if (userString && token) {
      return JSON.parse(userString);
    }
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const isAuthenticated = () => {
  try {
    const user = getCurrentUser();
    const token = localStorage.getItem('userToken');
    return !!(user && token);
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Validate session (check if token is still valid)
export const validateSession = () => {
  try {
    const user = getCurrentUser();
    const token = localStorage.getItem('userToken');
    
    if (!user || !token) {
      return { valid: false, message: 'No active session found' };
    }
    
    // Check if session is older than 24 hours
    const loginTime = new Date(user.loginTime);
    const now = new Date();
    const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      logoutUser();
      return { valid: false, message: 'Session expired. Please login again.' };
    }
    
    return { valid: true, user };
  } catch (error) {
    console.error('Error validating session:', error);
    return { valid: false, message: 'Session validation failed' };
  }
};
