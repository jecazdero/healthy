import { Link } from 'react-router-dom';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useViewport } from '../../contexts/ViewportContext';

const QUEUE = {
  number: '05',
  aheadCount: 3,
  estimatedWaitMinutes: 25,
};

const DOCTOR = {
  name: 'Dr. Alvarez',
  room: 'Room 3',
  floor: 'Second Floor',
};

export function PatientSchedules() {
  const { device } = useViewport();
  const isMobile = device === 'mobile';

  return (
    <div className="flex flex-col gap-lg">
      <ScreenHeader role="patient" title="Hi, Maria" subtitle="Tuesday, August 18" />

      <Card className="flex flex-col items-center gap-xs text-center">
        <p className="text-label-sm text-text-tertiary">YOUR QUEUE NUMBER</p>
        <p className="text-numeral-xl text-text-primary">{QUEUE.number}</p>
        <p className="text-body-md text-text-primary">{QUEUE.aheadCount} patients ahead of you</p>
        <p className="text-body-sm text-text-secondary">Estimated wait: ~{QUEUE.estimatedWaitMinutes} min</p>
      </Card>

      <div className="flex items-center gap-md rounded-lg bg-bg-surface p-md shadow-sm">
        <div className="h-11 w-11 shrink-0 rounded-full bg-bg-surfaceAlt" />
        <div className="flex flex-col gap-xs">
          <p className="text-body-md text-text-primary">{DOCTOR.name}</p>
          <p className="text-body-sm text-text-secondary">
            {DOCTOR.room} · {DOCTOR.floor}
          </p>
        </div>
      </div>

      {isMobile ? (
        <div className="flex flex-col gap-sm rounded-lg bg-bg-surface p-md shadow-sm">
          <Button variant="primary" className="w-full">
            Schedule Appointment
          </Button>
          <Button variant="secondary" className="w-full">
            Reschedule
          </Button>
          <Button variant="urgent-solid" className="w-full">
            Request Immediate Assistance
          </Button>
        </div>
      ) : device === 'tablet' ? (
        <div className="flex flex-wrap items-center gap-sm rounded-lg bg-bg-surface p-md shadow-sm">
          <Button variant="primary">Schedule Appointment</Button>
          <Button variant="secondary">Reschedule</Button>
          <Button variant="urgent-solid">Request Immediate Assistance</Button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-sm rounded-lg bg-bg-surface p-md shadow-sm">
          <div className="flex items-center gap-[12px]">
            <Button variant="primary">Schedule Appointment</Button>
            <Button variant="secondary">Reschedule</Button>
          </div>
          <Button variant="urgent-solid">Request Immediate Assistance</Button>
        </div>
      )}

      <Link to="/patient/history" className="text-label-md text-icon-primary hover:underline">
        → View my visit history &amp; active therapies
      </Link>
    </div>
  );
}
