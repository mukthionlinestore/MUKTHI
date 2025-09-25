import React from 'react';
import { FaCreditCard, FaMobile, FaUniversity, FaQrcode, FaInfoCircle } from 'react-icons/fa';

const PaymentInstructions = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Payment Instructions</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <FaInfoCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">How to Complete Payment</h4>
                  <p className="text-sm text-blue-800">
                    Choose any payment method below. If one doesn't work, try another option.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <FaCreditCard className="w-5 h-5 text-emerald-600 mr-2" />
                  <h4 className="font-medium text-gray-900">Credit/Debit Card (Recommended)</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Use any of these test cards:
                </p>
                <div className="bg-gray-50 rounded p-3 text-xs font-mono">
                  <div>Success: 4111 1111 1111 1111</div>
                  <div>Failure: 4000 0000 0000 0002</div>
                  <div>CVV: Any 3 digits | Expiry: Any future date</div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <FaUniversity className="w-5 h-5 text-blue-600 mr-2" />
                  <h4 className="font-medium text-gray-900">Net Banking</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Choose any bank from the list. Use test credentials provided by Razorpay.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <FaMobile className="w-5 h-5 text-purple-600 mr-2" />
                  <h4 className="font-medium text-gray-900">UPI</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Use Paytm, BHIM, or any UPI app (avoid Google Pay/PhonePe if having issues).
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                  <p className="text-xs text-yellow-800">
                    ⚠️ Google Pay & PhonePe may have issues. Try other UPI apps.
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <FaQrcode className="w-5 h-5 text-orange-600 mr-2" />
                  <h4 className="font-medium text-gray-900">UPI QR Code</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Scan the QR code with any UPI app except Google Pay/PhonePe.
                </p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">💡 Pro Tips:</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Credit/Debit cards work best for testing</li>
                <li>• If UPI fails, try card payment</li>
                <li>• All payments are secure and encrypted</li>
                <li>• You can cancel and try different methods</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Got it, Continue Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInstructions;

