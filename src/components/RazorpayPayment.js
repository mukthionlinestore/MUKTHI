import React, { useEffect } from 'react';
import axios from '../config/axios';
import { toast } from 'react-toastify';

const RazorpayPayment = ({ amount, currency = 'INR', onSuccess, onFailure, orderId, customerDetails }) => {
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          resolve(window.Razorpay);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(window.Razorpay);
        script.onerror = () => {
          toast.error('Failed to load Razorpay');
          onFailure('Failed to load Razorpay');
        };
        document.body.appendChild(script);
      });
    };

    const initializePayment = async () => {
      try {
        // Load Razorpay script
        const Razorpay = await loadRazorpayScript();

        // Create Razorpay order
        const response = await axios.post('/api/payment/create-razorpay-order', {
          amount: amount,
          currency: currency,
          receipt: `receipt_${orderId || Date.now()}`
        });

        const { orderId: razorpayOrderId, keyId } = response.data;

        // Configure Razorpay options
        const options = {
          key: keyId,
          amount: response.data.amount,
          currency: response.data.currency,
          name: 'E-Shop',
          description: `Order #${orderId || 'Direct Purchase'}`,
          order_id: razorpayOrderId,
          handler: async function (response) {
            try {
              // Verify payment on backend
              const verificationResponse = await axios.post('/api/payment/verify-razorpay-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verificationResponse.data.success) {
                toast.success('Payment successful!');
                onSuccess({
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  signature: response.razorpay_signature,
                  amount: amount,
                  currency: currency
                });
              } else {
                toast.error('Payment verification failed');
                onFailure('Payment verification failed');
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              toast.error('Payment verification failed');
              onFailure('Payment verification failed');
            }
          },
          prefill: {
            name: customerDetails?.name || '',
            email: customerDetails?.email || '',
            contact: customerDetails?.phone || ''
          },
          notes: {
            address: customerDetails?.address || '',
            order_id: orderId || 'Direct Purchase'
          },
          theme: {
            color: '#10B981'
          },
          modal: {
            ondismiss: function() {
              toast.info('Payment cancelled. You can try again or choose a different payment method.');
              onFailure('Payment cancelled by user');
            }
          },
          // Add configuration for better payment flow
          config: {
            display: {
              blocks: {
                utib: {
                  name: "Pay using UTI Bank",
                  instruments: [
                    {
                      method: "card"
                    },
                    {
                      method: "netbanking",
                      banks: ["UTIB"]
                    }
                  ]
                },
                other: {
                  name: "Other Payment methods",
                  instruments: [
                    {
                      method: "card",
                      issuers: ["HDFC"]
                    },
                    {
                      method: "netbanking"
                    }
                  ]
                }
              },
              sequence: ["block.utib", "block.other"],
              preferences: {
                show_default_blocks: false
              }
            }
          }
        };

        // Initialize Razorpay payment
        const rzp = new Razorpay(options);
        rzp.open();

        // Add event listeners for better user experience
        rzp.on('payment.failed', function (resp) {
          console.error('Payment failed:', resp.error);
          toast.error(`Payment failed: ${resp.error.description}`);
          onFailure(`Payment failed: ${resp.error.description}`);
        });

        rzp.on('payment.success', function (resp) {
          console.log('Payment success:', resp);
          // This will be handled by the handler function
        });

      } catch (error) {
        console.error('Razorpay initialization error:', error);
        toast.error('Failed to initialize payment');
        onFailure('Failed to initialize payment');
      }
    };

    initializePayment();
  }, [amount, currency, onSuccess, onFailure, orderId, customerDetails]);

  return null; // This component doesn't render anything
};

export default RazorpayPayment;
