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
  issue_date: string;
  due_date: string;
  status: string;
  reminder_schedule: number[];
  reminders_sent: number;
  last_reminder_sent: string;
  notes: string;
  created_at: string;
  reminder_logs?: Array<{
    id: string;
    reminder_number: number;
    sent_at: string;
    status: string;
  }>;
}

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [invoiceId, setInvoiceId] = useState('');

  useEffect(() => {
    params.then(p => {
      setInvoiceId(p.id);
      fetchInvoice(p.id);
    });
  }, [params]);

  const fetchInvoice = async (id: string) => {
    try {
      const res = await fetch(`/api/invoices/${id}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setInvoice(data.invoice);
    } catch {
      console.error('Failed to fetch invoice');
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async () => {
    if (!invoice) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/invoices/${invoice.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid' }),
      });
      if (!res.ok) throw new Error('Failed to update');
      const data = await res.json();
      setInvoice(data.invoice);
    } catch {
      console.error('Failed to mark as paid');
    } finally {
      setUpdating(false);
    }
  };

  const markAsPending = async () => {
    if (!invoice) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/invoices/${invoice.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'pending' }),
      });
      if (!res.ok) throw new Error('Failed to update');
      const data = await res.json();
      setInvoice(data.invoice);
    } catch {
      console.error('Failed to mark as pending');
    } finally {
      setUpdating(false);
    }
  };

  const deleteInvoice = async () => {
    if (!invoice) return;
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    try {
      const res = await fetch(`/api/invoices/${invoice.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      router.push('/app');
      router.refresh();
    } catch {
      console.error('Failed to delete invoice');
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
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Invoice not found.</p>
        <a href="/app" className="text-emerald-400 hover:text-emerald-300 mt-4 inline-block">
          &larr; Back to dashboard
        </a>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    overdue: 'bg-red-500/10 text-red-400 border-red-500/20',
    draft: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <a href="/app" className="text-sm text-slate-400 hover:text-white transition">
            &larr; Back to dashboard
          </a>
          <h1 className="text-2xl font-bold text-white mt-2">
            Invoice {invoice.invoice_number}
          </h1>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
            statusColors[invoice.status] || statusColors.draft
          }`}
        >
          {invoice.status}
        </span>
      </div>

      {/* Details Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6">
        {/* Client */}
        <div>
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Client</h2>
          <p className="text-white font-medium">{invoice.client_name}</p>
          <p className="text-slate-400 text-sm">{invoice.client_email}</p>
        </div>

        {/* Amount & Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">Amount</h2>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(invoice.amount, invoice.currency)}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">Issue Date</h2>
            <p className="text-white">{formatDate(invoice.issue_date)}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">Due Date</h2>
            <p className="text-white">{formatDate(invoice.due_date)}</p>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div>
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">Notes</h2>
            <p className="text-slate-300 whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}

        {/* Reminder Schedule */}
        <div>
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Reminder Schedule</h2>
          <div className="flex gap-2 flex-wrap">
            {(invoice.reminder_schedule || [3, 7, 14, 30]).map((day, i) => (
              <span
                key={day}
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  i < (invoice.reminders_sent || 0)
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                }`}
              >
                {day}d {i < (invoice.reminders_sent || 0) ? '(sent)' : ''}
              </span>
            ))}
          </div>
        </div>

        {/* Reminder Logs */}
        {invoice.reminder_logs && invoice.reminder_logs.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Reminder History</h2>
            <div className="space-y-2">
              {invoice.reminder_logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between text-sm py-2 border-b border-white/5">
                  <span className="text-slate-300">Reminder #{log.reminder_number}</span>
                  <span className="text-slate-500">{formatDate(log.sent_at)}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    log.status === 'sent' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {invoice.status !== 'paid' && (
          <button
            onClick={markAsPaid}
            disabled={updating}
            className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updating ? 'Updating...' : 'Mark as Paid'}
          </button>
        )}
        {invoice.status === 'paid' && (
          <button
            onClick={markAsPending}
            disabled={updating}
            className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updating ? 'Updating...' : 'Mark as Unpaid'}
          </button>
        )}
        <button
          onClick={deleteInvoice}
          className="px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-400 font-medium rounded-xl hover:bg-red-500/20 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
