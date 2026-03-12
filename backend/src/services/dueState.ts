export type DueState = 'overdue' | 'today' | 'upcoming' | 'none';

function toUtcDateStart(value: Date): Date {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}

function getTomorrowStart(now: Date = new Date()): Date {
  const todayStart = toUtcDateStart(now);
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1);
  return tomorrowStart;
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

  if (dueDay.getTime() < getTomorrowStart(now).getTime()) {
    return 'today';
  }

  return 'upcoming';
}
