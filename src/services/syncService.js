// Unique identifier for this client session to ignore self-echoed broadcast events
export const CLIENT_ID = `client-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

/**
 * Fetch the latest full timetable state from the Express backend
 */
export async function fetchTimetableFromServer() {
  const response = await fetch('/api/timetable');
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status} fetching timetable`);
  }
  return await response.json();
}

/**
 * Save updated timetable state to the Express backend (broadcasts to other devices)
 */
export async function pushTimetableToServer(state) {
  const payload = {
    ...state,
    clientId: CLIENT_ID
  };

  const response = await fetch('/api/timetable', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status} saving timetable`);
  }

  return await response.json();
}

/**
 * Reset server timetable to default initial schedule
 */
export async function resetTimetableOnServer() {
  const response = await fetch('/api/timetable/reset', {
    method: 'POST'
  });
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status} resetting timetable`);
  }
  return await response.json();
}

/**
 * Fetch server health & local network IP addresses
 */
export async function fetchServerHealth() {
  try {
    const response = await fetch('/api/health');
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Establish live synchronization across devices:
 * 1. Fast background polling & instant window-focus revalidation (works natively on Vercel)
 * 2. Real-time SSE stream when available
 */
export function initLiveSyncStream({ onUpdate, onStatusChange }) {
  let eventSource = null;
  let isIntentionallyClosed = false;
  let retryTimeout = null;
  let pollInterval = null;

  // Background fetch helper
  async function checkForUpdates() {
    if (isIntentionallyClosed) return;
    try {
      const data = await fetchTimetableFromServer();
      if (data) {
        onUpdate?.(data);
        onStatusChange?.('connected');
      }
    } catch {
      // Ignore background poll errors
    }
  }

  // 1. Immediate revalidation whenever the user returns to the tab or unlocks phone
  const handleVisibilityOrFocus = () => {
    if (document.visibilityState === 'visible' || document.hasFocus()) {
      checkForUpdates();
    }
  };

  window.addEventListener('focus', handleVisibilityOrFocus);
  document.addEventListener('visibilitychange', handleVisibilityOrFocus);

  // 2. Periodic background poll every 12 seconds (ideal for Vercel serverless)
  pollInterval = setInterval(checkForUpdates, 12000);

  // 3. Attempt SSE stream (works on local server and environments with persistent HTTP streaming)
  function connectSSE() {
    if (isIntentionallyClosed) return;

    try {
      eventSource = new EventSource('/api/timetable/stream');

      eventSource.onopen = () => {
        onStatusChange?.('connected');
      };

      eventSource.addEventListener('connected', () => {
        onStatusChange?.('connected');
      });

      eventSource.addEventListener('timetable_update', (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload.originClientId !== CLIENT_ID) {
            onUpdate?.(payload);
          }
        } catch (err) {
          console.error('Failed to parse timetable_update event:', err);
        }
      });

      eventSource.onerror = () => {
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
        // If SSE closes (e.g. on Vercel serverless), fallback polling continues smoothly
        if (!isIntentionallyClosed) {
          retryTimeout = setTimeout(connectSSE, 10000);
        }
      };
    } catch {
      // Fallback polling is active
    }
  }

  connectSSE();

  return () => {
    isIntentionallyClosed = true;
    if (retryTimeout) clearTimeout(retryTimeout);
    if (pollInterval) clearInterval(pollInterval);
    window.removeEventListener('focus', handleVisibilityOrFocus);
    document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  };
}

