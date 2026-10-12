import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { Utensils, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authService.login(email.trim(), password);
      login(res.token, res.user);

      if (res.user.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        navigate(redirectPath);
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Demo shortcut login helper
  const handleQuickDemoLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-ivory-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-ivory-200 shadow-xl">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-terracotta-600 to-burgundy-800 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-terracotta-600/20">
            <Utensils className="w-6 h-6 text-champagne-400" />
          </div>
          <h2 className="mt-4 font-serif text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Sign In to L'Aura
          </h2>
          <p className="mt-1 text-xs text-charcoal-600">
            Access your dining reservations and booking history
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@restaurant.com"
                className="w-full pl-10 pr-4 py-3 bg-ivory-50 border border-ivory-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-ivory-50 border border-ivory-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold rounded-2xl shadow-lg shadow-terracotta-600/25 transition text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Fill Buttons for Examiner Demonstration */}
        <div className="pt-4 border-t border-ivory-200">
          <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 text-center mb-2.5">
            Quick Demonstration Credentials
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin@restaurant.com', 'Admin@123')}
              className="p-2.5 bg-ivory-100 hover:bg-ivory-200 border border-ivory-300 rounded-xl text-left transition cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-burgundy-900 font-bold text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </div>
              <div className="text-[10px] text-charcoal-600 mt-0.5 truncate">admin@restaurant.com</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('user@restaurant.com', 'User@123')}
              className="p-2.5 bg-ivory-100 hover:bg-ivory-200 border border-ivory-300 rounded-xl text-left transition cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                <User className="w-3.5 h-3.5" />
                Customer
              </div>
              <div className="text-[10px] text-charcoal-600 mt-0.5 truncate">user@restaurant.com</div>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-charcoal-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-terracotta-600 font-bold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
