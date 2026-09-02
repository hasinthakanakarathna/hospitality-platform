/**
 * Reusable Button component with variants, sizes, and loading state.
 */
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm',
  secondary: 'bg-white text-text-primary border border-border hover:bg-surface-hover shadow-sm',
  danger: 'bg-danger-500 text-white hover:bg-danger-600 shadow-sm',
  ghost: 'text-text-secondary hover:bg-gray-100 hover:text-text-primary',
  success: 'bg-success-500 text-white hover:bg-success-600 shadow-sm',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-5 py-2.5 text-sm rounded-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 font-medium
        transition-all duration-150 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANTS[variant]}
        ${SIZES[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
}
