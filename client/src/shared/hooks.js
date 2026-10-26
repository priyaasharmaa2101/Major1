import { useEffect, useState } from 'react';
import { actions } from './store';

/**
 * Runs the automation engine every few seconds while an app is open and
 * returns a `now` value that refreshes (used for live SLA countdowns).
 *
 * NOTE: with a real backend this should be a server-side cron job.
 */
export function useAutomationLoop(everyMs = 5000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    actions.tick();
    const id = setInterval(() => {
      actions.tick();
      setNow(Date.now());
    }, everyMs);
    return () => clearInterval(id);
  }, [everyMs]);
  return now;
}
