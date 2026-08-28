import { cn } from '../../lib/cn';

interface NotificationBannerProps {
  message: string;
  timestamp: string;
  onDismiss?: () => void;
  icon?: string;
  tone?: 'default' | 'urgent';
  className?: string;
}

const TONE_CLASSES: Record<'default' | 'urgent', string> = {
  default: 'bg-bg-primarySubtle',
  urgent: 'bg-bg-urgent',
};

const TONE_ICON_CLASSES: Record<'default' | 'urgent', string> = {
  default: 'text-icon-primary',
  urgent: 'text-text-urgent',
};

export function NotificationBanner({
  message,
  timestamp,
  onDismiss,
  icon = 'notifications',
  tone = 'default',
  className,
}: NotificationBannerProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-[12px] rounded-lg px-[20px] py-[14px] shadow-sm',
        TONE_CLASSES[tone],
        className,
      )}
    >
      <span className={cn('material-symbols-rounded !text-[20px]', TONE_ICON_CLASSES[tone])}>{icon}</span>
      <div className="flex-1">
        <p className="text-body-md text-text-primary">{message}</p>
        <p className="text-body-sm text-text-secondary">{timestamp}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="shrink-0 text-icon-muted transition-colors hover:text-icon-primary"
        >
          <span className="material-symbols-rounded !text-[18px]">close</span>
        </button>
      )}
    </div>
  );
}
