export default function handler(req: any, res: any) {
  res.status(200).json({
    message: 'Simple test function works!',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    hasDbUrl: !!process.env.DATABASE_URL
  });
}
