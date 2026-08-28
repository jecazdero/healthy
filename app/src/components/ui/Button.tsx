import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'urgent-outline' | 'urgent-solid';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: string;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-bg-primary text-text-onPrimary hover:bg-bg-primaryHover',
  secondary: 'border border-border-primary bg-transparent text-icon-primary hover:bg-bg-primarySubtle',
  'urgent-outline': 'border border-text-urgent bg-transparent text-text-urgent hover:bg-bg-urgent',
  'urgent-solid': 'bg-bg-urgent text-text-urgent hover:bg-status-urgentSolid hover:text-text-onPrimary',
};

export function Button({ variant = 'primary', icon, children, className, disabled, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-xs whitespace-nowrap rounded-full px-lg py-sm text-label-md transition-colors',
        VARIANT_CLASSES[variant],
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
      {...rest}
    >
      {icon && <span className="material-symbols-rounded !text-[18px]">{icon}</span>}
      {children}
    </button>
  );
}
