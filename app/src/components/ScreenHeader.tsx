import type { Role } from '../types';
import { useViewport } from '../contexts/ViewportContext';
import { RoleSwitcher } from './shell/RoleSwitcher';

interface ScreenHeaderProps {
  role: Role;
  title: string;
  subtitle?: string;
}

/**
 * Per-screen header row (title + RoleSwitcher). On mobile the RoleSwitcher already
 * lives in the persistent TopBar, so this only renders the title there.
 */
export function ScreenHeader({ role, title, subtitle }: ScreenHeaderProps) {
  const { device } = useViewport();

  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-heading-lg text-text-primary">{title}</h1>
        {subtitle && <p className="mt-xs text-body-sm text-text-secondary">{subtitle}</p>}
      </div>
      {device !== 'mobile' && <RoleSwitcher role={role} />}
    </div>
  );
}
