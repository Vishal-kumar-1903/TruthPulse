import { NextRequest, NextResponse } from 'next/server';
import { CommunityNote, computeBridgingScore, MOCK_COMMUNITY_NOTES } from '@/lib/bridgingAlgorithm';

let notesStore: Record<string, CommunityNote[]> = { ...MOCK_COMMUNITY_NOTES };

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const articleId = searchParams.get('articleId') || 'default';

  const notes = notesStore[articleId] || notesStore['default'] || [];

  return NextResponse.json({
    success: true,
    notes,
    totalNotes: notes.length
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action = 'CREATE', articleId = 'default', noteId, summary, evidenceUrl, userId, userName, helpful, userPolarity = 0 } = body;

    if (action === 'CREATE') {
      if (!summary || !evidenceUrl) {
        return NextResponse.json({ success: false, error: 'Summary and evidence URL are required.' }, { status: 400 });
      }

      const newNote: CommunityNote = {
        id: `note-${Date.now()}`,
        articleId,
        authorId: userId || 'anonymous',
        authorName: userName || 'Citizen Contributor',
        authorRole: 'READER',
        summary,
        evidenceUrl,
        status: 'NEEDS_MORE_RATINGS',
        bridgingConsensusScore: 0.5,
        perspectiveDiversityScore: 0.2,
        ratings: [
          { userId: userId || 'author', userName: userName || 'Author', userPolarity: 0.5, helpful: true }
        ],
        createdAt: new Date().toISOString()
      };

      if (!notesStore[articleId]) notesStore[articleId] = [];
      notesStore[articleId].unshift(newNote);

      return NextResponse.json({ success: true, note: newNote });
    }

    if (action === 'RATE') {
      const list = notesStore[articleId] || notesStore['default'] || [];
      const note = list.find(n => n.id === noteId);
      if (!note) {
        return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
      }

      // Add or update rating
      const existing = note.ratings.find(r => r.userId === userId);
      if (existing) {
        existing.helpful = helpful;
      } else {
        note.ratings.push({
          userId: userId || `user-${Date.now()}`,
          userName: userName || 'Citizen Rater',
          userPolarity: userPolarity !== undefined ? userPolarity : (Math.random() > 0.5 ? 0.7 : -0.7),
          helpful
        });
      }

      // Recompute Bridging consensus score
      const calc = computeBridgingScore(note.ratings);
      note.bridgingConsensusScore = calc.score;
      note.perspectiveDiversityScore = calc.diversity;
      note.status = calc.status;

      return NextResponse.json({ success: true, note });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
