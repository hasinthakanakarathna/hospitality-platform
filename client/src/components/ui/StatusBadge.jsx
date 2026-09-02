/**
 * StatusBadge — colored pill badge for displaying status values.
 * Used for room status, booking status, task status, etc.
 */
export default function StatusBadge({ status, config }) {
  const statusConfig = config?.[status];

  if (!statusConfig) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
        {status}
      </span>
    );
  }

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full
        text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}
      `}
    >
      {statusConfig.label}
    </span>
  );
}
