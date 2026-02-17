import type { Timestamp } from '../backend';

export interface VaccinationReminder {
  message: string;
  variant: 'urgent' | 'warning' | 'info';
  isDueToday: boolean;
  category: 'overdue' | 'today' | 'tomorrow' | 'this-week' | 'this-month' | 'later';
}

export function getVaccinationReminderMessage(dueDate: Timestamp): VaccinationReminder {
  const now = Date.now();
  const due = Number(dueDate) / 1_000_000; // Convert nanoseconds to milliseconds
  const diffMs = due - now;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      message: `Overdue by ${overdueDays} day${overdueDays !== 1 ? 's' : ''}`,
      variant: 'urgent',
      isDueToday: false,
      category: 'overdue',
    };
  } else if (diffDays === 0) {
    return {
      message: 'Vaccination is due today',
      variant: 'urgent',
      isDueToday: true,
      category: 'today',
    };
  } else if (diffDays === 1) {
    return {
      message: 'Vaccination is due tomorrow',
      variant: 'warning',
      isDueToday: false,
      category: 'tomorrow',
    };
  } else if (diffDays <= 7) {
    return {
      message: `Vaccination is due this week (${diffDays} days)`,
      variant: 'warning',
      isDueToday: false,
      category: 'this-week',
    };
  } else if (diffDays <= 30) {
    return {
      message: `Vaccination is due this month (${diffDays} days)`,
      variant: 'info',
      isDueToday: false,
      category: 'this-month',
    };
  } else {
    const months = Math.floor(diffDays / 30);
    return {
      message: `Vaccination due in ${months} month${months !== 1 ? 's' : ''}`,
      variant: 'info',
      isDueToday: false,
      category: 'later',
    };
  }
}

export function getTimeUntilEndOfDay(): number {
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay.getTime() - now.getTime();
}

export function formatCountdown(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
