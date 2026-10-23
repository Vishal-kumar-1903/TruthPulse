import { NextRequest, NextResponse } from 'next/server';
import { 
  bot1AutoScout, 
  bot2GeoTagger, 
  bot3NeuralSynthesizer, 
  bot4VerificationAuditor,
  RawWireArticle
} from '@/lib/agents';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { headline, rawText, sourceUrl, sourceName, manualGps } = body;

    if (!headline || !rawText) {
      return NextResponse.json({ success: false, error: 'Headline and Raw Text are required' }, { status: 400 });
    }

    // 1. Run Bot 1: Auto-Scout
    const sampleWires: RawWireArticle[] = [
      {
        sourceName: sourceName || 'PTI News Wire',
        url: sourceUrl || 'https://ptinews.com/dispatch-wire-2026',
        headline: headline,
        rawText: rawText,
        publishedAt: new Date().toISOString()
      },
      {
        sourceName: 'DD News Technical Registry',
        url: 'https://ddnews.gov.in/bulletin/official-statement',
        headline: headline,
        rawText: `Corroborating statement: ${rawText.slice(0, 300)} Verified through government operational portal.`,
        publishedAt: new Date().toISOString()
      }
    ];

    const clusters = bot1AutoScout(sampleWires);
    const primaryCluster = clusters[0] || {
      primaryHeadline: headline,
      sources: sampleWires.map(w => ({ name: w.sourceName, url: w.url, stance: 'CORROBORATING' as const, rawSnippet: w.rawText.slice(0, 200) })),
      rawCombinedText: rawText
    };

    // 2. Run Bot 2: Geo-Tagger
    const location = bot2GeoTagger(`${headline} ${rawText}`, manualGps);

    // 3. Run Bot 3: Neural Synthesizer
    const synthesis = bot3NeuralSynthesizer(primaryCluster.rawCombinedText, headline);

    // 4. Run Bot 4: Verification & Bias Auditor
    const audit = bot4VerificationAuditor(headline, synthesis.summary + ' ' + rawText, primaryCluster.sources);

    return NextResponse.json({
      success: true,
      agentPipeline: {
        bot1AutoScout: {
          clusteredCount: sampleWires.length,
          primaryHeadline: primaryCluster.primaryHeadline,
          sourcesExtracted: primaryCluster.sources
        },
        bot2GeoTagger: {
          location,
          assignedRegionType: location.regionType,
          matchedCity: location.city,
          matchedState: location.state
        },
        bot3NeuralSynthesizer: {
          wordCount: synthesis.summary.split(' ').length,
          summary: synthesis.summary,
          bullets: synthesis.bullets
        },
        bot4VerificationAuditor: {
          trustScore: audit.trustScore,
          discrepancyAlert: audit.discrepancyAlert,
          isSensational: audit.isSensational,
          contentHash: audit.contentHash,
          eligibleForPublish: audit.trustScore >= 80 && primaryCluster.sources.length >= 1
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
