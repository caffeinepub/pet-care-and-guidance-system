import { useState, useEffect } from 'react';
import { useInternetIdentity } from './useInternetIdentity';
import { getTimeUntilEndOfDay, formatCountdown } from '../lib/vaccinationReminders';

export function useVaccinationDueTodayCountdown() {
  const { identity } = useInternetIdentity();
  const [countdown, setCountdown] = useState<string>('');

  useEffect(() => {
    // Only run countdown when authenticated
    if (!identity) {
      setCountdown('');
      return;
    }

    // Initialize countdown
    const updateCountdown = () => {
      const timeLeft = getTimeUntilEndOfDay();
      setCountdown(formatCountdown(timeLeft));
    };

    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [identity]);

  return countdown;
}
