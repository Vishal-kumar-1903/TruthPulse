import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import User from '@/models/User';
import AdminUser from '@/models/AdminUser';
import Article from '@/models/Article';
import { seedDatabase } from '@/lib/seed';

export const dynamic = 'force-dynamic';

/**
 * Superuser (su) & Database Auto-Provisioning Endpoint
 * Call GET /api/admin/setup to automatically initialize superuser accounts and seed dispatches.
 */
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  try {
    const conn = await connectDB();

    if (!conn || mongoose.connection.readyState !== 1) {
      return NextResponse.json({
        success: false,
        status: 'DISCONNECTED',
        message: 'Could not connect to MongoDB. Please check your MONGODB_URI in .env.local or Vercel Environment Variables.'
      }, { status: 503 });
    }

    // 1. Seed or update Superuser Admin ('su')
    const superusers = [
      {
        name: 'TruthPulse Superuser (SU)',
        email: 'admin@truthpulse.in',
        role: 'ADMIN' as const,
        truthCredits: 1000,
        accuracyRate: 100,
        strikes: 0
      },
      {
        name: 'Vikramaditya Sen (Chief Editor)',
        email: 'editor@truthpulse.in',
        role: 'CHIEF_EDITOR' as const,
        truthCredits: 500,
        accuracyRate: 98,
        strikes: 0
      }
    ];

    const provisionedUsers = [];

    for (const su of superusers) {
      // Upsert into User collection
      const user = await User.findOneAndUpdate(
        { email: su.email },
        { 
          $set: {
            name: su.name,
            role: su.role,
            truthCredits: su.truthCredits,
            accuracyRate: su.accuracyRate,
            strikes: su.strikes
          }
        },
        { upsert: true, new: true }
      );

      // Upsert into AdminUser collection
      await AdminUser.findOneAndUpdate(
        { email: su.email },
        {
          $set: {
            name: su.name,
            role: su.role === 'ADMIN' ? 'CHIEF_EDITOR' : 'CHIEF_EDITOR',
            truthCredits: su.truthCredits,
            accuracyRate: su.accuracyRate,
            strikes: su.strikes,
            isSuspended: false
          }
        },
        { upsert: true, new: true }
      );

      provisionedUsers.push({
        name: user.name,
        email: user.email,
        role: user.role,
        truthCredits: user.truthCredits
      });
    }

    // 2. Ensure articles are seeded
    await seedDatabase(false);

    // 3. Collect statistics
    const [articleCount, userCount] = await Promise.all([
      Article.countDocuments(),
      User.countDocuments()
    ]);

    const pingMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      status: 'PROVISIONED',
      database: mongoose.connection.name,
      host: `${mongoose.connection.host}:${mongoose.connection.port}`,
      pingMs,
      superusers: provisionedUsers,
      totalArticles: articleCount,
      totalUsers: userCount,
      message: 'MongoDB database and Superuser (su) accounts are successfully provisioned and verified!'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
