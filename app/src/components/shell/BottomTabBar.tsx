import { NavLink } from 'react-router-dom';
import type { Role } from '../../types';
import { NAV_CONFIG } from '../../config/nav';
import { cn } from '../../lib/cn';

export function BottomTabBar({ role }: { role: Role }) {
  return (
    <nav className="flex w-full shrink-0 items-stretch justify-around border-t border-border-default bg-bg-surface">
      {NAV_CONFIG[role].map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center gap-[2px] px-xs py-xs text-label-sm',
              isActive ? 'text-bg-primary' : 'text-text-tertiary',
            )
          }
        >
          <span className="material-symbols-rounded !text-[20px]">{item.icon}</span>
          <span>{item.shortLabel}</span>
        </NavLink>
      ))}
    </nav>
  );
}
