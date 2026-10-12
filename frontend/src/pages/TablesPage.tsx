import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resourceService } from '../services/api';
import { Resource } from '../types';
import {
  Search,
  Filter,
  ArrowUpDown,
  RefreshCw,
  Users,
  CheckCircle2,
  XCircle,
  Calendar,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export const TablesPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [sortBy, setSortBy] = useState<'none' | 'price-asc' | 'price-desc'>('none');

  const navigate = useNavigate();

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await resourceService.getAll();
      setResources(data);
    } catch (err) {
      console.error('Failed to load resources:', err);
      setError('Could not load table resources from backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await resourceService.getAll();
      setResources(data);
    } catch (err) {
      console.error('Refresh failed:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Filter & Sort Logic
  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.resourceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (availabilityFilter === 'available') return r.availableQuantity > 0;
    if (availabilityFilter === 'unavailable') return r.availableQuantity === 0;
    return true;
  });

  const sortedResources = [...filteredResources].sort((a, b) => {
    if (sortBy === 'price-asc') return a.currentRate - b.currentRate;
    if (sortBy === 'price-desc') return b.currentRate - a.currentRate;
    return 0;
  });

  return (
    <div className="min-h-screen bg-ivory-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-ivory-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-100 text-terracotta-700 text-xs font-semibold uppercase tracking-wider mb-2">
              Demonstration Resource Catalog
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-charcoal-900">
              Table Availability & Pricing
            </h1>
            <p className="mt-2 text-charcoal-600 text-sm max-w-2xl">
              Real-time table inventory fetched directly from MySQL backend. Displays rates, capacity, and remaining reservable units.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="mt-4 md:mt-0 px-4 py-2.5 bg-ivory-200 hover:bg-ivory-300 text-charcoal-800 rounded-xl border border-ivory-300 text-xs font-semibold flex items-center gap-2 transition cursor-pointer self-start md:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-terracotta-600' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Availability'}
          </button>
        </div>

        {/* Demonstration Specification Table Preview Banner */}
        <div className="mt-8 bg-ivory-100/90 rounded-2xl border border-ivory-300 p-4 text-xs text-charcoal-700 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-terracotta-600"></span>
            <span>
              <strong>Initial Benchmark Resources:</strong> R101 (Table A - ₹499), R102 (Table B - ₹799), R103 (Table C - ₹199), R104 (Table D - ₹1299 [0 units]), R105 (Table E - ₹1000).
            </span>
          </div>
          <span className="text-terracotta-700 font-semibold shrink-0">
            Current Active Items: {resources.length}
          </span>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-6 bg-white p-4 rounded-2xl border border-ivory-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by code (e.g. R101) or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/30 focus:border-terracotta-500"
            />
          </div>

          {/* Availability Filter */}
          <div className="md:col-span-4 flex items-center gap-2">
            <Filter className="w-4 h-4 text-charcoal-500 shrink-0" />
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as any)}
              className="w-full py-2 px-3 bg-ivory-50 border border-ivory-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/30 text-charcoal-800"
            >
              <option value="all">All Availability States</option>
              <option value="available">Available Only (&gt; 0)</option>
              <option value="unavailable">Unavailable / Sold Out (0)</option>
            </select>
          </div>

          {/* Sort By Price */}
          <div className="md:col-span-3 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-charcoal-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2 px-3 bg-ivory-50 border border-ivory-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/30 text-charcoal-800"
            >
              <option value="none">Sort by: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-ivory-200/50 rounded-3xl h-96 animate-pulse p-6"></div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center">
              <AlertCircle className="w-8 h-8 text-rose-600 mx-auto mb-2" />
              <p className="text-rose-800 font-semibold">{error}</p>
            </div>
          ) : sortedResources.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-ivory-200">
              <p className="text-charcoal-500 text-sm">No tables match your selected filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setAvailabilityFilter('all');
                  setSortBy('none');
                }}
                className="mt-4 px-4 py-2 bg-ivory-200 text-charcoal-800 text-xs font-semibold rounded-xl hover:bg-ivory-300"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedResources.map((table) => {
                const isAvailable = table.availableQuantity > 0;
                return (
                  <div
                    key={table.id}
                    className={`bg-white rounded-3xl border border-ivory-200 shadow-sm overflow-hidden flex flex-col card-hover transition-all ${
                      !isAvailable ? 'opacity-85' : ''
                    }`}
                  >
                    {/* Visual & Badges */}
                    <div className="relative h-48 bg-ivory-200 overflow-hidden">
                      <img
                        src={table.imageUrl || 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80'}
                        alt={table.displayName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-charcoal-900/85 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white tracking-wider">
                        {table.resourceCode}
                      </div>
                      <div className="absolute top-4 right-4">
                        {isAvailable ? (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {table.availableQuantity} Available
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 shadow-sm flex items-center gap-1">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            0 Available / Full
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="text-xs font-semibold text-terracotta-600 uppercase tracking-wider">
                          {table.category}
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-charcoal-900 mt-1">
                          {table.displayName}
                        </h3>
                        <p className="text-xs text-charcoal-600 mt-2 leading-relaxed">
                          {table.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-ivory-100 flex items-center justify-between text-xs text-charcoal-600">
                        <span className="flex items-center gap-1 font-medium">
                          <Users className="w-4 h-4 text-terracotta-500" />
                          Seats {table.seatingCapacity} Guests
                        </span>
                        <div className="text-right">
                          <span className="text-[11px] text-charcoal-500 block">Unit Rate</span>
                          <span className="font-serif text-xl font-bold text-charcoal-900">
                            ₹{table.currentRate.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Reserve Button */}
                      <button
                        onClick={() => {
                          if (isAvailable) {
                            navigate(`/book?resourceId=${table.id}`);
                          }
                        }}
                        disabled={!isAvailable}
                        className={`w-full py-3 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          isAvailable
                            ? 'bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-md shadow-terracotta-600/20'
                            : 'bg-ivory-300 text-charcoal-500 cursor-not-allowed'
                        }`}
                      >
                        {isAvailable ? (
                          <>
                            Book This Table
                            <ArrowRight className="w-4 h-4" />
                          </>
                        ) : (
                          'Unavailable for Booking'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
