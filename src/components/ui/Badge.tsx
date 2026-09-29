import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  className?: string;
}

export const Badge = ({ children, variant = 'primary', className }: BadgeProps) => {
  const variants = {
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-coral-100 text-coral-700', // Need to check if coral exists, fallback to red
    neutral: 'bg-neutral-100 text-neutral-700',
  };

  const actualVariant = variant === 'error' ? 'bg-red-100 text-red-700' : variants[variant];

  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold', actualVariant, className)}>
      {children}
    </span>
  );
};
