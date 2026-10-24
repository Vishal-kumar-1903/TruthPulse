import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import Article from '@/models/Article';
import User from '@/models/User';
import AdminUser from '@/models/AdminUser';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  try {
    const conn = await connectDB();
    const pingTime = Date.now() - startTime;

    const dbName = mongoose.connection.name || 'truthpulse';
    const host = mongoose.connection.host || '127.0.0.1';
    const port = mongoose.connection.port || 27017;
    const readyState = mongoose.connection.readyState; // 1 = connected

    // Query collection counts
    const [articleCount, userCount, adminCount] = await Promise.all([
      Article.countDocuments().catch(() => 0),
      User.countDocuments().catch(() => 0),
      AdminUser.countDocuments().catch(() => 0)
    ]);

    const isLocal = host.includes('127.0.0.1') || host.includes('localhost');

    return NextResponse.json({
      success: true,
      status: 'CONNECTED',
      database: dbName,
      connectionType: isLocal ? 'Local MongoDB Service' : 'Remote MongoDB Atlas / Cluster',
      host: `${host}:${port}`,
      readyState: readyState === 1 ? '1 (Connected)' : `${readyState}`,
      pingMs: pingTime,
      stats: {
        articles: articleCount,
        users: userCount,
        adminUsers: adminCount
      },
      message: 'MongoDB database is actively connected and servicing requests.'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      status: 'DISCONNECTED',
      error: error.message,
      pingMs: Date.now() - startTime
    }, { status: 500 });
  }
}
