import { Navigate, Route, Routes } from 'react-router-dom';
import { ViewportProvider } from './contexts/ViewportContext';
import { AssistanceProvider } from './contexts/AssistanceContext';
import { AppShell } from './components/shell/AppShell';
import { PlaceholderScreen } from './pages/PlaceholderScreen';
import { PatientSchedules } from './pages/patient/PatientSchedules';
import { PatientHistory } from './pages/patient/PatientHistory';
import { PatientProfile } from './pages/patient/PatientProfile';
import { NurseWaitingRoom } from './pages/nurse/NurseWaitingRoom';
import { NurseSchedule } from './pages/nurse/NurseSchedule';
import { DoctorWaitingRoom } from './pages/doctor/DoctorWaitingRoom';
import { NAV_CONFIG, ROLE_HOME } from './config/nav';
import type { NavItem } from './config/nav';
import type { Role } from './types';

function screenElement(role: Role, item: NavItem) {
  if (item.path === '/patient/schedules') return <PatientSchedules />;
  if (item.path === '/patient/history') return <PatientHistory />;
  if (item.path === '/patient/profile') return <PatientProfile />;
  if (item.path === '/nurse/waiting-room') return <NurseWaitingRoom />;
  if (item.path === '/nurse/schedule') return <NurseSchedule />;
  if (item.path === '/doctor/waiting-room') return <DoctorWaitingRoom />;
  return <PlaceholderScreen role={role} title={item.label} />;
}

function App() {
  return (
    <ViewportProvider>
      <AssistanceProvider>
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
      </AssistanceProvider>
    </ViewportProvider>
  );
}

export default App;
