import type { CSSProperties } from 'react';
import type { DueState } from '../services/taskTypes.js';

const STATUS_LABELS: Record<DueState, string> = {
  overdue: '期限切れ',
  today: '本日期限',
  upcoming: '期限あり',
  none: '期限なし'
};

const STATUS_STYLES: Record<DueState, CSSProperties> = {
  overdue: { backgroundColor: '#fce8e6', color: '#7f1d1d', borderColor: '#fca5a5' },
  today: { backgroundColor: '#fff4ce', color: '#713f12', borderColor: '#fcd34d' },
  upcoming: { backgroundColor: '#e8f0fe', color: '#1e3a8a', borderColor: '#93c5fd' },
  none: { backgroundColor: '#f4f4f5', color: '#3f3f46', borderColor: '#d4d4d8' }
};

type DueStatusBadgeProps = {
  dueState: DueState;
};

export function DueStatusBadge({ dueState }: DueStatusBadgeProps) {
  return (
    <span
      aria-label={`期限状況: ${STATUS_LABELS[dueState]}`}
      style={{
        display: 'inline-block',
        padding: '0.1rem 0.4rem',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 999,
        fontSize: '0.8rem',
        fontWeight: 600,
        ...STATUS_STYLES[dueState]
      }}
    >
      {STATUS_LABELS[dueState]}
    </span>
  );
}
