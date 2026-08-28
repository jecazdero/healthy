import { NavLink } from 'react-router-dom';
import type { Role } from '../../types';
import { NAV_CONFIG } from '../../config/nav';
import { cn } from '../../lib/cn';

export function IconRail({ role }: { role: Role }) {
  return (
    <aside className="flex w-[72px] shrink-0 flex-col items-center gap-xs self-stretch border-r border-border-default bg-bg-surface py-md">
      {NAV_CONFIG[role].map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          title={item.label}
          className={({ isActive }) =>
            cn(
              'flex h-11 w-11 items-center justify-center rounded-md transition-colors',
              isActive ? 'bg-bg-primarySubtle text-icon-primary' : 'text-icon-muted hover:bg-bg-surfaceAlt',
            )
          }
        >
          <span className="material-symbols-rounded !text-[22px]">{item.icon}</span>
        </NavLink>
      ))}
    </aside>
  );
}
