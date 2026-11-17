import { Redis } from '@upstash/redis';
import { 
  DEFAULT_CLASSES, 
  DEFAULT_COMPLETED_IDS, 
  DEFAULT_STREAK_DAYS, 
  DEFAULT_HABIT_HISTORY 
} from './defaultData.js';

// Initialize Redis if Vercel KV environment variables are present
let redis = null;
if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
  redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
} else if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

// In-memory fallback if Vercel KV is not yet linked
let memoryDb = {
  classes: DEFAULT_CLASSES,
  completedIds: DEFAULT_COMPLETED_IDS,
  streakDays: DEFAULT_STREAK_DAYS,
  habitHistory: DEFAULT_HABIT_HISTORY,
  lastUpdated: new Date().toISOString()
};

const STORAGE_KEY = 'timetable_db_state';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    if (redis) {
      try {
        const stored = await redis.get(STORAGE_KEY);
        if (stored) {
          return res.status(200).json(stored);
        }
        await redis.set(STORAGE_KEY, memoryDb);
        return res.status(200).json(memoryDb);
      } catch (err) {
        console.error('Redis read error:', err);
        return res.status(200).json(memoryDb);
      }
    }
    return res.status(200).json(memoryDb);
  }

  if (req.method === 'POST') {
    const { classes, completedIds, streakDays, habitHistory } = req.body || {};

    let current = memoryDb;
    if (redis) {
      try {
        const stored = await redis.get(STORAGE_KEY);
        if (stored) current = stored;
      } catch (e) {
        console.error('Redis fetch error:', e);
      }
    }

    const updated = {
      classes: classes !== undefined ? classes : current.classes,
      completedIds: completedIds !== undefined ? completedIds : current.completedIds,
      streakDays: streakDays !== undefined ? streakDays : current.streakDays,
      habitHistory: habitHistory !== undefined ? habitHistory : current.habitHistory,
      lastUpdated: new Date().toISOString()
    };

    memoryDb = updated;

    if (redis) {
      try {
        await redis.set(STORAGE_KEY, updated);
      } catch (err) {
        console.error('Redis write error:', err);
      }
    }

    return res.status(200).json({
      success: true,
      lastUpdated: updated.lastUpdated,
      isKvConnected: Boolean(redis)
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
