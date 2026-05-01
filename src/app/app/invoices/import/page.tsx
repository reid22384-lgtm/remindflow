'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function ImportInvoicesPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ imported: number; skipped: number; errors: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (f: File) => {
    if (!f.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }
    setFile(f);
    setError(null);
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/invoices/import', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Import failed');
        return;
      }

      setResult({
        imported: data.imported,
        skipped: data.skipped,
        errors: data.errors || [],
      });
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Import Invoices</h1>
        <p className="text-white/40">Upload a CSV file to bulk import your invoices.</p>
      </div>

      {/* Upload area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
          dragOver
            ? 'border-emerald-500 bg-emerald-500/5'
            : file
              ? 'border-emerald-500/30 bg-emerald-500/5'
              : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
        />

        {file ? (
          <div>
            <svg className="w-12 h-12 text-emerald-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-white/80 font-medium mb-1">{file.name}</p>
            <p className="text-white/30 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
        ) : (
          <div>
            <svg className="w-12 h-12 text-white/20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3" />
            </svg>
            <p className="text-white/60 font-medium mb-1">Drop your CSV file here</p>
            <p className="text-white/30 text-sm">or click to browse</p>
          </div>
        )}
      </div>

      {/* CSV format info */}
      <div className="mt-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
        <h3 className="text-sm font-medium text-white/60 mb-3">Expected CSV format</h3>
        <div className="font-mono text-xs text-white/30 bg-black/30 rounded-lg p-4 overflow-x-auto">
          client_name, client_email, invoice_number, amount, due_date, status, notes
        </div>
        <p className="text-white/20 text-xs mt-3">
          Column names are flexible — we auto-detect common variations like "client", "customer", "total", etc.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
          {error}
        </div>
      )}

      {/* Import button */}
      {file && !result && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleImport}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-semibold rounded-xl transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Importing...' : `Import ${file.name}`}
          </button>
          <button
            onClick={() => { setFile(null); setError(null); }}
            className="px-6 py-3 border border-white/10 text-white/60 hover:text-white hover:border-white/20 rounded-xl transition-all"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-lg font-semibold text-emerald-400">Import Complete</h3>
            </div>
            <p className="text-white/60">
              <strong className="text-white">{result.imported}</strong> invoice{result.imported !== 1 ? 's' : ''} imported
              {result.skipped > 0 && (
                <span> · <strong className="text-amber-400">{result.skipped}</strong> skipped</span>
              )}
            </p>
          </div>

          {result.errors.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <h4 className="text-sm font-medium text-amber-400 mb-2">Skipped rows:</h4>
              <ul className="text-sm text-white/40 space-y-1">
                {result.errors.map((err, i) => (
                  <li key={i}>• {err}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => router.push('/app')}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all"
          >
            ← Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
