import { Navigate, Route, Routes } from 'react-router-dom';
import { ViewportProvider } from './contexts/ViewportContext';
import { AppShell } from './components/shell/AppShell';
import { PlaceholderScreen } from './pages/PlaceholderScreen';
import { PatientSchedules } from './pages/patient/PatientSchedules';
import { NurseWaitingRoom } from './pages/nurse/NurseWaitingRoom';
import { DoctorWaitingRoom } from './pages/doctor/DoctorWaitingRoom';
import { NAV_CONFIG, ROLE_HOME } from './config/nav';
import type { NavItem } from './config/nav';
import type { Role } from './types';

function screenElement(role: Role, item: NavItem) {
  if (item.path === '/patient/schedules') return <PatientSchedules />;
  if (item.path === '/nurse/waiting-room') return <NurseWaitingRoom />;
  if (item.path === '/doctor/waiting-room') return <DoctorWaitingRoom />;
  return <PlaceholderScreen role={role} title={item.label} />;
}

function App() {
  return (
    <ViewportProvider>
      <Routes>
        <Route path="/" element={<Navigate to={ROLE_HOME.patient} replace />} />

        {(Object.keys(NAV_CONFIG) as Role[]).map((role) => (
          <Route key={role} path={role} element={<AppShell role={role} />}>
            <Route index element={<Navigate to={ROLE_HOME[role]} replace />} />
            {NAV_CONFIG[role].map((item) => (
              <Route
                key={item.path}
                path={item.path.split('/').slice(2).join('/')}
                element={screenElement(role, item)}
              />
            ))}
          </Route>
        ))}

        <Route path="*" element={<Navigate to={ROLE_HOME.patient} replace />} />
      </Routes>
    </ViewportProvider>
  );
}

export default App;
