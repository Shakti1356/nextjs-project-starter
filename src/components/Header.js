import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear any stored user data
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              ArthaNidhi Payment Bank
            </h1>
            <span className="ml-2 text-sm text-gray-500 font-medium">
              Trusted Banking Solutions
            </span>
          </div>
          
          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Home
            </Link>
            <Link 
              to="/login" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Sign Up
            </Link>
            <Link 
              to="/dashboard" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Dashboard
            </Link>
            <Link 
              to="/transfer" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Transfer
            </Link>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
