import React from 'react';
import { X } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';

const AddOnModal = ({ product, isOpen, onClose }) => {
  const { addItem } = useCartStore();
  const navigate = useNavigate();

  if (!isOpen || !product) return null;

  const handleAddBaseProduct = () => {
    addItem(product);
    onClose();
  };

  const handleAddWithAddon = (addon) => {
    addItem(product);
    addItem(addon);
    onClose();
  };

  const handleAddAndCheckout = () => {
    addItem(product);
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg bg-white rounded-3xl z-50 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="relative h-48 bg-gray-50 flex items-center justify-center p-6">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white text-gray-600 transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
          {product.imageUrl && (
            <img 
              src={product.imageUrl} 
              alt={product.title} 
              className="h-full object-contain drop-shadow-lg"
            />
          )}
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
              {product.title}
            </h2>
            <p className="text-gray-500">
              {product.description}
            </p>
            <div className="mt-2 text-xl font-bold text-brand-dark">
              ₹{product.cost.toFixed(2)}
            </div>
          </div>

          {product.addons && product.addons.length > 0 && (
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                Make it a meal? 🍟🥤
              </h3>
              <div className="space-y-3">
                {product.addons.map((addon) => (
                  <div 
                    key={addon._id} 
                    className="flex justify-between items-center p-3 sm:p-4 rounded-xl border-2 border-transparent bg-gray-50 hover:border-brand-yellow hover:bg-yellow-50 transition-colors cursor-pointer"
                    onClick={() => handleAddWithAddon(addon)}
                  >
                    <div className="flex items-center gap-3">
                      {addon.imageUrl && (
                        <img src={addon.imageUrl} alt={addon.title} className="w-12 h-12 object-contain" />
                      )}
                      <div>
                        <div className="font-bold text-gray-900">{addon.title}</div>
                        <div className="text-sm font-medium text-brand-red">
                          + ₹{addon.cost.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <button className="bg-white border shadow-sm px-4 py-1.5 rounded-full text-sm font-bold text-brand-dark">
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 flex flex-col sm:flex-row gap-3 mt-auto">
          <button 
            onClick={handleAddBaseProduct}
            className="flex-1 bg-brand-yellow hover:bg-yellow-500 text-brand-dark font-bold py-3.5 px-6 rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            Add Item to Cart
          </button>
          
          <button 
            onClick={handleAddAndCheckout}
            className="flex-1 bg-brand-red hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            Order Now
          </button>
        </div>
      </div>
    </>
  );
};

export default AddOnModal;
