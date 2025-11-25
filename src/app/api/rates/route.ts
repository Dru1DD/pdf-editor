import { NextResponse } from 'next/server';
const API_KEY = process.env.EXCHANGE_API_KEY;

const API_URL = 'https://v6.exchangerate-api.com/v6/';

const SUPPORTED = ['GBP', 'USD', 'AUD', 'CAD', 'PLN', 'MXN'];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const from = (searchParams.get('from') || 'GBP').toUpperCase();
    const to = (searchParams.get('to') || 'USD').toUpperCase();

    // Validate currencies
    if (!SUPPORTED.includes(from) || !SUPPORTED.includes(to)) {
      return NextResponse.json({ error: `Unsupported currency pair` }, { status: 400 });
    }

    if (!API_KEY) {
      return NextResponse.json({ error: 'API key missing. Add EXCHANGE_API_KEY to .env.' }, { status: 500 });
    }

    // exchangerate-api.com v6 uses format: /v6/{API_KEY}/latest/{BASE_CURRENCY}
    const res = await fetch(`${API_URL}${API_KEY}/latest/${from}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'External API error' }, { status: 502 });
    }

    const data = await res.json();

    // Check for API errors
    if (data.result === 'error') {
      return NextResponse.json({ error: data['error-type'] || 'API returned error' }, { status: 502 });
    }

    // exchangerate-api.com returns conversion_rates object
    const rate = data.conversion_rates?.[to];

    if (!rate) {
      return NextResponse.json({ error: `Rate not found for ${to}` }, { status: 502 });
    }

    return NextResponse.json({
      from,
      to,
      rate,
      date: data.time_last_update_utc,
      nextUpdate: data.time_next_update_utc,
    });
  } catch (err) {
    console.error('Rates API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
