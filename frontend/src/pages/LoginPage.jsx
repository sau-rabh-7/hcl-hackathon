import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data, data.token);
      if (data.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left: Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient flex-col justify-between p-14 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-black/10 pointer-events-none" />
        <div className="absolute top-1/3 right-12 w-20 h-20 rounded-full bg-brand-yellow/20 pointer-events-none" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-brand-dark rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-brand-yellow font-black text-2xl" style={{ fontFamily: 'Poppins, sans-serif' }}>M</span>
            </div>
            <div>
              <span className="text-white font-black text-xl block" style={{ fontFamily: 'Poppins, sans-serif' }}>McDonald's</span>
              <span className="text-white/50 text-xs font-semibold tracking-widest uppercase">Portal</span>
            </div>
          </Link>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white leading-tight mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Welcome<br />
            Back! <span className="text-brand-yellow">👋</span>
          </h2>
          <p className="text-white/60 text-base font-medium leading-relaxed max-w-xs">
            Sign in to access your orders, track deliveries, and explore our full menu.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            {['Quick ordering', 'Order history & reordering', 'Secure checkout'].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-yellow flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white/80 text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-white/30 text-xs font-medium">
          © 2026 McDonald's Hackathon Portal
        </p>
      </div>

      {/* Right: Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center">
              <span className="text-brand-yellow font-black text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>M</span>
            </div>
            <span className="font-black text-brand-dark text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>McDonald's Portal</span>
          </div>

          <h1 className="text-3xl font-black text-brand-dark mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Sign in
          </h1>
          <p className="text-gray-400 text-sm font-medium mb-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-red font-bold hover:underline">
              Create one free
            </Link>
          </p>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm font-medium flex items-start gap-2">
              <span className="text-red-400 text-base leading-none mt-0.5">⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@test.com"
                  className="input-field pl-11"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-11 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              id="login-submit-btn"
              className="w-full bg-brand-red hover:bg-red-700 disabled:bg-red-400 text-white font-black py-4 rounded-xl mt-2 flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-lg shadow-brand-red/30 shimmer-btn"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
