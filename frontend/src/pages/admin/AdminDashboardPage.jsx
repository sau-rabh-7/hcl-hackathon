import React, { useState, useEffect } from 'react';
import { Store, Layers, ClipboardList, TrendingUp, DollarSign, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    revenue: 0,
    lowStock: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, categoriesRes, ordersRes] = await Promise.all([
          api.get('/products/admin/all'),
          api.get('/categories'),
          api.get('/orders/admin/all'),
        ]);

        const products = productsRes.data;
        const categories = categoriesRes.data;
        const orders = ordersRes.data;

        const totalRevenue = orders
          .filter(o => o.status === 'Paid')
          .reduce((sum, order) => sum + order.totalAmount, 0);

        const lowStockCount = products.filter(p => p.stockQuantity < 5).length;

        setStats({
          products: products.length,
          categories: categories.length,
          orders: orders.length,
          revenue: totalRevenue,
          lowStock: lowStockCount,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Total Revenue', value: `₹${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Orders', value: stats.orders, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Products', value: stats.products, icon: Store, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Low Stock Items', value: stats.lowStock, icon: TrendingUp, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100 shadow-sm" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-brand-dark" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Seller Dashboard
        </h1>
        <p className="text-gray-500 text-sm font-medium mt-1">Overview of your store's performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-bold mb-1">{stat.label}</h3>
                <p className="text-3xl font-black text-brand-dark" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-black text-brand-dark mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/admin/products"
            className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-yellow/50 transition-all group"
          >
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-brand-yellow/20 transition-colors">
              <Store className="w-5 h-5 text-gray-500 group-hover:text-brand-dark" />
            </div>
            <div>
              <p className="font-bold text-gray-800">Manage Products</p>
              <p className="text-xs text-gray-400 mt-0.5">Add, edit or update stock</p>
            </div>
          </Link>
          <Link
            to="/admin/categories"
            className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-yellow/50 transition-all group"
          >
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-brand-yellow/20 transition-colors">
              <Layers className="w-5 h-5 text-gray-500 group-hover:text-brand-dark" />
            </div>
            <div>
              <p className="font-bold text-gray-800">Manage Categories</p>
              <p className="text-xs text-gray-400 mt-0.5">Organize your menu</p>
            </div>
          </Link>
          <Link
            to="/admin/orders"
            className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-yellow/50 transition-all group"
          >
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-brand-yellow/20 transition-colors">
              <ClipboardList className="w-5 h-5 text-gray-500 group-hover:text-brand-dark" />
            </div>
            <div>
              <p className="font-bold text-gray-800">View Orders</p>
              <p className="text-xs text-gray-400 mt-0.5">Track customer purchases</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
