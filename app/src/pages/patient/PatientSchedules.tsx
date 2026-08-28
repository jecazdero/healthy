import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
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

export function PatientSchedules() {
  const { device } = useViewport();
  const isMobile = device === 'mobile';
  const { requestAssistance } = useAssistance();
  const [showConfirmation, setShowConfirmation] = useState(false);

  function handleRequestAssistance() {
    requestAssistance({
      patientName: PATIENT_NAME,
      queueNumber: QUEUE.number,
      room: DOCTOR.room,
      requestedAt: 'Just now',
    });
    setShowConfirmation(true);
  }

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
          <Button variant="urgent-solid" className="w-full" onClick={handleRequestAssistance}>
            Request Immediate Assistance
          </Button>
        </div>
      ) : device === 'tablet' ? (
        <div className="flex flex-wrap items-center gap-sm rounded-lg bg-bg-surface p-md shadow-sm">
          <Button variant="primary">Schedule Appointment</Button>
          <Button variant="secondary">Reschedule</Button>
          <Button variant="urgent-solid" onClick={handleRequestAssistance}>
            Request Immediate Assistance
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-sm rounded-lg bg-bg-surface p-md shadow-sm">
          <div className="flex items-center gap-[12px]">
            <Button variant="primary">Schedule Appointment</Button>
            <Button variant="secondary">Reschedule</Button>
          </div>
          <Button variant="urgent-solid" onClick={handleRequestAssistance}>
            Request Immediate Assistance
          </Button>
        </div>
      )}

      <Link to="/patient/history" className="text-label-md text-icon-primary hover:underline">
        → View my visit history &amp; active therapies
      </Link>

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
