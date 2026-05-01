'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Invoice {
  id: string;
  client_name: string;
  client_email: string;
  invoice_number: string;
  amount: number;
  currency: string;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue' | 'draft';
  reminders_sent: number;
  created_at: string;
}

interface Stats {
  totalOutstanding: number;
  totalOverdue: number;
  totalPaid: number;
  pendingInvoices: number;
}

export default function AppDashboard() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalOutstanding: 0,
    totalOverdue: 0,
    totalPaid: 0,
    pendingInvoices: 0,
  });
  const [loading, setLoading] = useState(true);

  // Handle magic link redirect with tokens in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken) {
      fetch('/api/auth/set-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }),
      }).then(() => {
        // Clean URL
        router.replace('/app');
      });
    }
  }, [router]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch('/api/invoices');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setInvoices(data.invoices || []);

      // Calculate stats
      const outstanding = data.invoices
        ?.filter((i: Invoice) => i.status === 'pending')
        .reduce((sum: number, i: Invoice) => sum + i.amount, 0) || 0;
      const overdue = data.invoices
        ?.filter((i: Invoice) => i.status === 'overdue')
        .reduce((sum: number, i: Invoice) => sum + i.amount, 0) || 0;
      const paid = data.invoices
        ?.filter((i: Invoice) => i.status === 'paid')
        .reduce((sum: number, i: Invoice) => sum + i.amount, 0) || 0;

      setStats({
        totalOutstanding: outstanding,
        totalOverdue: overdue,
        totalPaid: paid,
        pendingInvoices: data.invoices?.filter((i: Invoice) => i.status === 'pending' || i.status === 'overdue').length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    overdue: 'bg-red-500/10 text-red-400 border-red-500/20',
    draft: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Outstanding"
          value={formatCurrency(stats.totalOutstanding)}
          subtext={`${stats.pendingInvoices} invoices pending`}
          color="amber"
        />
        <StatCard
          label="Overdue"
          value={formatCurrency(stats.totalOverdue)}
          subtext="Needs attention"
          color="red"
        />
        <StatCard
          label="Paid"
          value={formatCurrency(stats.totalPaid)}
          subtext="Collected"
          color="emerald"
        />
        <StatCard
          label="Total Invoices"
          value={invoices.length.toString()}
          subtext="All time"
          color="cyan"
        />
      </div>

      {/* Invoice List */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Invoices</h2>
          <a
            href="/app/invoices/new"
            className="text-sm text-emerald-400 hover:text-emerald-300 transition"
          >
            + Add Invoice
          </a>
        </div>

        {invoices.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-slate-400 mb-4">No invoices yet.</p>
            <a
              href="/app/invoices/new"
              className="inline-block px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition"
            >
              Add your first invoice
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-3">Invoice</th>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Reminders</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-sm text-white font-mono">
                      {invoice.invoice_number}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{invoice.client_name}</div>
                      <div className="text-xs text-slate-500">{invoice.client_email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white font-medium">
                      {formatCurrency(invoice.amount, invoice.currency)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {formatDate(invoice.due_date)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          statusColors[invoice.status] || statusColors.draft
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {invoice.reminders_sent}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href={`/app/invoices/${invoice.id}`}
                        className="text-sm text-emerald-400 hover:text-emerald-300 transition"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  subtext,
  color,
}: {
  label: string;
  value: string;
  subtext: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    amber: 'from-amber-500/10 to-amber-500/5 border-amber-500/10',
    red: 'from-red-500/10 to-red-500/5 border-red-500/10',
    emerald: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/10',
    cyan: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/10',
  };

  const valueColorMap: Record<string, string> = {
    amber: 'text-amber-400',
    red: 'text-red-400',
    emerald: 'text-emerald-400',
    cyan: 'text-cyan-400',
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorMap[color]} border rounded-xl p-5`}
    >
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${valueColorMap[color]}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-1">{subtext}</p>
    </div>
  );
}
