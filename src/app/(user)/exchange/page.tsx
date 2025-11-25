'use client';

import { useState, useEffect } from 'react';
import { ArrowUpDown, CircleUser, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CURRENCIES = ['GBP', 'USD', 'AUD', 'CAD', 'PLN', 'MXN'];

export default function SwapFiat() {
  const [from, setFrom] = useState('PLN');
  const [to, setTo] = useState('USD');
  const [amount, setAmount] = useState<number>(1);
  const [converted, setConverted] = useState<number>(0);
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  const fetchRate = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/rates?from=${from}&to=${to}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch rates');
      }

      const data = await res.json();

      const r = data?.rate;
      setRate(r || 0);
      setConverted(amount * r);
      setLastUpdate(data?.date || null);
    } catch (error) {
      console.error(error);
      setError((error as Error).message || 'Failed to fetch rates');
      setRate(null);
      setConverted(0);
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    const tempFrom = from;
    const tempTo = to;

    setFrom(tempTo);
    setTo(tempFrom);
  };

  useEffect(() => {
    fetchRate();
  }, [from, to]);

  useEffect(() => {
    if (rate) setConverted(amount * rate);
  }, [amount, rate]);

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white flex justify-center items-center p-6">
      <div className="w-full max-w-md bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Currency Exchange
        </h1>

        {/* FROM */}
        <div className="mb-6">
          <label className="text-sm text-neutral-400 mb-2 block">You pay</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="flex-1 p-4 rounded-xl bg-neutral-800/80 border border-neutral-700 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="0.00"
            />

            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="p-4 rounded-xl bg-neutral-800/80 border border-neutral-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SWAP BUTTON */}
        <div className="flex justify-center my-4">
          <button
            onClick={swapCurrencies}
            className="p-3 rounded-full bg-neutral-800/80 hover:bg-indigo-600 border border-neutral-700 hover:border-indigo-500 transition-all duration-300 transform hover:scale-110"
            disabled={loading}
          >
            <ArrowUpDown className="w-5 h-5" />
          </button>
        </div>

        {/* TO */}
        <div className="mb-6">
          <label className="text-sm text-neutral-400 mb-2 block">You receive</label>
          <div className="flex items-center gap-3">
            <input
              disabled
              value={loading ? 'Loading...' : error ? '—' : converted.toFixed(2)}
              className="flex-1 p-4 rounded-xl bg-neutral-800/80 border border-neutral-700 text-lg text-neutral-300"
            />

            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="p-4 rounded-xl bg-neutral-800/80 border border-neutral-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
        )}

        {/* RATE INFO */}
        {rate && !error && (
          <div className="bg-neutral-800/50 rounded-xl p-4 mb-4">
            <p className="text-neutral-300 text-sm">
              1 {from} = <span className="text-indigo-400 font-semibold">{rate.toFixed(4)}</span> {to}
            </p>
            {lastUpdate && (
              <p className="text-neutral-500 text-xs mt-1">Updated: {new Date(lastUpdate).toLocaleString()}</p>
            )}
          </div>
        )}

        {/* REFRESH BUTTON */}
        <Button
          onClick={fetchRate}
          disabled={loading}
          className="mb-5 w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-neutral-700 disabled:to-neutral-700 rounded-xl py-4 font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh Rate'}
        </Button>
        <Link href="/profile">
          <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-2">
            <CircleUser className="w-4 h-4" />
            Go to Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}
