import React from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';

const CartSidebar = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeItem, getTotalAmount, clearCart } = useCartStore();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const total = getTotalAmount();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-dark/60 z-50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-red/10 rounded-xl flex items-center justify-center">
              <ShoppingBag className="text-brand-red w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-brand-dark" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Your Order
              </h2>
              <p className="text-xs text-gray-400 font-medium">{items.length} item{items.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-200 cursor-pointer active:scale-90"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-5">
                <ShoppingBag className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Your cart is empty
              </h3>
              <p className="text-gray-400 text-sm mb-6 max-w-xs">
                Looks like you haven't added anything yet. Explore our menu!
              </p>
              <button
                onClick={onClose}
                className="flex items-center gap-2 bg-brand-red text-white font-bold px-6 py-2.5 rounded-full hover:bg-red-700 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Browse Menu
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100 hover:border-brand-yellow/30 transition-colors duration-200"
              >
                {/* Image */}
                <div className="w-18 h-18 min-w-[72px] min-h-[72px] bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className="text-xs text-gray-400 font-medium">No Img</div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-sm text-gray-900 leading-tight line-clamp-2">
                      {item.title}
                    </h4>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-gray-300 hover:text-brand-red transition-colors duration-200 p-1 -mr-1 -mt-0.5 flex-shrink-0 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="font-black text-brand-dark text-sm">
                      ₹{(item.priceAtPurchase * item.quantity).toFixed(2)}
                    </span>

                    <div className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-full px-1.5 py-1">
                      <button
                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                        className="w-5 h-5 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-colors duration-200 disabled:opacity-40"
                      >
                        <Minus className="w-3 h-3 text-gray-600" strokeWidth={2.5} />
                      </button>
                      <span className="font-bold text-xs w-4 text-center text-brand-dark">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-5 h-5 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-colors duration-200"
                      >
                        <Plus className="w-3 h-3 text-gray-600" strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-white">
            {/* Subtotal */}
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-500 text-sm font-medium">Subtotal</span>
              <span className="text-gray-500 text-sm">₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-dashed border-gray-200">
              <span className="text-gray-500 text-sm font-medium">Taxes & Fees</span>
              <span className="text-gray-500 text-sm">Included</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-black text-brand-dark text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>Total</span>
              <span className="font-black text-brand-dark text-2xl">₹{total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-brand-yellow hover:bg-yellow-400 active:scale-98 text-brand-dark font-black py-4 rounded-2xl text-base flex items-center justify-center gap-2.5 shadow-md shadow-brand-yellow/40 transition-all duration-200 cursor-pointer shimmer-btn"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
            </button>

            <button
              onClick={clearCart}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-brand-red mt-3 py-1.5 uppercase font-bold tracking-widest cursor-pointer transition-colors duration-200"
            >
              <Trash2 className="w-3 h-3" />
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
