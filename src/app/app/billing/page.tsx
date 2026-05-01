'use client';

import { useEffect, useState } from 'react';

export default function BillingPage() {
  const [subscription, setSubscription] = useState<{
    hasSubscription: boolean;
    plan: string | null;
    status: string | null;
    currentPeriodEnd: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stripe/subscription')
      .then((res) => res.json())
      .then((data) => setSubscription(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleManage = async () => {
    // Redirect to Stripe customer portal
    window.open('https://billing.stripe.com', '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Billing</h1>
        <p className="text-white/40">Manage your subscription and payment details.</p>
      </div>

      {subscription?.hasSubscription ? (
        <div className="space-y-6">
          <div className="p-8 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Active Subscription</h3>
                <p className="text-white/30 text-sm">
                  {subscription.plan} plan · {subscription.status}
                </p>
              </div>
            </div>
            {subscription.currentPeriodEnd && (
              <p className="text-white/40 text-sm">
                Next billing date: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </div>

          <button
            onClick={handleManage}
            className="px-6 py-3 border border-white/10 text-white/60 hover:text-white hover:border-white/20 rounded-xl transition-all"
          >
            Manage Subscription →
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-2">No active subscription</h3>
            <p className="text-white/30 mb-6">
              Choose a plan to unlock automated reminders and all features.
            </p>
            <a
              href="/pricing"
              className="inline-block px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-semibold rounded-xl transition-all duration-300"
            >
              View Plans →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
