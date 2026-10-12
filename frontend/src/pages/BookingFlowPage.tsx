import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { resourceService, reservationService } from '../services/api';
import { Resource, FareCalculationResponse, Reservation } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Printer,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Tag,
  Star,
  Award,
} from 'lucide-react';

export const BookingFlowPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Multi-step: 1 = Table, 2 = Guest Details, 3 = Fare Preview, 4 = Review, 5 = Confirmed
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResourceId, setSelectedResourceId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [bookingDate, setBookingDate] = useState<string>('');
  const [diningSlot, setDiningSlot] = useState<string>('Dinner Prime (19:30 - 21:30)');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // Fare and Submission State
  const [fare, setFare] = useState<FareCalculationResponse | null>(null);
  const [calculatingFare, setCalculatingFare] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingResources, setLoadingResources] = useState<boolean>(true);

  useEffect(() => {
    loadResources();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split('T')[0]);

    if (user) {
      setCustomerName(user.name);
    }
  }, [user]);

  const loadResources = async () => {
    try {
      setLoadingResources(true);
      const data = await resourceService.getAll();
      setResources(data);

      const params = new URLSearchParams(location.search);
      const queryId = params.get('resourceId');
      if (queryId) {
        const idNum = parseInt(queryId, 10);
        const match = data.find((r) => r.id === idNum);
        if (match && match.availableQuantity > 0) {
          setSelectedResourceId(match.id);
          setCurrentStep(2);
        }
      }
    } catch (err) {
      console.error('Failed to load tables:', err);
      setErrorMessage('Could not load table resources.');
    } finally {
      setLoadingResources(false);
    }
  };

  const selectedResource = resources.find((r) => r.id === selectedResourceId);

  const handleProceedToFare = async () => {
    setErrorMessage(null);

    if (!selectedResourceId) {
      setErrorMessage('Please select a dining table to proceed.');
      return;
    }

    if (!customerName.trim()) {
      setErrorMessage('Customer name is required.');
      return;
    }

    if (!customerPhone.trim() || !/^\d{10}$/.test(customerPhone.trim())) {
      setErrorMessage('Customer phone number must contain exactly 10 numeric digits per rule BR5.');
      return;
    }

    if (!bookingDate) {
      setErrorMessage('Please select a scheduled reservation date.');
      return;
    }

    if (quantity < 1 || quantity > 5) {
      setErrorMessage('Quantity must be an integer between 1 and 5 inclusive (Rule BR1).');
      return;
    }

    if (selectedResource && selectedResource.availableQuantity < quantity) {
      setErrorMessage(
        `Insufficient availability. Selected table only has ${selectedResource.availableQuantity} unit(s) remaining.`
      );
      return;
    }

    try {
      setCalculatingFare(true);
      const fareResponse = await resourceService.calculateFare(selectedResourceId, quantity);
      setFare(fareResponse);
      setCurrentStep(3);
    } catch (err: any) {
      console.error('Fare calculation failed:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to calculate fare.');
    } finally {
      setCalculatingFare(false);
    }
  };

  const handleConfirmReservation = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/book');
      return;
    }

    if (!selectedResourceId) return;

    try {
      setSubmitting(true);
      setErrorMessage(null);

      const reservationData = {
        resourceId: selectedResourceId,
        quantity,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        bookingDate,
        diningSlot,
        specialRequests: specialRequests.trim() || undefined,
      };

      const result = await reservationService.create(reservationData);
      setConfirmedReservation(result);
      setCurrentStep(5);
    } catch (err: any) {
      console.error('Reservation submission failed:', err);
      const serverMessage =
        err.response?.data?.message || 'Failed to confirm reservation. Please check availability and details.';
      setErrorMessage(serverMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { num: 1, label: 'Table Select' },
              { num: 2, label: 'Guest Details' },
              { num: 3, label: 'Fare Engine' },
              { num: 4, label: 'Review' },
            ].map((step, idx) => (
              <React.Fragment key={step.num}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm transition-all ${
                      currentStep === step.num
                        ? 'terracotta-gradient text-white shadow-lg shadow-terracotta-600/30 ring-4 ring-terracotta-200 scale-105'
                        : currentStep > step.num
                        ? 'bg-emerald-600 text-white'
                        : 'bg-ivory-200 text-charcoal-400'
                    }`}
                  >
                    {currentStep > step.num ? <CheckCircle2 className="w-5 h-5" /> : step.num}
                  </div>
                  <span
                    className={`mt-2 text-xs font-bold uppercase tracking-wider ${
                      currentStep === step.num ? 'text-terracotta-700' : 'text-charcoal-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < 3 && (
                  <div
                    className={`flex-1 h-0.5 mx-3 transition-all ${
                      currentStep > step.num ? 'bg-emerald-500' : 'bg-ivory-300'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-start gap-3 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block text-sm">Action Rejected</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* ================= STEP 1: SELECT TABLE ================= */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl border border-ivory-200 p-8 sm:p-10 shadow-sm space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-terracotta-600">
                Step 1 of 4
              </span>
              <h2 className="font-serif text-3xl font-bold text-charcoal-900 mt-1">
                Choose Your Reservable Dining Space
              </h2>
              <p className="text-xs text-charcoal-600 mt-1">
                Select one of our active tables. Rates and capacities are dynamically synced with our MySQL database.
              </p>
            </div>

            {loadingResources ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-36 bg-ivory-100 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {resources.map((res) => {
                  const isAvailable = res.availableQuantity > 0;
                  const isSelected = selectedResourceId === res.id;
                  return (
                    <div
                      key={res.id}
                      onClick={() => {
                        if (isAvailable) setSelectedResourceId(res.id);
                      }}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                        !isAvailable
                          ? 'opacity-60 bg-ivory-100/60 border-ivory-200 cursor-not-allowed'
                          : isSelected
                          ? 'border-terracotta-600 bg-terracotta-50/60 shadow-md ring-2 ring-terracotta-500/20 cursor-pointer'
                          : 'border-ivory-200 hover:border-ivory-300 bg-ivory-50/40 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-500 block">
                            {res.resourceCode} • {res.category}
                          </span>
                          <h4 className="font-serif text-xl font-bold text-charcoal-900 mt-0.5">
                            {res.displayName}
                          </h4>
                        </div>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                            isAvailable
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isAvailable ? `${res.availableQuantity} Left` : 'Sold Out'}
                        </span>
                      </div>

                      <div className="mt-4 pt-3 border-t border-ivory-200 flex items-center justify-between text-xs">
                        <span className="text-charcoal-600 font-medium">
                          Seats up to {res.seatingCapacity} guests
                        </span>
                        <span className="font-serif text-xl font-black text-terracotta-700">
                          ₹{res.currentRate.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (selectedResourceId) {
                    setCurrentStep(2);
                  } else {
                    setErrorMessage('Please select a dining table to continue.');
                  }
                }}
                disabled={!selectedResourceId}
                className="px-7 py-3.5 terracotta-gradient hover:opacity-95 disabled:bg-ivory-300 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition flex items-center gap-2 cursor-pointer shadow-lg shadow-terracotta-600/25"
              >
                Proceed to Guest Details
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: GUEST DETAILS ================= */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl border border-ivory-200 p-8 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-terracotta-600">
                  Step 2 of 4
                </span>
                <h2 className="font-serif text-3xl font-bold text-charcoal-900 mt-1">
                  Guest & Dining Schedule
                </h2>
                <p className="text-xs text-charcoal-600 mt-1">
                  Reserved Table: <strong>{selectedResource?.displayName} ({selectedResource?.resourceCode})</strong> @ ₹{selectedResource?.currentRate.toFixed(2)} / table
                </p>
              </div>
              <button
                onClick={() => setCurrentStep(1)}
                className="text-xs text-terracotta-600 hover:underline font-bold"
              >
                Change Selection
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-2">
                  Customer Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 bg-ivory-50 border border-ivory-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-2">
                  10-Digit Mobile Phone <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  placeholder="9876543210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 bg-ivory-50 border border-ivory-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/30 font-mono"
                />
                <p className="mt-1 text-[11px] text-charcoal-500">
                  Enforces Rule BR5: exactly 10 numeric digits.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-2">
                  Reservation Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-4 py-3 bg-ivory-50 border border-ivory-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-2">
                  Number of Tables (1 to 5) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                  className="w-full px-4 py-3 bg-ivory-50 border border-ivory-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/30 font-bold"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Table' : 'Tables'} (
                      {selectedResource ? `Base: ₹${(selectedResource.currentRate * num).toFixed(2)}` : ''})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-charcoal-500">
                  Enforces Rule BR1: quantities between 1 and 5 inclusive.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-2">
                  Dining Slot
                </label>
                <select
                  value={diningSlot}
                  onChange={(e) => setDiningSlot(e.target.value)}
                  className="w-full px-4 py-3 bg-ivory-50 border border-ivory-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/30"
                >
                  <option value="Lunch (12:30 - 14:30)">Lunch (12:30 - 14:30)</option>
                  <option value="Sunset Twilight (17:30 - 19:15)">Sunset Twilight (17:30 - 19:15)</option>
                  <option value="Dinner Prime (19:30 - 21:30)">Dinner Prime (19:30 - 21:30)</option>
                  <option value="Late Night Degustation (21:45 - 23:30)">Late Night Degustation (21:45 - 23:30)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-2">
                  Special Notes / Dietary Requests
                </label>
                <input
                  type="text"
                  placeholder="e.g. Quiet corner, anniversary celebration"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-4 py-3 bg-ivory-50 border border-ivory-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/30"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-ivory-200">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 bg-ivory-200 hover:bg-ivory-300 text-charcoal-700 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <button
                type="button"
                onClick={handleProceedToFare}
                disabled={calculatingFare}
                className="px-7 py-3.5 terracotta-gradient hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition flex items-center gap-2 cursor-pointer shadow-lg shadow-terracotta-600/25"
              >
                {calculatingFare ? 'Computing Live Fare...' : 'Calculate Live Fare'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: LIVE FARE BREAKDOWN ================= */}
        {currentStep === 3 && fare && (
          <div className="bg-white rounded-3xl border border-ivory-200 p-8 sm:p-10 shadow-sm space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-terracotta-600">
                Rule BR4 Live Fare Engine
              </span>
              <h2 className="font-serif text-3xl font-bold text-charcoal-900 mt-1">
                Verified Fare Breakdown
              </h2>
              <p className="text-xs text-charcoal-600">
                Calculated strictly on the backend REST API. Totals cannot be tampered with by the client.
              </p>
            </div>

            {/* Fee Waiver Banner */}
            {fare.baseAmount >= 1000 ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-900 text-xs">
                <Award className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold block">Hospitality Fee Exemption Applied!</span>
                  <span>Base amount is ₹{fare.baseAmount.toFixed(2)} (≥ ₹1000.00). The standard ₹50 booking charge is completely waived.</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center gap-3 text-amber-900 text-xs">
                <Tag className="w-5 h-5 text-amber-700 shrink-0" />
                <div>
                  <span className="font-bold block">Standard Booking Fee</span>
                  <span>Base amount is under ₹1000.00. Standard ₹50.00 booking fee applies per Rule BR4.</span>
                </div>
              </div>
            )}

            {/* Receipt Summary Card */}
            <div className="bg-ivory-50 rounded-2xl border border-ivory-300 p-6 space-y-4">
              <div className="flex justify-between items-center text-xs pb-3 border-b border-ivory-200">
                <span className="text-charcoal-600">Dining Table</span>
                <span className="font-bold text-charcoal-900">
                  {fare.displayName} ({fare.resourceCode})
                </span>
              </div>

              <div className="flex justify-between items-center text-xs pb-3 border-b border-ivory-200">
                <span className="text-charcoal-600">Current Unit Rate</span>
                <span className="font-mono font-semibold text-charcoal-900">
                  ₹{fare.unitRate.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs pb-3 border-b border-ivory-200">
                <span className="text-charcoal-600">Table Quantity</span>
                <span className="font-bold text-charcoal-900">{fare.quantity}</span>
              </div>

              <div className="flex justify-between items-center text-xs pb-3 border-b border-ivory-200">
                <span className="text-charcoal-600 font-semibold">
                  Base Amount (`Rate × Qty`)
                </span>
                <span className="font-mono text-sm font-bold text-charcoal-900">
                  ₹{fare.baseAmount.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs pb-3 border-b border-ivory-200">
                <span className="text-charcoal-600">Booking Charge (BR4)</span>
                <span
                  className={`font-mono font-bold ${
                    fare.bookingCharge === 0 ? 'text-emerald-700' : 'text-charcoal-900'
                  }`}
                >
                  {fare.bookingCharge === 0 ? 'WAIVED (₹0.00)' : `₹${fare.bookingCharge.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div>
                  <span className="font-serif text-lg font-bold text-charcoal-900 block">
                    Grand Total
                  </span>
                  <span className="text-[11px] text-charcoal-500">Includes all taxes and services</span>
                </div>
                <span className="font-serif text-3xl font-black text-terracotta-700">
                  ₹{fare.grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-ivory-200">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 bg-ivory-200 hover:bg-ivory-300 text-charcoal-700 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Modify Details
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-7 py-3.5 terracotta-gradient hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition flex items-center gap-2 cursor-pointer shadow-lg shadow-terracotta-600/25"
              >
                Review & Confirm
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: REVIEW & CONFIRM ================= */}
        {currentStep === 4 && fare && (
          <div className="bg-white rounded-3xl border border-ivory-200 p-8 sm:p-10 shadow-sm space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-terracotta-600">
                Final Step
              </span>
              <h2 className="font-serif text-3xl font-bold text-charcoal-900 mt-1">
                Review & Confirm Reservation
              </h2>
              <p className="text-xs text-charcoal-600">
                Please verify guest information before final transactional confirmation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-ivory-50 p-6 rounded-2xl border border-ivory-300">
              <div>
                <span className="text-charcoal-500 block">Primary Guest Name</span>
                <span className="font-bold text-charcoal-900 text-sm">{customerName}</span>
              </div>
              <div>
                <span className="text-charcoal-500 block">Contact Phone Number</span>
                <span className="font-mono font-bold text-charcoal-900 text-sm">{customerPhone}</span>
              </div>
              <div>
                <span className="text-charcoal-500 block">Scheduled Dining Date</span>
                <span className="font-bold text-charcoal-900">{bookingDate}</span>
              </div>
              <div>
                <span className="text-charcoal-500 block">Dining Slot</span>
                <span className="font-bold text-charcoal-900">{diningSlot}</span>
              </div>
              <div>
                <span className="text-charcoal-500 block">Table Reserved</span>
                <span className="font-bold text-charcoal-900">
                  {fare.displayName} ({fare.quantity} unit)
                </span>
              </div>
              <div>
                <span className="text-charcoal-500 block">Total Due</span>
                <span className="font-serif text-2xl font-black text-terracotta-700">
                  ₹{fare.grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {!isAuthenticated && (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs flex items-center justify-between">
                <span>Please sign in or register to complete and save your reservation.</span>
                <Link
                  to="/login?redirect=/book"
                  className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 uppercase tracking-wider"
                >
                  Sign In Now
                </Link>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between border-t border-ivory-200">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                disabled={submitting}
                className="px-5 py-2.5 bg-ivory-200 hover:bg-ivory-300 text-charcoal-700 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Fare
              </button>

              <button
                type="button"
                onClick={handleConfirmReservation}
                disabled={submitting || !isAuthenticated}
                className={`px-8 py-4 terracotta-gradient hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-terracotta-600/30 transition flex items-center gap-2 cursor-pointer ${
                  submitting ? 'opacity-70 cursor-wait' : ''
                }`}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Locking Seat Inventory...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-champagne-300" />
                    Confirm & Reserve Table
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: DIGITAL VIP DINING PASS ================= */}
        {currentStep === 5 && confirmedReservation && (
          <div className="bg-white rounded-3xl border border-emerald-300 p-8 sm:p-12 shadow-2xl space-y-8 text-center animate-fadeIn">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="text-xs uppercase font-black tracking-widest text-emerald-700">
                Reservation Confirmed
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-charcoal-900 mt-1">
                Your Table is Reserved!
              </h2>
              <p className="text-xs text-charcoal-600 mt-2 max-w-md mx-auto">
                Thank you, {confirmedReservation.customerName}. Your table has been atomically locked and confirmed in our system.
              </p>
            </div>

            {/* VIP Pass Badge */}
            <div className="bg-ivory-100/90 rounded-3xl border-2 border-dashed border-terracotta-400 p-8 max-w-lg mx-auto relative overflow-hidden">
              <div className="text-center space-y-1">
                <span className="text-[10px] text-charcoal-500 uppercase tracking-[0.25em] font-bold block">
                  Official Reservation Pass
                </span>
                <span className="font-mono text-3xl sm:text-4xl font-black text-terracotta-700 tracking-wider block">
                  {confirmedReservation.uniqueBookingReference}
                </span>
                <span className="text-[11px] text-charcoal-600 block pt-1">
                  Present this reference upon arrival at the restaurant concierge.
                </span>
              </div>
            </div>

            {/* Snapshot Receipt Details */}
            <div className="bg-ivory-50 rounded-2xl border border-ivory-200 p-6 max-w-lg mx-auto text-left text-xs space-y-3">
              <div className="flex justify-between pb-2 border-b border-ivory-200">
                <span className="text-charcoal-500">Date & Slot</span>
                <span className="font-bold text-charcoal-900">
                  {confirmedReservation.bookingDate} • {confirmedReservation.diningSlot}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-ivory-200">
                <span className="text-charcoal-500">Reserved Resource</span>
                <span className="font-bold text-charcoal-900">
                  {confirmedReservation.items[0]?.displayName} ({confirmedReservation.items[0]?.quantity} table)
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-ivory-200">
                <span className="text-charcoal-500">Snapshotted Unit Rate</span>
                <span className="font-mono font-bold text-charcoal-900">
                  ₹{confirmedReservation.items[0]?.savedUnitRate.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-ivory-200">
                <span className="text-charcoal-500">Base Amount</span>
                <span className="font-mono font-bold text-charcoal-900">
                  ₹{confirmedReservation.baseAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-ivory-200">
                <span className="text-charcoal-500">Booking Charge</span>
                <span className="font-mono font-bold text-charcoal-900">
                  ₹{confirmedReservation.bookingCharge.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-black">
                <span className="text-charcoal-900">Grand Total</span>
                <span className="font-mono text-terracotta-700">
                  ₹{confirmedReservation.grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-ivory-200 hover:bg-ivory-300 text-charcoal-800 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition"
              >
                <Printer className="w-4 h-4" />
                Print / Save Receipt
              </button>

              <Link
                to="/my-reservations"
                className="px-7 py-3 terracotta-gradient hover:opacity-95 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-terracotta-600/20"
              >
                View in My Bookings
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
