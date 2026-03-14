import React from 'react';
import { Plus } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

const ProductCard = ({ product, openAddOnModal }) => {
  const { addItem } = useCartStore();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.addons && product.addons.length > 0) {
      openAddOnModal(product);
    } else {
      addItem(product);
    }
  };

  return (
    <div 
      onClick={() => openAddOnModal(product)}
      className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 flex flex-col h-full group"
    >
      <div className="aspect-square bg-gray-50 rounded-xl mb-4 overflow-hidden relative overflow-hidden">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = 'https://via.placeholder.com/300?text=No+Image' 
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col">
        <h3 className="font-bold text-lg text-brand-dark mb-1 line-clamp-2 leading-tight">
          {product.title}
        </h3>
        {product.isCombo && (
          <span className="inline-block bg-brand-red text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide mb-2 self-start">
            Combo Meal
          </span>
        )}
        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
          {product.description}
        </p>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="font-bold text-xl text-brand-dark">
            ₹{product.cost.toFixed(2)}
          </div>
          <button 
            onClick={handleAddToCart}
            className="bg-brand-yellow text-brand-dark w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors cursor-pointer group-hover:shadow-md"
          >
            <Plus strokeWidth={3} className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
