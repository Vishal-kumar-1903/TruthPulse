import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { CommunityNote, computeBridgingScore, MOCK_COMMUNITY_NOTES } from '@/lib/bridgingAlgorithm';

let notesStore: Record<string, CommunityNote[]> = { ...MOCK_COMMUNITY_NOTES };

const CommunityNoteActionSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('CREATE'),
    articleId: z.string().optional().default('default'),
    summary: z.string().trim().min(10, 'Summary must be at least 10 characters').max(600, 'Summary cannot exceed 600 characters'),
    evidenceUrl: z.string().trim().min(5, 'Evidence URL is required'),
    userId: z.string().optional().default('anonymous'),
    userName: z.string().trim().max(100).optional().default('Citizen Contributor'),
  }),
  z.object({
    action: z.literal('RATE'),
    articleId: z.string().optional().default('default'),
    noteId: z.string().min(1, 'Note ID is required to rate'),
    helpful: z.boolean(),
    userId: z.string().optional().default('anonymous'),
    userName: z.string().trim().max(100).optional().default('Citizen Rater'),
    userPolarity: z.number().min(-1).max(1).optional(),
  }),
]);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const articleId = searchParams.get('articleId') || 'default';

  const notes = notesStore[articleId] || notesStore['default'] || [];

  return NextResponse.json({
    success: true,
    notes,
    totalNotes: notes.length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = CommunityNoteActionSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid community note request',
          details: parseResult.error.issues.map(i => i.message),
        },
        { status: 422 }
      );
    }

    const data = parseResult.data;

    if (data.action === 'CREATE') {
      const { articleId, summary, evidenceUrl, userId, userName } = data;

      const newNote: CommunityNote = {
        id: `note-${Date.now()}`,
        articleId,
        authorId: userId,
        authorName: userName,
        authorRole: 'READER',
        summary,
        evidenceUrl,
        status: 'NEEDS_MORE_RATINGS',
        bridgingConsensusScore: 0.5,
        perspectiveDiversityScore: 0.2,
        ratings: [
          { userId, userName, userPolarity: 0.5, helpful: true },
        ],
        createdAt: new Date().toISOString(),
      };

      if (!notesStore[articleId]) notesStore[articleId] = [];
      notesStore[articleId].unshift(newNote);

      return NextResponse.json({ success: true, note: newNote });
    }

    if (data.action === 'RATE') {
      const { articleId, noteId, helpful, userId, userName, userPolarity } = data;
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
          helpful,
        });
      }

      // Recompute Bridging consensus score
      const calc = computeBridgingScore(note.ratings);
      note.bridgingConsensusScore = calc.score;
      note.perspectiveDiversityScore = calc.diversity;
      note.status = calc.status;

      return NextResponse.json({ success: true, note });
    }

    return NextResponse.json({ success: false, error: 'Unsupported action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
