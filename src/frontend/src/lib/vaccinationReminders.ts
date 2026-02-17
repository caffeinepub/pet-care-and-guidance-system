import type { Timestamp } from '../backend';

export interface VaccinationReminder {
  message: string;
  variant: 'urgent' | 'warning' | 'info';
  isDueToday: boolean;
}

export function getVaccinationReminderMessage(dueDate: Timestamp): VaccinationReminder {
  const now = Date.now();
  const due = Number(dueDate) / 1_000_000; // Convert nanoseconds to milliseconds
  const diffMs = due - now;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      message: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`,
      variant: 'urgent',
      isDueToday: false,
    };
  } else if (diffDays === 0) {
    return {
      message: 'Due today',
      variant: 'urgent',
      isDueToday: true,
    };
  } else if (diffDays === 1) {
    return {
      message: 'Due tomorrow',
      variant: 'warning',
      isDueToday: false,
    };
  } else if (diffDays === 2) {
    return {
      message: '2 days left',
      variant: 'warning',
      isDueToday: false,
    };
  } else if (diffDays <= 7) {
    return {
      message: `${diffDays} days left`,
      variant: 'warning',
      isDueToday: false,
    };
  } else if (diffDays <= 30) {
    return {
      message: `${diffDays} days left`,
      variant: 'info',
      isDueToday: false,
    };
  } else if (diffDays <= 60) {
    return {
      message: `${Math.floor(diffDays / 30)} month left`,
      variant: 'info',
      isDueToday: false,
    };
  } else if (diffDays <= 90) {
    return {
      message: `${Math.floor(diffDays / 30)} months left`,
      variant: 'info',
      isDueToday: false,
    };
  } else {
    return {
      message: `${Math.floor(diffDays / 30)} months left`,
      variant: 'info',
      isDueToday: false,
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
