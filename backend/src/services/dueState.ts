export type DueState = 'overdue' | 'dueSoon' | 'upcoming' | 'none';

export const DUE_SOON_DAYS = 3;

function toUtcDateStart(value: Date): Date {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}

export function getDueSoonEndExclusive(now: Date = new Date()): Date {
  const todayStart = toUtcDateStart(now);
  const end = new Date(todayStart);
  end.setUTCDate(end.getUTCDate() + DUE_SOON_DAYS + 1);
  return end;
}

export function classifyDueState(dueDate: Date | null, now: Date = new Date()): DueState {
  if (!dueDate) {
    return 'none';
  }

  const dueDay = toUtcDateStart(dueDate);
  const todayStart = toUtcDateStart(now);

  if (dueDay.getTime() < todayStart.getTime()) {
    return 'overdue';
  }

  if (dueDay.getTime() < getDueSoonEndExclusive(now).getTime()) {
    return 'dueSoon';
  }

  return 'upcoming';
}
