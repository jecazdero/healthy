import { cn } from '../../lib/cn';

export function DragHandle({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('material-symbols-rounded !text-[18px] cursor-grab select-none text-icon-muted', className)}
    >
      drag_indicator
    </span>
  );
}
