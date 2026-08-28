import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  'aria-label': string;
}

export function IconButton({ icon, className, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bg-primarySubtle text-icon-primary transition-colors hover:bg-bg-surfaceAlt',
        className,
      )}
      {...rest}
    >
      <span className="material-symbols-rounded !text-[20px]">{icon}</span>
    </button>
  );
}
