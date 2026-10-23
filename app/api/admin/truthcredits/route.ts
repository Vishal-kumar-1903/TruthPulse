import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AdminUser from '@/models/AdminUser';
import Article from '@/models/Article';

export async function GET() {
  try {
    await connectDB();
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

    // Determine tier
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
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { action, articleId } = body;

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

    // Penalty Action: Flagged Misinformation Penalty (-30 Credits + 1 Strike, 3 strikes auto-suspends)
    if (action === 'PENALTY_MISINFO') {
      admin.truthCredits = Math.max(0, admin.truthCredits - 30);
      admin.strikes += 1;
      if (admin.strikes >= 3) {
        admin.isSuspended = true;
      }

      admin.history.unshift({
        action: `Flagged Misinformation Penalty: -30 credits, Strike ${admin.strikes}/3 added.${admin.isSuspended ? ' ACCOUNT AUTO-SUSPENDED.' : ''}`,
        creditChange: -30,
        timestamp: new Date()
      });

      await admin.save();
      return NextResponse.json({
        success: true,
        message: `Penalty applied. Current strikes: ${admin.strikes}/3. ${admin.isSuspended ? 'Account suspended.' : ''}`,
        admin
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
