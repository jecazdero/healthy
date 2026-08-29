import { useState } from 'react';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useViewport } from '../../contexts/ViewportContext';
import { cn } from '../../lib/cn';

type Visit = {
  id: string;
  diagnosis: string;
  date: string;
  time: string;
  doctor: string;
  specialization: string;
  details: string;
  therapy: string[];
  images?: string[];
};

const VISITS: Visit[] = [
  {
    id: 'v1',
    diagnosis: 'Contact Dermatitis',
    date: 'Aug 3, 2026',
    time: '10:15 AM',
    doctor: 'Dr. Sofia Reyes',
    specialization: 'Dermatology',
    details:
      'Mild rash on right forearm, likely a reaction to a new laundry detergent. No signs of infection. Advised to avoid the suspected irritant.',
    therapy: ['Hydrocortisone cream 1% — apply twice daily for 7 days'],
    images: ['Photo — forearm, day 1', 'Photo — forearm, day 3'],
  },
  {
    id: 'v2',
    diagnosis: 'Hypertension Follow-up',
    date: 'Jun 2, 2026',
    time: '9:30 AM',
    doctor: 'Dr. Alvarez',
    specialization: 'Cardiology',
    details: 'Blood pressure 128/82, stable compared to last visit. Continuing current dose, recheck in 3 months.',
    therapy: ['Lisinopril 10mg — once daily'],
  },
  {
    id: 'v3',
    diagnosis: 'Type 2 Diabetes Check-in',
    date: 'Apr 18, 2026',
    time: '2:00 PM',
    doctor: 'Dr. Patel',
    specialization: 'Endocrinology',
    details: 'A1C improved to 6.8% from 7.4% last quarter. Diet and exercise plan is working well, no medication change.',
    therapy: ['Metformin 500mg — twice daily'],
  },
  {
    id: 'v4',
    diagnosis: 'Right Knee MRI Review',
    date: 'Mar 14, 2026',
    time: '11:00 AM',
    doctor: 'Dr. Kwame Boateng',
    specialization: 'Orthopedics',
    details:
      'MRI shows a minor meniscus strain, no tear. Surgery not indicated. Recommended physical therapy and activity modification.',
    therapy: ['Physical therapy — 2x per week for 6 weeks', 'Ibuprofen 200mg — as needed for pain'],
    images: ['MRI — sagittal view', 'MRI — coronal view'],
  },
  {
    id: 'v5',
    diagnosis: 'Annual Physical',
    date: 'Jan 22, 2026',
    time: '8:45 AM',
    doctor: 'Dr. Alvarez',
    specialization: 'General Practice',
    details: 'Routine annual exam. Bloodwork within normal ranges across the board. No concerns raised.',
    therapy: [],
  },
  {
    id: 'v6',
    diagnosis: 'Melanoma Screening',
    date: 'Nov 5, 2025',
    time: '3:15 PM',
    doctor: 'Dr. Sofia Reyes',
    specialization: 'Dermatology',
    details: 'Full-body skin check. One mole on left shoulder flagged for monitoring; biopsy not needed at this time.',
    therapy: [],
    images: ['Photo — left shoulder mole'],
  },
  {
    id: 'v7',
    diagnosis: 'Seasonal Bronchitis',
    date: 'Sep 9, 2025',
    time: '1:30 PM',
    doctor: 'Dr. Chen',
    specialization: 'Pulmonology',
    details: 'Persistent cough for 10 days with mild wheezing. Chest sounds clear on follow-up, fully resolved.',
    therapy: ['Albuterol inhaler — as needed'],
  },
];

const SPECIALIZATIONS = ['All', ...Array.from(new Set(VISITS.map((visit) => visit.specialization)))];

function SpecializationBadge({ specialization }: { specialization: string }) {
  return (
    <span className="inline-flex w-fit items-center self-start rounded-full bg-bg-surfaceAlt px-sm py-[2px] text-label-sm text-text-secondary">
      {specialization}
    </span>
  );
}

function VisitDetailsDrawer({ visit, onClose }: { visit: Visit | null; onClose: () => void }) {
  const open = visit !== null;

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          'fixed inset-0 z-40 bg-[#0d1a1f] transition-opacity duration-300',
          open ? 'opacity-30' : 'pointer-events-none opacity-0',
        )}
      />
      <div
        className={cn(
          'fixed right-0 top-0 z-50 h-full w-[85%] max-w-[400px] overflow-y-auto bg-bg-canvas p-lg shadow-lg transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        role="dialog"
        aria-label="Visit details"
        aria-hidden={!open}
      >
        {visit && (
          <div className="flex flex-col gap-md">
            <div className="flex items-start justify-between gap-sm">
              <div>
                <p className="text-heading-sm text-text-primary">{visit.diagnosis}</p>
                <p className="mt-xs text-body-sm text-text-secondary">
                  {visit.date} · {visit.time}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close visit details"
                className="shrink-0 text-icon-muted transition-colors hover:text-icon-primary"
              >
                <span className="material-symbols-rounded !text-[22px]">close</span>
              </button>
            </div>

            <div className="flex items-center gap-sm rounded-lg bg-bg-surface p-md shadow-sm">
              <div className="h-10 w-10 shrink-0 rounded-full bg-bg-surfaceAlt" />
              <div className="flex flex-col gap-[2px]">
                <p className="text-body-md text-text-primary">{visit.doctor}</p>
                <SpecializationBadge specialization={visit.specialization} />
              </div>
            </div>

            <div>
              <p className="text-label-sm text-text-tertiary">DETAILS</p>
              <p className="mt-xs text-body-md text-text-primary">{visit.details}</p>
            </div>

            {visit.images && visit.images.length > 0 && (
              <div>
                <p className="text-label-sm text-text-tertiary">IMAGES</p>
                <div className="mt-xs flex flex-wrap gap-sm">
                  {visit.images.map((image) => (
                    <div
                      key={image}
                      className="flex h-[92px] w-[92px] flex-col items-center justify-center gap-xs rounded-md bg-bg-surfaceAlt p-xs text-icon-muted"
                    >
                      <span className="material-symbols-rounded !text-[24px]">image</span>
                      <span className="text-center text-label-sm leading-tight">{image}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-label-sm text-text-tertiary">THERAPY</p>
              {visit.therapy.length > 0 ? (
                <div className="mt-xs flex flex-col gap-[6px]">
                  {visit.therapy.map((item) => (
                    <p key={item} className="text-body-md text-text-primary">
                      · {item}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="mt-xs text-body-md text-text-secondary">No therapy prescribed for this visit.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function FilterBar({
  query,
  onQueryChange,
  specialization,
  onSpecializationChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  specialization: string;
  onSpecializationChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-sm">
      <div className="flex w-full max-w-[400px] items-center gap-xs rounded-full border border-border-default bg-bg-surface px-md py-sm">
        <span className="material-symbols-rounded !text-[18px] text-icon-muted">search</span>
        <input
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by diagnosis or doctor"
          className="w-full bg-transparent text-body-md text-text-primary placeholder:text-text-tertiary focus:outline-none"
        />
      </div>
      <div className="flex flex-wrap gap-xs">
        {SPECIALIZATIONS.map((spec) => (
          <button
            key={spec}
            type="button"
            onClick={() => onSpecializationChange(spec)}
            className={cn(
              'rounded-full px-md py-xs text-label-md transition-colors',
              specialization === spec
                ? 'bg-bg-primary text-text-onPrimary'
                : 'border border-border-default bg-bg-surface text-text-secondary hover:bg-bg-surfaceAlt',
            )}
          >
            {spec}
          </button>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-xs rounded-lg bg-bg-surface p-xl text-center shadow-sm">
      <span className="material-symbols-rounded !text-[28px] text-icon-muted">search_off</span>
      <p className="text-body-md text-text-primary">No visits match your search.</p>
      <p className="text-body-sm text-text-secondary">Try a different diagnosis, doctor, or specialization.</p>
    </div>
  );
}

const COL_WIDTHS = {
  date: 'w-[110px]',
  doctor: 'w-[180px]',
  specialization: 'w-[160px]',
};

export function PatientHistory() {
  const { device } = useViewport();
  const isMobile = device === 'mobile';
  const isTablet = device === 'tablet';
  const [query, setQuery] = useState('');
  const [specialization, setSpecialization] = useState('All');
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

  const filteredVisits = VISITS.filter((visit) => {
    const matchesSpecialization = specialization === 'All' || visit.specialization === specialization;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || visit.diagnosis.toLowerCase().includes(q) || visit.doctor.toLowerCase().includes(q);
    return matchesSpecialization && matchesQuery;
  });

  return (
    <div className="flex flex-col gap-lg">
      <ScreenHeader role="patient" title="History of my Health" subtitle={`${VISITS.length} visits recorded`} />

      <FilterBar
        query={query}
        onQueryChange={setQuery}
        specialization={specialization}
        onSpecializationChange={setSpecialization}
      />

      {filteredVisits.length === 0 ? (
        <EmptyState />
      ) : isMobile ? (
        <div className="flex flex-col gap-sm">
          {filteredVisits.map((visit) => (
            <div
              key={visit.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedVisit(visit)}
              onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && setSelectedVisit(visit)}
              className="flex cursor-pointer items-center justify-between gap-sm rounded-lg bg-bg-surface p-md shadow-sm transition-colors hover:bg-bg-surfaceAlt"
            >
              <div className="flex flex-col gap-xs">
                <p className="text-body-md text-text-primary">{visit.diagnosis}</p>
                <SpecializationBadge specialization={visit.specialization} />
                <p className="text-label-sm text-text-secondary">
                  {visit.doctor} · {visit.date}
                </p>
              </div>
              <span className="material-symbols-rounded shrink-0 !text-[20px] text-icon-muted">chevron_right</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full overflow-hidden rounded-lg bg-bg-surface shadow-sm">
          <div className="flex items-center bg-bg-surfaceAlt px-md py-sm">
            <p className="flex-1 text-label-sm text-text-tertiary">DIAGNOSIS</p>
            <p className={`text-label-sm text-text-tertiary ${COL_WIDTHS.doctor}`}>DOCTOR</p>
            {!isTablet && (
              <p className={`text-label-sm text-text-tertiary ${COL_WIDTHS.specialization}`}>SPECIALIZATION</p>
            )}
            <p className={`text-label-sm text-text-tertiary ${COL_WIDTHS.date}`}>DATE</p>
            <div className="w-[28px] shrink-0" />
          </div>
          <div className="divide-y divide-border-default">
            {filteredVisits.map((visit) => (
              <div
                key={visit.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedVisit(visit)}
                onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && setSelectedVisit(visit)}
                className="flex h-[56px] cursor-pointer items-center px-md py-sm transition-colors hover:bg-bg-surfaceAlt"
              >
                <p className="flex-1 truncate pr-sm text-body-sm text-text-primary">{visit.diagnosis}</p>
                <p className={`truncate pr-sm text-body-sm text-text-primary ${COL_WIDTHS.doctor}`}>{visit.doctor}</p>
                {!isTablet && (
                  <div className={COL_WIDTHS.specialization}>
                    <SpecializationBadge specialization={visit.specialization} />
                  </div>
                )}
                <p className={`text-body-sm text-text-secondary ${COL_WIDTHS.date}`}>{visit.date}</p>
                <div className="flex w-[28px] shrink-0 items-center justify-center">
                  <span className="material-symbols-rounded !text-[18px] text-icon-muted">chevron_right</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <VisitDetailsDrawer visit={selectedVisit} onClose={() => setSelectedVisit(null)} />
    </div>
  );
}
