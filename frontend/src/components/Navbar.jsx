import React from 'react';
import { ShoppingCart, LogOut, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

const Navbar = ({ toggleCart }) => {
  const { getTotalItems } = useCartStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-brand-red text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-brand-yellow font-bold text-2xl tracking-tight leading-none bg-brand-dark px-2 rounded-md py-1">
              M
            </div>
            <span className="font-bold text-xl hidden sm:block">McDonald's Portal</span>
          </Link>

          <div className="flex items-center gap-6">
            <button 
              onClick={toggleCart}
              className="relative p-2 hover:bg-red-700 rounded-full transition-colors flex items-center justify-center cursor-pointer"
            >
              <ShoppingCart className="w-6 h-6" />
              {getTotalItems() > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-brand-yellow text-brand-dark text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-4 border-l border-red-400 pl-4">
                <Link to="/orders" className="text-sm font-medium hover:text-brand-yellow transition-colors hidden sm:block">
                  Order History
                </Link>
                <div className="flex items-center gap-2 bg-red-800 rounded-full px-3 py-1 text-sm font-bold">
                  <UserIcon className="w-4 h-4 text-brand-yellow" />
                  <span className="truncate max-w-[100px]">{user?.name?.split(' ')[0]}</span>
                </div>
                <button onClick={handleLogout} className="p-2 hover:bg-red-700 rounded-full transition-colors cursor-pointer" title="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex gap-4 border-l border-red-400 pl-4">
                <Link to="/login" className="text-sm font-bold hover:text-brand-yellow transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="text-sm font-bold bg-brand-yellow text-brand-dark px-3 py-1 rounded-full hover:bg-yellow-400 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
