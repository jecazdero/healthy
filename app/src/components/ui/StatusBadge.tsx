import { cn } from '../../lib/cn';

export type StatusBadgeVariant = 'in-room' | 'next-up' | 'waiting' | 'urgent';

const DEFAULT_LABEL: Record<StatusBadgeVariant, string> = {
  'in-room': 'In Room',
  'next-up': 'Next Up',
  waiting: 'Waiting',
  urgent: 'Urgent',
};

const VARIANT_CLASSES: Record<StatusBadgeVariant, string> = {
  'in-room': 'bg-bg-warning text-text-warning',
  'next-up': 'bg-bg-primarySubtle text-text-primary',
  waiting: 'bg-bg-surfaceAlt text-text-secondary',
  urgent: 'bg-bg-urgent text-text-urgent',
};

interface StatusBadgeProps {
  variant: StatusBadgeVariant;
  label?: string;
  className?: string;
}

export function StatusBadge({ variant, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-sm py-xs text-label-sm',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {label ?? DEFAULT_LABEL[variant]}
    </span>
  );
}
