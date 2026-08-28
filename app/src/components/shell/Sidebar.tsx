import { NavLink } from 'react-router-dom';
import type { Role } from '../../types';
import { NAV_CONFIG, ROLE_SIDEBAR_SUBTITLE } from '../../config/nav';
import { cn } from '../../lib/cn';

export function Sidebar({ role }: { role: Role }) {
  return (
    <aside className="flex w-[220px] shrink-0 flex-col self-stretch border-r border-border-default bg-bg-surface">
      <div className="px-md pt-md">
        <p className="text-heading-sm text-text-primary">Healthy</p>
        <p className="mt-xs text-body-sm text-text-tertiary">{ROLE_SIDEBAR_SUBTITLE[role]}</p>
      </div>
      <nav className="mt-md flex flex-col gap-xs px-sm">
        {NAV_CONFIG[role].map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-sm rounded-md px-sm py-sm text-label-md transition-colors',
                isActive
                  ? 'bg-bg-primarySubtle text-icon-primary'
                  : 'text-text-secondary hover:bg-bg-surfaceAlt',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'material-symbols-rounded !text-[18px]',
                    isActive ? 'text-icon-primary' : 'text-icon-muted',
                  )}
                >
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.quickAction && (
                  <span
                    role="button"
                    aria-label={item.quickAction.label}
                    title={item.quickAction.label}
                    onClick={(e) => e.preventDefault()}
                    className="material-symbols-rounded !text-[16px] flex h-6 w-6 items-center justify-center rounded-full bg-bg-primarySubtle text-icon-primary"
                  >
                    {item.quickAction.icon}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
