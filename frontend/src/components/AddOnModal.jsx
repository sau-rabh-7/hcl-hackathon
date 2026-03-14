import React, { useState } from 'react';
import { X, ShoppingCart, Zap, ChevronRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';

const AddOnModal = ({ product, isOpen, onClose }) => {
  const { addItem } = useCartStore();
  const navigate = useNavigate();
  const [addedAddon, setAddedAddon] = useState(null);

  if (!isOpen || !product) return null;

  const handleAddBaseProduct = () => {
    addItem(product);
    onClose();
  };

  const handleAddWithAddon = (addon) => {
    addItem(product);
    addItem(addon);
    setAddedAddon(addon._id);
    setTimeout(() => {
      onClose();
      setAddedAddon(null);
    }, 400);
  };

  const handleAddAndCheckout = () => {
    addItem(product);
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-dark/70 z-50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Wrapper */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-scale-in pointer-events-auto">

        {/* Image Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 hover:bg-white shadow-md rounded-full flex items-center justify-center text-gray-500 hover:text-gray-800 transition-all duration-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="h-52 flex items-center justify-center p-6">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="h-full object-contain drop-shadow-xl"
              />
            ) : (
              <div className="text-gray-300 text-6xl font-black">?</div>
            )}
          </div>

          {/* Wave divider */}
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-white" style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }} />
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-6 pt-2 pb-4">
          {/* Product Info */}
          <div className="mb-5">
            {product.isCombo && (
              <span className="badge-combo mb-2">Combo Meal</span>
            )}
            <h2 className="text-xl font-black text-brand-dark leading-tight mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {product.title}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              {product.description}
            </p>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl font-black text-brand-dark">₹{product.cost.toFixed(2)}</span>
              <span className="text-xs text-gray-400 font-medium">incl. taxes</span>
            </div>
          </div>

          {/* Addons */}
          {product.addons && product.addons.length > 0 && (
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-black text-brand-dark uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Make it a Meal 🍟
                </span>
              </div>

              <div className="space-y-2">
                {product.addons.map((addon) => (
                  <div
                    key={addon._id}
                    onClick={() => handleAddWithAddon(addon)}
                    className={`flex justify-between items-center p-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                      addedAddon === addon._id
                        ? 'border-brand-yellow bg-yellow-50 scale-[0.98]'
                        : 'border-gray-100 bg-gray-50 hover:border-brand-yellow hover:bg-yellow-50/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {addon.imageUrl && (
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0">
                          <img src={addon.imageUrl} alt={addon.title} className="w-10 h-10 object-contain" />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-sm text-gray-800">{addon.title}</div>
                        <div className="text-xs font-bold text-brand-red mt-0.5">+ ₹{addon.cost.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-white border-2 border-brand-yellow flex items-center justify-center shadow-sm flex-shrink-0">
                      <ChevronRight className="w-3.5 h-3.5 text-brand-dark" strokeWidth={3} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/80 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleAddBaseProduct}
            className="flex-1 flex items-center justify-center gap-2 bg-brand-yellow hover:bg-yellow-400 text-brand-dark font-black py-3.5 px-4 rounded-2xl transition-all duration-200 active:scale-95 shadow-md shadow-brand-yellow/30 cursor-pointer shimmer-btn"
          >
            <ShoppingCart className="w-4 h-4" strokeWidth={2.5} />
            Add to Cart
          </button>

          <button
            onClick={handleAddAndCheckout}
            className="flex-1 flex items-center justify-center gap-2 bg-brand-red hover:bg-red-700 text-white font-black py-3.5 px-4 rounded-2xl transition-all duration-200 active:scale-95 shadow-md shadow-brand-red/30 cursor-pointer shimmer-btn"
          >
            <Zap className="w-4 h-4 fill-current" strokeWidth={0} />
            Order Now
          </button>
        </div>
      </div>
      </div>
    </>
  );
};

export default AddOnModal;
