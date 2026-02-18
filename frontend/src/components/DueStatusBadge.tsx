import type { CSSProperties } from 'react';

export type DueStatus = 'overdue' | 'today' | 'future' | 'none';

const STATUS_LABELS: Record<DueStatus, string> = {
  overdue: 'Overdue',
  today: 'Due today',
  future: 'Future',
  none: 'No due date'
};

const STATUS_STYLES: Record<DueStatus, CSSProperties> = {
  overdue: { backgroundColor: '#fce8e6', color: '#7f1d1d', borderColor: '#fca5a5' },
  today: { backgroundColor: '#fff4ce', color: '#713f12', borderColor: '#fcd34d' },
  future: { backgroundColor: '#e8f0fe', color: '#1e3a8a', borderColor: '#93c5fd' },
  none: { backgroundColor: '#f4f4f5', color: '#3f3f46', borderColor: '#d4d4d8' }
};

function toDayStartUtc(value: Date): Date {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}

export function classifyDueDate(dueDate: string | null, now: Date = new Date()): DueStatus {
  if (!dueDate) {
    return 'none';
  }

  const dueDay = new Date(`${dueDate}T00:00:00.000Z`);
  const todayStart = toDayStartUtc(now);

  if (dueDay.getTime() < todayStart.getTime()) {
    return 'overdue';
  }

  if (dueDay.getTime() === todayStart.getTime()) {
    return 'today';
  }

  return 'future';
}

type DueStatusBadgeProps = {
  dueDate: string | null;
};

export function DueStatusBadge({ dueDate }: DueStatusBadgeProps) {
  const status = classifyDueDate(dueDate);

  return (
    <span
      aria-label={`Due status: ${STATUS_LABELS[status]}`}
      style={{
        display: 'inline-block',
        padding: '0.1rem 0.4rem',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 999,
        fontSize: '0.8rem',
        fontWeight: 600,
        ...STATUS_STYLES[status]
      }}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
