export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top nav */}
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            RemindFlow
          </a>
          <div className="flex items-center gap-2">
            <a
              href="/app"
              className="px-3 py-2 text-slate-400 hover:text-white text-sm transition"
            >
              Dashboard
            </a>
            <a
              href="/app/invoices/new"
              className="px-3 py-2 text-slate-400 hover:text-white text-sm transition"
            >
              + New
            </a>
            <a
              href="/app/invoices/import"
              className="px-3 py-2 text-slate-400 hover:text-white text-sm transition"
            >
              Import CSV
            </a>
            <a
              href="/app/billing"
              className="px-3 py-2 text-slate-400 hover:text-white text-sm transition"
            >
              Billing
            </a>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="px-3 py-2 text-slate-400 hover:text-white text-sm transition"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
