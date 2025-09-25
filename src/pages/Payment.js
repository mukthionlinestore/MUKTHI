import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const Payment = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/checkout')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <FaArrowLeft /> Back to Checkout
          </button>
          <h1 className="text-3xl font-bold">Payment Processing</h1>
          <p className="text-gray-600">This page would handle payment processing</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Payment Integration</h2>
            <p className="text-gray-600 mb-6">
              Payment processing is integrated into the checkout flow. This separate payment page 
              is available for additional payment features like:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">PayPal Integration</h3>
              <p className="text-sm text-gray-600">Secure PayPal payment processing</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Stripe Integration</h3>
              <p className="text-sm text-gray-600">Credit card processing via Stripe</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Apple Pay</h3>
              <p className="text-sm text-gray-600">One-touch Apple Pay payments</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Google Pay</h3>
              <p className="text-sm text-gray-600">Quick Google Pay checkout</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;