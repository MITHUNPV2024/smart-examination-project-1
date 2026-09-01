import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(
          clsx(
            'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100',
            {
              // Sizes
              'px-3 py-1.5 text-xs': size === 'sm',
              'px-4 py-2 text-sm': size === 'md',
              'px-6 py-3 text-base': size === 'lg',

              // Variants
              'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20': variant === 'primary',
              'bg-slate-800 text-slate-100 hover:bg-slate-700': variant === 'secondary',
              'border border-slate-700 text-slate-200 hover:bg-slate-800': variant === 'outline',
              'text-slate-300 hover:bg-slate-800 hover:text-slate-100': variant === 'ghost',
              'bg-rose-600 text-white hover:bg-rose-500 shadow-lg shadow-rose-600/20': variant === 'destructive',
              'bg-white/10 backdrop-blur-md text-white border border-white/10 hover:bg-white/20': variant === 'glass',
            }
          ),
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
