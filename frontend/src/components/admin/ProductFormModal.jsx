import React, { useState, useEffect } from 'react';
import { X, Save, Box, Image as ImageIcon } from 'lucide-react';
import api from '../../api/axios';

const ProductFormModal = ({ product, categories, allProducts, onClose, onSuccess }) => {
  const isEdit = !!product;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    cost: '',
    stockQuantity: '',
    imageUrl: '',
    isCombo: false,
    addons: [],
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        categoryId: product.categoryId?._id || product.categoryId || '',
        cost: product.cost || '',
        stockQuantity: product.stockQuantity || 0,
        imageUrl: product.imageUrl || '',
        isCombo: product.isCombo || false,
        addons: product.addons?.map(a => a._id || a) || [],
      });
    } else {
      // Set default category if available
      if (categories.length > 0) {
        setFormData(prev => ({ ...prev, categoryId: categories[0]._id }));
      }
    }
  }, [product, isEdit, categories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleAddonChange = (e) => {
    const options = e.target.options;
    const values = [];
    for (let i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
            values.push(options[i].value);
        }
    }
    setFormData(prev => ({ ...prev, addons: values }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        cost: Number(formData.cost),
        stockQuantity: Number(formData.stockQuantity),
      };

      let res;
      if (isEdit) {
        res = await api.put(`/products/${product._id}`, payload);
      } else {
        res = await api.post('/products', payload);
      }
      onSuccess(res.data, isEdit);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-scale-in flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-yellow/20 text-brand-dark rounded-xl flex items-center justify-center">
              <Box className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-brand-dark" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {isEdit ? 'Edit Product' : 'New Product'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form id="product-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Title */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Product Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. McChicken Burger"
                  className="input-field"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Category *</label>
                <select
                  name="categoryId"
                  required
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="input-field cursor-pointer"
                >
                  <option value="" disabled>Select a category...</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Price (₹) *</label>
                <input
                  type="number"
                  name="cost"
                  required
                  min="0"
                  step="0.01"
                  value={formData.cost}
                  onChange={handleChange}
                  placeholder="e.g. 149"
                  className="input-field"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Initial Stock *</label>
                <input
                  type="number"
                  name="stockQuantity"
                  required
                  min="0"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  className="input-field"
                />
              </div>

              {/* Combo Toggle */}
              <div className="flex items-center">
                 <label className="flex items-center gap-3 cursor-pointer mt-4 group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        name="isCombo"
                        checked={formData.isCombo}
                        onChange={handleChange}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-gray-700 group-hover:text-purple-600 transition-colors">Is Combo Meal?</span>
                      <span className="block text-xs text-gray-400">Shows combo badge in UI</span>
                    </div>
                 </label>
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Description *</label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Product description and ingredients..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              {/* Image URL */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Image URL</label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/product.png"
                      className="input-field"
                    />
                  </div>
                  {/* Preview */}
                  <div className="w-12 h-12 flex-shrink-0 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center p-1.5 overflow-hidden">
                    {formData.imageUrl ? (
                      <img src={formData.imageUrl} alt="preview" className="w-full h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                </div>
              </div>

              {/* Addons Multi-select */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Select Addons (Optional)</label>
                <select
                  multiple
                  name="addons"
                  value={formData.addons}
                  onChange={handleAddonChange}
                  className="input-field h-32 overflow-y-auto"
                >
                  {allProducts?.filter(p => !isEdit || p._id !== product._id).map(p => (
                    <option key={p._id} value={p._id} className="py-1 px-2 border-b border-gray-50 hover:bg-gray-100">
                      {p.title} (₹{p.cost})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple</p>
              </div>

            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={loading}
            className="bg-brand-red text-white font-bold px-6 py-2.5 rounded-xl hover:bg-red-700 disabled:bg-red-300 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-sm shimmer-btn"
          >
            {loading ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFormModal;
