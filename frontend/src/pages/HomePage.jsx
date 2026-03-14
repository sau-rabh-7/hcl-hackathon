import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import AddOnModal from '../components/AddOnModal';
import { Search, ChevronRight, Flame } from 'lucide-react';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

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
      const allCategory = { _id: 'all', name: 'All Menu' };
      setCategories([allCategory, ...data]);
      if (!selectedCategory) {
        setSelectedCategory('all');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async (categoryId, pageNum, append = false) => {
    if (!categoryId) return;
    try {
      setLoading(true);
      const endpoint = categoryId === 'all'
        ? `/products?page=${pageNum}`
        : `/categories/${categoryId}/products?page=${pageNum}`;

      const { data } = await api.get(endpoint);

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
      const endpoint = `/products/search?q=${searchQuery}${selectedCategory !== 'all' ? `&categoryId=${selectedCategory}` : ''}`;
      const { data } = await api.get(endpoint);
      setProducts(data);
      setTotalPages(1);
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

  const currentCategory = categories.find(c => c._id === selectedCategory);

  return (
    <div className="min-h-screen pb-24">

      {/* ── Hero Section ── */}
      <div className="relative overflow-hidden bg-hero-gradient pt-10 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-24 -left-12 w-64 h-64 rounded-full bg-black/10 pointer-events-none" />
        <div className="absolute top-8 right-1/4 w-12 h-12 rounded-full bg-brand-yellow/20 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          {/* Tagline */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
              <Flame className="w-3 h-3 text-brand-yellow fill-brand-yellow" />
              Freshly Made, Just For You
            </div>
            <h1
              className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              What are you
              <span className="text-brand-yellow"> craving</span>?
            </h1>
            <p className="text-white/60 text-sm font-medium mt-2">
              Order fresh meals in just a few clicks
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10">
            <div className={`flex items-center gap-3 bg-white rounded-2xl shadow-2xl px-5 py-3 transition-all duration-300 ${searchFocused ? 'ring-4 ring-brand-yellow/40 shadow-glow-yellow' : ''}`}>
              <Search className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${searchFocused ? 'text-brand-red' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search burgers, fries, shakes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="flex-1 bg-transparent py-1 text-brand-dark font-medium placeholder-gray-300 outline-none text-base"
              />
              {searchQuery && (
                <button type="submit" className="flex-shrink-0 bg-brand-red text-white px-4 py-1.5 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors active:scale-95 cursor-pointer">
                  Search
                </button>
              )}
            </div>
          </form>

          {/* Category Tabs */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((cat, idx) => (
              <button
                key={cat._id}
                onClick={() => {
                  setSelectedCategory(cat._id);
                  setPage(1);
                  setSearchQuery('');
                }}
                className={`flex flex-col items-center justify-center min-w-[100px] h-24 rounded-2xl transition-all duration-300 border-2 flex-shrink-0 ${selectedCategory === cat._id
                    ? 'bg-brand-yellow border-brand-yellow text-brand-dark scale-[1.06] shadow-glow-yellow'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm'
                  }`}
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {cat.logoUrl ? (
                  <img src={cat.logoUrl} alt={cat.name} className="w-10 h-10 object-contain mb-2 drop-shadow-md" />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center mb-2">
                    <Flame className={selectedCategory === cat._id ? 'w-6 h-6 text-brand-dark' : 'w-6 h-6 text-white/70'} />
                  </div>
                )}
                <span className="font-bold text-xs text-center leading-tight px-2">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>


      {/* ── Products Section ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-dark" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {searchQuery ? (
                <>Search: <span className="text-brand-red">"{searchQuery}"</span></>
              ) : (
                currentCategory?.name || 'Our Menu'
              )}
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-1">
              {products.length} item{products.length !== 1 ? 's' : ''} available
            </p>
          </div>
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); fetchProducts(selectedCategory, 1, false); }}
              className="text-sm text-brand-red bg-red-50 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition-colors cursor-pointer"
            >
              Clear Search ×
            </button>
          )}
        </div>

        {/* Grid */}
        {loading && products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl overflow-hidden border border-gray-100">
                <div className="bg-gray-100 aspect-square" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                  <div className="h-8 bg-gray-100 rounded-xl mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product, idx) => (
              <div
                key={product._id}
                className="animate-fade-up"
                style={{ animationDelay: `${Math.min(idx * 50, 400)}ms` }}
              >
                <ProductCard
                  product={product}
                  openAddOnModal={openAddOnModal}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-card">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>No items found</h3>
            <p className="text-gray-400 text-sm">Try a different search or category</p>
          </div>
        )}

        {/* Load More */}
        {!searchQuery && page < totalPages && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-brand-red border-2 border-brand-red font-bold py-3 px-8 rounded-full shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              {loading ? 'Loading...' : (
                <>
                  Load More
                  <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                </>
              )}
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
