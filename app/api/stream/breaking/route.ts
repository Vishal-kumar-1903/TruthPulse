import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const LIVE_NEWS_FLASHES = [
  {
    id: 'sse-1',
    headline: 'Supreme Court bench concludes hearing on national digital privacy safeguards',
    location: 'New Delhi',
    category: 'National',
    trustScore: 94,
    source: 'PIB & Supreme Court Gazette'
  },
  {
    id: 'sse-2',
    headline: 'ISRO commences integrated thermal testing for Gaganyaan crew module flight simulator',
    location: 'Bengaluru, Karnataka',
    category: 'Tech',
    trustScore: 98,
    source: 'ISRO Press Dispatch'
  },
  {
    id: 'sse-3',
    headline: 'Chhattisgarh approves 90% capital grant for 1.8 Lakh agricultural solar installations',
    location: 'Raigarh, Chhattisgarh',
    category: 'Environment',
    trustScore: 92,
    source: 'State Renewable Energy Bulletin'
  },
  {
    id: 'sse-4',
    headline: 'Reserve Bank of India reports digital rupee (e-INR) retail volume surges 310%',
    location: 'Mumbai, Maharashtra',
    category: 'Business',
    trustScore: 96,
    source: 'RBI Financial Stability Report'
  },
  {
    id: 'sse-5',
    headline: 'National Highway Authority deploys multi-spectral AI cameras across NH-44 corridor',
    location: 'Hyderabad, Telangana',
    category: 'Infrastructure',
    trustScore: 91,
    source: 'MoRTH Official'
  }
];

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connect handshake
      controller.enqueue(
        encoder.encode(
          `event: connected\ndata: ${JSON.stringify({ message: 'Connected to TruthPulse Live Wire SSE', timestamp: new Date().toISOString() })}\n\n`
        )
      );

      let counter = 0;
      const interval = setInterval(() => {
        try {
          const item = LIVE_NEWS_FLASHES[counter % LIVE_NEWS_FLASHES.length];
          const payload = {
            ...item,
            timestamp: new Date().toISOString(),
            sequenceId: counter + 1,
            activeReaders: 1420 + Math.floor(Math.random() * 85)
          };

          controller.enqueue(
            encoder.encode(`event: breaking_alert\ndata: ${JSON.stringify(payload)}\n\n`)
          );

          counter++;
        } catch (err) {
          clearInterval(interval);
          controller.close();
        }
      }, 5000);

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive'
    }
  });
}
