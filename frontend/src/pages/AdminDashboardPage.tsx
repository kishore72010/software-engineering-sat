import React, { useEffect, useState } from 'react';
import { adminService, resourceService } from '../services/api';
import { Reservation, AdminStats, Resource, ReservationStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmationModal } from '../components/ConfirmationModal';
import {
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Clock,
  Utensils,
  XCircle,
  TrendingUp,
  Search,
  Filter,
  RefreshCw,
  Eye,
  ArrowRight,
  AlertTriangle,
  Sliders,
  DollarSign,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Details Modal
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  // Status Progression Modal
  const [statusModalTarget, setStatusModalTarget] = useState<{
    reservation: Reservation;
    nextStatus: ReservationStatus;
  } | null>(null);
  const [statusRemarks, setStatusRemarks] = useState<string>('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);

  // Resource Inventory Edit Modal (for T7 / T12 demonstration)
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [editRate, setEditRate] = useState<number>(0);
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [isSavingResource, setIsSavingResource] = useState<boolean>(false);

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, resList, resourceList] = await Promise.all([
        adminService.getStats(),
        adminService.getAllReservations(),
        adminService.getAllResources(),
      ]);
      setStats(statsData);
      setReservations(resList);
      setResources(resourceList);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      setError(err.response?.data?.message || 'Access denied or failed to load administrator dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const [statsData, resList, resourceList] = await Promise.all([
        adminService.getStats(),
        adminService.getAllReservations(),
        adminService.getAllResources(),
      ]);
      setStats(statsData);
      setReservations(resList);
      setResources(resourceList);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  // Status progression action (CONFIRMED -> CHECKED_IN -> COMPLETED)
  const handleConfirmStatusProgression = async () => {
    if (!statusModalTarget) return;

    try {
      setIsUpdatingStatus(true);
      await adminService.updateStatus(
        statusModalTarget.reservation.id,
        statusModalTarget.nextStatus,
        statusRemarks.trim() || undefined
      );

      setStatusModalTarget(null);
      setStatusRemarks('');
      await handleRefresh();
    } catch (err: any) {
      console.error('Status progression failed:', err);
      alert(err.response?.data?.message || 'Failed to update reservation status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Resource Update Action
  const handleSaveResource = async () => {
    if (!editingResource) return;

    try {
      setIsSavingResource(true);
      await resourceService.update(editingResource.id, {
        currentRate: editRate,
        availableQuantity: editQuantity,
      });
      setEditingResource(null);
      await handleRefresh();
    } catch (err: any) {
      console.error('Resource update failed:', err);
      alert(err.response?.data?.message || 'Failed to update resource catalog.');
    } finally {
      setIsSavingResource(false);
    }
  };

  const filteredReservations = reservations.filter((r) => {
    const matchesSearch =
      r.uniqueBookingReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerPhone.includes(searchQuery) ||
      (r.items[0]?.displayName || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const chartData = [
    { name: 'Confirmed', count: stats?.confirmedCount || 0, color: '#10B981' },
    { name: 'Checked In', count: stats?.checkedInCount || 0, color: '#F59E0B' },
    { name: 'Completed', count: stats?.completedCount || 0, color: '#57534E' },
    { name: 'Cancelled', count: stats?.cancelledCount || 0, color: '#EF4444' },
  ];

  return (
    <div className="min-h-screen bg-ivory-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="bg-charcoal-900 text-ivory-50 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-charcoal-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-burgundy-900 text-champagne-400 text-xs font-semibold uppercase tracking-wider mb-2 border border-burgundy-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              Administrative Operations Console
            </div>
            <h1 className="font-serif text-3xl font-extrabold text-white">
              Restaurant Management & Control
            </h1>
            <p className="mt-1 text-xs text-ivory-300 max-w-2xl">
              Strict operational stage progression (CONFIRMED → CHECKED_IN → COMPLETED), live table inventory manager, and financial metrics.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2.5 bg-charcoal-800 hover:bg-charcoal-700 text-ivory-100 rounded-xl border border-charcoal-700 text-xs font-semibold flex items-center gap-2 transition cursor-pointer self-start md:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-terracotta-400' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Live State'}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ================= KPI CARDS ================= */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-ivory-200 shadow-sm">
              <span className="text-[11px] text-charcoal-500 font-bold uppercase tracking-wider block">
                Total Bookings
              </span>
              <span className="font-serif text-2xl font-bold text-charcoal-900 mt-1 block">
                {stats.totalReservations}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-ivory-200 shadow-sm">
              <span className="text-[11px] text-emerald-700 font-bold uppercase tracking-wider block">
                Confirmed
              </span>
              <span className="font-serif text-2xl font-bold text-emerald-700 mt-1 block">
                {stats.confirmedCount}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-ivory-200 shadow-sm">
              <span className="text-[11px] text-amber-700 font-bold uppercase tracking-wider block">
                Checked In
              </span>
              <span className="font-serif text-2xl font-bold text-amber-700 mt-1 block">
                {stats.checkedInCount}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-ivory-200 shadow-sm">
              <span className="text-[11px] text-charcoal-600 font-bold uppercase tracking-wider block">
                Completed
              </span>
              <span className="font-serif text-2xl font-bold text-charcoal-800 mt-1 block">
                {stats.completedCount}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-ivory-200 shadow-sm">
              <span className="text-[11px] text-rose-600 font-bold uppercase tracking-wider block">
                Cancelled
              </span>
              <span className="font-serif text-2xl font-bold text-rose-600 mt-1 block">
                {stats.cancelledCount}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-ivory-200 shadow-sm">
              <span className="text-[11px] text-terracotta-700 font-bold uppercase tracking-wider block">
                Realized Revenue
              </span>
              <span className="font-serif text-2xl font-bold text-terracotta-700 mt-1 block truncate">
                ₹{stats.totalRevenue.toFixed(0)}
              </span>
            </div>
          </div>
        )}

        {/* Charts & Inventory Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recharts Analytics Chart */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-ivory-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal-900">
                Reservation Status Distribution
              </h3>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Breakdown across operational stages
              </p>
            </div>
            <div className="h-48 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Live Resource Inventory Manager */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-ivory-200 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <div>
                <h3 className="font-serif text-lg font-bold text-charcoal-900">
                  Live Resource Inventory
                </h3>
                <p className="text-xs text-charcoal-500">
                  Modify rate or availability for demonstration tests (T7 / T12)
                </p>
              </div>
              <span className="text-xs text-terracotta-600 font-bold">
                {resources.length} Tables Registered
              </span>
            </div>

            <div className="mt-4 space-y-2 max-h-52 overflow-y-auto pr-1 text-xs">
              {resources.map((res) => (
                <div
                  key={res.id}
                  className="p-3 bg-ivory-50 rounded-xl border border-ivory-200 flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono font-bold text-charcoal-900 mr-2">
                      {res.resourceCode}
                    </span>
                    <span className="font-semibold text-charcoal-800">{res.displayName}</span>
                    <span className="text-charcoal-500 ml-2">({res.category})</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-terracotta-700">₹{res.currentRate.toFixed(2)}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold ${
                        res.availableQuantity > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {res.availableQuantity} units
                    </span>
                    <button
                      onClick={() => {
                        setEditingResource(res);
                        setEditRate(res.currentRate);
                        setEditQuantity(res.availableQuantity);
                      }}
                      className="px-2.5 py-1 bg-ivory-200 hover:bg-ivory-300 text-charcoal-700 rounded-lg text-[11px] font-semibold cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Master Reservations Table */}
        <div className="bg-white rounded-3xl border border-ivory-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-charcoal-900">
                Master Reservation Management
              </h2>
              <p className="text-xs text-charcoal-500">
                Advance reservations only through the sequence: CONFIRMED → CHECKED_IN → COMPLETED (Rule BR8).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter reference or guest..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-ivory-50 border border-ivory-300 rounded-xl text-xs focus:outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-1.5 px-3 bg-ivory-50 border border-ivory-300 rounded-xl text-xs text-charcoal-800 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CHECKED_IN">Checked In</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory-100/70 border-b border-ivory-200 text-charcoal-600 uppercase font-semibold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Guest Details</th>
                  <th className="py-3 px-4">Date / Slot</th>
                  <th className="py-3 px-4">Table & Qty</th>
                  <th className="py-3 px-4">Grand Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Stage Progression</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-100">
                {filteredReservations.map((res) => {
                  const item = res.items[0];
                  return (
                    <tr key={res.id} className="hover:bg-ivory-50/60 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-charcoal-900">
                        {res.uniqueBookingReference}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-charcoal-900 block">
                          {res.customerName}
                        </span>
                        <span className="text-[11px] text-charcoal-500 font-mono">
                          {res.customerPhone}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-charcoal-900 font-medium block">
                          {res.bookingDate}
                        </span>
                        <span className="text-[10px] text-charcoal-500">{res.diningSlot}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-charcoal-800 block">
                          {item?.displayName || 'Table'}
                        </span>
                        <span className="text-[10px] text-charcoal-500 font-mono">
                          {item?.quantity} × ₹{item?.savedUnitRate.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-terracotta-700">
                        ₹{res.grandTotal.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={res.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => setSelectedReservation(res)}
                          title="View Details"
                          className="px-2.5 py-1.5 bg-ivory-200 hover:bg-ivory-300 text-charcoal-700 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Progression Step 1: CONFIRMED -> CHECKED_IN */}
                        {res.status === 'CONFIRMED' && (
                          <button
                            onClick={() =>
                              setStatusModalTarget({
                                reservation: res,
                                nextStatus: 'CHECKED_IN',
                              })
                            }
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold cursor-pointer transition shadow-sm inline-flex items-center gap-1"
                          >
                            Check In
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}

                        {/* Progression Step 2: CHECKED_IN -> COMPLETED */}
                        {res.status === 'CHECKED_IN' && (
                          <button
                            onClick={() =>
                              setStatusModalTarget({
                                reservation: res,
                                nextStatus: 'COMPLETED',
                              })
                            }
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer transition shadow-sm inline-flex items-center gap-1"
                          >
                            Complete
                            <CheckCircle2 className="w-3 h-3" />
                          </button>
                        )}

                        {/* Terminal statuses (COMPLETED, CANCELLED) */}
                        {(res.status === 'COMPLETED' || res.status === 'CANCELLED') && (
                          <span className="text-[11px] text-charcoal-400 italic px-2">
                            Terminal
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= STATUS PROGRESSION CONFIRMATION MODAL ================= */}
      {statusModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-ivory-50 rounded-3xl border border-ivory-300 shadow-2xl p-6">
            <h3 className="font-serif text-xl font-bold text-charcoal-900">
              Advance Operational Status
            </h3>
            <p className="text-xs text-charcoal-600 mt-2">
              Advance <strong>{statusModalTarget.reservation.uniqueBookingReference}</strong> from{' '}
              <span className="font-bold">{statusModalTarget.reservation.status}</span> to{' '}
              <span className="font-bold text-terracotta-700">
                {statusModalTarget.nextStatus}
              </span>
              .
            </p>

            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                Optional Audit Remarks
              </label>
              <input
                type="text"
                placeholder="e.g. Guest arrived at Table A; Party seated"
                value={statusRemarks}
                onChange={(e) => setStatusRemarks(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-ivory-300 rounded-xl text-xs focus:outline-none"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setStatusModalTarget(null)}
                className="px-4 py-2 bg-ivory-200 text-charcoal-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusProgression}
                disabled={isUpdatingStatus}
                className="px-5 py-2 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-2"
              >
                {isUpdatingStatus ? 'Updating...' : 'Confirm Progression'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= RESOURCE EDIT MODAL (FOR T7 / T12 TESTING) ================= */}
      {editingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl border border-ivory-300 shadow-2xl p-6">
            <h3 className="font-serif text-xl font-bold text-charcoal-900">
              Edit Table Resource: {editingResource.displayName} ({editingResource.resourceCode})
            </h3>
            <p className="text-xs text-charcoal-500 mt-1">
              Used to demonstrate rate changes (T12 snapshot preservation) and capacity revalidation (T7).
            </p>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">
                  Current Unit Rate (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editRate}
                  onChange={(e) => setEditRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">
                  Available Quantity (Units)
                </label>
                <input
                  type="number"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 bg-ivory-50 border border-ivory-300 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditingResource(null)}
                className="px-4 py-2 bg-ivory-200 text-charcoal-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveResource}
                disabled={isSavingResource}
                className="px-5 py-2 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-xl text-xs font-bold"
              >
                {isSavingResource ? 'Saving...' : 'Save Catalog Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= RESERVATION DETAILS MODAL ================= */}
      {selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-ivory-50 rounded-3xl border border-ivory-300 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-ivory-200">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-charcoal-500 font-bold">
                  Admin Inspection
                </span>
                <h3 className="font-mono text-xl font-bold text-terracotta-700">
                  {selectedReservation.uniqueBookingReference}
                </h3>
              </div>
              <StatusBadge status={selectedReservation.status} />
            </div>

            <div className="mt-6 space-y-6 text-xs">
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
                  <span className="text-charcoal-500 block">User Account Email</span>
                  <span className="font-semibold text-charcoal-900">
                    {selectedReservation.userEmail}
                  </span>
                </div>
                <div>
                  <span className="text-charcoal-500 block">Dining Date</span>
                  <span className="font-semibold text-charcoal-900">
                    {selectedReservation.bookingDate}
                  </span>
                </div>
              </div>

              {/* Saved Snapshot Rate */}
              <div className="bg-white p-4 rounded-2xl border border-ivory-200 space-y-2">
                <h4 className="font-serif text-sm font-bold text-charcoal-900">
                  Snapshotted Rate Items (BR3)
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

              {/* Status Audit Trail */}
              <div className="bg-white p-4 rounded-2xl border border-ivory-200 space-y-2">
                <h4 className="font-serif text-sm font-bold text-charcoal-900">Audit History</h4>
                {selectedReservation.statusHistory?.map((hist) => (
                  <div
                    key={hist.id}
                    className="p-2.5 rounded-xl bg-ivory-50 border border-ivory-200 flex justify-between text-[11px]"
                  >
                    <div>
                      <span className="font-bold text-charcoal-900">
                        {hist.previousStatus ? `${hist.previousStatus} → ` : 'Initial: '}
                        {hist.newStatus}
                      </span>
                      <p className="text-charcoal-600">{hist.remarks}</p>
                    </div>
                    <span className="text-charcoal-400 text-[10px]">{hist.changedBy}</span>
                  </div>
                ))}
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
    </div>
  );
};
