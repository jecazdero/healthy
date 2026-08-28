import { useRef, useState, type DragEvent } from 'react';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Button } from '../../components/ui/Button';
import { StatusBadge, type StatusBadgeVariant } from '../../components/ui/StatusBadge';
import { DragHandle } from '../../components/ui/DragHandle';
import { NotificationBanner } from '../../components/ui/NotificationBanner';
import { useViewport } from '../../contexts/ViewportContext';
import { useAssistance } from '../../contexts/AssistanceContext';

const STATS = [
  { label: 'TOTAL WAITING', value: '12', caption: 'patients in queue' },
  { label: 'SEEN TODAY', value: '27', caption: 'of 39 scheduled' },
  { label: 'AVG CONSULT TIME', value: '14 min', caption: 'across 3 doctors' },
];

type DoctorStatus = 'In session' | 'On break' | 'Calling next patient';

const DOCTOR_STATUS_DOT: Record<DoctorStatus, string> = {
  'In session': 'bg-status-warningSolid',
  'On break': 'bg-icon-muted',
  'Calling next patient': 'bg-status-successSolid',
};

const DOCTOR_CHIPS: { name: string; status: DoctorStatus; backAt?: string }[] = [
  { name: 'Dr. Alvarez · Room 3', status: 'In session' },
  { name: 'Dr. Chen · Room 5', status: 'On break', backAt: '10:05' },
  { name: 'Dr. Patel · Room 2', status: 'Calling next patient' },
];

const INITIAL_PATIENTS: {
  number: string;
  name: string;
  doctor: string;
  arrived: string;
  status: StatusBadgeVariant;
  timeInExam: string;
}[] = [
  { number: '01', name: 'James Okafor', doctor: 'Dr. Alvarez', arrived: '8:15 AM', status: 'in-room', timeInExam: '6 min' },
  { number: '02', name: 'Ahmed Nasser', doctor: 'Dr. Patel', arrived: '8:40 AM', status: 'next-up', timeInExam: '—' },
  { number: '03', name: 'Lucia Fernández', doctor: 'Dr. Alvarez', arrived: '8:22 AM', status: 'waiting', timeInExam: '—' },
  { number: '04', name: 'Emily Zhou', doctor: 'Dr. Chen', arrived: '8:55 AM', status: 'waiting', timeInExam: '—' },
  { number: '05', name: 'Maria Torres', doctor: 'Dr. Alvarez', arrived: '9:05 AM', status: 'waiting', timeInExam: '—' },
  { number: '06', name: 'David Kim', doctor: 'Unassigned', arrived: '9:12 AM', status: 'urgent', timeInExam: '—' },
];

const COL_WIDTHS = {
  number: 'w-[40px]',
  patient: 'w-[220px]',
  doctor: 'w-[200px]',
  arrived: 'w-[120px]',
  status: 'w-[140px]',
  timeInExam: 'w-[140px]',
};

export function NurseWaitingRoom() {
  const { device } = useViewport();
  const isMobile = device === 'mobile';
  const isTablet = device === 'tablet';
  const statValueSize = device === 'desktop' ? 'text-numeral-xl' : 'text-display-md';
  const { request: assistanceRequest, clearAssistance } = useAssistance();
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [draggedNumber, setDraggedNumber] = useState<string | null>(null);
  const [dragOverNumber, setDragOverNumber] = useState<string | null>(null);
  const draggedNumberRef = useRef<string | null>(null);
  const dragOverNumberRef = useRef<string | null>(null);

  const startDrag = (number: string) => {
    draggedNumberRef.current = number;
    setDraggedNumber(number);
  };

  const handleDragOver = (event: DragEvent, targetNumber: string) => {
    event.preventDefault();
    if (draggedNumberRef.current && draggedNumberRef.current !== targetNumber) {
      dragOverNumberRef.current = targetNumber;
      setDragOverNumber(targetNumber);
    }
  };

  const handleDragEnd = () => {
    const sourceNumber = draggedNumberRef.current;
    const targetNumber = dragOverNumberRef.current;
    if (sourceNumber && targetNumber && sourceNumber !== targetNumber) {
      setPatients((prev) => {
        const sourceIndex = prev.findIndex((p) => p.number === sourceNumber);
        const targetIndex = prev.findIndex((p) => p.number === targetNumber);
        if (sourceIndex === -1 || targetIndex === -1) return prev;
        const updated = [...prev];
        const [moved] = updated.splice(sourceIndex, 1);
        updated.splice(targetIndex, 0, moved);
        return updated;
      });
    }
    draggedNumberRef.current = null;
    dragOverNumberRef.current = null;
    setDraggedNumber(null);
    setDragOverNumber(null);
  };

  return (
    <div className="flex flex-col gap-lg">
      <ScreenHeader role="nurse" title="Waiting Room" subtitle="Tuesday, August 18 · 9:42 AM" />

      {assistanceRequest && (
        <NotificationBanner
          tone="urgent"
          icon="emergency_home"
          message={`${assistanceRequest.patientName} (#${assistanceRequest.queueNumber}) needs immediate assistance — approach patient at ${assistanceRequest.room} now.`}
          timestamp={assistanceRequest.requestedAt}
          onDismiss={clearAssistance}
        />
      )}

      <div className="flex items-center gap-[12px]">
        <Button variant="primary">{isMobile ? '+ Walk-in' : '+ Register Walk-in'}</Button>
        <Button variant="urgent-outline">{isMobile ? 'Alert Doctor' : 'Alert Doctor — Silent'}</Button>
      </div>

      <div className={`flex w-full flex-wrap items-stretch gap-md ${isMobile ? '' : 'items-start'}`}>
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className={`flex flex-col gap-[6px] rounded-lg bg-bg-surface p-md shadow-sm ${
              isMobile ? 'min-w-[160px] flex-1 basis-[calc(50%-8px)]' : 'flex-1'
            }`}
          >
            <p className="text-label-sm text-text-tertiary">{stat.label}</p>
            <p className={`${statValueSize} whitespace-nowrap text-text-primary`}>{stat.value}</p>
            <p className="text-body-sm text-text-secondary">{stat.caption}</p>
          </div>
        ))}
      </div>

      <div className={isMobile ? 'flex flex-col gap-sm' : 'flex items-center gap-md'}>
        {DOCTOR_CHIPS.map((chip) => (
          <div
            key={chip.name}
            className={`flex flex-col items-start border border-border-default bg-bg-surfaceAlt px-[14px] py-sm ${
              isMobile ? 'w-full rounded-lg' : 'rounded-full'
            }`}
          >
            <p className="text-body-sm text-text-primary">{chip.name}</p>
            <p className="flex items-center gap-xs text-label-sm text-text-secondary">
              <span className={`h-[6px] w-[6px] shrink-0 rounded-full ${DOCTOR_STATUS_DOT[chip.status]}`} />
              {chip.status}
              {chip.backAt && ` · back ${chip.backAt}`}
            </p>
          </div>
        ))}
      </div>

      {isMobile ? (
        <div className="flex w-full flex-col gap-sm">
          <h2 className="text-heading-sm text-text-primary">Patients List</h2>
          {patients.map((patient) => (
            <div
              key={patient.number}
              draggable
              onDragStart={() => startDrag(patient.number)}
              onDragOver={(event) => handleDragOver(event, patient.number)}
              onDragEnd={handleDragEnd}
              className={`flex cursor-grab items-center justify-between gap-sm rounded-lg p-md shadow-sm transition-colors ${
                patient.status === 'next-up' ? 'bg-bg-primarySubtle' : 'bg-bg-surface hover:bg-bg-surfaceAlt'
              } ${draggedNumber === patient.number ? 'opacity-40' : ''} ${
                dragOverNumber === patient.number ? 'ring-2 ring-inset ring-icon-primary' : ''
              }`}
            >
              <div className="flex items-center gap-sm">
                <DragHandle />
                <div className="flex flex-col gap-[2px]">
                  <p className="text-body-sm text-text-primary">{patient.name}</p>
                  <p className="text-label-sm text-text-secondary">
                    {patient.doctor} · {patient.arrived}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-[2px]">
                <StatusBadge variant={patient.status} />
                {patient.timeInExam !== '—' && (
                  <p className="text-label-sm text-text-secondary">{patient.timeInExam}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : isTablet ? (
        <div className="w-full overflow-hidden rounded-lg bg-bg-surface shadow-sm">
          <div className="flex items-center bg-bg-surfaceAlt px-md py-sm">
            <div className="flex w-[28px] shrink-0 items-center justify-center" />
            <p className={`text-label-sm text-text-tertiary ${COL_WIDTHS.number}`}>#</p>
            <p className="flex-1 text-label-sm text-text-tertiary">PATIENT</p>
            <p className={`text-label-sm text-text-tertiary ${COL_WIDTHS.arrived}`}>ARRIVED</p>
            <p className={`text-label-sm text-text-tertiary ${COL_WIDTHS.status}`}>STATUS</p>
          </div>
          <div className="divide-y divide-border-default">
            {patients.map((patient) => (
              <div
                key={patient.number}
                draggable
                onDragStart={() => startDrag(patient.number)}
                onDragOver={(event) => handleDragOver(event, patient.number)}
                onDragEnd={handleDragEnd}
                className={`flex h-[52px] cursor-grab items-center px-md py-sm transition-colors ${
                  patient.status === 'next-up' ? 'bg-bg-primarySubtle' : 'hover:bg-bg-surfaceAlt'
                } ${draggedNumber === patient.number ? 'opacity-40' : ''} ${
                  dragOverNumber === patient.number ? 'ring-2 ring-inset ring-icon-primary' : ''
                }`}
              >
                <div className="flex w-[28px] shrink-0 items-center justify-center">
                  <DragHandle />
                </div>
                <p className={`text-body-sm text-text-primary ${COL_WIDTHS.number}`}>{patient.number}</p>
                <p className="flex-1 text-body-sm text-text-primary">{patient.name}</p>
                <p className={`text-body-sm text-text-primary ${COL_WIDTHS.arrived}`}>{patient.arrived}</p>
                <div className={COL_WIDTHS.status}>
                  <StatusBadge variant={patient.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full overflow-hidden rounded-lg bg-bg-surface shadow-sm">
          <div className="flex items-center bg-bg-surfaceAlt px-md py-sm">
            <div className="flex w-[28px] shrink-0 items-center justify-center" />
            <p className={`text-label-sm text-text-tertiary ${COL_WIDTHS.number}`}>#</p>
            <p className={`text-label-sm text-text-tertiary ${COL_WIDTHS.patient}`}>PATIENT</p>
            <p className={`text-label-sm text-text-tertiary ${COL_WIDTHS.doctor}`}>ASSIGNED DOCTOR</p>
            <p className={`text-label-sm text-text-tertiary ${COL_WIDTHS.arrived}`}>ARRIVED</p>
            <p className={`text-label-sm text-text-tertiary ${COL_WIDTHS.status}`}>STATUS</p>
            <p className={`text-label-sm text-text-tertiary ${COL_WIDTHS.timeInExam}`}>TIME IN EXAM</p>
          </div>
          <div className="divide-y divide-border-default">
            {patients.map((patient) => (
              <div
                key={patient.number}
                draggable
                onDragStart={() => startDrag(patient.number)}
                onDragOver={(event) => handleDragOver(event, patient.number)}
                onDragEnd={handleDragEnd}
                className={`flex h-[52px] cursor-grab items-center px-md py-sm transition-colors ${
                  patient.status === 'next-up' ? 'bg-bg-primarySubtle' : 'hover:bg-bg-surfaceAlt'
                } ${draggedNumber === patient.number ? 'opacity-40' : ''} ${
                  dragOverNumber === patient.number ? 'ring-2 ring-inset ring-icon-primary' : ''
                }`}
              >
                <div className="flex w-[28px] shrink-0 items-center justify-center">
                  <DragHandle />
                </div>
                <p className={`text-body-sm text-text-primary ${COL_WIDTHS.number}`}>{patient.number}</p>
                <p className={`text-body-sm text-text-primary ${COL_WIDTHS.patient}`}>{patient.name}</p>
                <p className={`text-body-sm text-text-primary ${COL_WIDTHS.doctor}`}>{patient.doctor}</p>
                <p className={`text-body-sm text-text-primary ${COL_WIDTHS.arrived}`}>{patient.arrived}</p>
                <div className={COL_WIDTHS.status}>
                  <StatusBadge variant={patient.status} />
                </div>
                <p className={`text-body-sm text-text-primary ${COL_WIDTHS.timeInExam}`}>{patient.timeInExam}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
