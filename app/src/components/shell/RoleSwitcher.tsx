import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES, ROLE_LABEL, type Role } from '../../types';
import { ROLE_HOME } from '../../config/nav';
import { cn } from '../../lib/cn';

export function RoleSwitcher({ role }: { role: Role }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickAway(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickAway);
    return () => document.removeEventListener('mousedown', onClickAway);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-xs rounded-full border border-border-default bg-bg-surface px-md py-xs text-label-md text-text-primary shadow-sm"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {ROLE_LABEL[role]}
        <span className="material-symbols-rounded !text-[16px] text-text-tertiary">expand_more</span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-30 mt-xs w-40 overflow-hidden rounded-md border border-border-default bg-bg-surface shadow-md"
        >
          {ROLES.map((r) => (
            <li key={r}>
              <button
                type="button"
                role="option"
                aria-selected={r === role}
                onClick={() => {
                  setOpen(false);
                  navigate(ROLE_HOME[r]);
                }}
                className={cn(
                  'block w-full px-md py-sm text-left text-label-md',
                  r === role
                    ? 'bg-bg-primarySubtle text-icon-primary'
                    : 'text-text-secondary hover:bg-bg-surfaceAlt',
                )}
              >
                {ROLE_LABEL[r]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
