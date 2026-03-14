import React, { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const CheckoutPage = () => {
  const { items, getTotalAmount, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = getTotalAmount();

  const handlePayment = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setError('');

    try {
      // 1. Create Razorpay order on our backend
      const { data: order } = await api.post('/orders/create-razorpay-order', {
        amount: total,
      });

      // 2. Initialize Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder_key', 
        amount: order.amount,
        currency: order.currency,
        name: "McDonald's Portal",
        description: "Hackathon Order",
        order_id: order.id,
        handler: async (response) => {
          try {
            // 3. On success, verify on our backend
            await api.post('/orders/verify-payment', {
              orderDetails: {
                items: items.map(item => ({
                  productId: item.productId,
                  quantity: item.quantity,
                  priceAtPurchase: item.priceAtPurchase
                })),
                totalAmount: total,
              },
              paymentDto: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            });

            // 4. Clear cart and redirect to success
            clearCart();
            navigate('/orders', { state: { success: true } });
          } catch (verificationError) {
            console.error('Payment verification failed:', verificationError);
            setError(verificationError.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#da291c',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        setError(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (err) {
      console.error('Error initiating checkout:', err);
      setError(err.response?.data?.message || 'Could not initiate checkout');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-20">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/" className="text-brand-red font-bold hover:underline cursor-pointer">
          Go back to menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-brand-dark">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.productId} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div className="flex items-center gap-4">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.title} className="w-12 h-12 object-contain" />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.priceAtPurchase.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="font-bold">
                    ₹{(item.quantity * item.priceAtPurchase).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-gray-50 rounded-2xl p-6 border sticky top-24">
            <h3 className="text-lg font-bold mb-4">Payment Details</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxes & Fees</span>
                <span>Included</span>
              </div>
              <div className="pt-3 border-t flex justify-between font-bold text-xl text-brand-dark">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-medium">
                {error}
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-brand-yellow hover:bg-yellow-500 text-brand-dark font-bold py-4 rounded-xl shadow-md transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Processing...' : `Pay ₹${total.toFixed(2)} with Razorpay`}
            </button>
            <p className="text-xs text-center text-gray-500 mt-4">
              Secure payment processed by Razorpay (Test Mode)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
