import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Article from '@/models/Article';
import { buildMerkleTree, generateMerkleProof, sha256 } from '@/lib/merkle';
import { FALLBACK_ARTICLES } from '@/lib/fallbackArticles';

export async function GET(req: NextRequest) {
  try {
    const conn = await connectDB();
    const { searchParams } = new URL(req.url);
    const targetHash = searchParams.get('hash');

    let articles: any[] = [];

    if (conn && conn.connection.readyState === 1) {
      try {
        articles = await Article.find({ status: 'PUBLISHED' }).select('contentHash title category location createdAt').lean();
      } catch (dbErr) {
        console.warn('Merkle query fallback to memory:', dbErr);
      }
    }

    if (!articles || articles.length === 0) {
      articles = FALLBACK_ARTICLES;
    }

    const hashes = articles.map(a => a.contentHash || sha256(a.title + a.category));
    const { root, layers } = buildMerkleTree(hashes);

    let proof = null;
    if (targetHash) {
      proof = generateMerkleProof(targetHash, hashes);
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      blockIndex: 10428,
      merkleRoot: root,
      totalAnchoredArticles: articles.length,
      treeDepth: layers.length,
      proof
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
