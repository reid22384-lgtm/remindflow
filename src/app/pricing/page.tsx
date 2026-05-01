'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function PricingContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [canceled, setCanceled] = useState(false);

  useEffect(() => {
    if (searchParams.get('success')) setSuccess(true);
    if (searchParams.get('canceled')) setCanceled(true);
  }, [searchParams]);

  const handleCheckout = async (plan: 'individual' | 'agency') => {
    setLoading(plan);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, email: undefined }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
    }
    setLoading(null);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* Background grid */}
      <div className="fixed inset-0 bg-grid pointer-events-none z-0" />

      {/* Floating orbs */}
      <div className="fixed top-32 -left-48 w-[600px] h-[600px] bg-emerald-600/8 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />
      <div className="fixed top-[600px] -right-48 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] animate-pulse-glow pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#030303]/90 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <span className="font-semibold text-xl tracking-tight">RemindFlow</span>
          </a>
          <a href="/" className="text-sm text-white/40 hover:text-white transition-colors">
            ← Back to home
          </a>
        </div>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-40">
        {/* Success / Canceled banners */}
        {success && (
          <div className="mb-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center">
            🎉 Payment successful! Welcome to RemindFlow.
          </div>
        )}
        {canceled && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-center">
            Checkout canceled. No worries — your spot is still reserved.
          </div>
        )}

        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Simple <span className="text-gradient">pricing</span>
          </h1>
          <p className="text-white/30 text-lg max-w-md mx-auto">
            Less than the cost of one unpaid invoice. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Individual */}
          <div className="p-12 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-white/15 transition-all duration-500 h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-2">Individual</h3>
            <p className="text-white/25 text-sm mb-8">For solo freelancers and consultants</p>
            <div className="mb-10">
              <span className="text-6xl font-bold">$19</span>
              <span className="text-white/25 text-lg">/month</span>
            </div>
            <ul className="space-y-4 mb-12 flex-1">
              {[
                'Unlimited invoices',
                'Automated email reminders',
                'CSV import from any tool',
                'Dashboard & analytics',
                '14-day free trial',
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-white/40">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout('individual')}
              disabled={loading === 'individual'}
              className="block text-center px-6 py-4 rounded-2xl border border-white/10 hover:border-emerald-500/50 hover:text-emerald-400 transition-all duration-300 font-medium disabled:opacity-50"
            >
              {loading === 'individual' ? 'Redirecting...' : 'Get Started'}
            </button>
          </div>

          {/* Agency */}
          <div className="p-12 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/[0.02] border border-emerald-500/30 relative glow-emerald h-full flex flex-col">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-400 text-black text-xs font-bold rounded-full shadow-lg shadow-emerald-500/20">
              MOST POPULAR
            </div>
            <h3 className="text-lg font-semibold mb-2">Agency</h3>
            <p className="text-white/25 text-sm mb-8">For teams up to 10 people</p>
            <div className="mb-10">
              <span className="text-6xl font-bold">$29</span>
              <span className="text-white/25 text-lg">/month</span>
            </div>
            <ul className="space-y-4 mb-12 flex-1">
              {[
                'Everything in Individual',
                'Up to 10 team members',
                'Stripe & Wave integration',
                'Custom email templates',
                'Priority support',
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-white/40">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout('agency')}
              disabled={loading === 'agency'}
              className="block text-center px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-semibold transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {loading === 'agency' ? 'Redirecting...' : 'Get Started'}
            </button>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-24 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Frequently asked questions</h2>
          <div className="space-y-1">
            {[
              { q: 'Is there a free trial?', a: 'Yes — 14 days, no credit card required.' },
              { q: 'Can I cancel anytime?', a: 'Absolutely. No contracts, no cancellation fees.' },
              { q: 'What payment methods do you accept?', a: 'All major credit and debit cards via Stripe.' },
              { q: 'What happens to my data if I cancel?', a: 'Your data is retained for 30 days. You can export everything before canceling.' },
            ].map((item, i) => (
              <div key={i} className="border-b border-white/[0.06] py-6 group hover:border-white/10 transition-colors">
                <h3 className="font-medium mb-2 group-hover:text-emerald-400 transition-colors">{item.q}</h3>
                <p className="text-white/30 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030303]" />}>
      <PricingContent />
    </Suspense>
  );
}
