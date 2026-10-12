import React from 'react';
import { ReservationStatus } from '../types';

interface StatusBadgeProps {
  status: ReservationStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStyles = () => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 ring-emerald-500/20';
      case 'CHECKED_IN':
        return 'bg-amber-50 text-amber-800 border-amber-200 ring-amber-500/20';
      case 'COMPLETED':
        return 'bg-stone-100 text-stone-700 border-stone-200 ring-stone-500/20';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20';
      default:
        return 'bg-stone-50 text-stone-600 border-stone-200';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmed';
      case 'CHECKED_IN':
        return 'Checked In';
      case 'COMPLETED':
        return 'Completed';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs tracking-wider uppercase font-semibold',
    lg: 'px-3.5 py-1.5 text-sm font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm ring-1 ${sizeClasses[size]} ${getStyles()}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'CONFIRMED'
            ? 'bg-emerald-500'
            : status === 'CHECKED_IN'
            ? 'bg-amber-500 animate-pulse'
            : status === 'COMPLETED'
            ? 'bg-stone-500'
            : 'bg-rose-500'
        }`}
      />
      {getLabel()}
    </span>
  );
};
