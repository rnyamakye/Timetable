import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { 
  DEFAULT_CLASSES, 
  DEFAULT_COMPLETED_IDS, 
  DEFAULT_STREAK_DAYS, 
  DEFAULT_HABIT_HISTORY 
} from './defaultData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Database directory & file setup
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'timetable_db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to get local network IP addresses
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const k in interfaces) {
    for (const k2 in interfaces[k]) {
      const address = interfaces[k][k2];
      if (address.family === 'IPv4' && !address.internal) {
        addresses.push(address.address);
      }
    }
  }
  return addresses;
}

// Load database from file or create with defaults
function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading database file, resetting to defaults:', err);
  }

  const initialData = {
    classes: DEFAULT_CLASSES,
    completedIds: DEFAULT_COMPLETED_IDS,
    streakDays: DEFAULT_STREAK_DAYS,
    habitHistory: DEFAULT_HABIT_HISTORY,
    lastUpdated: new Date().toISOString()
  };

  saveDatabase(initialData);
  return initialData;
}

// Atomic save to file (write to temp then rename)
function saveDatabase(data) {
  try {
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error saving database file:', err);
  }
}

// Real-Time Server-Sent Events (SSE) Client Connections
const sseClients = new Set();

function broadcastToClients(eventType, payload, originClientId = null) {
  const dataString = `event: ${eventType}\ndata: ${JSON.stringify({ ...payload, originClientId })}\n\n`;
  for (const client of sseClients) {
    try {
      client.res.write(dataString);
    } catch {
      sseClients.delete(client);
    }
  }
}

// Periodic keep-alive ping for SSE connections (every 25s)
setInterval(() => {
  for (const client of sseClients) {
    try {
      client.res.write(': keepalive\n\n');
    } catch {
      sseClients.delete(client);
    }
  }
}, 25000);

// ==========================================
// API ENDPOINTS
// ==========================================

// Health & Network Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    connectedDevices: sseClients.size,
    localIPs: getLocalIPs(),
    port: PORT
  });
});

// SSE Live Stream Endpoint for Instant Multi-Device Sync
app.get('/api/timetable/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const clientId = `client-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const clientObj = { id: clientId, res };
  sseClients.add(clientObj);

  // Send initial connection handshake
  res.write(`event: connected\ndata: ${JSON.stringify({ clientId, connectedDevices: sseClients.size })}\n\n`);

  req.on('close', () => {
    sseClients.delete(clientObj);
  });
});

// Get Current Timetable State
app.get('/api/timetable', (req, res) => {
  const data = loadDatabase();
  res.json(data);
});

// Update Timetable State (from any device)
app.post('/api/timetable', (req, res) => {
  const { classes, completedIds, streakDays, habitHistory, clientId } = req.body;

  const currentDb = loadDatabase();
  const updatedData = {
    classes: classes !== undefined ? classes : currentDb.classes,
    completedIds: completedIds !== undefined ? completedIds : currentDb.completedIds,
    streakDays: streakDays !== undefined ? streakDays : currentDb.streakDays,
    habitHistory: habitHistory !== undefined ? habitHistory : currentDb.habitHistory,
    lastUpdated: new Date().toISOString()
  };

  saveDatabase(updatedData);

  // Broadcast instantly to all other connected tabs / devices
  broadcastToClients('timetable_update', updatedData, clientId);

  res.json({
    success: true,
    lastUpdated: updatedData.lastUpdated,
    connectedDevices: sseClients.size
  });
});

// Reset Schedule to Default
app.post('/api/timetable/reset', (req, res) => {
  const defaultData = {
    classes: DEFAULT_CLASSES,
    completedIds: DEFAULT_COMPLETED_IDS,
    streakDays: DEFAULT_STREAK_DAYS,
    habitHistory: DEFAULT_HABIT_HISTORY,
    lastUpdated: new Date().toISOString()
  };

  saveDatabase(defaultData);
  broadcastToClients('timetable_update', defaultData);

  res.json({ success: true, message: 'Timetable reset to defaults' });
});

// Production: serve built static frontend if present
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  const localIPs = getLocalIPs();
  console.log(`\n======================================================`);
  console.log(`🚀 Timetable Cloud Sync Backend is RUNNING on port ${PORT}`);
  console.log(`- Local Access:   http://localhost:${PORT}`);
  if (localIPs.length > 0) {
    localIPs.forEach(ip => {
      console.log(`- Network Access: http://${ip}:5173 (Vite Frontend with Proxy)`);
      console.log(`- API Direct:     http://${ip}:${PORT}`);
    });
  }
  console.log(`======================================================\n`);
});
