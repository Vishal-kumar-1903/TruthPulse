import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import AdminUser from '@/models/AdminUser';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { role = 'READER', email, name } = body;

    let targetEmail = email;
    let targetName = name;
    let targetRole = role;

    if (role === 'READER' && !email) {
      targetEmail = 'rohit.sharma@gmail.com';
      targetName = 'Rohit Sharma (Verified Citizen)';
    } else if ((role === 'CHIEF_EDITOR' || role === 'ADMIN') && !email) {
      targetEmail = 'editor@truthpulse.in';
      targetName = 'Vikramaditya Sen (Chief Editor)';
      targetRole = 'CHIEF_EDITOR';
    }

    let user = await User.findOne({ email: targetEmail });
    if (!user) {
      user = await User.create({
        name: targetName,
        email: targetEmail,
        role: targetRole,
        truthCredits: targetRole === 'CHIEF_EDITOR' ? 185 : 50,
        strikes: 0,
        accuracyRate: targetRole === 'CHIEF_EDITOR' ? 98 : 95,
        notifications: [
          {
            title: 'Welcome to TruthPulse SatyaNews',
            message: 'Your credibility voting rights and decentralized verification feed are active.',
            read: false,
            createdAt: new Date()
          }
        ]
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        truthCredits: user.truthCredits,
        votedArticles: user.votedArticles || [],
        bookmarks: user.bookmarks || []
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
