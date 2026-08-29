import { useState } from 'react';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Button, type ButtonVariant } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { NotificationBanner } from '../../components/ui/NotificationBanner';
import { useViewport } from '../../contexts/ViewportContext';
import { cn } from '../../lib/cn';

type PlanTier = 'none' | 'standard' | 'premium';

type PlanCatalogEntry = {
  tier: PlanTier;
  name: string;
  monthlyPrice: number;
  accessLabel: string;
  accessDescription: string;
  coveredSpecializations?: string[];
};

const PLAN_CATALOG: PlanCatalogEntry[] = [
  {
    tier: 'none',
    name: 'No Insurance',
    monthlyPrice: 0,
    accessLabel: 'Basic Health Care only',
    accessDescription:
      'Free general checkups and urgent care. Specialist exams and procedures are billed per visit.',
  },
  {
    tier: 'standard',
    name: 'Standard Care Plan',
    monthlyPrice: 49,
    accessLabel: 'Some doctors',
    accessDescription: 'Full access to General Practice plus 4 core specialties.',
    coveredSpecializations: ['General Practice', 'Cardiology', 'Dermatology', 'Endocrinology'],
  },
  {
    tier: 'premium',
    name: 'Premium Care Plan',
    monthlyPrice: 89,
    accessLabel: 'All doctors',
    accessDescription: 'Unlimited access to every doctor and specialist at Healthy, including same-day priority scheduling.',
  },
];

const PLAN_BY_TIER = Object.fromEntries(PLAN_CATALOG.map((plan) => [plan.tier, plan])) as Record<
  PlanTier,
  PlanCatalogEntry
>;

const TIER_ORDER: PlanTier[] = ['none', 'standard', 'premium'];

const EMPLOYER_NAME = 'Northgate Manufacturing Co.';

type Subscription = {
  tier: PlanTier;
  startDate?: string;
  endDate?: string;
  daysRemaining?: number;
  progressPercent?: number;
  sponsor?: { employerName: string; employerPercent: number };
};

const INITIAL_SUBSCRIPTION: Subscription = {
  tier: 'standard',
  startDate: 'Jan 15, 2026',
  endDate: 'Oct 15, 2026',
  daysRemaining: 47,
  progressPercent: 83,
  sponsor: { employerName: EMPLOYER_NAME, employerPercent: 70 },
};

const PATIENT = {
  name: 'Maria Torres',
  detail: '34 years · Female · Patient ID #P-10452',
  memberSince: 'Jan 15, 2026',
};

const EXAM_PRICES = [
  { name: 'General Consultation', price: 25 },
  { name: 'Blood Panel', price: 40 },
  { name: 'X-Ray Imaging', price: 65 },
  { name: 'Specialist Consultation', price: 90 },
];

type PendingAction =
  | { type: 'extend' }
  | { type: 'decline' }
  | { type: 'pay'; exam: { name: string; price: number } };

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex w-fit items-center self-start rounded-full bg-bg-surfaceAlt px-sm py-[2px] text-label-sm text-text-secondary">
      {children}
    </span>
  );
}

function PlanStatusBadge({ tier, daysRemaining }: { tier: PlanTier; daysRemaining?: number }) {
  if (tier === 'none') {
    return <Pill>No Insurance</Pill>;
  }
  const expiringSoon = (daysRemaining ?? 0) <= 30;
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center self-start rounded-full px-sm py-xs text-label-sm',
        expiringSoon ? 'bg-bg-warning text-text-warning' : 'bg-bg-success text-text-success',
      )}
    >
      {expiringSoon ? 'Expiring Soon' : 'Active'}
    </span>
  );
}

function ActionButton({
  variant,
  label,
  onClick,
  fullWidth,
}: {
  variant: ButtonVariant;
  label: string;
  onClick: () => void;
  fullWidth?: boolean;
}) {
  return (
    <Button variant={variant} className={fullWidth ? 'w-full' : undefined} onClick={onClick}>
      {label}
    </Button>
  );
}

export function PatientProfile() {
  const { device } = useViewport();
  const isMobile = device === 'mobile';
  const isTablet = device === 'tablet';

  const [subscription, setSubscription] = useState<Subscription>(INITIAL_SUBSCRIPTION);
  const [isPlanPickerOpen, setIsPlanPickerOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const currentPlan = PLAN_BY_TIER[subscription.tier];
  const eligibleUpgrades = TIER_ORDER.slice(TIER_ORDER.indexOf(subscription.tier) + 1);
  const pickerOptions = subscription.tier === 'none' ? eligibleUpgrades : eligibleUpgrades;

  function openPicker() {
    setIsPlanPickerOpen(true);
  }

  function selectPlan(tier: PlanTier) {
    if (tier === 'none') {
      setSubscription({ tier: 'none' });
      setSuccessMessage('You are now on Basic Health Care access only.');
    } else {
      setSubscription({
        tier,
        startDate: 'Aug 29, 2026',
        endDate: 'Aug 29, 2027',
        daysRemaining: 365,
        progressPercent: 0,
        sponsor: { employerName: EMPLOYER_NAME, employerPercent: 70 },
      });
      setSuccessMessage(`You're now subscribed to the ${PLAN_BY_TIER[tier].name}.`);
    }
    setIsPlanPickerOpen(false);
  }

  function confirmExtend() {
    setSubscription((prev) => ({
      ...prev,
      endDate: 'Aug 29, 2027',
      daysRemaining: 365,
      progressPercent: 8,
    }));
    setPendingAction(null);
    setSuccessMessage(`Your ${currentPlan.name} has been extended through Aug 29, 2027.`);
  }

  function confirmDecline() {
    setSubscription({ tier: 'none' });
    setPendingAction(null);
    setSuccessMessage('Insurance declined. You now have Basic Health Care access only.');
  }

  function confirmPay(exam: { name: string; price: number }) {
    setPendingAction(null);
    setSuccessMessage(`Payment of $${exam.price} confirmed for ${exam.name}.`);
  }

  const actions: { variant: ButtonVariant; label: string; onClick: () => void }[] =
    subscription.tier === 'none'
      ? [{ variant: 'primary', label: 'Get Insurance', onClick: openPicker }]
      : [
          { variant: 'primary', label: 'Extend Plan', onClick: () => setPendingAction({ type: 'extend' }) },
          ...(eligibleUpgrades.length > 0
            ? [{ variant: 'secondary' as ButtonVariant, label: 'Upgrade Plan', onClick: openPicker }]
            : []),
          { variant: 'urgent-outline', label: 'Decline Insurance', onClick: () => setPendingAction({ type: 'decline' }) },
        ];

  return (
    <div className="flex flex-col gap-lg">
      <ScreenHeader role="patient" title="My Profile" subtitle={PATIENT.name} />

      {successMessage && (
        <NotificationBanner
          icon="check_circle"
          message={successMessage}
          timestamp="Just now"
          onDismiss={() => setSuccessMessage(null)}
        />
      )}

      <Card className="flex items-center gap-md">
        <div className="h-14 w-14 shrink-0 rounded-full bg-bg-surfaceAlt" />
        <div className="flex flex-col gap-xs">
          <p className="text-heading-sm text-text-primary">{PATIENT.name}</p>
          <p className="text-body-sm text-text-secondary">{PATIENT.detail}</p>
          <p className="text-label-sm text-text-tertiary">Member since {PATIENT.memberSince}</p>
        </div>
      </Card>

      <Card className="flex flex-col gap-md">
        <div className="flex flex-wrap items-start justify-between gap-sm">
          <div>
            <p className="text-label-sm text-text-tertiary">CURRENT PLAN</p>
            <p className="mt-xs text-heading-sm text-text-primary">{currentPlan.name}</p>
          </div>
          <PlanStatusBadge tier={subscription.tier} daysRemaining={subscription.daysRemaining} />
        </div>

        {subscription.tier !== 'none' && (
          <div className="flex flex-col gap-xs">
            <p className="text-body-sm text-text-secondary">
              Active since {subscription.startDate} · Renews {subscription.endDate}
            </p>
            <div className="h-[6px] w-full overflow-hidden rounded-full bg-bg-surfaceAlt">
              <div
                className="h-full rounded-full bg-bg-primary"
                style={{ width: `${subscription.progressPercent ?? 0}%` }}
              />
            </div>
            <p className="text-label-sm text-text-tertiary">{subscription.daysRemaining} days remaining</p>
          </div>
        )}

        <div>
          <p className="text-label-sm text-text-tertiary">DOCTOR ACCESS</p>
          <p className="mt-xs text-body-md text-text-primary">{currentPlan.accessLabel}</p>
          <p className="mt-xs text-body-sm text-text-secondary">{currentPlan.accessDescription}</p>
          {currentPlan.coveredSpecializations && (
            <div className="mt-sm flex flex-wrap gap-xs">
              {currentPlan.coveredSpecializations.map((spec) => (
                <Pill key={spec}>{spec}</Pill>
              ))}
            </div>
          )}
        </div>

        {subscription.sponsor && (
          <div className="rounded-lg bg-bg-primarySubtle p-md">
            <p className="text-label-sm text-text-tertiary">EMPLOYER SPONSORSHIP</p>
            <p className="mt-xs text-body-md text-text-primary">{subscription.sponsor.employerName}</p>
            <p className="mt-xs text-body-sm text-text-secondary">
              Covers {subscription.sponsor.employerPercent}% of your premium ($
              {((currentPlan.monthlyPrice * subscription.sponsor.employerPercent) / 100).toFixed(2)} of $
              {currentPlan.monthlyPrice}/mo) — you pay $
              {(currentPlan.monthlyPrice - (currentPlan.monthlyPrice * subscription.sponsor.employerPercent) / 100).toFixed(2)}
              /mo.
            </p>
          </div>
        )}

        <div
          className={cn(
            'flex gap-sm',
            isMobile
              ? 'flex-col'
              : isTablet
                ? 'flex-wrap items-center'
                : 'flex-wrap items-center justify-between',
          )}
        >
          {isMobile || isTablet ? (
            actions.map((action) => (
              <ActionButton key={action.label} {...action} fullWidth={isMobile} />
            ))
          ) : (
            <>
              <div className="flex items-center gap-[12px]">
                {actions
                  .filter((action) => action.label !== 'Decline Insurance')
                  .map((action) => (
                    <ActionButton key={action.label} {...action} />
                  ))}
              </div>
              {actions.find((action) => action.label === 'Decline Insurance') && (
                <ActionButton {...actions.find((action) => action.label === 'Decline Insurance')!} />
              )}
            </>
          )}
        </div>
      </Card>

      {subscription.tier === 'none' && (
        <Card className="flex flex-col gap-md">
          <div>
            <p className="text-heading-sm text-text-primary">Pay Per Exam</p>
            <p className="mt-xs text-body-sm text-text-secondary">
              Without insurance, specialist exams and procedures are billed individually.
            </p>
          </div>
          <div className="flex flex-col gap-sm">
            {EXAM_PRICES.map((exam) => (
              <div
                key={exam.name}
                className="flex items-center justify-between gap-sm rounded-lg bg-bg-surfaceAlt px-md py-sm"
              >
                <div>
                  <p className="text-body-md text-text-primary">{exam.name}</p>
                  <p className="text-body-sm text-text-secondary">${exam.price}</p>
                </div>
                <Button variant="secondary" onClick={() => setPendingAction({ type: 'pay', exam })}>
                  Pay Now
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal open={isPlanPickerOpen} onClose={() => setIsPlanPickerOpen(false)}>
        <div className="flex flex-col gap-md">
          <h2 className="text-heading-sm text-text-primary">
            {subscription.tier === 'none' ? 'Choose a Plan' : 'Upgrade Your Plan'}
          </h2>
          <div className="flex flex-col gap-sm">
            {pickerOptions.map((tier) => {
              const plan = PLAN_BY_TIER[tier];
              return (
                <div key={tier} className="flex flex-col gap-xs rounded-lg border border-border-default p-md">
                  <div className="flex items-start justify-between gap-sm">
                    <p className="text-body-md text-text-primary">{plan.name}</p>
                    <p className="text-body-md text-text-primary">
                      {plan.monthlyPrice === 0 ? 'Free' : `$${plan.monthlyPrice}/mo`}
                    </p>
                  </div>
                  <p className="text-body-sm text-text-secondary">{plan.accessDescription}</p>
                  <Button variant="primary" className="mt-xs self-start" onClick={() => selectPlan(tier)}>
                    Select {plan.name}
                  </Button>
                </div>
              );
            })}
          </div>
          <Button variant="secondary" onClick={() => setIsPlanPickerOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>

      <Modal open={pendingAction !== null} onClose={() => setPendingAction(null)}>
        {pendingAction?.type === 'extend' && (
          <div className="flex flex-col gap-sm text-center">
            <span className="material-symbols-rounded !text-[32px] text-icon-primary">event_repeat</span>
            <h2 className="text-heading-sm text-text-primary">Extend Your Plan</h2>
            <p className="text-body-md text-text-secondary">
              Extend your {currentPlan.name} by 12 months? Your new coverage will run through Aug 29, 2027.
            </p>
            <div className="mt-xs flex justify-center gap-sm">
              <Button variant="secondary" onClick={() => setPendingAction(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={confirmExtend}>
                Confirm
              </Button>
            </div>
          </div>
        )}
        {pendingAction?.type === 'decline' && (
          <div className="flex flex-col gap-sm text-center">
            <span className="material-symbols-rounded !text-[32px] text-text-urgent">warning</span>
            <h2 className="text-heading-sm text-text-primary">Decline Insurance?</h2>
            <p className="text-body-md text-text-secondary">
              You'll lose access to {currentPlan.accessLabel.toLowerCase()}. You'll still have Basic Health Care
              access and can pay per exam for anything else. You can subscribe again anytime from this page.
            </p>
            <div className="mt-xs flex justify-center gap-sm">
              <Button variant="secondary" onClick={() => setPendingAction(null)}>
                Cancel
              </Button>
              <Button variant="urgent-solid" onClick={confirmDecline}>
                Decline Insurance
              </Button>
            </div>
          </div>
        )}
        {pendingAction?.type === 'pay' && (
          <div className="flex flex-col gap-sm text-center">
            <span className="material-symbols-rounded !text-[32px] text-icon-primary">payments</span>
            <h2 className="text-heading-sm text-text-primary">Confirm Payment</h2>
            <p className="text-body-md text-text-secondary">
              Pay ${pendingAction.exam.price} for {pendingAction.exam.name} now?
            </p>
            <div className="mt-xs flex justify-center gap-sm">
              <Button variant="secondary" onClick={() => setPendingAction(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => confirmPay(pendingAction.exam)}>
                Confirm Payment
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
