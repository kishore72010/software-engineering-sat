import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Utensils, Calendar, ShieldCheck, LogOut, Menu, X, Sparkles, Compass } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-ivory-300 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="w-12 h-12 rounded-2xl terracotta-gradient text-white flex items-center justify-center shadow-lg shadow-terracotta-600/25 group-hover:scale-105 transition-transform border border-champagne-400/40">
            <Utensils className="w-5 h-5 text-champagne-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-2xl font-black tracking-[0.08em] text-charcoal-900 leading-tight">
                L'AURA
              </span>
              <span className="text-[10px] text-terracotta-600 font-bold px-1.5 py-0.2 bg-terracotta-50 border border-terracotta-200 rounded-md">
                EST. 2026
              </span>
            </div>
            <span className="text-[10px] tracking-[0.28em] uppercase text-charcoal-500 font-semibold block">
              Fine Dining & Reserve
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <Link
            to="/"
            className={`transition-all hover:text-terracotta-600 relative py-1 ${
              isActive('/') ? 'text-terracotta-700 font-bold' : 'text-charcoal-700'
            }`}
          >
            Home
            {isActive('/') && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-terracotta-600 rounded-full" />
            )}
          </Link>
          <Link
            to="/tables"
            className={`transition-all hover:text-terracotta-600 relative py-1 flex items-center gap-1.5 ${
              isActive('/tables') ? 'text-terracotta-700 font-bold' : 'text-charcoal-700'
            }`}
          >
            <Compass className="w-4 h-4 text-terracotta-500" />
            Table Catalog
            {isActive('/tables') && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-terracotta-600 rounded-full" />
            )}
          </Link>
          <Link
            to="/book"
            className={`transition-all hover:text-terracotta-600 relative py-1 flex items-center gap-1.5 ${
              isActive('/book') ? 'text-terracotta-700 font-bold' : 'text-charcoal-700'
            }`}
          >
            <Calendar className="w-4 h-4 text-terracotta-500" />
            Reserve Table
            {isActive('/book') && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-terracotta-600 rounded-full" />
            )}
          </Link>

          {isAuthenticated && (
            <Link
              to="/my-reservations"
              className={`transition-all hover:text-terracotta-600 relative py-1 ${
                isActive('/my-reservations')
                  ? 'text-terracotta-700 font-bold'
                  : 'text-charcoal-700'
              }`}
            >
              My Bookings
              {isActive('/my-reservations') && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-terracotta-600 rounded-full" />
              )}
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition shadow-sm ${
                isActive('/admin')
                  ? 'bg-burgundy-900 text-champagne-300 ring-2 ring-champagne-400/50'
                  : 'bg-burgundy-900/10 text-burgundy-900 hover:bg-burgundy-900/15 border border-burgundy-800/20'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-burgundy-700" />
              Admin Portal
            </Link>
          )}
        </nav>

        {/* User Account Strip */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 pl-3 py-1.5 pr-3 bg-white rounded-full border border-ivory-300 shadow-sm">
                <div className="w-7 h-7 rounded-full terracotta-gradient text-white flex items-center justify-center text-xs font-black uppercase ring-2 ring-terracotta-200">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left text-xs pr-1">
                  <span className="font-bold text-charcoal-900 block truncate max-w-[120px]">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-terracotta-600 font-bold tracking-wider uppercase">
                    {isAdmin ? 'Manager' : 'Guest'}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 text-charcoal-500 hover:text-terracotta-600 hover:bg-ivory-200 rounded-full transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-charcoal-700 hover:text-terracotta-600 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 text-xs font-bold tracking-wide uppercase text-white terracotta-gradient rounded-xl shadow-md shadow-terracotta-600/25 transition-all hover:scale-105 cursor-pointer flex items-center gap-2 border border-champagne-400/30"
              >
                <Sparkles className="w-3.5 h-3.5 text-champagne-300" />
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl text-charcoal-800 hover:bg-ivory-200 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 space-y-2.5 bg-ivory-100 border-b border-ivory-300 animate-fadeIn shadow-xl">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2 rounded-xl text-sm font-semibold text-charcoal-800 hover:bg-ivory-200"
          >
            Home
          </Link>
          <Link
            to="/tables"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2 rounded-xl text-sm font-semibold text-charcoal-800 hover:bg-ivory-200"
          >
            Table Catalog
          </Link>
          <Link
            to="/book"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2 rounded-xl text-sm font-semibold text-charcoal-800 hover:bg-ivory-200"
          >
            Reserve Table
          </Link>

          {isAuthenticated && (
            <Link
              to="/my-reservations"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2 rounded-xl text-sm font-semibold text-charcoal-800 hover:bg-ivory-200"
            >
              My Bookings
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2 rounded-xl text-sm font-bold text-burgundy-900 bg-burgundy-100"
            >
              Admin Portal
            </Link>
          )}

          <div className="pt-4 border-t border-ivory-300">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-charcoal-900">{user?.name}</p>
                  <p className="text-xs text-charcoal-500">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg font-bold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2.5">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 text-center py-2.5 text-xs font-bold uppercase tracking-wider border border-ivory-400 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 text-center py-2.5 text-xs font-bold uppercase tracking-wider text-white terracotta-gradient rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
