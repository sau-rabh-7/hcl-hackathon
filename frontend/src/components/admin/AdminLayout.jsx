import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Store, Layers, ClipboardList } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Products', path: '/admin/products', icon: Store, exact: false },
    { label: 'Categories', path: '/admin/categories', icon: Layers, exact: false },
    { label: 'Orders', path: '/admin/orders', icon: ClipboardList, exact: false },
  ];

  const isActive = (path, exact) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-100 hidden md:block">
          <h2 className="text-xl font-black text-brand-dark" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Seller Portal
          </h2>
          <p className="text-xs text-gray-400 font-medium mt-1">Manage your store</p>
        </div>

        <nav className="flex-1 p-4 flex md:flex-col gap-2 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap min-w-max md:min-w-0 ${
                  active
                    ? 'bg-brand-red text-white shadow-md shadow-brand-red/20 font-bold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-brand-red font-medium'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden relative">
        <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
