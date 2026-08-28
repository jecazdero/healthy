import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, children, className }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-md">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={cn('relative w-full max-w-[420px] rounded-lg bg-bg-surface p-lg shadow-sm', className)}
      >
        {children}
      </div>
    </div>
  );
}
