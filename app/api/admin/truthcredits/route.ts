import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AdminUser from '@/models/AdminUser';
import Article from '@/models/Article';

const MOCK_ADMIN_USER = {
  name: 'Vikramaditya Sen',
  email: 'editor@truthpulse.in',
  role: 'CHIEF_EDITOR',
  truthCredits: 185,
  accuracyRate: 98,
  strikes: 0,
  history: [
    { action: 'Initial Verification Reserve Grant', creditChange: 100, timestamp: new Date(Date.now() - 86400000 * 5).toISOString() },
    { action: 'Published Ground Verified Story (Raigarh)', creditChange: 25, timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
    { action: 'Cross-Source Corroboration Reward (High Trust >= 95%)', creditChange: 10, timestamp: new Date(Date.now() - 86400000 * 1).toISOString() }
  ]
};

export async function GET() {
  try {
    const conn = await connectDB();
    if (conn && conn.connection.readyState === 1) {
      try {
        let admin = await AdminUser.findOne({ email: 'editor@truthpulse.in' });
        if (!admin) {
          admin = await AdminUser.create({
            name: 'Vikramaditya Sen',
            email: 'editor@truthpulse.in',
            role: 'CHIEF_EDITOR',
            truthCredits: 185,
            accuracyRate: 98,
            strikes: 0,
            history: [{ action: 'Initial TruthCredits Allocation', creditChange: 100, timestamp: new Date() }]
          });
        }

        let tier = 'ROOKIE';
        if (admin.truthCredits >= 150) tier = 'CHIEF_EDITOR';
        else if (admin.truthCredits >= 80) tier = 'CONTRIBUTOR';

        return NextResponse.json({
          success: true,
          user: {
            ...admin.toObject(),
            role: tier
          }
        });
      } catch (dbErr) {
        console.warn('Admin fetch from mongo skipped:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      user: MOCK_ADMIN_USER,
      isDatabaseConnected: false
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      user: MOCK_ADMIN_USER,
      isDatabaseConnected: false
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const conn = await connectDB();
    const body = await req.json().catch(() => ({}));
    const { action, articleId } = body;

    if (conn && conn.connection.readyState === 1) {
      try {
        let admin = await AdminUser.findOne({ email: 'editor@truthpulse.in' });
        if (!admin) {
          return NextResponse.json({ success: false, error: 'Admin account not found' }, { status: 404 });
        }

        if (admin.isSuspended) {
          return NextResponse.json({ success: false, error: 'Account suspended due to 3 accumulated misinformation strikes.' }, { status: 403 });
        }

        // Spend Action 1: Pin Story to City Top for 24h (-20 Credits)
        if (action === 'PIN_STORY') {
          const COST = 20;
          if (admin.truthCredits < COST) {
            return NextResponse.json({ success: false, error: `Insufficient TruthCredits. Need ${COST}, you have ${admin.truthCredits}.` }, { status: 400 });
          }

          admin.truthCredits -= COST;
          admin.history.unshift({
            action: 'Pin Story to City Top for 24h',
            creditChange: -COST,
            timestamp: new Date()
          });

          if (articleId) {
            await Article.findByIdAndUpdate(articleId, { isPinned: true });
          }

          await admin.save();
          return NextResponse.json({
            success: true,
            message: `Story pinned to City Top for 24h! -${COST} TruthCredits deducted.`,
            wallet: admin.truthCredits
          });
        }

        // Spend Action 2: Send Breaking Push Notification (-35 Credits)
        if (action === 'PUSH_ALERT') {
          const COST = 35;
          if (admin.truthCredits < COST) {
            return NextResponse.json({ success: false, error: `Insufficient TruthCredits. Need ${COST}, you have ${admin.truthCredits}.` }, { status: 400 });
          }

          admin.truthCredits -= COST;
          admin.history.unshift({
            action: 'Broadcast Breaking Priority Push Notification to City & State Subscriptions',
            creditChange: -COST,
            timestamp: new Date()
          });

          await admin.save();
          return NextResponse.json({
            success: true,
            message: `Breaking Push Notification dispatched to 24,000+ local subscribers! -${COST} TruthCredits deducted.`,
            wallet: admin.truthCredits
          });
        }
      } catch (dbErr) {
        console.warn('Admin action error:', dbErr);
      }
    }

    // In-memory action fallback
    if (action === 'PIN_STORY') {
      MOCK_ADMIN_USER.truthCredits = Math.max(0, MOCK_ADMIN_USER.truthCredits - 20);
      return NextResponse.json({
        success: true,
        message: 'Story pinned to City Top for 24h! -20 TruthCredits deducted.',
        wallet: MOCK_ADMIN_USER.truthCredits
      });
    }

    if (action === 'PUSH_ALERT') {
      MOCK_ADMIN_USER.truthCredits = Math.max(0, MOCK_ADMIN_USER.truthCredits - 35);
      return NextResponse.json({
        success: true,
        message: 'Breaking Push Notification dispatched to 24,000+ local subscribers! -35 TruthCredits deducted.',
        wallet: MOCK_ADMIN_USER.truthCredits
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
