import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { RefreshCw, CheckCircle, Clock, Package, ChevronRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(location.state?.success || false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
    if (showSuccess) {
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/history');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = (order) => {
    order.items.forEach(item => {
      addItem({
        _id: item.productId._id,
        title: item.productId.title,
        cost: item.productId.cost,
        imageUrl: item.productId.imageUrl,
      });
    });
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-2xl p-6 border border-gray-100 shadow-card">
            <div className="flex justify-between mb-4">
              <div className="space-y-2">
                <div className="h-3 w-28 bg-gray-100 rounded-full" />
                <div className="h-4 w-48 bg-gray-100 rounded-full" />
              </div>
              <div className="h-8 w-24 bg-gray-100 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-14 bg-gray-50 rounded-xl" />
              <div className="h-14 bg-gray-50 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

      {/* Success Toast */}
      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-5 py-4 rounded-2xl flex items-center gap-3 animate-fade-up shadow-sm">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle className="text-green-600 w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-sm">Payment Successful! 🎉</p>
            <p className="text-green-600 text-xs font-medium mt-0.5">Your order has been placed and is being prepared.</p>
          </div>
          <button
            onClick={() => setShowSuccess(false)}
            className="ml-auto text-green-400 hover:text-green-600 text-lg font-bold cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-brand-dark" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Order History
          </h1>
          <p className="text-gray-400 text-sm font-medium mt-0.5">
            {orders.length} order{orders.length !== 1 ? 's' : ''} placed
          </p>
        </div>
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs font-bold text-brand-red hover:text-red-700 border-2 border-brand-red/20 hover:border-brand-red/40 px-4 py-2 rounded-full transition-all"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Order Again
        </Link>
      </div>

      {/* Orders */}
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-card border border-gray-100">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-black text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>No orders yet</h3>
          <p className="text-gray-400 text-sm mb-6">Place your first order and it will show up here.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-brand-red text-white font-bold px-6 py-3 rounded-full hover:bg-red-700 transition-all active:scale-95"
          >
            Explore Menu
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, idx) => {
            const isPaid = order.status === 'Paid';
            const isExpanded = expandedOrder === order._id;

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden animate-fade-up opacity-0-init hover:shadow-card-hover transition-all duration-300"
                style={{ animationDelay: `${idx * 60}ms`, animationFillMode: 'forwards' }}
              >
                {/* Order Header */}
                <div
                  className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                >
                  <div className="flex items-center gap-4">
                    {/* Timeline dot */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isPaid ? 'bg-green-100' : 'bg-yellow-100'}`}>
                      {isPaid
                        ? <CheckCircle className="w-5 h-5 text-green-600" />
                        : <Clock className="w-5 h-5 text-yellow-600" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-brand-dark text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          #{order._id.substring(order._id.length - 8).toUpperCase()}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {isPaid && <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1 animate-dot-pulse" />}
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:flex-row-reverse">
                    <span className="font-black text-brand-dark text-lg">₹{order.totalAmount.toFixed(2)}</span>
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>
                </div>

                {/* Expanded Items */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/60 animate-fade-up">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
                          <div className="w-11 h-11 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {item.productId?.imageUrl ? (
                              <img src={item.productId.imageUrl} alt="" className="w-9 h-9 object-contain" />
                            ) : (
                              <Package className="w-5 h-5 text-gray-300" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs text-gray-800 line-clamp-1">{item.productId?.title || 'Unknown Item'}</p>
                            <p className="text-xs text-gray-400 font-medium">Qty: {item.quantity}</p>
                          </div>
                          <span className="text-xs font-black text-brand-dark">
                            ₹{(item.priceAtPurchase * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleReorder(order)}
                        className="flex items-center gap-2 bg-brand-dark text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-gray-800 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Reorder
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
