import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon } from 'lucide-react';
import api from '../../api/axios';

const CategoryFormModal = ({ category, onClose, onSuccess }) => {
  const isEdit = !!category;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logoUrl: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        logoUrl: category.logoUrl || '',
      });
    }
  }, [category, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let res;
      if (isEdit) {
        res = await api.put(`/categories/${category._id}`, formData);
      } else {
        res = await api.post('/categories', formData);
      }
      onSuccess(res.data, isEdit);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-black text-brand-dark" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {isEdit ? 'Edit Category' : 'New Category'}
          </h2>
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
            <div className="mb-5 bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Category Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Burgers, Beverages"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Description *</label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="A short description of the category..."
                rows={3}
                className="input-field resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Icon / Image URL</label>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <input
                    type="url"
                    name="logoUrl"
                    value={formData.logoUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/icon.png"
                    className="input-field"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">Square transparent PNG recommended</p>
                </div>
                {/* Preview */}
                <div className="w-12 h-12 flex-shrink-0 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center p-1.5 overflow-hidden">
                  {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="preview" className="w-full h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-gray-300" />
                  )}
                </div>
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
            form="category-form"
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
            {loading ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryFormModal;
