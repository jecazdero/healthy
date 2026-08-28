import type { Role } from '../types';
import { ScreenHeader } from '../components/ScreenHeader';

interface PlaceholderScreenProps {
  role: Role;
  title: string;
}

export function PlaceholderScreen({ role, title }: PlaceholderScreenProps) {
  return (
    <div className="flex flex-col gap-lg">
      <ScreenHeader role={role} title={title} />
      <div className="rounded-lg border border-dashed border-border-default bg-bg-surface p-xl text-center shadow-sm">
        <p className="text-body-md text-text-secondary">
          This screen will be built to match the approved Figma design in an upcoming step.
        </p>
      </div>
    </div>
  );
}
