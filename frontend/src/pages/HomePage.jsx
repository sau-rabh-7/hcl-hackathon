import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import AddOnModal from '../components/AddOnModal';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(selectedCategory, page, true);
  }, [selectedCategory, page]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
      if (data.length > 0) {
        setSelectedCategory(data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async (categoryId, pageNum, append = false) => {
    if (!categoryId) return;
    try {
      setLoading(true);
      const { data } = await api.get(`/categories/${categoryId}/products?page=${pageNum}`);
      
      if (append && pageNum > 1) {
        setProducts(prev => [...prev, ...data.products]);
      } else {
        setProducts(data.products);
      }
      setTotalPages(data.pages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchProducts(selectedCategory, 1, false);
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.get(`/products/search?q=${searchQuery}`);
      setProducts(data);
      setTotalPages(1); // Disable pagination on search for now
      setLoading(false);
    } catch (error) {
      console.error('Error searching products:', error);
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  const openAddOnModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero / Categories Section */}
      <div className="bg-brand-red text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto">
          <form onSubmit={handleSearch} className="mb-8 max-w-xl mx-auto">
            <input 
              type="text" 
              placeholder="Search for your favorites..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-full text-brand-dark bg-white shadow-lg focus:outline-none focus:ring-4 focus:ring-yellow-400 font-medium text-lg placeholder-gray-400"
            />
          </form>

          <h1 className="text-3xl font-extrabold mb-6 tracking-tight">Our Menu</h1>
          
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
            {categories.map(cat => (
              <button
                key={cat._id}
                onClick={() => {
                  setSelectedCategory(cat._id);
                  setPage(1);
                  setSearchQuery('');
                }}
                className={`flex flex-col items-center justify-center min-w-[120px] h-32 rounded-2xl transition-all cursor-pointer ${
                  selectedCategory === cat._id 
                    ? 'bg-brand-yellow text-brand-dark scale-105 shadow-xl ring-2 ring-white' 
                    : 'bg-white text-gray-800 hover:bg-gray-100'
                }`}
              >
                {cat.logoUrl && (
                  <img src={cat.logoUrl} alt={cat.name} className="w-12 h-12 object-contain mb-3" />
                )}
                <span className="font-bold text-center leading-tight px-2">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <h2 className="text-2xl font-bold text-brand-dark mb-8">
          {searchQuery ? 'Search Results' : categories.find(c => c._id === selectedCategory)?.name || 'Products'}
        </h2>

        {loading && products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-80 rounded-2xl"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard 
                key={product._id} 
                product={product} 
                openAddOnModal={openAddOnModal}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 font-medium text-xl">
            No items found.
          </div>
        )}

        {!searchQuery && page < totalPages && (
          <div className="mt-12 text-center">
            <button 
              onClick={loadMore}
              disabled={loading}
              className="bg-white hover:bg-gray-50 text-brand-red border-2 border-brand-red font-bold py-3 px-8 rounded-full shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>

      <AddOnModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={selectedProduct} 
      />
    </div>
  );
};

export default HomePage;
