import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resourceService } from '../services/api';
import { Resource } from '../types';
import {
  Calendar,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
  Star,
  Wine,
  UtensilsCrossed,
  Clock,
  Compass,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await resourceService.getAll();
      setResources(data);
    } catch (err) {
      console.error('Failed to load tables from API:', err);
      setError('Unable to load live table availability from server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-50 text-charcoal-900">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 bg-gradient-to-b from-ivory-100 via-ivory-50 to-ivory-50 border-b border-ivory-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-champagne-400/50 shadow-sm text-terracotta-700 text-xs font-bold tracking-wide uppercase">
                <Star className="w-3.5 h-3.5 fill-champagne-500 text-champagne-500" />
                <span>Michelin-Inspired Gastronomy • Reserve 2026</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-charcoal-900 leading-[1.12]">
                Culinary Artistry, <br />
                <span className="text-terracotta-600 italic">Exclusively Reserved</span> for You.
              </h1>

              <p className="text-base sm:text-lg text-charcoal-700 max-w-2xl leading-relaxed">
                Step into L'Aura, where every evening is an orchestral symphony of flavors and architectural intimacy. Reserve your curated table in real-time with zero overbooking risk, transparent rate snapshots, and instant confirmation.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-3">
                <Link
                  to="/book"
                  className="px-8 py-4 terracotta-gradient hover:opacity-95 text-white font-bold rounded-2xl shadow-xl shadow-terracotta-600/30 transition-all hover:-translate-y-0.5 flex items-center gap-3 cursor-pointer text-sm border border-champagne-400/30"
                >
                  <Calendar className="w-5 h-5 text-champagne-300" />
                  Reserve a Table Now
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/tables"
                  className="px-7 py-4 bg-white hover:bg-ivory-100 text-charcoal-800 font-bold rounded-2xl border border-ivory-300 shadow-sm transition-all cursor-pointer text-sm flex items-center gap-2"
                >
                  <Compass className="w-4 h-4 text-terracotta-600" />
                  Explore Table Inventory
                </Link>
              </div>

              {/* Trust Metric Strip */}
              <div className="pt-8 border-t border-ivory-300/80 grid grid-cols-3 gap-6 max-w-lg">
                <div className="space-y-1">
                  <span className="font-serif text-2xl sm:text-3xl font-extrabold text-charcoal-900">
                    100%
                  </span>
                  <p className="text-xs text-charcoal-500 font-medium">Real-Time DB Sync</p>
                </div>
                <div className="space-y-1">
                  <span className="font-serif text-2xl sm:text-3xl font-extrabold text-terracotta-700">
                    ₹0 Fee
                  </span>
                  <p className="text-xs text-charcoal-500 font-medium">On Orders ≥ ₹1000</p>
                </div>
                <div className="space-y-1">
                  <span className="font-serif text-2xl sm:text-3xl font-extrabold text-charcoal-900">
                    Instant
                  </span>
                  <p className="text-xs text-charcoal-500 font-medium">Unique Booking Ref</p>
                </div>
              </div>
            </div>

            {/* Right Visual Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
                <img
                  src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80"
                  alt="L'Aura Restaurant Dining Hall"
                  className="w-full h-[480px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/85 via-charcoal-950/25 to-transparent flex flex-col justify-end p-8 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-terracotta-600 text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                      Atmospheric Seating
                    </span>
                    <span className="px-2.5 py-1 bg-black/40 backdrop-blur-md text-[11px] font-medium rounded-lg text-champagne-300">
                      ★ 4.9 Rating
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    Panoramic Skyline & Intimate Booths
                  </h3>
                  <p className="text-xs text-ivory-200 mt-1 leading-relaxed">
                    Preserving table availability via database row locking to guarantee zero concurrent overselling.
                  </p>
                </div>
              </div>

              {/* Floating Quote Card */}
              <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-champagne-400/40 shadow-xl max-w-xs hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center shrink-0">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-charcoal-900">
                    "Exceptional dining elegance."
                  </p>
                  <p className="text-[10px] text-charcoal-500">The Gastronomy Gazette</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LIVE TABLES SHOWCASE ================= */}
      <section className="py-20 bg-ivory-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta-100 text-terracotta-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Live Dining Inventory
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-charcoal-900">
                Featured Tables & Availability
              </h2>
              <p className="mt-2 text-charcoal-600 max-w-xl text-sm">
                Real-time capacity loaded directly from our MySQL database. Select your preferred atmosphere for live fare calculation.
              </p>
            </div>
            <Link
              to="/tables"
              className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-wider text-terracotta-700 hover:text-terracotta-800 flex items-center gap-1 group py-2"
            >
              Browse Complete Table Catalog
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-ivory-200/60 rounded-3xl h-96 animate-pulse p-6"></div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto" />
              <p className="text-rose-800 font-semibold">{error}</p>
              <button
                onClick={fetchTables}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700"
              >
                Retry Loading
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resources.slice(0, 5).map((table) => {
                const isAvailable = table.availableQuantity > 0;
                return (
                  <div
                    key={table.id}
                    className={`bg-white rounded-3xl border border-ivory-200 shadow-sm overflow-hidden flex flex-col card-hover transition-all ${
                      !isAvailable ? 'opacity-80' : ''
                    }`}
                  >
                    {/* Image & Pill Header */}
                    <div className="relative h-52 overflow-hidden bg-ivory-200">
                      <img
                        src={table.imageUrl || 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80'}
                        alt={table.displayName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-charcoal-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-champagne-300 tracking-wider border border-charcoal-700">
                        {table.resourceCode}
                      </div>
                      <div className="absolute top-4 right-4">
                        {isAvailable ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            {table.availableQuantity} Left
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-sm">
                            Sold Out
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="text-[11px] font-bold text-terracotta-600 uppercase tracking-widest">
                          {table.category}
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-charcoal-900 mt-1">
                          {table.displayName}
                        </h3>
                        <p className="text-xs text-charcoal-600 line-clamp-2 mt-2 leading-relaxed">
                          {table.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-ivory-100 flex items-center justify-between text-xs text-charcoal-600">
                        <span className="flex items-center gap-1.5 font-semibold">
                          <Users className="w-4 h-4 text-terracotta-500" />
                          Seats {table.seatingCapacity} Guests
                        </span>
                        <div className="text-right">
                          <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block">
                            Rate per unit
                          </span>
                          <span className="font-serif text-2xl font-black text-charcoal-900">
                            ₹{table.currentRate.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Action */}
                      <button
                        onClick={() => {
                          if (isAvailable) {
                            navigate(`/book?resourceId=${table.id}`);
                          }
                        }}
                        disabled={!isAvailable}
                        className={`w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          isAvailable
                            ? 'terracotta-gradient text-white shadow-md shadow-terracotta-600/20 hover:opacity-95'
                            : 'bg-ivory-200 text-charcoal-400 cursor-not-allowed border border-ivory-300'
                        }`}
                      >
                        {isAvailable ? (
                          <>
                            Reserve This Table
                            <ArrowRight className="w-4 h-4" />
                          </>
                        ) : (
                          'Unavailable / Fully Booked'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20 bg-ivory-100/70 border-t border-b border-ivory-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600">
              Rule-Governed Booking Experience
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-charcoal-900">
              The 4-Step Reservation Architecture
            </h2>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Designed with server-validated fare formulas (BR4), transactional seat locking (BR7), and atomic confirmations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-7 rounded-3xl border border-ivory-200 shadow-sm relative">
              <div className="w-11 h-11 rounded-2xl terracotta-gradient text-white font-serif font-black flex items-center justify-center text-lg mb-4 shadow-md shadow-terracotta-600/20">
                1
              </div>
              <h4 className="font-serif text-lg font-bold text-charcoal-900">Choose Resource</h4>
              <p className="mt-2 text-xs text-charcoal-600 leading-relaxed">
                Select from fine dining booths, panoramic window tables, or sommelier suites with live capacity synchronization.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-ivory-200 shadow-sm relative">
              <div className="w-11 h-11 rounded-2xl terracotta-gradient text-white font-serif font-black flex items-center justify-center text-lg mb-4 shadow-md shadow-terracotta-600/20">
                2
              </div>
              <h4 className="font-serif text-lg font-bold text-charcoal-900">Specify Quantity</h4>
              <p className="mt-2 text-xs text-charcoal-600 leading-relaxed">
                Select table quantity (1 to 5 per rule BR1), guest contact details, dining slot, and personalized culinary requests.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-ivory-200 shadow-sm relative">
              <div className="w-11 h-11 rounded-2xl terracotta-gradient text-white font-serif font-black flex items-center justify-center text-lg mb-4 shadow-md shadow-terracotta-600/20">
                3
              </div>
              <h4 className="font-serif text-lg font-bold text-charcoal-900">Live Fare Computation</h4>
              <p className="mt-2 text-xs text-charcoal-600 leading-relaxed">
                Instant server calculation: ₹50 fee applied if base is under ₹1000; completely waived (₹0) on bookings ₹1000 and above.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-ivory-200 shadow-sm relative">
              <div className="w-11 h-11 rounded-2xl terracotta-gradient text-white font-serif font-black flex items-center justify-center text-lg mb-4 shadow-md shadow-terracotta-600/20">
                4
              </div>
              <h4 className="font-serif text-lg font-bold text-charcoal-900">Atomic Reference</h4>
              <p className="mt-2 text-xs text-charcoal-600 leading-relaxed">
                Receive an immutable booking reference with rate snapshot and printable dining pass pass.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CHEF PHILOSOPHY & AMBIANCE ================= */}
      <section className="py-20 bg-ivory-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-charcoal-900 text-white rounded-3xl p-8 sm:p-14 border border-charcoal-800 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-4">
                <div className="flex items-center gap-2 text-champagne-400 text-xs font-bold uppercase tracking-widest">
                  <Wine className="w-4 h-4" />
                  Culinary Philosophy
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl font-extrabold leading-snug">
                  "Gastronomy is the confluence of emotion, craft, and bespoke hospitality."
                </h3>
                <p className="text-xs sm:text-sm text-ivory-300 leading-relaxed max-w-2xl">
                  Every reservation at L'Aura is treated as a masterclass event. Our sommeliers and chefs coordinate table allocations in real-time to curate unforgettable gastronomic journeys for discerning guests.
                </p>
                <div className="pt-2 text-xs text-champagne-300 font-semibold tracking-wide">
                  — Chef Patron Jean-Luc & The Culinary Team
                </div>
              </div>

              <div className="md:col-span-4 flex justify-center md:justify-end">
                <Link
                  to="/book"
                  className="px-8 py-4 bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-xl transition-transform hover:scale-105"
                >
                  Book Your Evening
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
