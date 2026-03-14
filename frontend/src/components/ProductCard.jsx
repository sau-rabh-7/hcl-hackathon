import React from 'react';
import { Plus, Star } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

const ProductCard = ({ product, openAddOnModal }) => {
  const { addItem } = useCartStore();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.stockQuantity === 0) return;

    if (product.addons && product.addons.length > 0) {
      openAddOnModal(product);
    } else {
      addItem(product);
    }
  };

  return (
    <div
      onClick={() => product.stockQuantity > 0 && openAddOnModal(product)}
      className={`bg-white rounded-2xl shadow-card hover:shadow-card-hover border border-gray-100/80 flex flex-col h-full group overflow-hidden transition-all duration-300 ${product.stockQuantity === 0 ? 'opacity-70 cursor-not-allowed grayscale-[0.2]' : 'cursor-pointer hover:-translate-y-1.5'
        }`}
    >
      {/* Image Container */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden aspect-square">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-red/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-contain p-5 group-hover:scale-110 transition-transform duration-500 ease-out drop-shadow-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-medium">
            No image
          </div>
        )}



        {/* Stock Badge */}
        {product.stockQuantity === 0 ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50 backdrop-blur-sm">
            <span className="bg-brand-red text-white font-black px-4 py-1.5 rounded-full text-sm shadow-lg rotate-[-10deg]">
              OUT OF STOCK
            </span>
          </div>
        ) : product.stockQuantity < 5 ? (
          <div className="absolute top-3 right-3 z-20">
            <span className="bg-yellow-400 text-brand-dark text-[10px] font-black px-2 py-1 rounded-full shadow-sm">
              Only {product.stockQuantity} left!
            </span>
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4">
        <h3 className="font-bold text-base text-brand-dark mb-1 line-clamp-2 leading-snug" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {product.title}
        </h3>
        <p className="text-gray-400 text-xs line-clamp-2 mb-4 font-medium leading-relaxed">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</span>
            <span className="font-black text-xl text-brand-dark">₹{product.cost.toFixed(2)}</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${product.stockQuantity === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                : 'bg-brand-yellow text-brand-dark hover:bg-yellow-400 active:scale-90 cursor-pointer shadow-brand-yellow/40 group-hover:shadow-glow-yellow shimmer-btn'
              }`}
          >
            <Plus strokeWidth={3} className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
