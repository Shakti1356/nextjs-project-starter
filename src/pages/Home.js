import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const heroImage = "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/77a6274c-21d0-441d-b3a6-0c9f0207d99f.png";
  
  return (
    <div>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Welcome to ArthaNidhi Pay Investment & Banking
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Experience the future of banking with our secure, reliable, and innovative digital banking solutions 
            designed specifically for the Indian market.
          </p>
        </div>
        
        {/* Hero Image */}
        <div className="mb-12">
          <img 
            src={heroImage}
            alt="Modern Indian banking interface with elegant design and secure transactions"
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/dbb3ecea-2801-4532-a023-7a08695802aa.png'; 
            }}
            className="w-full max-h-96 object-cover rounded-lg shadow-2xl"
          />
        </div>
        
        {/* Call to Action Buttons */}
        <div className="text-center mb-16">
          <Link 
            to="/login" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg mr-4 transition-colors duration-200 shadow-lg"
          >
            Login to Your Account
          </Link>
          <Link 
            to="/signup" 
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 shadow-lg"
          >
            Open New Account
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose ArthaNidhi Pay Investment & Banking?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 bg-gray-50 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">₹</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Instant Transfers
              </h3>
              <p className="text-gray-600">
                Send money instantly to any bank account across India with our secure and fast transfer system.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="text-center p-6 bg-gray-50 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Bank-Grade Security
              </h3>
              <p className="text-gray-600">
                Your money and data are protected with advanced encryption and multi-layer security protocols.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="text-center p-6 bg-gray-50 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Digital First
              </h3>
              <p className="text-gray-600">
                Manage your finances anytime, anywhere with our user-friendly digital banking platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Our Banking Services
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h4 className="font-semibold text-gray-800 mb-2">Account Management</h4>
              <p className="text-sm text-gray-600">View balance, statements, and account details</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h4 className="font-semibold text-gray-800 mb-2">Fund Transfers</h4>
              <p className="text-sm text-gray-600">NEFT, RTGS, and UPI transfers</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h4 className="font-semibold text-gray-800 mb-2">Transaction History</h4>
              <p className="text-sm text-gray-600">Detailed transaction records and reports</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h4 className="font-semibold text-gray-800 mb-2">24/7 Support</h4>
              <p className="text-sm text-gray-600">Round-the-clock customer assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Account Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Try Our Demo Account
          </h2>
          <p className="text-xl mb-6">
            Experience our banking platform with a pre-loaded demo account
          </p>
          <div className="bg-white text-gray-800 p-6 rounded-lg max-w-md mx-auto">
            <h3 className="font-semibold mb-2">Demo Login Credentials:</h3>
            <p className="mb-1"><strong>Email:</strong> demo@arthanidhi.com</p>
            <p className="mb-4"><strong>Password:</strong> demo123</p>
            <Link 
              to="/login" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
            >
              Try Demo Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* Removed footer from here to use global Footer component */}
    </div>
  );
};

export default Home;
