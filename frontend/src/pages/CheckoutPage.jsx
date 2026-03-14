import React, { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { ShieldCheck, Lock, ChevronLeft, ArrowRight } from 'lucide-react';

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
      const payload = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtPurchase,
        })),
        totalAmount: total,
      };

      await api.post('/orders/place', payload);
      
      clearCart();
      navigate('/orders', { state: { success: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Could not process payment.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-7xl mb-5">🛒</div>
        <h2 className="text-2xl font-black text-brand-dark mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Your cart is empty
        </h2>
        <p className="text-gray-400 text-sm mb-6">Add some delicious items to get started!</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-brand-red text-white font-bold px-6 py-3 rounded-full hover:bg-red-700 transition-all active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          Go to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-brand-dark" style={{ fontFamily: 'Poppins, sans-serif' }}>Checkout</h1>
          <p className="text-xs text-gray-400 font-medium">{items.length} items in your order</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60">
              <h2 className="text-base font-black text-brand-dark" style={{ fontFamily: 'Poppins, sans-serif' }}>Order Summary</h2>
            </div>
            <div className="divide-y divide-gray-50 px-6">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between items-center py-4">
                  <div className="flex items-center gap-4">
                    {item.imageUrl && (
                      <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <img src={item.imageUrl} alt={item.title} className="w-11 h-11 object-contain" />
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-sm text-gray-900 leading-snug">{item.title}</div>
                      <div className="text-xs text-gray-400 font-medium mt-0.5">
                        {item.quantity} × ₹{item.priceAtPurchase.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="font-black text-brand-dark text-sm">
                    ₹{(item.quantity * item.priceAtPurchase).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden sticky top-24">
            {/* Card Header */}
            <div className="bg-hero-gradient px-6 py-5">
              <h3 className="text-white font-black text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>Payment Details</h3>
              <p className="text-white/60 text-xs mt-0.5 font-medium">Fast & Secure mock payment</p>
            </div>

            <div className="px-6 py-5">
              {/* Price breakdown */}
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="font-semibold text-gray-700">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Taxes &amp; Fees</span>
                  <span className="font-semibold text-green-600">Included</span>
                </div>
                <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between items-center">
                  <span className="font-black text-brand-dark text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>Total</span>
                  <span className="font-black text-brand-dark text-2xl">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-xs font-medium">
                  {error}
                </div>
              )}

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-brand-yellow hover:bg-yellow-400 disabled:opacity-60 text-brand-dark font-black py-4 rounded-xl flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.98] shadow-lg shadow-brand-yellow/30 cursor-pointer shimmer-btn"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Pay ₹{total.toFixed(2)}
                    <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                  </>
                )}
              </button>

              {/* Trust badges */}
              <div className="mt-5 flex items-center justify-center gap-4">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                  Secure
                </div>
                <div className="w-px h-3 bg-gray-200" />
                <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                  <Lock className="w-3.5 h-3.5 text-blue-500" />
                  Encrypted
                </div>
                <div className="w-px h-3 bg-gray-200" />
                <div className="text-gray-400 text-xs font-medium">Test Mode</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
