export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const isKv = Boolean(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
  res.status(200).json({
    status: 'ok',
    platform: 'vercel-serverless',
    timestamp: new Date().toISOString(),
    isVercelKvConnected: isKv,
    connectedDevices: 1
  });
}

