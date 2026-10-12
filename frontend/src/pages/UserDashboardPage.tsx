import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reservationService } from '../services/api';
import { Reservation } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmationModal } from '../components/ConfirmationModal';
import {
  Calendar,
  Search,
  Filter,
  Eye,
  XCircle,
  Clock,
  MapPin,
  Utensils,
  Plus,
  RefreshCw,
  AlertCircle,
  FileText,
  History,
} from 'lucide-react';

export const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [searchRef, setSearchRef] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Details Modal
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  // Cancellation Modal
  const [cancellingReservation, setCancellingReservation] = useState<Reservation | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  useEffect(() => {
    loadUserReservations();
  }, []);

  const loadUserReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reservationService.getMy();
      setReservations(data);
    } catch (err) {
      console.error('Failed to load reservations:', err);
      setError('Could not load your reservations. Please ensure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConfirm = async () => {
    if (!cancellingReservation) return;

    try {
      setIsCancelling(true);
      await reservationService.cancel(cancellingReservation.id, cancelReason);
      setCancellingReservation(null);
      setCancelReason('');
      await loadUserReservations(); // Refresh list to reflect CANCELLED status
    } catch (err: any) {
      console.error('Cancellation failed:', err);
      alert(err.response?.data?.message || 'Failed to cancel reservation');
    } finally {
      setIsCancelling(false);
    }
  };

  const filteredReservations = reservations.filter((r) => {
    const matchesRef =
      r.uniqueBookingReference.toLowerCase().includes(searchRef.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchRef.toLowerCase()) ||
      (r.items[0]?.displayName || '').toLowerCase().includes(searchRef.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;

    return matchesRef && matchesStatus;
  });

  const upcomingCount = reservations.filter((r) => r.status === 'CONFIRMED').length;

  return (
    <div className="min-h-screen bg-ivory-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-white rounded-3xl border border-ivory-200 p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-100 text-terracotta-700 text-xs font-semibold uppercase tracking-wider mb-2">
              Guest Portal
            </div>
            <h1 className="font-serif text-3xl font-extrabold text-charcoal-900">
              Welcome back, {user?.name}
            </h1>
            <p className="mt-1 text-sm text-charcoal-600">
              Manage your upcoming dining experiences, view immutable fare receipts, and review booking history.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/book"
              className="px-5 py-3 bg-terracotta-600 hover:bg-terracotta-700 text-white font-semibold rounded-2xl shadow-md shadow-terracotta-600/20 text-xs flex items-center gap-2 cursor-pointer transition"
            >
              <Plus className="w-4 h-4" />
              Book New Table
            </Link>
            <button
              onClick={loadUserReservations}
              title="Refresh Reservations"
              className="p-3 bg-ivory-200 hover:bg-ivory-300 text-charcoal-700 rounded-2xl transition cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-ivory-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-charcoal-500 uppercase font-bold tracking-wider">
                Total Reservations
              </p>
              <p className="font-serif text-3xl font-bold text-charcoal-900 mt-1">
                {reservations.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-ivory-100 text-terracotta-600 rounded-2xl flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-ivory-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-charcoal-500 uppercase font-bold tracking-wider">
                Confirmed Bookings
              </p>
              <p className="font-serif text-3xl font-bold text-emerald-700 mt-1">
                {upcomingCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-ivory-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-charcoal-500 uppercase font-bold tracking-wider">
                Completed Dining
              </p>
              <p className="font-serif text-3xl font-bold text-charcoal-700 mt-1">
                {reservations.filter((r) => r.status === 'COMPLETED').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-ivory-100 text-charcoal-700 rounded-2xl flex items-center justify-center">
              <Utensils className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-ivory-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Reference ID (e.g. RES-...) or table name..."
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-ivory-50 border border-ivory-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-terracotta-500/30"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-charcoal-500 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 bg-ivory-50 border border-ivory-300 rounded-xl text-xs text-charcoal-800 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CHECKED_IN">Checked In</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Reservations Table */}
        <div className="bg-white rounded-3xl border border-ivory-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-charcoal-500 text-sm animate-pulse">
              Loading your reservations...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-rose-700 bg-rose-50">
              <AlertCircle className="w-8 h-8 text-rose-600 mx-auto mb-2" />
              {error}
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="p-16 text-center space-y-4">
              <div className="w-14 h-14 bg-ivory-200 rounded-full flex items-center justify-center mx-auto text-charcoal-500">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal-900">
                No Reservations Found
              </h3>
              <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
                You haven't made any reservations matching this filter. Select a table to reserve your culinary experience!
              </p>
              <Link
                to="/book"
                className="inline-block px-5 py-2.5 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-xl text-xs font-semibold"
              >
                Reserve a Table
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-ivory-100/70 border-b border-ivory-200 text-charcoal-600 uppercase font-semibold tracking-wider">
                  <tr>
                    <th className="py-4 px-6">Reference ID</th>
                    <th className="py-4 px-6">Date & Slot</th>
                    <th className="py-4 px-6">Reserved Table</th>
                    <th className="py-4 px-6">Quantity</th>
                    <th className="py-4 px-6">Grand Total</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-100">
                  {filteredReservations.map((res) => {
                    const item = res.items[0];
                    const isEligibleForCancellation = res.status === 'CONFIRMED';
                    return (
                      <tr key={res.id} className="hover:bg-ivory-50/60 transition">
                        <td className="py-4 px-6 font-mono font-bold text-charcoal-900">
                          {res.uniqueBookingReference}
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-medium text-charcoal-900 block">
                            {res.bookingDate}
                          </span>
                          <span className="text-[11px] text-charcoal-500">{res.diningSlot}</span>
                        </td>
                        <td className="py-4 px-6 font-medium text-charcoal-800">
                          {item ? `${item.displayName} (${item.resourceCode})` : '—'}
                        </td>
                        <td className="py-4 px-6">{item?.quantity || 1} table</td>
                        <td className="py-4 px-6 font-bold text-terracotta-700 text-sm">
                          ₹{res.grandTotal.toFixed(2)}
                        </td>
                        <td className="py-4 px-6">
                          <StatusBadge status={res.status} size="sm" />
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => setSelectedReservation(res)}
                            className="px-3 py-1.5 bg-ivory-200 hover:bg-ivory-300 text-charcoal-700 rounded-lg text-xs font-medium cursor-pointer transition inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Details
                          </button>

                          {isEligibleForCancellation ? (
                            <button
                              onClick={() => setCancellingReservation(res)}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold cursor-pointer transition inline-flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Cancel
                            </button>
                          ) : (
                            <button
                              disabled
                              title="Only CONFIRMED bookings can be cancelled per rule BR8"
                              className="px-3 py-1.5 bg-ivory-100 text-charcoal-400 rounded-lg text-xs font-medium cursor-not-allowed opacity-60"
                            >
                              Locked
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ================= RESERVATION DETAILS MODAL ================= */}
      {selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-ivory-50 rounded-3xl border border-ivory-300 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-ivory-200">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-charcoal-500 font-bold">
                  Reservation Record
                </span>
                <h3 className="font-mono text-xl font-bold text-terracotta-700">
                  {selectedReservation.uniqueBookingReference}
                </h3>
              </div>
              <StatusBadge status={selectedReservation.status} />
            </div>

            <div className="mt-6 space-y-6 text-xs">
              {/* Guest Information */}
              <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-ivory-200">
                <div>
                  <span className="text-charcoal-500 block">Customer Name</span>
                  <span className="font-semibold text-charcoal-900 text-sm">
                    {selectedReservation.customerName}
                  </span>
                </div>
                <div>
                  <span className="text-charcoal-500 block">Phone Number</span>
                  <span className="font-semibold text-charcoal-900 text-sm">
                    {selectedReservation.customerPhone}
                  </span>
                </div>
                <div>
                  <span className="text-charcoal-500 block">Dining Date</span>
                  <span className="font-semibold text-charcoal-900">
                    {selectedReservation.bookingDate}
                  </span>
                </div>
                <div>
                  <span className="text-charcoal-500 block">Dining Slot</span>
                  <span className="font-semibold text-charcoal-900">
                    {selectedReservation.diningSlot}
                  </span>
                </div>
                {selectedReservation.specialRequests && (
                  <div className="col-span-2 pt-2 border-t border-ivory-100">
                    <span className="text-charcoal-500 block">Special Requests</span>
                    <span className="text-charcoal-800">{selectedReservation.specialRequests}</span>
                  </div>
                )}
              </div>

              {/* Immutable Fare Breakdown (BR3 / BR4) */}
              <div className="bg-white p-4 rounded-2xl border border-ivory-200 space-y-2">
                <h4 className="font-serif text-sm font-bold text-charcoal-900">
                  Fare Breakdown (Snapshotted at Confirmation)
                </h4>
                {selectedReservation.items.map((item) => (
                  <div key={item.id} className="flex justify-between py-1 text-charcoal-700">
                    <span>
                      {item.displayName} ({item.quantity} × ₹{item.savedUnitRate.toFixed(2)})
                    </span>
                    <span className="font-semibold">₹{item.savedBaseAmount.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between py-1 text-charcoal-700">
                  <span>Booking Charge</span>
                  <span className="font-semibold">
                    ₹{selectedReservation.bookingCharge.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-ivory-200 text-sm font-bold">
                  <span className="text-charcoal-900">Grand Total</span>
                  <span className="text-terracotta-700">
                    ₹{selectedReservation.grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Status Audit History Trail */}
              <div className="bg-white p-4 rounded-2xl border border-ivory-200 space-y-3">
                <h4 className="font-serif text-sm font-bold text-charcoal-900 flex items-center gap-2">
                  <History className="w-4 h-4 text-terracotta-600" />
                  Status Audit Trail
                </h4>
                <div className="space-y-2">
                  {selectedReservation.statusHistory?.map((hist) => (
                    <div
                      key={hist.id}
                      className="p-2.5 rounded-xl bg-ivory-50 border border-ivory-200 flex items-start justify-between text-[11px]"
                    >
                      <div>
                        <span className="font-bold text-charcoal-900">
                          {hist.previousStatus ? `${hist.previousStatus} → ` : 'Initial: '}
                          {hist.newStatus}
                        </span>
                        <p className="text-charcoal-600 mt-0.5">{hist.remarks}</p>
                      </div>
                      <div className="text-right text-charcoal-400">
                        <span className="block font-mono">
                          {new Date(hist.changedAt).toLocaleDateString()}
                        </span>
                        <span className="block text-[10px]">{hist.changedBy}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedReservation(null)}
                className="px-5 py-2.5 bg-ivory-200 hover:bg-ivory-300 text-charcoal-800 rounded-xl font-semibold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CANCELLATION CONFIRMATION MODAL ================= */}
      <ConfirmationModal
        isOpen={!!cancellingReservation}
        title="Cancel Reservation?"
        message={`Are you sure you want to cancel booking ${cancellingReservation?.uniqueBookingReference}? In accordance with rule BR9, your reserved capacity will be restored to restaurant availability exactly once.`}
        confirmText="Confirm Cancellation"
        cancelText="Keep Booking"
        isDestructive={true}
        isLoading={isCancelling}
        onConfirm={handleCancelConfirm}
        onCancel={() => setCancellingReservation(null)}
      />
    </div>
  );
};
