import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Article from '@/models/Article';
import { buildMerkleTree, generateMerkleProof, sha256 } from '@/lib/merkle';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const targetHash = searchParams.get('hash');

    const articles = await Article.find({ status: 'PUBLISHED' }).select('contentHash title category location createdAt').lean();

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
