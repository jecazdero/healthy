import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { IconButton } from '../../components/ui/IconButton';
import { Modal } from '../../components/ui/Modal';
import { useViewport } from '../../contexts/ViewportContext';
import { useAssistance } from '../../contexts/AssistanceContext';

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

const PATIENT_NAME = 'Maria Torres';

type Schedule = {
  id: string;
  date: string;
  time: string;
  doctor: string;
  type: string;
  status: 'upcoming' | 'completed';
};

const SCHEDULES: Schedule[] = [
  { id: '1', date: 'Aug 18, 2026', time: '10:30 AM', doctor: 'Dr. Alvarez', type: 'Follow-up Consultation', status: 'upcoming' },
  { id: '2', date: 'Aug 25, 2026', time: '2:00 PM', doctor: 'Dr. Chen', type: 'Annual Checkup', status: 'upcoming' },
  { id: '3', date: 'Sep 9, 2026', time: '9:15 AM', doctor: 'Dr. Alvarez', type: 'Blood Work Review', status: 'upcoming' },
  { id: '4', date: 'Jul 30, 2026', time: '9:15 AM', doctor: 'Dr. Alvarez', type: 'Blood Work Review', status: 'completed' },
  { id: '5', date: 'Jun 2, 2026', time: '11:00 AM', doctor: 'Dr. Patel', type: 'Vaccination', status: 'completed' },
];

function ScheduleRows({ schedules }: { schedules: Schedule[] }) {
  return (
    <>
      {schedules.map((schedule) => (
        <div key={schedule.id} className="flex items-start gap-[12px] rounded-md bg-bg-surfaceAlt px-[14px] py-sm">
          <div
            className={`mt-[7px] h-[8px] w-[8px] shrink-0 rounded-full ${
              schedule.status === 'upcoming' ? 'bg-icon-primary' : 'bg-border-strong'
            }`}
          />
          <div className="flex flex-col gap-[2px]">
            <p className="text-body-md text-text-primary">
              {schedule.date} · {schedule.time}
            </p>
            <p className="text-body-sm text-text-secondary">
              {schedule.doctor} · {schedule.type}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}

function AllSchedulesDrawer({
  open,
  onClose,
  schedules,
}: {
  open: boolean;
  onClose: () => void;
  schedules: Schedule[];
}) {
  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-[#0d1a1f] transition-opacity duration-300 ${
          open ? 'opacity-30' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        className={`fixed right-0 top-0 z-50 h-full w-[85%] max-w-[360px] overflow-y-auto bg-bg-canvas p-lg shadow-lg transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="All Schedules"
        aria-hidden={!open}
      >
        <div className="flex flex-col gap-md">
          <div className="flex items-center justify-between">
            <p className="text-heading-sm text-text-primary">All Schedules</p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close All Schedules"
              className="shrink-0 text-icon-muted transition-colors hover:text-icon-primary"
            >
              <span className="material-symbols-rounded !text-[22px]">close</span>
            </button>
          </div>
          <Button variant="primary">Schedule</Button>
          <ScheduleRows schedules={schedules} />
        </div>
      </div>
    </>
  );
}

export function PatientSchedules() {
  const { device } = useViewport();
  const { requestAssistance } = useAssistance();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSchedulesOpen, setIsSchedulesOpen] = useState(false);

  function handleRequestAssistance() {
    requestAssistance({
      patientName: PATIENT_NAME,
      queueNumber: QUEUE.number,
      room: DOCTOR.room,
      requestedAt: 'Just now',
    });
    setShowConfirmation(true);
  }

  const mainContent = (
    <div className={`flex flex-1 flex-col gap-lg ${device === 'desktop' ? 'min-w-[420px]' : ''}`}>
      {device !== 'desktop' && (
        <div className="flex items-center justify-end">
          <IconButton
            icon="calendar_month"
            aria-label="All Schedules"
            className="border border-border-primary"
            onClick={() => setIsSchedulesOpen(true)}
          />
        </div>
      )}

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

      <div
        className={`flex flex-wrap items-center gap-sm rounded-lg bg-bg-surface p-md shadow-sm ${
          device === 'desktop' ? 'justify-between' : ''
        }`}
      >
        <Button variant="secondary">Reschedule</Button>
        <Button variant="urgent-solid" onClick={handleRequestAssistance}>
          Request Immediate Assistance
        </Button>
      </div>

      <Link to="/patient/history" className="text-label-md text-icon-primary hover:underline">
        → View my visit history &amp; active therapies
      </Link>
    </div>
  );

  return (
    <div className="flex flex-col gap-lg">
      <ScreenHeader role="patient" title="Hi, Maria" subtitle="Tuesday, August 18" />

      {device === 'desktop' ? (
        <div className="flex w-full min-w-0 flex-wrap items-start gap-xl">
          {mainContent}
          <div className="flex min-w-[320px] flex-1 flex-col gap-md">
            <div className="flex items-center justify-between">
              <p className="text-heading-sm text-text-primary">All Schedules</p>
              <Button variant="primary">Schedule</Button>
            </div>
            <ScheduleRows schedules={SCHEDULES} />
          </div>
        </div>
      ) : (
        mainContent
      )}

      {device !== 'desktop' && (
        <AllSchedulesDrawer
          open={isSchedulesOpen}
          onClose={() => setIsSchedulesOpen(false)}
          schedules={SCHEDULES}
        />
      )}

      <Modal open={showConfirmation} onClose={() => setShowConfirmation(false)}>
        <div className="flex flex-col items-center gap-sm text-center">
          <span className="material-symbols-rounded !text-[32px] text-text-urgent">emergency_home</span>
          <h2 className="text-heading-sm text-text-primary">Assistance Requested</h2>
          <p className="text-body-md text-text-secondary">
            Your request has been sent. Nurse Diaz has been notified that you need immediate assistance and is on
            her way to approach you at {DOCTOR.room}.
          </p>
          <Button variant="primary" className="mt-xs" onClick={() => setShowConfirmation(false)}>
            OK
          </Button>
        </div>
      </Modal>
    </div>
  );
}
