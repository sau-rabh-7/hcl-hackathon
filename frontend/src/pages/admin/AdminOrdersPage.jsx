import React, { useState, useEffect } from 'react';
import { ClipboardList, Search, User, Package, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import api from '../../api/axios';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders/admin/all');
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.userId?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col mb-8">
        <h1 className="text-2xl font-black text-brand-dark" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Customer Orders
        </h1>
        <p className="text-gray-500 text-sm font-medium mt-1">View and track all purchases made on the platform.</p>
      </div>

      {error ? (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      ) : loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white h-24 rounded-2xl border border-gray-100 p-5" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">No orders yet</h3>
          <p className="text-gray-400 text-sm mt-1">When customers place orders, they will appear here.</p>
        </div>
      ) : (
        <>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by Order ID or Customer Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-transparent focus:border-brand-yellow/50 focus:bg-white focus:ring-4 focus:ring-brand-yellow/10 rounded-xl py-2 pl-9 pr-4 text-sm font-medium text-gray-800 placeholder-gray-400 transition-all outline-none"
              />
            </div>
            <div className="text-sm font-bold text-gray-500 hidden sm:block">
              {filteredOrders.length} orders
            </div>
          </div>

          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const date = new Date(order.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
              });
              
              return (
                <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50 bg-gray-50/50">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID:</span>
                        <span className="font-black text-brand-dark" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          #{order._id.substring(order._id.length - 8).toUpperCase()}
                        </span>
                        {order.status === 'Paid' && (
                          <span className="flex items-center gap-1 bg-green-100 text-green-700 font-bold text-[10px] px-2 py-0.5 rounded-md ml-2">
                            <CheckCircle className="w-3 h-3" /> PAID
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {date}</span>
                        <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {order.userId?.name || 'Guest User'}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Amount</p>
                      <p className="text-xl font-black text-green-600 flex items-center justify-end">
                        <DollarSign className="w-4 h-4" /> {order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4" /> Ordered Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100 hover:border-brand-yellow/30 transition-colors">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1 shadow-sm border border-gray-100 flex-shrink-0">
                            {item.productId?.imageUrl ? (
                               <img src={item.productId.imageUrl} alt="" className="w-full h-full object-contain" />
                            ) : (
                               <Package className="w-5 h-5 text-gray-300" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-gray-800 line-clamp-1" title={item.productId?.title || 'Unknown Product'}>
                              {item.productId?.title || 'Unknown Product'}
                            </p>
                            <p className="text-xs font-medium text-gray-500 mt-0.5">
                              {item.quantity} × ₹{(item.priceAtPurchase || item.productId?.cost || 0).toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right mr-1">
                            <span className="text-sm font-black text-brand-dark">
                              ₹{((item.priceAtPurchase || item.productId?.cost || 0) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrdersPage;
