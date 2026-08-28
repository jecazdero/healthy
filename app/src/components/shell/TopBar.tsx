import type { Role } from '../../types';
import { RoleSwitcher } from './RoleSwitcher';

export function TopBar({ role }: { role: Role }) {
  return (
    <header className="flex h-[60px] w-full shrink-0 items-center justify-between border-b border-border-default bg-bg-surface px-md">
      <p className="text-heading-sm text-text-primary">Healthy</p>
      <RoleSwitcher role={role} />
    </header>
  );
}
