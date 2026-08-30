import { useEffect, useRef, useState } from 'react';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { cn } from '../../lib/cn';
import { useViewport } from '../../contexts/ViewportContext';
import { useAssistance } from '../../contexts/AssistanceContext';

type ScheduleTab = 'today' | 'week' | 'month';

const TABS: { key: ScheduleTab; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
];

const TODAY_KEY = '2026-08-18';
const WEEK_START = '2026-08-17';
const WEEK_END = '2026-08-23';

interface Appointment {
  id: string;
  patientName: string;
  doctor: string;
  specialization: string;
  dateKey: string;
  dateLabel: string;
  time: string;
}

const APPOINTMENTS: Appointment[] = [
  { id: 'a1', patientName: 'Maria Torres', doctor: 'Dr. Alvarez', specialization: 'General Medicine', dateKey: '2026-08-18', dateLabel: 'Aug 18, 2026', time: '10:30 AM' },
  { id: 'a2', patientName: 'James Okafor', doctor: 'Dr. Alvarez', specialization: 'General Medicine', dateKey: '2026-08-18', dateLabel: 'Aug 18, 2026', time: '11:15 AM' },
  { id: 'a3', patientName: 'Emily Zhou', doctor: 'Dr. Chen', specialization: 'Pediatrics', dateKey: '2026-08-18', dateLabel: 'Aug 18, 2026', time: '1:45 PM' },
  { id: 'a4', patientName: 'Ahmed Nasser', doctor: 'Dr. Patel', specialization: 'Cardiology', dateKey: '2026-08-19', dateLabel: 'Aug 19, 2026', time: '9:00 AM' },
  { id: 'a5', patientName: 'Lucia Fernández', doctor: 'Dr. Alvarez', specialization: 'General Medicine', dateKey: '2026-08-20', dateLabel: 'Aug 20, 2026', time: '2:30 PM' },
  { id: 'a6', patientName: 'David Kim', doctor: 'Dr. Patel', specialization: 'Cardiology', dateKey: '2026-08-21', dateLabel: 'Aug 21, 2026', time: '4:00 PM' },
  { id: 'a7', patientName: 'Sofia Marin', doctor: 'Dr. Chen', specialization: 'Pediatrics', dateKey: '2026-08-06', dateLabel: 'Aug 6, 2026', time: '9:30 AM' },
  { id: 'a8', patientName: 'Noah Williams', doctor: 'Dr. Alvarez', specialization: 'General Medicine', dateKey: '2026-08-27', dateLabel: 'Aug 27, 2026', time: '3:15 PM' },
];

function appointmentsForTab(tab: ScheduleTab): Appointment[] {
  if (tab === 'today') return APPOINTMENTS.filter((a) => a.dateKey === TODAY_KEY);
  if (tab === 'week') return APPOINTMENTS.filter((a) => a.dateKey >= WEEK_START && a.dateKey <= WEEK_END);
  return APPOINTMENTS.filter((a) => a.dateKey.startsWith('2026-08'));
}

interface DoctorOption {
  name: string;
  specialization: string;
  hasFreeSlot: boolean;
}

const DOCTORS: DoctorOption[] = [
  { name: 'Dr. Alvarez', specialization: 'General Medicine', hasFreeSlot: true },
  { name: 'Dr. Chen', specialization: 'Pediatrics', hasFreeSlot: false },
  { name: 'Dr. Patel', specialization: 'Cardiology', hasFreeSlot: true },
];

interface AssistRequest {
  id: string;
  patientName: string;
  requestedAt: string;
  room?: string;
}

const MOCK_REQUESTS: AssistRequest[] = [
  { id: 'req-1', patientName: 'Sofia Marin', requestedAt: '9:12 AM', room: 'Waiting Area' },
];

type ModalState =
  | { type: 'approve'; request: AssistRequest; step: 'select' | 'confirmed'; assignedDoctor?: string }
  | { type: 'decline'; request: AssistRequest; step: 'select' | 'confirmed'; outcome?: string }
  | null;

const COL_WIDTHS = {
  patient: 'w-[200px]',
  doctor: 'w-[180px]',
  specialization: 'w-[180px]',
  date: 'w-[140px]',
  time: 'w-[120px]',
  dateTime: 'w-[190px]',
};

function ScheduleTabs({ active, onChange }: { active: ScheduleTab; onChange: (tab: ScheduleTab) => void }) {
  return (
    <div className="inline-flex items-center gap-xs self-start rounded-full bg-bg-surfaceAlt p-xs">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={cn(
            'rounded-full px-md py-xs text-label-md transition-colors',
            active === tab.key ? 'bg-bg-primary text-text-onPrimary' : 'text-text-secondary hover:text-text-primary',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

const DOCTOR_FILTER_ALL = 'all';

function DoctorFilterDropdown({
  value,
  onChange,
  align,
}: {
  value: string;
  onChange: (value: string) => void;
  align: 'left' | 'right';
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickAway(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickAway);
    return () => document.removeEventListener('mousedown', onClickAway);
  }, []);

  const selectedLabel = value === DOCTOR_FILTER_ALL ? 'All Doctors' : value;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-xs rounded-full border border-border-default bg-bg-surface px-md py-xs text-label-md text-text-primary shadow-sm"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selectedLabel}
        <span className="material-symbols-rounded !text-[16px] text-text-tertiary">expand_more</span>
      </button>
      {open && (
        <ul
          role="listbox"
          className={cn(
            'absolute z-30 mt-xs w-56 overflow-hidden rounded-md border border-border-default bg-bg-surface shadow-md',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          <li>
            <button
              type="button"
              role="option"
              aria-selected={value === DOCTOR_FILTER_ALL}
              onClick={() => {
                onChange(DOCTOR_FILTER_ALL);
                setOpen(false);
              }}
              className={cn(
                'block w-full px-md py-sm text-left text-label-md',
                value === DOCTOR_FILTER_ALL
                  ? 'bg-bg-primarySubtle text-icon-primary'
                  : 'text-text-secondary hover:bg-bg-surfaceAlt',
              )}
            >
              All Doctors
            </button>
          </li>
          {DOCTORS.map((doctor) => (
            <li key={doctor.name}>
              <button
                type="button"
                role="option"
                aria-selected={value === doctor.name}
                onClick={() => {
                  onChange(doctor.name);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between gap-sm px-md py-sm text-left text-label-md',
                  value === doctor.name ? 'bg-bg-primarySubtle text-icon-primary' : 'text-text-secondary hover:bg-bg-surfaceAlt',
                )}
              >
                <span>{doctor.name}</span>
                <span className="text-label-sm text-text-tertiary">{doctor.specialization}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AssistanceRequestCard({
  request,
  onApprove,
  onDecline,
  stacked,
}: {
  request: AssistRequest;
  onApprove: () => void;
  onDecline: () => void;
  stacked: boolean;
}) {
  return (
    <div
      className={cn(
        'flex gap-sm rounded-lg bg-bg-urgent p-md shadow-sm',
        stacked ? 'flex-col' : 'items-center justify-between',
      )}
    >
      <div className="flex items-start gap-sm">
        <span className="material-symbols-rounded !text-[20px] text-text-urgent">emergency_home</span>
        <div className="flex flex-col gap-[2px]">
          <p className="text-body-md text-text-primary">{request.patientName}</p>
          <p className="text-label-sm text-text-secondary">
            Requested {request.requestedAt}
            {request.room ? ` · ${request.room}` : ''}
          </p>
        </div>
      </div>
      <div className={cn('flex items-center gap-sm', stacked && 'w-full')}>
        <Button variant="secondary" className={stacked ? 'flex-1' : undefined} onClick={onDecline}>
          Decline
        </Button>
        <Button variant="primary" className={stacked ? 'flex-1' : undefined} onClick={onApprove}>
          Approve
        </Button>
      </div>
    </div>
  );
}

export function NurseSchedule() {
  const { device } = useViewport();
  const isMobile = device === 'mobile';
  const isTablet = device === 'tablet';
  const { request: liveRequest, clearAssistance } = useAssistance();

  const [activeTab, setActiveTab] = useState<ScheduleTab>('today');
  const [doctorFilter, setDoctorFilter] = useState<string>(DOCTOR_FILTER_ALL);
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<ModalState>(null);

  const liveAsRequest: AssistRequest | null = liveRequest
    ? { id: 'live', patientName: liveRequest.patientName, requestedAt: liveRequest.requestedAt, room: liveRequest.room }
    : null;

  const pendingRequests = [liveAsRequest, ...MOCK_REQUESTS].filter(
    (r): r is AssistRequest => r !== null && !resolvedIds.has(r.id),
  );

  function resolveRequest(id: string) {
    setResolvedIds((prev) => new Set(prev).add(id));
    if (id === 'live') clearAssistance();
  }

  const appointments = appointmentsForTab(activeTab).filter(
    (a) => doctorFilter === DOCTOR_FILTER_ALL || a.doctor === doctorFilter,
  );
  const availableDoctors = DOCTORS.filter((d) => d.hasFreeSlot);

  return (
    <div className="flex flex-col gap-lg">
      <ScreenHeader role="nurse" title="Schedule" subtitle="Tuesday, August 18" />

      <div className="flex flex-col gap-sm">
        <h2 className="text-heading-sm text-text-primary">Immediate Assistance</h2>
        {pendingRequests.length === 0 ? (
          <p className="text-body-sm text-text-tertiary">No pending immediate assistance requests right now.</p>
        ) : (
          <div className="flex flex-col gap-sm">
            {pendingRequests.map((request) => (
              <AssistanceRequestCard
                key={request.id}
                request={request}
                stacked={isMobile}
                onApprove={() => setModal({ type: 'approve', request, step: 'select' })}
                onDecline={() => setModal({ type: 'decline', request, step: 'select' })}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-sm">
        <div className="flex flex-wrap items-center justify-between gap-sm">
          <ScheduleTabs active={activeTab} onChange={setActiveTab} />
          <DoctorFilterDropdown
            value={doctorFilter}
            onChange={setDoctorFilter}
            align={isMobile ? 'left' : 'right'}
          />
        </div>

        {appointments.length === 0 ? (
          <p className="rounded-lg bg-bg-surface p-md text-body-sm text-text-tertiary shadow-sm">
            No appointments match this filter.
          </p>
        ) : isMobile ? (
          <div className="flex flex-col gap-sm">
            {appointments.map((appt) => (
              <div key={appt.id} className="flex flex-col gap-[2px] rounded-lg bg-bg-surface p-md shadow-sm">
                <p className="text-body-md text-text-primary">{appt.patientName}</p>
                <p className="text-label-sm text-text-secondary">
                  {appt.doctor} · {appt.specialization}
                </p>
                <p className="text-label-sm text-text-secondary">
                  {appt.dateLabel} · {appt.time}
                </p>
              </div>
            ))}
          </div>
        ) : isTablet ? (
          <div className="w-full overflow-hidden rounded-lg bg-bg-surface shadow-sm">
            <div className="flex items-center bg-bg-surfaceAlt px-md py-sm">
              <p className="flex-1 text-label-sm text-text-tertiary">PATIENT</p>
              <p className={`text-label-sm text-text-tertiary ${COL_WIDTHS.doctor}`}>DOCTOR</p>
              <p className={`text-label-sm text-text-tertiary ${COL_WIDTHS.dateTime}`}>DATE &amp; TIME</p>
            </div>
            <div className="divide-y divide-border-default">
              {appointments.map((appt) => (
                <div key={appt.id} className="flex h-[52px] items-center px-md py-sm">
                  <p className="flex-1 text-body-sm text-text-primary">{appt.patientName}</p>
                  <p className={`text-body-sm text-text-primary ${COL_WIDTHS.doctor}`}>{appt.doctor}</p>
                  <p className={`whitespace-nowrap text-body-sm text-text-primary ${COL_WIDTHS.dateTime}`}>
                    {appt.dateLabel} · {appt.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full overflow-hidden rounded-lg bg-bg-surface shadow-sm">
            <div className="flex items-center bg-bg-surfaceAlt px-md py-sm">
              <p className={`text-label-sm text-text-tertiary ${COL_WIDTHS.patient}`}>PATIENT</p>
              <p className={`text-label-sm text-text-tertiary ${COL_WIDTHS.doctor}`}>DOCTOR</p>
              <p className={`text-label-sm text-text-tertiary ${COL_WIDTHS.specialization}`}>SPECIALIZATION</p>
              <p className={`text-label-sm text-text-tertiary ${COL_WIDTHS.date}`}>DATE</p>
              <p className={`text-label-sm text-text-tertiary ${COL_WIDTHS.time}`}>TIME</p>
            </div>
            <div className="divide-y divide-border-default">
              {appointments.map((appt) => (
                <div key={appt.id} className="flex h-[52px] items-center px-md py-sm hover:bg-bg-surfaceAlt">
                  <p className={`text-body-sm text-text-primary ${COL_WIDTHS.patient}`}>{appt.patientName}</p>
                  <p className={`text-body-sm text-text-primary ${COL_WIDTHS.doctor}`}>{appt.doctor}</p>
                  <p className={`text-body-sm text-text-primary ${COL_WIDTHS.specialization}`}>{appt.specialization}</p>
                  <p className={`text-body-sm text-text-primary ${COL_WIDTHS.date}`}>{appt.dateLabel}</p>
                  <p className={`text-body-sm text-text-primary ${COL_WIDTHS.time}`}>{appt.time}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal open={modal !== null} onClose={() => setModal(null)}>
        {modal?.type === 'approve' && modal.step === 'select' && (
          <div className="flex flex-col items-center gap-sm text-center">
            <span className="material-symbols-rounded !text-[32px] text-icon-primary">event_available</span>
            <h2 className="text-heading-sm text-text-primary">Assign a Doctor</h2>
            <p className="text-body-md text-text-secondary">
              Approve {modal.request.patientName}&apos;s request by assigning a doctor with a free slot.
            </p>
            <div className="flex w-full flex-col gap-sm">
              {availableDoctors.length === 0 ? (
                <p className="text-body-sm text-text-tertiary">No doctors have a free slot right now.</p>
              ) : (
                availableDoctors.map((doctor) => (
                  <button
                    key={doctor.name}
                    type="button"
                    onClick={() =>
                      setModal({ type: 'approve', request: modal.request, step: 'confirmed', assignedDoctor: doctor.name })
                    }
                    className="flex w-full items-center justify-between rounded-md border border-border-primary px-md py-sm text-label-md text-icon-primary transition-colors hover:bg-bg-primarySubtle"
                  >
                    <span>{doctor.name}</span>
                    <span className="text-text-tertiary">{doctor.specialization}</span>
                  </button>
                ))
              )}
            </div>
            <Button
              variant="urgent-outline"
              className="w-full"
              onClick={() => setModal({ type: 'decline', request: modal.request, step: 'select' })}
            >
              No Free Slot — Decline Instead
            </Button>
          </div>
        )}

        {modal?.type === 'approve' && modal.step === 'confirmed' && (
          <div className="flex flex-col items-center gap-sm text-center">
            <span className="material-symbols-rounded !text-[32px] text-icon-primary">check_circle</span>
            <h2 className="text-heading-sm text-text-primary">Request Approved</h2>
            <p className="text-body-md text-text-secondary">
              {modal.request.patientName} has been assigned to {modal.assignedDoctor}.
            </p>
            <Button
              variant="primary"
              className="mt-xs w-full"
              onClick={() => {
                resolveRequest(modal.request.id);
                setModal(null);
              }}
            >
              OK
            </Button>
          </div>
        )}

        {modal?.type === 'decline' && modal.step === 'select' && (
          <div className="flex flex-col items-center gap-sm text-center">
            <span className="material-symbols-rounded !text-[32px] text-text-urgent">event_busy</span>
            <h2 className="text-heading-sm text-text-primary">Decline Request</h2>
            <p className="text-body-md text-text-secondary">
              No free slot for {modal.request.patientName} right now. Choose how to proceed.
            </p>
            <div className="flex w-full flex-col gap-sm">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() =>
                  setModal({
                    type: 'decline',
                    request: modal.request,
                    step: 'confirmed',
                    outcome: 'Suggested Aug 19, 10:00 AM as the next available slot.',
                  })
                }
              >
                Suggest Aug 19, 10:00 AM
              </Button>
              <Button
                variant="urgent-outline"
                className="w-full"
                onClick={() =>
                  setModal({
                    type: 'decline',
                    request: modal.request,
                    step: 'confirmed',
                    outcome: 'Referred to Riverside Community Clinic for immediate care.',
                  })
                }
              >
                Refer to Another Clinic
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setModal(null)}
              className="text-label-md text-text-tertiary hover:underline"
            >
              Cancel
            </button>
          </div>
        )}

        {modal?.type === 'decline' && modal.step === 'confirmed' && (
          <div className="flex flex-col items-center gap-sm text-center">
            <span className="material-symbols-rounded !text-[32px] text-text-urgent">check_circle</span>
            <h2 className="text-heading-sm text-text-primary">Request Declined</h2>
            <p className="text-body-md text-text-secondary">{modal.outcome}</p>
            <Button
              variant="primary"
              className="mt-xs w-full"
              onClick={() => {
                resolveRequest(modal.request.id);
                setModal(null);
              }}
            >
              OK
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
