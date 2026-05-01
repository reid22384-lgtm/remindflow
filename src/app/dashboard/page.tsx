'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSignups: 0,
    todaySignups: 0,
    weekSignups: 0,
    conversionRate: 0,
  });
  const [recentSignups, setRecentSignups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      setStats(data.stats);
      setRecentSignups(data.recent);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center">
        <div className="animate-pulse text-white/40">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* Header */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-black font-bold text-sm">R</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold">RemindFlow Dashboard</h1>
              <p className="text-white/30 text-sm">Waitlist Analytics</p>
            </div>
          </div>
          <button
            onClick={fetchStats}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Signups', value: stats.totalSignups, icon: '👥', color: 'text-emerald-400' },
            { label: 'Today', value: stats.todaySignups, icon: '📅', color: 'text-blue-400' },
            { label: 'This Week', value: stats.weekSignups, icon: '📊', color: 'text-purple-400' },
            { label: 'Daily Avg', value: stats.totalSignups > 0 ? (stats.totalSignups / 7).toFixed(1) : '0', icon: '📈', color: 'text-amber-400' },
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-2xl mb-3">{stat.icon}</div>
              <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
              <div className="text-white/30 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Progress Tracker */}
        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] mb-12">
          <h2 className="text-2xl font-semibold mb-6">Path to $1K/mo</h2>
          <div className="space-y-6">
            {[
              { label: 'Waitlist Signups', current: stats.totalSignups, target: 500, unit: '' },
              { label: 'Paying Customers (at $19/mo)', current: Math.floor(stats.totalSignups * 0.1), target: 53, unit: '' },
              { label: 'Monthly Revenue', current: Math.floor(stats.totalSignups * 0.1 * 19), target: 1007, unit: '$' },
            ].map((metric, i) => {
              const progress = Math.min((metric.current / metric.target) * 100, 100);
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">{metric.label}</span>
                    <span className="text-white/40 text-sm">
                      {metric.unit}{metric.current} / {metric.unit}{metric.target} ({progress.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Signups */}
        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <h2 className="text-2xl font-semibold mb-6">Recent Signups</h2>
          {recentSignups.length === 0 ? (
            <div className="text-center py-12 text-white/20">
              <div className="text-4xl mb-4">📭</div>
              <p>No signups yet. Share your link to get started!</p>
              <code className="mt-4 inline-block px-4 py-2 rounded-lg bg-white/5 text-emerald-400 text-sm">
                https://remindflow-silk.vercel.app/
              </code>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSignups.map((signup: any) => (
                <div key={signup.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-sm font-bold">
                      {signup.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white/60">{signup.email}</span>
                  </div>
                  <span className="text-white/20 text-sm">
                    {new Date(signup.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
