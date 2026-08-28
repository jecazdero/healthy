import { useViewport } from '../../contexts/ViewportContext';
import type { Device } from '../../types';
import { cn } from '../../lib/cn';

const OPTIONS: { device: Device; icon: string; label: string }[] = [
  { device: 'desktop', icon: 'desktop_windows', label: 'Desktop' },
  { device: 'tablet', icon: 'tablet_mac', label: 'Tablet' },
  { device: 'mobile', icon: 'smartphone', label: 'Mobile' },
];

export function DevicePreviewToggle() {
  const { mode, setMode } = useViewport();

  return (
    <div className="fixed right-md top-md z-40 flex items-center gap-xs rounded-full border border-border-default bg-bg-surface p-[4px] shadow-md">
      {OPTIONS.map((opt) => {
        const active = mode === opt.device;
        return (
          <button
            key={opt.device}
            type="button"
            title={opt.label}
            aria-pressed={active}
            onClick={() => setMode(active ? 'auto' : opt.device)}
            className={cn(
              'flex items-center gap-xs rounded-full px-sm py-xs text-label-sm transition-colors',
              active ? 'bg-bg-primary text-text-onPrimary' : 'text-text-tertiary hover:bg-bg-surfaceAlt',
            )}
          >
            <span className="material-symbols-rounded !text-[16px]">{opt.icon}</span>
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
