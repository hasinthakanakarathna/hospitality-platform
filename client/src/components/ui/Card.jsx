/**
 * Reusable stat card component for the dashboard.
 * Shows a metric with an icon, value, and optional change indicator.
 */
export default function Card({ children, className = '', hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-surface rounded-xl border border-border
        shadow-card transition-all duration-200
        ${hover ? 'hover:shadow-card-hover hover:border-primary-200 cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/**
 * StatCard — dashboard metric card with icon + value + label + trend
 */
export function StatCard({ icon: Icon, label, value, trend, trendUp, color = 'primary' }) {
  const colorMap = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
    danger: 'bg-danger-50 text-danger-600',
    info: 'bg-info-50 text-info-600',
  };

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-text-secondary">{label}</p>
          <p className="text-2xl font-bold text-text-primary">{value}</p>
          {trend && (
            <p className={`text-xs font-medium ${trendUp ? 'text-success-600' : 'text-danger-600'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${colorMap[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </Card>
  );
}
