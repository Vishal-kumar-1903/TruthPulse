import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Article from '@/models/Article';
import User from '@/models/User';
import { verifyContentIntegrity } from '@/lib/crypto';
import { FALLBACK_ARTICLES } from '@/lib/fallbackArticles';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const conn = await connectDB();

    let article: any = null;

    if (conn && conn.connection.readyState === 1) {
      try {
        article = await Article.findById(id);
      } catch (findErr) {
        // Fallback to in-memory array
      }
    }

    if (!article) {
      article = FALLBACK_ARTICLES.find(a => a._id === id || a.contentHash === id);
    }

    if (!article) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    // Auto-increment views if mongo connected
    if (article.save) {
      article.views = (article.views || 0) + 1;
      await article.save();
    }

    const isTampered = !verifyContentIntegrity(
      article.title,
      article.summary,
      article.content,
      article.contentHash
    );

    return NextResponse.json({
      success: true,
      data: article,
      integrity: {
        hash: article.contentHash,
        verified: !isTampered,
        tampered: isTampered
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Handle Authenticated Credibility Voting & Comment Counter-Evidence
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const conn = await connectDB();

    let article: any = null;

    if (conn && conn.connection.readyState === 1) {
      try {
        article = await Article.findById(id);
      } catch (findErr) {
        // Fallback to memory
      }
    }

    if (!article) {
      article = FALLBACK_ARTICLES.find(a => a._id === id);
    }

    if (!article) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    if (!article.greenVoters) article.greenVoters = [];
    if (!article.redVoters) article.redVoters = [];
    if (!article.comments) article.comments = [];

    // 1. ACTION: VOTE
    if (body.action === 'VOTE') {
      const { userId, type } = body;
      if (!userId) {
        return NextResponse.json(
          { success: false, error: 'Authentication Required: Please sign in to verify or flag this dispatch.' },
          { status: 401 }
        );
      }

      const voteType = (type === 'GREEN' || type === 'UP') ? 'GREEN' : 'RED';
      const hasVotedGreen = article.greenVoters.includes(userId);
      const hasVotedRed = article.redVoters.includes(userId);

      if (voteType === 'GREEN') {
        if (hasVotedGreen) {
          article.greenVoters = article.greenVoters.filter((u: string) => u !== userId);
          article.upvotes = Math.max(0, (article.upvotes || 1) - 1);
        } else {
          article.greenVoters.push(userId);
          article.upvotes = (article.upvotes || 0) + 1;
          if (hasVotedRed) {
            article.redVoters = article.redVoters.filter((u: string) => u !== userId);
            article.downvotes = Math.max(0, (article.downvotes || 1) - 1);
          }
        }
      } else {
        if (hasVotedRed) {
          article.redVoters = article.redVoters.filter((u: string) => u !== userId);
          article.downvotes = Math.max(0, (article.downvotes || 1) - 1);
        } else {
          article.redVoters.push(userId);
          article.downvotes = (article.downvotes || 0) + 1;
          if (hasVotedGreen) {
            article.greenVoters = article.greenVoters.filter((u: string) => u !== userId);
            article.upvotes = Math.max(0, (article.upvotes || 1) - 1);
          }
        }
      }

      const downCount = article.downvotes || 0;
      const upCount = article.upvotes || 0;

      if (downCount >= 3) {
        article.isVerified = false;
        article.trustScore = Math.max(25, (article.trustScore || 80) - 5);
      } else if (upCount >= 1 && downCount < 3) {
        article.isVerified = true;
        article.trustScore = Math.min(99, (article.trustScore || 80) + 2);
      }

      if (article.save) {
        await article.save();
      }

      if (conn && conn.connection.readyState === 1) {
        try {
          await User.findByIdAndUpdate(userId, {
            $pull: { votedArticles: { articleId: article._id } }
          });
          if (article.greenVoters.includes(userId) || article.redVoters.includes(userId)) {
            const finalType = article.greenVoters.includes(userId) ? 'GREEN' : 'RED';
            await User.findByIdAndUpdate(userId, {
              $push: { votedArticles: { articleId: article._id, voteType: finalType, votedAt: new Date() } }
            });
          }
        } catch (e) {
          // Non-blocking
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          id: article._id,
          upvotes: article.upvotes,
          downvotes: article.downvotes,
          isVerified: article.isVerified,
          isFlagged: (article.downvotes || 0) >= 3,
          trustScore: article.trustScore,
          userVote: article.greenVoters.includes(userId) ? 'GREEN' : (article.redVoters.includes(userId) ? 'RED' : null)
        }
      });
    }

    // 2. ACTION: COMMENT
    if (body.action === 'COMMENT') {
      const { userId, userName, text, evidenceUrl, userRole } = body;
      if (!userId || !text) {
        return NextResponse.json({ success: false, error: 'User ID and comment text are required' }, { status: 400 });
      }

      const newComment = {
        userId,
        userName: userName || 'Citizen Analyst',
        userRole: userRole || 'READER',
        text,
        evidenceUrl: evidenceUrl || '',
        createdAt: new Date().toISOString()
      };

      article.comments.unshift(newComment);

      if (article.save) {
        await article.save();
      }

      return NextResponse.json({ success: true, comments: article.comments });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
