import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTransaction, validateBeneficiary } from '../api/transactions';
import { getCurrentUser, isAuthenticated } from '../api/auth';

const Transfer = () => {
  const [formData, setFormData] = useState({
    beneficiary: '',
    amount: '',
    remarks: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [validatingBeneficiary, setValidatingBeneficiary] = useState(false);
  const [beneficiaryValid, setBeneficiaryValid] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const user = getCurrentUser();
    setCurrentUser(user);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear success message when form is modified
    if (successMessage) {
      setSuccessMessage('');
    }

    // Reset beneficiary validation when account number changes
    if (name === 'beneficiary') {
      setBeneficiaryValid(null);
    }
  };

  const validateBeneficiaryAccount = async (accountNumber) => {
    if (!accountNumber || accountNumber.length < 10) return;
    
    setValidatingBeneficiary(true);
    try {
      const result = await validateBeneficiary(accountNumber);
      setBeneficiaryValid(result);
    } catch (error) {
      setBeneficiaryValid({ valid: false, message: 'Unable to validate account' });
    } finally {
      setValidatingBeneficiary(false);
    }
  };

  const handleBeneficiaryBlur = () => {
    if (formData.beneficiary.trim()) {
      validateBeneficiaryAccount(formData.beneficiary.trim());
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Beneficiary validation
    if (!formData.beneficiary.trim()) {
      newErrors.beneficiary = 'Beneficiary account number is required';
    } else if (!/^[A-Z]{2}\d{10,12}$/.test(formData.beneficiary.trim())) {
      newErrors.beneficiary = 'Invalid account number format (e.g., AN1234567890)';
    } else if (formData.beneficiary.trim() === currentUser?.accountNumber) {
      newErrors.beneficiary = 'Cannot transfer to your own account';
    }

    // Amount validation
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Please enter a valid amount';
      } else if (amount < 1) {
        newErrors.amount = 'Minimum transfer amount is ₹1';
      } else if (amount > 100000) {
        newErrors.amount = 'Maximum transfer amount is ₹1,00,000';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const response = await addTransaction({
        beneficiary: formData.beneficiary.trim(),
        amount: parseFloat(formData.amount),
        remarks: formData.remarks.trim()
      });
      
      if (response.success) {
        setSuccessMessage(response.message);
        // Reset form
        setFormData({
          beneficiary: '',
          amount: '',
          remarks: ''
        });
        setBeneficiaryValid(null);
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setErrors({ general: response.message });
      }
    } catch (err) {
      setErrors({ general: 'Transfer failed. Please check your connection and try again.' });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Fund Transfer</h1>
          <p className="text-gray-600 mt-2">
            Send money securely to any bank account in India
          </p>
        </div>

        {/* Transfer Form */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 text-white">
            <h2 className="text-xl font-semibold">Transfer Details</h2>
          </div>

          <div className="p-6">
            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  {successMessage}
                </div>
                <p className="text-sm mt-2">Redirecting to dashboard in 3 seconds...</p>
              </div>
            )}

            {/* General Error */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Beneficiary Account Number */}
              <div>
                <label htmlFor="beneficiary" className="block text-sm font-medium text-gray-700 mb-1">
                  Beneficiary Account Number *
                </label>
                <input
                  id="beneficiary"
                  name="beneficiary"
                  type="text"
                  required
                  value={formData.beneficiary}
                  onChange={handleChange}
                  onBlur={handleBeneficiaryBlur}
                  className={`form-input w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.beneficiary ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="e.g., AN1234567890"
                />
                
                {/* Beneficiary Validation Status */}
                {validatingBeneficiary && (
                  <p className="mt-1 text-sm text-blue-600">Validating account number...</p>
                )}
                
                {beneficiaryValid && !validatingBeneficiary && (
                  <p className={`mt-1 text-sm ${beneficiaryValid.valid ? 'text-green-600' : 'text-red-600'}`}>
                    {beneficiaryValid.message}
                    {beneficiaryValid.valid && beneficiaryValid.beneficiaryName && 
                      ` - ${beneficiaryValid.beneficiaryName}`
                    }
                  </p>
                )}
                
                {errors.beneficiary && (
                  <p className="error-message mt-1 text-sm text-red-600">{errors.beneficiary}</p>
                )}
                
                <p className="mt-1 text-xs text-gray-500">
                  Enter account number in format: AN followed by 10-12 digits
                </p>
              </div>

              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Transfer Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₹</span>
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    min="1"
                    max="100000"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={handleChange}
                    className={`form-input w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.amount ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                
                {errors.amount && (
                  <p className="error-message mt-1 text-sm text-red-600">{errors.amount}</p>
                )}
                
                <p className="mt-1 text-xs text-gray-500">
                  Minimum: ₹1 | Maximum: ₹1,00,000 per transaction
                </p>
                
                {/* Amount Preview */}
                {formData.amount && !errors.amount && parseFloat(formData.amount) > 0 && (
                  <p className="mt-2 text-sm text-blue-600">
                    Transfer amount: {formatCurrency(parseFloat(formData.amount))}
                  </p>
                )}
              </div>

              {/* Remarks */}
              <div>
                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks (Optional)
                </label>
                <textarea
                  id="remarks"
                  name="remarks"
                  rows="3"
                  value={formData.remarks}
                  onChange={handleChange}
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add a note for this transfer (optional)"
                  maxLength="100"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.remarks.length}/100 characters
                </p>
              </div>

              {/* Transfer Summary */}
              {formData.beneficiary && formData.amount && !errors.beneficiary && !errors.amount && (
                <div className="bg-gray-50 p-4 rounded-md border">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Transfer Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">To Account:</span>
                      <span className="font-medium">{formData.beneficiary}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">{formatCurrency(parseFloat(formData.amount) || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transfer Fee:</span>
                      <span className="font-medium text-green-600">FREE</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Total Debit:</span>
                      <span>{formatCurrency(parseFloat(formData.amount) || 0)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading || validatingBeneficiary}
                  className={`flex-1 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading || validatingBeneficiary
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                  } transition-colors duration-200`}
                >
                  {loading ? 'Processing Transfer...' : 'Transfer Money'}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-blue-400">🔒</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Security Notice</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>All transfers are processed securely with bank-grade encryption</li>
                  <li>Verify beneficiary details before confirming the transfer</li>
                  <li>Keep your transaction receipt for future reference</li>
                  <li>Contact support immediately if you notice any unauthorized transactions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfer;
