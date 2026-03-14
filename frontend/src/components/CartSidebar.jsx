import React from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
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

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="text-brand-red w-6 h-6" />
            Your Order
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
              <ShoppingBag className="w-16 h-16 text-gray-300" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <button 
                onClick={onClose}
                className="text-brand-red font-bold hover:underline cursor-pointer"
              >
                Start Ordering
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="flex gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className="text-xs text-gray-400">No Img</div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900 leading-tight line-clamp-2 pr-2">
                      {item.title}
                    </h4>
                    <button 
                      onClick={() => removeItem(item.productId)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 -mr-1 -mt-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="font-bold text-lg text-brand-dark">
                      ₹{(item.priceAtPurchase * item.quantity).toFixed(2)}
                    </div>
                    
                    <div className="flex items-center gap-3 bg-white border shadow-sm rounded-full px-1 py-1">
                      <button 
                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t bg-gray-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-medium">Subtotal</span>
              <span className="text-xl font-bold text-brand-dark">
                ₹{getTotalAmount().toFixed(2)}
              </span>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full bg-brand-yellow hover:bg-yellow-500 text-brand-dark font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              Checkout Now
            </button>
            <div className="text-center mt-3">
              <button 
                onClick={clearCart} 
                className="text-xs text-gray-400 hover:text-gray-600 uppercase font-bold tracking-wider cursor-pointer transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
