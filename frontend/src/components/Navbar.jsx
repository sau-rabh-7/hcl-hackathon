import React, { useEffect, useRef, useState } from 'react';
import { ShoppingCart, LogOut, User as UserIcon, ChevronRight, UtensilsCrossed } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

const Navbar = ({ toggleCart }) => {
  const { getTotalItems } = useCartStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const prevCount = useRef(getTotalItems());
  const [badgeBounce, setBadgeBounce] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const current = getTotalItems();
    if (current > prevCount.current) {
      setBadgeBounce(true);
      setTimeout(() => setBadgeBounce(false), 600);
    }
    prevCount.current = current;
  }, [getTotalItems()]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalItems = getTotalItems();
  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`text-white sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-brand-red/95 backdrop-blur-lg shadow-lg shadow-brand-red/20'
          : 'bg-brand-red'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 bg-brand-dark rounded-xl flex items-center justify-center shadow-inner overflow-hidden group-hover:scale-105 transition-transform duration-200">
              <span className="text-brand-yellow font-black text-xl" style={{ fontFamily: 'Poppins, sans-serif' }}>M</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-lg tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                McDonald's
              </span>
              <span className="text-brand-yellow/80 text-xs font-medium block leading-none -mt-0.5">Portal</span>
            </div>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              onClick={toggleCart}
              id="navbar-cart-btn"
              className="relative p-2.5 hover:bg-white/15 active:bg-white/20 rounded-full transition-all duration-200 cursor-pointer group"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              {totalItems > 0 && (
                <span
                  className={`absolute -top-1 -right-1 bg-brand-yellow text-brand-dark text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow-md ${
                    badgeBounce ? 'animate-bounce-in' : ''
                  }`}
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-3 border-l border-white/20">
                {user?.role === 'Admin' && (
                  <Link
                    to="/admin"
                    className={`text-sm font-semibold px-3 py-1.5 rounded-full transition-all duration-200 hidden sm:block ${
                      location.pathname.startsWith('/admin')
                        ? 'bg-brand-yellow text-brand-dark'
                        : 'bg-black/20 text-brand-yellow hover:bg-black/30'
                    }`}
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/orders"
                  className={`text-sm font-semibold px-3 py-1.5 rounded-full transition-all duration-200 hidden sm:block ${
                    isActive('/orders')
                      ? 'bg-white/20 text-white'
                      : 'hover:bg-white/10 text-white/90 hover:text-white'
                  }`}
                >
                  My Orders
                </Link>
                <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full pl-2 pr-3 py-1">
                  <div className="w-6 h-6 rounded-full bg-brand-yellow flex items-center justify-center">
                    <UserIcon className="w-3.5 h-3.5 text-brand-dark" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-bold truncate max-w-[80px]">{user?.name?.split(' ')[0]}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-white/15 rounded-full transition-all duration-200 cursor-pointer group"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-3 border-l border-white/20">
                <Link
                  to="/login"
                  className="text-sm font-semibold hover:text-brand-yellow transition-colors duration-200 px-2 py-1"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-1 text-sm font-bold bg-brand-yellow text-brand-dark px-4 py-1.5 rounded-full hover:bg-yellow-400 active:scale-95 transition-all duration-200 shadow-md shadow-brand-yellow/30"
                >
                  Sign Up
                  <ChevronRight className="w-3.5 h-3.5" strokeWidth={3} />
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
