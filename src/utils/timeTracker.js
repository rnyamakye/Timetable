import { ALL_PERIODS } from '../data/timetableData';

/**
 * Parses time string like "10:00 - 11:50" or "8:00 - 8:50" into start and end minutes from midnight
 */
export function parseSessionMinutes(timeString) {
  if (!timeString) return null;
  const parts = timeString.split(' - ');
  if (parts.length !== 2) return null;

  const [startH, startM] = parts[0].trim().split(':').map(Number);
  const [endH, endM] = parts[1].trim().split(':').map(Number);

  return {
    startMinutes: startH * 60 + (startM || 0),
    endMinutes: endH * 60 + (endM || 0)
  };
}

/**
 * Formats a duration in minutes to human readable "X hrs Y mins" or "X mins"
 */
export function formatDurationMinutes(mins) {
  if (mins <= 0) return '0 mins';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h} hr${h > 1 ? 's' : ''}`;
  return `${m} min${m > 1 ? 's' : ''}`;
}

/**
 * Returns current schedule time information based on a Date object
 */
export function getCurrentScheduleTime(dateInput = null) {
  const now = dateInput ? new Date(dateInput) : new Date();

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = daysOfWeek[now.getDay()];

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentMinutes = hours * 60 + minutes;

  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateFormatted = now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

  // Find corresponding period
  const matchingPeriod = ALL_PERIODS.find(period => {
    const range = parseSessionMinutes(period.time);
    if (!range) return false;
    return currentMinutes >= range.startMinutes && currentMinutes <= range.endMinutes;
  });

  return {
    now,
    dayName,
    hours,
    minutes,
    currentMinutes,
    timeFormatted,
    dateFormatted,
    currentPeriod: matchingPeriod || null,
    currentPeriodId: matchingPeriod ? matchingPeriod.id : null,
    isWeekend: now.getDay() === 0 || now.getDay() === 6
  };
}

/**
 * Checks if a specific session is active at the given schedule time
 */
export function isSessionActive(session, scheduleTime) {
  if (!session || !scheduleTime) return false;
  if (session.day !== scheduleTime.dayName) return false;

  const range = parseSessionMinutes(session.time);
  if (range) {
    return scheduleTime.currentMinutes >= range.startMinutes && scheduleTime.currentMinutes < range.endMinutes;
  }

  // Fallback: compare period ranges
  if (scheduleTime.currentPeriodId && session.startPeriod && session.endPeriod) {
    return scheduleTime.currentPeriodId >= session.startPeriod && scheduleTime.currentPeriodId <= session.endPeriod;
  }

  return false;
}

/**
 * Finds the currently active session and the next upcoming session today
 */
export function getActiveAndNextSession(classes, scheduleTime) {
  if (!classes || !scheduleTime) {
    return { activeSession: null, nextSession: null, minutesUntilNext: null, minutesRemaining: null };
  }

  const todaySessions = classes
    .filter(c => c.day === scheduleTime.dayName)
    .map(c => {
      const range = parseSessionMinutes(c.time);
      return {
        ...c,
        startMinutes: range ? range.startMinutes : (c.startPeriod ? (c.startPeriod + 7) * 60 : 0),
        endMinutes: range ? range.endMinutes : (c.endPeriod ? (c.endPeriod + 7) * 60 + 50 : 0)
      };
    })
    .sort((a, b) => a.startMinutes - b.startMinutes);

  // Active session
  const active = todaySessions.find(s => 
    scheduleTime.currentMinutes >= s.startMinutes && scheduleTime.currentMinutes < s.endMinutes
  );

  let minutesRemaining = null;
  if (active) {
    minutesRemaining = Math.max(0, active.endMinutes - scheduleTime.currentMinutes);
  }

  // Next upcoming session
  const next = todaySessions.find(s => s.startMinutes > scheduleTime.currentMinutes);
  let minutesUntilNext = null;
  if (next) {
    minutesUntilNext = Math.max(0, next.startMinutes - scheduleTime.currentMinutes);
  }

  return {
    activeSession: active || null,
    nextSession: next || null,
    minutesUntilNext,
    minutesRemaining
  };
}

