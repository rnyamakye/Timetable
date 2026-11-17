import { Redis } from '@upstash/redis';
import { 
  DEFAULT_CLASSES, 
  DEFAULT_COMPLETED_IDS, 
  DEFAULT_STREAK_DAYS, 
  DEFAULT_HABIT_HISTORY 
} from './defaultData.js';

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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const defaultData = {
    classes: DEFAULT_CLASSES,
    completedIds: DEFAULT_COMPLETED_IDS,
    streakDays: DEFAULT_STREAK_DAYS,
    habitHistory: DEFAULT_HABIT_HISTORY,
    lastUpdated: new Date().toISOString()
  };

  if (redis) {
    try {
      await redis.set('timetable_db_state', defaultData);
    } catch (err) {
      console.error('Redis reset error:', err);
    }
  }

  res.status(200).json({ success: true, message: 'Timetable reset to defaults' });
}

