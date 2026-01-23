import { NextResponse } from 'next/server';

const { tavily } = await import('@tavily/core');

const apiKey = process.env.TAVILY_API_KEY;
const client = tavily({ apiKey });

export async function POST(req: Request) {
  try {
    const { tool, params } = await req.json();

    switch (tool) {
      case 'search': {
        const query = params.query || params.text || '';
        const options = params.options || {};
        const result = await client.search(query, options);
        return NextResponse.json({ toolResult: result });
      }
      case 'extract': {
        const urls = params.urls || params.targets || [];
        const options = params.options || {};
        const result = await client.extract(urls, options);
        return NextResponse.json({ toolResult: result });
      }
      case 'research': {
        const query = params.query || params.text || '';
        const result = await client.research(query, params.options || {});
        return NextResponse.json({ toolResult: result });
      }
      case 'crawl': {
        const url = params.url || params.target;
        const options = params.options || {};
        const result = await client.crawl(url, options);
        return NextResponse.json({ toolResult: result });
      }
      default:
        return NextResponse.json({ error: `Unknown Tavily tool: ${tool}` }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
