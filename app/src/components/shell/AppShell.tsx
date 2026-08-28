import { Outlet } from 'react-router-dom';
import { useViewport } from '../../contexts/ViewportContext';
import type { Role } from '../../types';
import { Sidebar } from './Sidebar';
import { IconRail } from './IconRail';
import { BottomTabBar } from './BottomTabBar';
import { TopBar } from './TopBar';
import { DevicePreviewToggle } from './DevicePreviewToggle';

const FRAME_WIDTH: Record<'desktop' | 'tablet' | 'mobile', number> = {
  desktop: 1440,
  tablet: 834,
  mobile: 390,
};

function Layout({ role, fillHeight }: { role: Role; fillHeight: boolean }) {
  const { device } = useViewport();
  const frame = fillHeight ? 'h-full min-h-0' : 'min-h-[600px]';

  if (device === 'mobile') {
    return (
      <div className={`flex w-full flex-col bg-bg-canvas ${frame}`}>
        <TopBar role={role} />
        <div className="flex-1 overflow-y-auto px-md py-md">
          <Outlet context={{ role } satisfies { role: Role }} />
        </div>
        <BottomTabBar role={role} />
      </div>
    );
  }

  return (
    <div className={`flex w-full bg-bg-canvas ${frame}`}>
      {device === 'desktop' ? <Sidebar role={role} /> : <IconRail role={role} />}
      <div className="flex-1 overflow-y-auto px-xl pb-xl pt-[64px]">
        <Outlet context={{ role } satisfies { role: Role }} />
      </div>
    </div>
  );
}

export function AppShell({ role }: { role: Role }) {
  const { isPreview, device } = useViewport();

  return (
    <div className="min-h-screen w-full bg-bg-surfaceAlt">
      <DevicePreviewToggle />
      {isPreview ? (
        <div className="flex min-h-screen w-full justify-center overflow-x-auto py-2xl">
          <div
            className="h-fit transform overflow-hidden rounded-lg border border-border-strong bg-bg-canvas shadow-lg"
            style={{ width: FRAME_WIDTH[device] }}
          >
            <Layout role={role} fillHeight={false} />
          </div>
        </div>
      ) : (
        <div className="h-screen w-full">
          <Layout role={role} fillHeight />
        </div>
      )}
    </div>
  );
}
