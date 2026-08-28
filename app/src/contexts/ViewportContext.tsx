import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Device, ViewportMode } from '../types';

const BREAKPOINT_TABLET = 640;
const BREAKPOINT_DESKTOP = 1024;

function deviceFromWidth(width: number): Device {
  if (width < BREAKPOINT_TABLET) return 'mobile';
  if (width < BREAKPOINT_DESKTOP) return 'tablet';
  return 'desktop';
}

function useAutoDevice(): Device {
  const [device, setDevice] = useState<Device>(() =>
    typeof window === 'undefined' ? 'desktop' : deviceFromWidth(window.innerWidth),
  );

  useEffect(() => {
    function onResize() {
      setDevice(deviceFromWidth(window.innerWidth));
    }
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return device;
}

interface ViewportContextValue {
  mode: ViewportMode;
  setMode: (mode: ViewportMode) => void;
  /** Resolved device: the manual override when set, otherwise derived from real window width. */
  device: Device;
  /** Whether the manual device-preview frame is active (mode !== 'auto'). */
  isPreview: boolean;
}

const ViewportContext = createContext<ViewportContextValue | null>(null);

export function ViewportProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ViewportMode>('auto');
  const autoDevice = useAutoDevice();

  const value = useMemo<ViewportContextValue>(() => {
    const device = mode === 'auto' ? autoDevice : mode;
    return { mode, setMode, device, isPreview: mode !== 'auto' };
  }, [mode, autoDevice]);

  return <ViewportContext.Provider value={value}>{children}</ViewportContext.Provider>;
}

export function useViewport(): ViewportContextValue {
  const ctx = useContext(ViewportContext);
  if (!ctx) throw new Error('useViewport must be used within a ViewportProvider');
  return ctx;
}
