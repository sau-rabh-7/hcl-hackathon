import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { RefreshCw, CheckCircle, Clock } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useNavigate, useLocation } from 'react-router-dom';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(location.state?.success || false);

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
      // Format to match product structure for addItem
      addItem({
        _id: item.productId._id,
        title: item.productId.title,
        cost: item.productId.cost,
        imageUrl: item.productId.imageUrl
      });
    });
    navigate('/checkout');
  };

  if (loading) return <div className="text-center py-20">Loading orders...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {showSuccess && (
        <div className="mb-8 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl flex items-center gap-3">
          <CheckCircle className="text-green-500 w-6 h-6" />
          <div>
            <h3 className="text-green-800 font-bold">Payment Successful!</h3>
            <p className="text-green-700 text-sm">Your order has been placed successfully.</p>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-8 text-brand-dark">Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border">
          <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4 border-b pb-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Order #{order._id.substring(order._id.length - 8)}
                  </div>
                  <div className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute:'2-digit'
                    })}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-bold">
                    {order.status === 'Paid' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4 text-yellow-600" />}
                    {order.status}
                  </div>
                  <div className="font-bold text-xl">
                    ₹{order.totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                      {item.productId?.imageUrl ? (
                        <img src={item.productId.imageUrl} alt="" className="w-8 h-8 object-contain" />
                      ) : (
                        <span className="text-xs text-gray-400">Img</span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 line-clamp-1">{item.productId?.title || 'Unknown Product'}</div>
                      <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t">
                <button 
                  onClick={() => handleReorder(order)}
                  className="flex items-center gap-2 bg-brand-light hover:bg-gray-200 text-brand-dark px-6 py-2 rounded-full font-bold transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reorder
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
