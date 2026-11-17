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
 * Establish a live Server-Sent Events (SSE) connection for instant real-time sync across devices
 */
export function initLiveSyncStream({ onUpdate, onStatusChange }) {
  let eventSource = null;
  let isIntentionallyClosed = false;
  let retryTimeout = null;

  function connect() {
    if (isIntentionallyClosed) return;

    try {
      onStatusChange?.('connecting');
      eventSource = new EventSource('/api/timetable/stream');

      eventSource.onopen = () => {
        onStatusChange?.('connected');
      };

      eventSource.addEventListener('connected', (e) => {
        onStatusChange?.('connected');
      });

      // Listen for instant updates pushed from other devices
      eventSource.addEventListener('timetable_update', (e) => {
        try {
          const payload = JSON.parse(e.data);
          // Only process updates originating from other devices / clients
          if (payload.originClientId !== CLIENT_ID) {
            onUpdate?.(payload);
          }
        } catch (err) {
          console.error('Failed to parse timetable_update event:', err);
        }
      });

      eventSource.onerror = () => {
        onStatusChange?.('offline');
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
        // Auto-retry connection after 4 seconds
        if (!isIntentionallyClosed) {
          retryTimeout = setTimeout(connect, 4000);
        }
      };
    } catch (err) {
      onStatusChange?.('offline');
      retryTimeout = setTimeout(connect, 4000);
    }
  }

  connect();

  return () => {
    isIntentionallyClosed = true;
    if (retryTimeout) clearTimeout(retryTimeout);
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  };
}

