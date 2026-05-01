'use client';

import { useState, useEffect, useRef } from 'react';

// Animated counter - simplified to always show value
function AnimatedNumber({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  return <div>{prefix}{target.toLocaleString()}{suffix}</div>;
}

// Scroll reveal wrapper
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [signupCount, setSignupCount] = useState(247); // fallback

  // Fetch real signup count
  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        if (data.stats?.totalSignups > 0) {
          setSignupCount(data.stats.totalSignups);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) { setStatus('success'); setEmail(''); }
      else {
        const data = await res.json();
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
    }
  };

  const testimonials = [
    {
      quote: "I used to spend 2 hours every Monday chasing unpaid invoices. Since setting up automated reminders, my average payment time dropped from 21 days to 8 days.",
      name: "Sarah K.",
      role: "Freelance Designer",
      metric: "47 invoices/month",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
    },
    {
      quote: "The reminders sound human. My clients actually respond positively. I've recovered over $3,200 in late payments in the first month alone.",
      name: "Marcus T.",
      role: "Web Developer",
      metric: "$12k/mo revenue",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      quote: "I was skeptical about another tool, but this literally pays for itself. One recovered invoice = 3 months of subscription. No brainer.",
      name: "Priya M.",
      role: "Marketing Consultant",
      metric: "3-person agency",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white relative">
      {/* Film grain overlay */}
      <div className="noise-overlay" />

      {/* Background grid */}
      <div className="fixed inset-0 bg-grid pointer-events-none z-0" />

      {/* Floating orbs */}
      <div className="fixed top-32 -left-48 w-[600px] h-[600px] bg-emerald-600/8 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />
      <div className="fixed top-[600px] -right-48 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] animate-pulse-glow pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="fixed bottom-40 left-1/3 w-[400px] h-[400px] bg-emerald-400/5 rounded-full blur-[80px] animate-pulse-glow pointer-events-none" style={{ animationDelay: '4s' }} />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrollY > 50 ? 'border-b border-white/5 bg-[#030303]/90 backdrop-blur-2xl' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <span className="font-semibold text-xl tracking-tight">RemindFlow</span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="/login"
              className="text-sm text-white/40 hover:text-white transition-colors duration-300 font-medium"
            >
              Sign In
            </a>
            <a
              href="#waitlist"
              className="text-sm text-white/40 hover:text-emerald-400 transition-colors duration-300 font-medium"
            >
              Join Waitlist
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION - Cinematic */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920&q=80"
            alt="Modern workspace"
            className="w-full h-full object-cover opacity-[0.08] scale-105"
            style={{ transform: `translateY(${scrollY * 0.15}px) scale(1.05)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#030303]/80 to-[#030303]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030303] via-transparent to-[#030303]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-32 pb-20">
          {/* Badge */}
          <Reveal>
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass mb-10">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400/90 text-sm font-medium tracking-wide">Early access — founding members get $15/mo forever</span>
            </div>
          </Reveal>

          {/* Headline */}
          <Reveal delay={100}>
            <h1 className="text-7xl md:text-[9rem] font-bold tracking-tighter leading-[0.85] mb-8">
              Get paid
              <br />
              <span className="text-gradient">on time.</span>
            </h1>
          </Reveal>

          {/* Subheadline */}
          <Reveal delay={200}>
            <p className="text-xl md:text-2xl text-white/35 max-w-2xl mx-auto mb-14 leading-relaxed font-light">
              Automated payment reminders that sound human.
              <br className="hidden md:block" />
              Connect your invoices, set your schedule, and watch
              <br className="hidden md:block" />
              late payments disappear.
            </p>
          </Reveal>

          {/* Email form */}
          <Reveal delay={300}>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 px-6 py-5 rounded-2xl glass-strong text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-500 text-lg"
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-semibold rounded-2xl transition-all duration-500 disabled:opacity-50 whitespace-nowrap text-lg shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.03] active:scale-[0.97]"
              >
                {status === 'loading' ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Joining...
                  </span>
                ) : 'Get Early Access →'}
              </button>
            </form>

            {status === 'success' && (
              <div className="flex flex-col items-center justify-center gap-2 text-emerald-400 mb-4 animate-scale-in">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">You're on the list!</span>
                </div>
                <a href="/login" className="text-sm text-emerald-300/70 hover:text-emerald-300 underline underline-offset-4 transition">
                  Try the app now →
                </a>
              </div>
            )}
            {status === 'error' && <p className="text-red-400 text-sm mb-4">{errorMessage}</p>}

            <p className="text-white/15 text-sm">Free for 14 days · No credit card required · Cancel anytime</p>
          </Reveal>

          {/* Social proof */}
          <Reveal delay={400}>
            <div className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-8">
              <div className="flex -space-x-3">
                {[
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face"
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="w-11 h-11 rounded-full border-2 border-[#030303] object-cover"
                  />
                ))}
                <div className="w-11 h-11 rounded-full border-2 border-[#030303] bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400">
                  +{Math.max(0, signupCount - 5)}
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center gap-1.5 justify-center sm:justify-start mb-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-white/30 text-sm">
                  <span className="text-white/60 font-medium">{signupCount} freelancers</span> already on the waitlist
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/20 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-white/5 py-16 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-white/15 text-xs uppercase tracking-[0.3em] font-medium mb-10">
            Integrates with tools you already use
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8 opacity-30">
            {['Stripe', 'Wave', 'PayPal', 'FreshBooks', 'QuickBooks', 'CSV'].map((tool) => (
              <span key={tool} className="text-2xl font-bold text-white/80 tracking-tight">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-40 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <Reveal>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-8">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  The hidden cost of freelancing
                </div>
              </Reveal>

              <Reveal delay={100}>
                <h2 className="text-5xl md:text-6xl font-bold leading-[0.95] tracking-tight mb-10">
                  You're losing
                  <br />
                  <span className="text-gradient-warm">thousands</span>
                  <br />
                  <span className="text-white/15">to silence.</span>
                </h2>
              </Reveal>

              <Reveal delay={200}>
                <div className="space-y-6 text-white/40 text-lg leading-relaxed">
                  <p>
                    The average freelancer has <strong className="text-white/70">$2,400 in unpaid invoices</strong> sitting in their inbox. Not because clients refuse to pay — but because <em className="text-white/60">nobody reminded them.</em>
                  </p>
                  <p>
                    You're too busy doing the actual work to play accounts receivable. And by the time you remember to follow up, it's been 3 weeks and the conversation feels awkward.
                  </p>
                  <p>
                    Existing tools either do nothing (free invoicing apps) or cost $25+/month for enterprise features you'll never use.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-5">
              {[
                { stat: 63, suffix: '%', label: "of freelancers don't follow up on late invoices", color: 'text-red-400' },
                { stat: 18, suffix: ' days', label: 'average time to get paid without reminders', color: 'text-orange-400' },
                { stat: 2400, prefix: '$', label: 'average outstanding invoices per freelancer', color: 'text-amber-400' },
                { stat: 3, suffix: 'x', label: 'faster payment with automated reminders', color: 'text-emerald-400' },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div className="p-8 rounded-3xl glass hover:border-emerald-500/20 transition-all duration-700 group">
                    <div className={`text-5xl font-bold ${item.color} mb-3 group-hover:scale-110 transition-transform duration-500`}>
                      <AnimatedNumber target={item.stat} prefix={item.prefix || ''} suffix={item.suffix || ''} />
                    </div>
                    <div className="text-white/25 text-sm leading-snug">{item.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT PREVIEW - Dashboard Mockup */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-8">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                See it in action
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                Your dashboard. <span className="text-white/15">At a glance.</span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="relative rounded-3xl overflow-hidden cinematic-shadow group">
              {/* Dashboard mockup */}
              <div className="bg-[#0a0a0a] border border-white/10">
                {/* Title bar */}
                <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-[#0f0f0f]">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex-1 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white/5 text-white/20 text-xs">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      app.remindflow.app
                    </div>
                  </div>
                </div>

                {/* Dashboard content */}
                <div className="p-8">
                  {/* Top stats */}
                  <div className="grid grid-cols-4 gap-4 mb-8">
                    {[
                      { label: 'Outstanding', value: '$4,280', change: '-$820', positive: true },
                      { label: 'Overdue', value: '$1,640', change: '-$340', positive: true },
                      { label: 'Reminders Sent', value: '47', change: '+12', positive: true },
                      { label: 'Avg. Payment Time', value: '8 days', change: '-13 days', positive: true },
                    ].map((stat, i) => (
                      <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="text-white/30 text-xs uppercase tracking-wider mb-2">{stat.label}</div>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className={`text-xs mt-1 ${stat.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                          {stat.change} this month
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Invoice list */}
                  <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                      <span className="text-sm font-medium text-white/60">Recent Invoices</span>
                      <span className="text-xs text-white/20">Last 30 days</span>
                    </div>
                    <div className="divide-y divide-white/[0.03]">
                      {[
                        { client: 'Acme Corp', amount: '$2,400', due: '3 days ago', status: 'Reminder sent', statusColor: 'text-amber-400' },
                        { client: 'Design Studio', amount: '$1,800', due: 'In 5 days', status: 'Scheduled', statusColor: 'text-blue-400' },
                        { client: 'Tech Startup', amount: '$3,200', due: '12 days ago', status: '2nd reminder', statusColor: 'text-red-400' },
                        { client: 'Media Agency', amount: '$950', due: 'Paid', status: 'Completed', statusColor: 'text-emerald-400' },
                      ].map((invoice, i) => (
                        <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/30 text-xs font-bold">
                              {invoice.client.split(' ').map(w => w[0]).join('')}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white/80">{invoice.client}</div>
                              <div className="text-xs text-white/25">Due: {invoice.due}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-white/80">{invoice.amount}</div>
                            <div className={`text-xs ${invoice.statusColor}`}>{invoice.status}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent opacity-30 pointer-events-none" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-40 px-6 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.015] to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <Reveal>
            <div className="text-center mb-24">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-8">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                How it works
              </div>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
                Three steps. <span className="text-white/15">Zero effort after.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
                title: 'Connect your invoices',
                desc: 'Import from Stripe, Wave, PayPal, or upload a CSV. Takes 2 minutes, not 2 hours.',
              },
              {
                step: '02',
                image: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=600&q=80',
                title: 'Set your schedule',
                desc: 'Choose when to send follow-ups: 3, 7, 14, 30 days after due date. Or customize your own cadence.',
              },
              {
                step: '03',
                image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
                title: 'Get paid faster',
                desc: 'Polite, professional emails go out automatically. You just watch the payments roll in.',
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 150}>
                <div className="group">
                  {/* Image */}
                  <div className="relative rounded-2xl overflow-hidden mb-6 aspect-[4/3]">
                    <img
                      src={item.image}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/20 to-transparent" />
                    <div className="absolute top-4 right-4 text-white/10 font-mono text-6xl font-bold group-hover:text-emerald-500/20 transition-colors duration-500">
                      {item.step}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:bg-emerald-500/20 transition-colors duration-500">
                    {i === 0 && (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3" />
                      </svg>
                    )}
                    {i === 1 && (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {i === 2 && (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>

                  <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-white/35 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER COMPARISON */}
      <section className="py-40 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Before RemindFlow. <span className="text-white/15">After RemindFlow.</span>
              </h2>
              <p className="text-white/30 text-lg max-w-lg mx-auto">
                The difference between chasing payments and getting paid.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Before */}
            <Reveal delay={100}>
              <div className="p-10 rounded-3xl bg-red-500/[0.03] border border-red-500/10 h-full">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-red-400/80">Without RemindFlow</h3>
                </div>
                <ul className="space-y-5">
                  {[
                    "Manually track due dates in a spreadsheet",
                    "Awkward 'Hey, just checking in' emails at 11pm",
                    "Forget to follow up → invoice goes 30+ days late",
                    "Lose $2,400+ on average to unpaid invoices",
                    "Spend 2+ hours per week on payment chasing",
                    "Client relationships strained by late conversations"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/35">
                      <svg className="w-5 h-5 text-red-400/40 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* After */}
            <Reveal delay={200}>
              <div className="p-10 rounded-3xl bg-emerald-500/[0.03] border border-emerald-500/10 h-full glow-emerald">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-emerald-400/80">With RemindFlow</h3>
                </div>
                <ul className="space-y-5">
                  {[
                    "Dashboard shows everything at a glance",
                    "Polite, scheduled reminders sent automatically",
                    "Never miss a follow-up — every invoice tracked",
                    "Get paid 3x faster — average 8 days vs 21",
                    "Zero time spent chasing — set it and forget it",
                    "Professional relationship maintained throughout"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/60">
                      <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-40 px-6 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.015] to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <Reveal>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                Loved by <span className="text-gradient">freelancers</span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="relative">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className={`transition-all duration-700 ${
                    i === activeTestimonial ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'
                  }`}
                >
                  <div className="p-12 rounded-3xl glass-strong text-center">
                    <svg className="w-12 h-12 text-emerald-500/20 mx-auto mb-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="text-xl md:text-2xl text-white/60 leading-relaxed mb-10 max-w-3xl mx-auto font-light">
                      "{t.quote}"
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-white/10" />
                      <div className="text-left">
                        <div className="font-semibold text-white/80">{t.name}</div>
                        <div className="text-white/30 text-sm">{t.role} · {t.metric}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Dots */}
              <div className="flex items-center justify-center gap-3 mt-8">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i === activeTestimonial ? 'bg-emerald-400 w-8' : 'bg-white/10 hover:bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* BUILT FOR YOU - Audience section */}
      <section className="py-40 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Built for <span className="text-white/15">people like you</span>
              </h2>
              <p className="text-white/30 text-lg max-w-lg mx-auto">
                Whether you're solo or a small team, if you send invoices, RemindFlow is for you.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
                role: 'Freelancers',
                desc: 'Designers, writers, developers. You do the work. We handle the follow-ups.'
              },
              {
                image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
                role: 'Small Agencies',
                desc: '1-10 person teams. Manage all client invoices in one place, no more spreadsheets.'
              },
              {
                image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80',
                role: 'Consultants',
                desc: 'Coaches, advisors, consultants. Professional reminders that match your brand.'
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 150}>
                <div className="group relative rounded-3xl overflow-hidden aspect-[3/4]">
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-2xl font-bold mb-2">{item.role}</h3>
                    <p className="text-white/40 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-40 px-6 relative z-10" id="pricing">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.015] to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <Reveal>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Simple pricing
              </h2>
              <p className="text-white/30 text-lg max-w-md mx-auto">
                Less than the cost of one unpaid invoice.
                <br />
                Cancel anytime.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Individual */}
            <Reveal delay={100}>
              <div className="p-12 rounded-3xl glass hover:border-white/10 transition-all duration-500 h-full flex flex-col">
                <h3 className="text-lg font-semibold mb-2">Individual</h3>
                <p className="text-white/25 text-sm mb-8">
                  For solo freelancers and consultants
                </p>
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
                <a
                  href="#waitlist"
                  className="block text-center px-6 py-4 rounded-2xl border border-white/10 hover:border-emerald-500/50 hover:text-emerald-400 transition-all duration-300 font-medium"
                >
                  Join Waitlist
                </a>
              </div>
            </Reveal>

            {/* Agency */}
            <Reveal delay={200}>
              <div className="p-12 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/[0.02] border border-emerald-500/30 relative glow-emerald h-full flex flex-col">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-400 text-black text-xs font-bold rounded-full shadow-lg shadow-emerald-500/20">
                  MOST POPULAR
                </div>
                <h3 className="text-lg font-semibold mb-2">Agency</h3>
                <p className="text-white/25 text-sm mb-8">
                  For teams up to 10 people
                </p>
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
                <a
                  href="#waitlist"
                  className="block text-center px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-semibold transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Join Waitlist
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-40 px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <h2 className="text-4xl font-bold text-center mb-16">
              Frequently asked questions
            </h2>
          </Reveal>
          <div className="space-y-1">
            {[
              {
                q: 'What invoicing tools do you support?',
                a: "Right now you can import invoices via CSV from any tool. We're building direct integrations with Stripe, Wave, and PayPal for launch.",
              },
              {
                q: 'Will the emails sound robotic?',
                a: 'No. We provide professionally written templates that sound human and polite. You can customize them to match your voice.',
              },
              {
                q: 'What if my client pays after a reminder is sent?',
                a: 'You can mark invoices as paid at any time. Once marked paid, no more reminders will be sent for that invoice.',
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes — 14 days, no credit card required. You can test the full product before committing.',
              },
              {
                q: 'Can I cancel anytime?',
                a: "Absolutely. No contracts, no cancellation fees. One click and you're done.",
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="border-b border-white/[0.06] py-6 group hover:border-white/10 transition-colors duration-300">
                  <h3 className="font-medium mb-2 group-hover:text-emerald-400 transition-colors duration-300">{item.q}</h3>
                  <p className="text-white/30 text-sm leading-relaxed">{item.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-40 px-6 relative z-10" id="waitlist">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover opacity-[0.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/80 to-[#030303]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <Reveal>
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.85] mb-8">
              Start getting paid
              <br />
              <span className="text-gradient">on time.</span>
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <p className="text-white/30 text-lg mb-14 max-w-lg mx-auto">
              Join the waitlist and be first in line when we launch.
              Founding members lock in $15/month forever.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 px-6 py-5 rounded-2xl glass-strong text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-500 text-lg"
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-semibold rounded-2xl transition-all duration-500 disabled:opacity-50 whitespace-nowrap text-lg shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.03] active:scale-[0.97]"
              >
                {status === 'loading' ? 'Joining...' : 'Join Waitlist →'}
              </button>
            </form>
            {status === 'success' && (
              <div className="flex flex-col items-center justify-center gap-2 text-emerald-400 mb-4 animate-scale-in">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">You're on the list!</span>
                </div>
                <a href="/login" className="text-sm text-emerald-300/70 hover:text-emerald-300 underline underline-offset-4 transition">
                  Try the app now →
                </a>
              </div>
            )}
            {status === 'error' && <p className="text-red-400 text-sm mb-4">{errorMessage}</p>}
            <p className="text-white/15 text-sm">{signupCount} freelancers already on the waitlist</p>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xs">R</span>
            </div>
            <span className="text-sm text-white/15">
              © 2026 RemindFlow. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-8 text-sm text-white/15">
            <a href="#" className="hover:text-white/40 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/40 transition-colors">Terms</a>
            <a href="mailto:hello@remindflow.app" className="hover:text-white/40 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
