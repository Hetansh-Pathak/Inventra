import { Status } from '@/types';

const statusConfig: Record<string, { className: string; label: string }> = {
  draft: { className: 'status-draft', label: 'Draft' },
  confirmed: { className: 'status-waiting', label: 'Confirmed' },
  waiting: { className: 'status-waiting', label: 'Waiting' },
  ready: { className: 'status-ready', label: 'Ready' },
  picked: { className: 'status-ready', label: 'Picked' },
  packed: { className: 'status-ready', label: 'Packed' },
  validated: { className: 'status-validated', label: 'Validated' },
  done: { className: 'status-done', label: 'Done' },
  canceled: { className: 'status-canceled', label: 'Canceled' },
};

interface StatusBadgeProps {
  status: Status | string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || { className: 'status-draft', label: status };
  return (
    <span className={`${config.className} px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1`}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} />
      {config.label}
    </span>
  );
}
