/**
 * Formatting utilities for dates, currency, and display values.
 */
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

/**
 * Format a Firestore timestamp or Date to a readable date string.
 * Handles both Firestore Timestamp objects and ISO strings.
 */
export function formatDate(date) {
  if (!date) return '—';
  const d = date?.toDate ? date.toDate() : new Date(date);
  return format(d, 'MMM d, yyyy');
}

/**
 * Format to a short date (e.g., "Sep 3")
 */
export function formatShortDate(date) {
  if (!date) return '—';
  const d = date?.toDate ? date.toDate() : new Date(date);
  return format(d, 'MMM d');
}

/**
 * Relative time (e.g., "5 minutes ago")
 */
export function formatRelativeTime(date) {
  if (!date) return '—';
  const d = date?.toDate ? date.toDate() : new Date(date);
  return formatDistanceToNow(d, { addSuffix: true });
}

/**
 * Smart date label for activity feeds — "Today", "Yesterday", or the date
 */
export function formatSmartDate(date) {
  if (!date) return '—';
  const d = date?.toDate ? date.toDate() : new Date(date);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d, yyyy');
}

/**
 * Format currency — defaults to USD
 */
export function formatCurrency(amount) {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Get greeting based on time of day
 */
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Room status display config — maps status codes to colors and labels
 */
export const ROOM_STATUS = {
  available: { label: 'Available', color: 'success', bg: 'bg-success-50', text: 'text-success-700', border: 'border-success-500' },
  occupied: { label: 'Occupied', color: 'info', bg: 'bg-info-50', text: 'text-info-600', border: 'border-info-500' },
  reserved: { label: 'Reserved', color: 'warning', bg: 'bg-warning-50', text: 'text-warning-600', border: 'border-warning-500' },
  dirty: { label: 'Dirty', color: 'danger', bg: 'bg-danger-50', text: 'text-danger-600', border: 'border-danger-500' },
  maintenance: { label: 'Out of Service', color: 'gray', bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-400' },
};

/**
 * Booking status display config
 */
export const BOOKING_STATUS = {
  confirmed: { label: 'Confirmed', bg: 'bg-info-50', text: 'text-info-600' },
  'checked-in': { label: 'Checked In', bg: 'bg-success-50', text: 'text-success-700' },
  'checked-out': { label: 'Checked Out', bg: 'bg-gray-100', text: 'text-gray-600' },
  cancelled: { label: 'Cancelled', bg: 'bg-danger-50', text: 'text-danger-600' },
};

/**
 * Housekeeping task status display config
 */
export const TASK_STATUS = {
  todo: { label: 'To Do', bg: 'bg-gray-100', text: 'text-gray-600' },
  'in-progress': { label: 'In Progress', bg: 'bg-warning-50', text: 'text-warning-600' },
  done: { label: 'Done', bg: 'bg-success-50', text: 'text-success-700' },
};
