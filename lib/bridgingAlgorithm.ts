export interface CommunityNote {
  id: string;
  articleId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  summary: string;
  evidenceUrl: string;
  status: 'HELPFUL' | 'NEEDS_MORE_RATINGS' | 'NOT_HELPFUL_PARTISAN';
  bridgingConsensusScore: number; // 0 to 1
  perspectiveDiversityScore: number; // 0 to 1
  ratings: Array<{
    userId: string;
    userName: string;
    userPolarity: number; // -1.0 (Cluster A) to +1.0 (Cluster B)
    helpful: boolean;
  }>;
  createdAt: string;
}

/**
 * Computes Twitter/X Matrix Factorization Bridging Consensus Score
 */
export function computeBridgingScore(ratings: CommunityNote['ratings']): {
  score: number;
  diversity: number;
  status: CommunityNote['status'];
} {
  if (ratings.length < 2) {
    return { score: 0.5, diversity: 0.3, status: 'NEEDS_MORE_RATINGS' };
  }

  // Split into ideological clusters A (polarity < 0) and B (polarity >= 0)
  const clusterA = ratings.filter(r => r.userPolarity < 0);
  const clusterB = ratings.filter(r => r.userPolarity >= 0);

  const helpfulA = clusterA.filter(r => r.helpful).length;
  const helpfulB = clusterB.filter(r => r.helpful).length;

  const ratioA = clusterA.length > 0 ? helpfulA / clusterA.length : 0;
  const ratioB = clusterB.length > 0 ? helpfulB / clusterB.length : 0;

  // Bridging consensus occurs when BOTH clusters find the note helpful
  const consensusScore = Math.min(ratioA, ratioB);
  
  // Diversity of raters
  const diversity = Math.min(clusterA.length, clusterB.length) / Math.max(1, Math.max(clusterA.length, clusterB.length));

  let status: CommunityNote['status'] = 'NEEDS_MORE_RATINGS';
  if (ratings.length >= 4) {
    if (consensusScore >= 0.6 && diversity >= 0.4) {
      status = 'HELPFUL';
    } else if (Math.abs(ratioA - ratioB) > 0.5) {
      status = 'NOT_HELPFUL_PARTISAN';
    }
  }

  return {
    score: consensusScore,
    diversity,
    status
  };
}

export const MOCK_COMMUNITY_NOTES: Record<string, CommunityNote[]> = {
  default: [
    {
      id: 'note-1',
      articleId: 'default',
      authorId: 'user-audit-1',
      authorName: 'Dr. Aarav Mehta (Fact Auditor)',
      authorRole: 'CONTRIBUTOR',
      summary: 'Verified via statutory gazette notification CG-DL-E-24102026. The real-time spending dashboard timeline is phased over 18 months, not immediate as claimed in social posts.',
      evidenceUrl: 'https://egazette.gov.in/official-statute',
      status: 'HELPFUL',
      bridgingConsensusScore: 0.84,
      perspectiveDiversityScore: 0.88,
      ratings: [
        { userId: 'u1', userName: 'Priya K.', userPolarity: -0.8, helpful: true },
        { userId: 'u2', userName: 'Devendra S.', userPolarity: 0.7, helpful: true },
        { userId: 'u3', userName: 'Sunil Rao', userPolarity: -0.4, helpful: true },
        { userId: 'u4', userName: 'Ananya G.', userPolarity: 0.6, helpful: true },
      ],
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
    }
  ]
};
