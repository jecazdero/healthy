import { useState } from 'react';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Button } from '../../components/ui/Button';
import { IconButton } from '../../components/ui/IconButton';
import { useViewport } from '../../contexts/ViewportContext';

type Patient = {
  name: string;
  queueNumber: string;
  details: string;
  activeTherapies: string[];
  visitHistory: string;
  waitTime: string;
  urgent?: boolean;
};

const INITIAL_QUEUE: Patient[] = [
  {
    name: 'Maria Torres',
    queueNumber: '05',
    details: '34 years · Female · Checked in 9:05 AM',
    activeTherapies: ['Lisinopril 10mg — once daily', 'Metformin 500mg — twice daily'],
    visitHistory: '3 visits in the last 12 months · Last visit: Jun 2, 2026',
    waitTime: 'In consultation',
  },
  {
    name: 'David Kim',
    queueNumber: '08',
    details: '52 years · Male · Checked in 9:20 AM',
    activeTherapies: ['Atorvastatin 20mg — once daily'],
    visitHistory: 'First visit — no prior records',
    waitTime: 'Waiting 3 min',
    urgent: true,
  },
  {
    name: 'Ahmed Nasser',
    queueNumber: '06',
    details: '29 years · Male · Checked in 8:40 AM',
    activeTherapies: ['Albuterol inhaler — as needed'],
    visitHistory: '1 visit in the last 12 months · Last visit: Mar 14, 2026',
    waitTime: 'Waiting 22 min',
  },
  {
    name: 'Emily Zhou',
    queueNumber: '07',
    details: '41 years · Female · Checked in 8:55 AM',
    activeTherapies: ['Levothyroxine 75mcg — once daily'],
    visitHistory: '5 visits in the last 12 months · Last visit: Jul 30, 2026',
    waitTime: 'Waiting 15 min',
  },
];

function ConsultationPanel({
  activePatient,
  onOpenUpNext,
}: {
  activePatient: Patient;
  onOpenUpNext?: () => void;
}) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-sm">
        <Button variant="secondary">Call Nurse</Button>
        <Button variant="urgent-outline">Flag Triage</Button>
        {onOpenUpNext && (
          <IconButton
            icon="skip_next"
            aria-label="Up Next"
            className="ml-auto border border-border-primary"
            onClick={onOpenUpNext}
          />
        )}
      </div>

      <div className="flex flex-col gap-sm rounded-lg bg-bg-surface p-[20px] shadow-sm">
        <div className="flex items-center gap-md">
          <div className="h-14 w-14 shrink-0 rounded-full bg-bg-surfaceAlt" />
          <div className="flex flex-col gap-[2px]">
            <p className="text-heading-sm text-text-primary">
              {activePatient.name} · #{activePatient.queueNumber}
            </p>
            <p className="text-body-sm text-text-secondary">{activePatient.details}</p>
          </div>
        </div>
        <p className="text-label-sm text-text-tertiary">ACTIVE THERAPIES</p>
        {activePatient.activeTherapies.map((therapy) => (
          <p key={therapy} className="text-body-md text-text-primary">
            ☐ {therapy}
          </p>
        ))}
        <p className="text-label-sm text-text-tertiary">VISIT HISTORY</p>
        <p className="text-body-sm text-text-secondary">{activePatient.visitHistory}</p>
      </div>

      <div className="flex flex-col gap-sm rounded-lg bg-bg-surface p-[20px] shadow-sm">
        <p className="text-heading-sm text-text-primary">Assessment &amp; Therapy</p>
        <textarea
          key={activePatient.queueNumber}
          className="h-[140px] w-full resize-none rounded-sm border border-border-default bg-bg-surfaceAlt p-sm text-body-md text-text-primary"
          placeholder="Enter assessment and therapy notes…"
        />
      </div>

      <div>
        <Button variant="primary">Complete &amp; Save</Button>
      </div>
    </>
  );
}

function UpNextRows({ patients }: { patients: Patient[] }) {
  return (
    <>
      {patients.map((patient) => (
        <div key={patient.queueNumber} className="flex items-start gap-[12px] rounded-md bg-bg-surfaceAlt px-[14px] py-sm">
          <div
            className={`mt-[7px] h-[8px] w-[8px] shrink-0 rounded-full ${
              patient.urgent ? 'bg-status-urgentSolid' : 'bg-border-strong'
            }`}
          />
          <div className="flex flex-col gap-[2px]">
            <p className="text-body-md text-text-primary">{patient.name}</p>
            <p className="text-body-sm text-text-secondary">
              #{patient.queueNumber} · {patient.urgent && 'Urgent · '}
              {patient.waitTime}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}

function StaffCoverageCard() {
  return (
    <div className="flex flex-col gap-xs rounded-lg bg-bg-surface p-[14px] shadow-sm">
      <p className="text-body-md text-text-primary">Nurse Diaz — on floor</p>
      <p className="text-body-sm text-text-secondary">Nurse Reyes — on break until 10:15, covered by Nurse Diaz</p>
    </div>
  );
}

function UpNextDrawer({
  open,
  onClose,
  upNext,
  onCallNext,
}: {
  open: boolean;
  onClose: () => void;
  upNext: Patient[];
  onCallNext: () => void;
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
        aria-label="Up Next"
        aria-hidden={!open}
      >
        <div className="flex flex-col gap-md">
          <div className="flex items-center justify-between">
            <p className="text-heading-sm text-text-primary">Up Next</p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Up Next"
              className="shrink-0 text-icon-muted transition-colors hover:text-icon-primary"
            >
              <span className="material-symbols-rounded !text-[22px]">close</span>
            </button>
          </div>
          <Button variant="primary" disabled={upNext.length === 0} onClick={onCallNext}>
            Call Next Patient
          </Button>
          <UpNextRows patients={upNext} />
          <p className="mt-sm text-heading-sm text-text-primary">Staff Coverage</p>
          <StaffCoverageCard />
        </div>
      </div>
    </>
  );
}

export function DoctorWaitingRoom() {
  const { device } = useViewport();
  const [isUpNextOpen, setIsUpNextOpen] = useState(false);
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [activePatient, ...upNext] = queue;

  const handleCallNext = () => {
    setQueue((prev) => (prev.length > 1 ? prev.slice(1) : prev));
  };

  if (device === 'desktop') {
    return (
      <div className="flex flex-col gap-lg">
        <ScreenHeader role="doctor" title="Room 3 · Consultation" subtitle="5 patients waiting" />

        <div className="flex w-full min-w-0 flex-wrap items-start gap-xl">
          <div className="flex min-w-[420px] w-[700px] flex-1 flex-col gap-lg">
            <ConsultationPanel activePatient={activePatient} />
          </div>

          <div className="flex min-w-[320px] flex-1 flex-col gap-md">
            <div className="flex items-center justify-between">
              <p className="text-heading-sm text-text-primary">Up Next</p>
              <Button variant="primary" disabled={upNext.length === 0} onClick={handleCallNext}>
                Call Next Patient
              </Button>
            </div>
            <UpNextRows patients={upNext} />
            <p className="mt-sm text-heading-sm text-text-primary">Staff Coverage</p>
            <StaffCoverageCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg">
      <ScreenHeader role="doctor" title="Room 3 · Consultation" subtitle="5 patients waiting" />
      <ConsultationPanel activePatient={activePatient} onOpenUpNext={() => setIsUpNextOpen(true)} />
      <UpNextDrawer
        open={isUpNextOpen}
        onClose={() => setIsUpNextOpen(false)}
        upNext={upNext}
        onCallNext={handleCallNext}
      />
    </div>
  );
}
