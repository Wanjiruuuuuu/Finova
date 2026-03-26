import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Shield, Zap, BarChart3, TrendingUp, Play, Check, Github, Linkedin, Mail, Phone, Star, MessageCircle, ChevronRight } from "lucide-react";
import { FinovaLogo } from "@/components/FinovaLogo";

const typingPhrases = ["your spending habits.", "your savings potential.", "your financial future.", "where every shilling goes."];

function useCountUp(target: number, duration = 2000, shouldStart: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!shouldStart) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, shouldStart]);
  return count;
}

function HeroDashboardMock() {
  return (
    <div className="relative">
      <div className="absolute -inset-10 bg-primary/10 blur-3xl rounded-full" />
      <div className="glass-card w-full max-w-sm relative" style={{ transform: 'perspective(1000px) rotateY(-8deg) rotateX(3deg)', animation: 'float 6s ease-in-out infinite' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] text-muted-foreground">Total Balance</p>
            <p className="text-lg font-bold text-foreground animate-count-up">KES 352,270</p>
          </div>
          <div className="pill-badge bg-primary/10 text-primary text-[10px]">
            <TrendingUp className="w-3 h-3" /> +8.2%
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="rounded-lg bg-secondary/50 p-2">
            <p className="text-[9px] text-muted-foreground">Income</p>
            <p className="text-xs font-bold text-primary">+230K</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-2">
            <p className="text-[9px] text-muted-foreground">Expenses</p>
            <p className="text-xs font-bold text-expense">-85K</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-2">
            <p className="text-[9px] text-muted-foreground">Savings</p>
            <p className="text-xs font-bold text-foreground">145K</p>
          </div>
        </div>
        <div className="flex gap-1 mb-4">
          {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm" style={{ height: h * 0.5, background: i > 8 ? '#4edea3' : 'rgba(78,222,163,0.2)' }} />
          ))}
        </div>
        <div className="space-y-2">
          {[
            { name: "Naivas Supermarket", amount: "-3,450", color: "text-expense" },
            { name: "Salary - March", amount: "+185,000", color: "text-primary" },
            { name: "Uber Ride", amount: "-1,200", color: "text-expense" },
          ].map(tx => (
            <div key={tx.name} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{tx.name}</span>
              <span className={`font-bold ${tx.color}`}>{tx.amount}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg bg-primary/5 border border-primary/20 p-2">
          <div className="flex items-center gap-1 text-[10px] text-primary font-semibold">
            <Brain className="w-3 h-3" /> AI Insight
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">Spending score: 78/100 — Top 12%</p>
        </div>
      </div>
    </div>
  );
}

function AnimatedFeatureMock({ type }: { type: string }) {
  if (type === "spending") {
    const bars = [
      { label: "Housing", pct: 70, color: "#4edea3" },
      { label: "Food", pct: 55, color: "#F97316" },
      { label: "Transport", pct: 30, color: "#3B82F6" },
      { label: "Entertainment", pct: 20, color: "#8B5CF6" },
    ];
    return (
      <div className="glass-card space-y-3">
        {bars.map(b => (
          <div key={b.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">{b.label}</span>
              <span className="text-foreground font-semibold">{b.pct}%</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-bar-fill"
                style={{ background: b.color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${b.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (type === "ai") {
    return (
      <div className="glass-card flex items-center gap-4">
        <svg width="80" height="80" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(217,19%,17%)" strokeWidth="6" />
          <motion.circle
            cx="50" cy="50" r="40" fill="none" stroke="#4edea3" strokeWidth="6"
            strokeDasharray="251" strokeLinecap="round"
            initial={{ strokeDashoffset: 251 }}
            whileInView={{ strokeDashoffset: 251 - (251 * 84 / 100) }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            transform="rotate(-90 50 50)"
          />
          <text x="50" y="54" textAnchor="middle" className="fill-foreground" style={{ fontSize: 20, fontWeight: 700 }}>84</text>
        </svg>
        <div>
          <p className="text-xs text-primary font-semibold">The Strategic Minimalist</p>
          <p className="text-[10px] text-muted-foreground mt-1">Prioritizes essentials while investing wisely</p>
        </div>
      </div>
    );
  }
  if (type === "budget") {
    const items = [
      { label: "Housing", pct: 65, cls: "progress-bar-fill-primary" },
      { label: "Food & Dining", pct: 82, cls: "progress-bar-fill-warning" },
      { label: "Entertainment", pct: 105, cls: "progress-bar-fill-danger" },
    ];
    return (
      <div className="glass-card space-y-3">
        {items.map(b => (
          <div key={b.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">{b.label}</span>
              <span className={b.pct >= 100 ? "text-expense" : b.pct >= 75 ? "text-warning" : "text-primary"}>{b.pct}%</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className={b.cls}
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.min(b.pct, 100)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
  // reports
  return (
    <div className="glass-card text-xs">
      <table className="w-full">
        <thead><tr className="text-muted-foreground text-[10px]"><th className="text-left py-1">Month</th><th className="text-right py-1">Income</th><th className="text-right py-1">Expenses</th><th className="text-right py-1">Eff.</th></tr></thead>
        <tbody>
          {[{ m: "Mar", i: "230K", e: "85K", eff: "63%" }, { m: "Feb", i: "207K", e: "86K", eff: "58%" }, { m: "Jan", i: "185K", e: "78K", eff: "58%" }].map(r => (
            <tr key={r.m} className="border-t border-border/30">
              <td className="py-1.5 text-foreground font-medium">{r.m}</td>
              <td className="py-1.5 text-right text-primary">{r.i}</td>
              <td className="py-1.5 text-right text-muted-foreground">{r.e}</td>
              <td className="py-1.5 text-right"><span className="pill-badge bg-primary/10 text-primary text-[9px]">{r.eff}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Landing() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const phrase = typingPhrases[phraseIndex];
    if (typing) {
      if (displayed.length < phrase.length) {
        const timer = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length + 1)), 60);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => setTyping(false), 2000);
        return () => clearTimeout(timer);
      }
    } else {
      if (displayed.length > 0) {
        const timer = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
        return () => clearTimeout(timer);
      } else {
        setPhraseIndex((phraseIndex + 1) % typingPhrases.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, phraseIndex]);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setStatsVisible(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const stat1 = useCountUp(10000, 2000, statsVisible);
  const stat2 = useCountUp(65, 1500, statsVisible);
  const stat3 = useCountUp(3, 1000, statsVisible);

  const features = [
    {
      title: "See your whole financial picture at a glance.",
      body: "Every transaction, every category, every trend in one beautiful view. No more opening five apps.",
      mockType: "spending",
      reverse: false,
    },
    {
      title: "An AI advisor that actually reads your data.",
      body: "Gemini analyses your real transactions and gives you a personalized spending score, persona archetype, and 3 actionable tips.",
      mockType: "ai",
      reverse: true,
    },
    {
      title: "Set budgets. Get warned before you overspend.",
      body: "Category-level budget limits with color-coded alerts. Safe is teal. Caution is amber. Critical is coral.",
      mockType: "budget",
      reverse: false,
    },
    {
      title: "Download your finances as a professional report.",
      body: "One-click PDF and CSV export. Monthly summaries, efficiency ratings, and top spending categories.",
      mockType: "reports",
      reverse: true,
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#0b1326' }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl" style={{ background: 'rgba(11,19,38,0.8)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FinovaLogo size={24} />
            <span className="text-lg font-bold text-primary">Finova</span>
            <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground hidden md:block ml-1">Your Digital Ledger</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#advisors" className="hover:text-foreground transition-colors">Advisors</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="btn-ghost text-sm hidden sm:block">Log In</Link>
            <Link to="/auth" className="btn-primary text-sm rounded-xl animate-pulse-glow">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center pt-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 pill-badge bg-primary/10 text-primary mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
              Now powered by Gemini AI
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground leading-[0.95] tracking-tight">
              Finally know where<br />
              your money<br />
              <span className="text-primary">goes.</span>
            </h1>
            <div className="h-8 mt-4">
              <p className="text-lg md:text-xl text-muted-foreground font-light">
                {displayed}<span className="animate-pulse text-primary">|</span>
              </p>
            </div>
            <p className="text-base text-muted-foreground mt-6 max-w-[420px] leading-relaxed">
              Finova combines intelligent tracking with AI analysis to give you complete visibility into your finances. Built for people who take money seriously.
            </p>
            <div className="flex gap-3 mt-10">
              <Link to="/auth" className="btn-primary flex items-center gap-2 text-base px-6 py-3">
                Get Started — It's Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/demo/dashboard" className="btn-ghost flex items-center gap-2">
                <Play className="w-4 h-4" /> See How It Works
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 mt-8 text-xs text-muted-foreground">
              <span>🔒 Bank-grade security</span>
              <span>✅ No credit card needed</span>
              <span>🇰🇪 Made in Nairobi</span>
            </div>
          </motion.div>

          <motion.div
            className="hidden lg:flex justify-end"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <HeroDashboardMock />
          </motion.div>
        </div>
      </section>

      {/* Ticker */}
      <div className="border-y border-border/50 py-4 overflow-hidden">
        <div className="animate-ticker flex whitespace-nowrap">
          {[...Array(2)].map((_, rep) => (
            <div key={rep} className="flex items-center gap-24 px-12 text-sm text-muted-foreground">
              <span>🇰🇪 <strong className="text-foreground">Made in Nairobi</strong></span>
              <span>🔒 <strong className="text-foreground">Bank-grade</strong> security</span>
              <span>📱 <strong className="text-foreground">Mobile-first</strong> design</span>
              <span>💯 <strong className="text-foreground">100% Free</strong></span>
              <span>📊 <strong className="text-foreground">10K+</strong> transactions tracked</span>
              <span>🧠 <strong className="text-foreground">AI-Powered</strong> by Gemini</span>
              <span>⚡ <strong className="text-foreground">Real-time</strong> updates</span>
              <span>📄 <strong className="text-foreground">PDF Reports</strong></span>
            </div>
          ))}
        </div>
      </div>

      {/* Problem */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
            Most people have no idea<br />
            where their money<br />
            <span className="text-primary">actually goes.</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-light mt-6 max-w-2xl mx-auto">
            Not because they're bad with money. Because no one has ever shown them clearly. <strong className="text-foreground">Finova changes that.</strong>
          </p>
        </div>
      </section>

      {/* Stats */}
      <div ref={statsRef} className="py-16 px-6 border-y border-border/50">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl md:text-4xl font-black text-primary">{stat1 >= 10000 ? "10K+" : stat1.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Transactions tracked</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-primary">{stat2}%</p>
            <p className="text-xs text-muted-foreground mt-1">Average savings rate</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-primary">{stat3} sec</p>
            <p className="text-xs text-muted-foreground mt-1">To get AI insights</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-primary">100%</p>
            <p className="text-xs text-muted-foreground mt-1">Free forever</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="section-eyebrow">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Everything you need to master your money</h2>
          </div>
          <div className="space-y-20">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${f.reverse ? "lg:direction-rtl" : ""}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className={f.reverse ? "lg:order-2 lg:text-left" : ""} style={{ direction: 'ltr' }}>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground leading-snug">{f.title}</h3>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-md">{f.body}</p>
                </div>
                <div className={f.reverse ? "lg:order-1" : ""} style={{ direction: 'ltr' }}>
                  <AnimatedFeatureMock type={f.mockType} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 px-6 border-y border-border/50" style={{ background: '#060e20' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">How It Works</h2>
          <div className="w-12 h-0.5 bg-primary mx-auto mb-16" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 border-t-2 border-dashed border-border/50" />
            {[
              { step: "01", icon: "👤", title: "Sign up in 30 seconds", desc: "No credit card. No commitment. Your email and you're in." },
              { step: "02", icon: "📝", title: "Add your transactions", desc: "Type them in manually. Our AI categorizes and analyzes instantly." },
              { step: "03", icon: "✨", title: "Watch Finova do the rest", desc: "Charts build. AI speaks. You finally understand your money." },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                className="text-center relative z-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl mx-auto mb-4">{s.icon}</div>
                <p className="text-xs text-primary font-bold tracking-widest mb-2">STEP {s.step}</p>
                <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Spotlight */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/[0.08] blur-3xl rounded-full" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight leading-tight">
            What if someone smart was always watching your finances —{" "}
            <em className="text-primary">and actually cared?</em>
          </h2>
          <div className="glass-card max-w-xl mx-auto mt-10 border-primary/20 text-left">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-primary">Gemini Reflective Prompt</span>
            </div>
            <p className="text-lg text-foreground italic leading-relaxed">
              "If your spending this month was a mirror, does it reflect the version of yourself you want to be in five years?"
            </p>
          </div>
        </div>
      </section>

      {/* Advisors Teaser */}
      <section id="advisors" className="py-24 px-6" style={{ background: '#060e20' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground">Connect with a Certified Financial Advisor</h2>
          <p className="text-sm text-muted-foreground mt-2">Real humans. Real expertise. When AI isn't enough.</p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="flex -space-x-3">
              {["7c3aed", "2563eb", "dc2626", "ea580c"].map((c, i) => (
                <img key={i} src={`https://ui-avatars.com/api/?name=A+${i}&background=${c}&color=fff&size=40&rounded=true`} className="w-10 h-10 rounded-full border-2 border-background" alt="" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">8 advisors available</span>
          </div>
          <div className="flex gap-3 justify-center mt-6">
            <Link to="/demo/advisors" className="btn-ghost flex items-center gap-2">Meet the Advisors</Link>
            <Link to="/auth" className="btn-primary flex items-center gap-2">Upgrade to Pro</Link>
          </div>
          <p className="text-xs text-primary font-medium mt-3">Available on Pro Plan</p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground">Simple, honest pricing.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <motion.div className="glass-card flex flex-col" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h3 className="text-lg font-bold text-foreground">Free</h3>
              <div className="mt-2 mb-6">
                <span className="text-3xl font-bold text-foreground">KES 0</span>
                <span className="text-sm text-muted-foreground ml-1">/month</span>
              </div>
              <ul className="space-y-2.5 mb-8 flex-1">
                {["Unlimited transaction tracking", "Dashboard with all charts", "5 budget categories", "3 AI insights refreshes/day", "PDF and CSV reports", "Basic notifications"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/auth" className="btn-ghost text-center">Get Started Free</Link>
            </motion.div>
            {/* Pro */}
            <motion.div className="glass-card flex flex-col border-primary/40 ring-1 ring-primary/20 relative" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="pill-badge bg-primary text-primary-foreground text-[10px] font-bold">MOST POPULAR</span>
              </div>
              <h3 className="text-lg font-bold text-foreground">Pro</h3>
              <div className="mt-2 mb-1">
                <span className="text-3xl font-bold text-foreground">KES 499</span>
                <span className="text-sm text-muted-foreground ml-1">/month</span>
              </div>
              <p className="text-xs text-muted-foreground mb-6">or KES 4,990/year (save 2 months)</p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {["Everything in Free", "Unlimited budget categories", "Unlimited AI insights", "1 advisor session per month", "Advanced quarterly reports", "Financial goal milestones", "Priority AI analysis"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/auth" className="btn-primary text-center">Start 7-Day Free Trial</Link>
              <p className="text-[10px] text-muted-foreground text-center mt-2">No credit card for trial</p>
            </motion.div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-8">
            Built by Rachel Maina · Nairobi, Kenya — Finova is free because financial clarity should be accessible to everyone.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 border-y border-border/50" style={{ background: 'rgba(78,222,163,0.05)' }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Your financial clarity is one click away.</h2>
          <Link to="/auth" className="btn-ghost border-primary/30 text-primary flex items-center gap-2 group whitespace-nowrap">
            Start for free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-6" style={{ background: '#0b1326' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <FinovaLogo size={20} />
                <span className="text-lg font-bold text-primary">Finova</span>
              </div>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground mt-0.5">Your Digital Ledger</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Designed and built by <strong className="text-foreground">Rachel Maina</strong>
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/Wanjiruuuuuu" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors"><Github className="w-5 h-5" /></a>
              <a href="https://linkedin.com/in/rachelmaina" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="mailto:rachelwanjiru037@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors"><Mail className="w-5 h-5" /></a>
              <a href="https://wa.me/254728437261" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors"><MessageCircle className="w-5 h-5" /></a>
            </div>
          </div>
          <div className="border-t border-border/50 pt-6 text-center">
            <p className="text-xs text-muted-foreground">© 2025 Finova — Your Digital Ledger. Built by Rachel Maina · Nairobi, Kenya 🇰🇪</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
