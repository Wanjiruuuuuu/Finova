import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Brain, Shield, Zap, TrendingUp, ChevronRight, Check, Play, Github, Linkedin, Mail, Phone } from "lucide-react";

const typingPhrases = ["your spending habits.", "your savings potential.", "your financial future.", "where every shilling goes."];

function HeroDashboardMock() {
  return (
    <div className="glass-card w-full max-w-sm transform perspective-1000 rotate-y-[-8deg] rotate-x-[4deg] hover:rotate-y-[-2deg] hover:rotate-x-[1deg] transition-transform duration-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] text-muted-foreground">Total Balance</p>
          <p className="text-lg font-bold text-foreground animate-count-up">KES 352,270</p>
        </div>
        <div className="pill-badge bg-primary/10 text-primary text-[10px]">
          <TrendingUp className="w-3 h-3" /> +8.2%
        </div>
      </div>
      <div className="flex gap-1 mb-4">
        {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
          <div key={i} className="flex-1 rounded-sm" style={{ height: h * 0.5, background: i > 8 ? '#4edea3' : 'rgba(78,222,163,0.2)' }} />
        ))}
      </div>
      <div className="space-y-2">
        {[{ name: "Naivas Supermarket", amount: "-3,450", color: "text-expense" }, { name: "Salary - March", amount: "+185,000", color: "text-primary" }].map(tx => (
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
  );
}

const pricingPlans = [
  {
    name: "Free",
    price: "KES 0",
    period: "forever",
    desc: "Perfect for getting started",
    features: ["50 transactions/month", "Basic dashboard", "Manual CSV export", "1 budget category"],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "KES 499",
    period: "/month",
    desc: "For serious money managers",
    features: ["Unlimited transactions", "AI-powered insights", "PDF & CSV exports", "Unlimited budgets", "Priority support"],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Annual",
    price: "KES 3,999",
    period: "/year",
    desc: "Best value — save 33%",
    features: ["Everything in Pro", "Advanced analytics", "Custom reports", "API access", "Early feature access"],
    cta: "Go Annual",
    highlighted: false,
  },
];

export default function Landing() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

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

  const features = [
    { icon: BarChart3, title: "Smart Analytics", desc: "Real-time dashboards with spending breakdowns, trends, and category-level insights across all your accounts." },
    { icon: Brain, title: "AI-Powered Insights", desc: "Gemini AI analyzes your patterns, assigns a spending score, and offers personalized financial tips." },
    { icon: Shield, title: "Budget Guardian", desc: "Set category budgets with real-time alerts. Color-coded progress bars warn you before overspending." },
    { icon: Zap, title: "Instant Reports", desc: "Export branded PDF and CSV reports with monthly summaries, efficiency ratings, and top categories." },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#0b1326' }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-md" style={{ background: 'rgba(11,19,38,0.8)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary">Finova</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="btn-ghost text-sm hidden sm:block">Log In</Link>
            <Link to="/dashboard" className="btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-28 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 pill-badge bg-primary/10 text-primary mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
              Now powered by Gemini AI
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Finally know where your{" "}
              <span className="text-primary">money goes.</span>
            </h1>
            <div className="h-8 mt-3">
              <p className="text-lg text-muted-foreground">
                Understand {displayed}<span className="animate-pulse text-primary">|</span>
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-6 max-w-md leading-relaxed">
              Finova combines intelligent tracking with AI analysis to give you complete visibility into your finances. Built for Kenyans who take their money seriously.
            </p>
            <div className="flex gap-3 mt-10">
              <Link to="/dashboard" className="btn-primary flex items-center gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/demo/dashboard" className="btn-ghost flex items-center gap-2">
                <Play className="w-4 h-4" /> See How It Works
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="hidden lg:flex justify-end"
            initial={{ opacity: 0, x: 30, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
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
            <div key={rep} className="flex items-center gap-20 px-10 text-sm text-muted-foreground">
              <span>📊 <strong className="text-foreground">10K+</strong> transactions tracked</span>
              <span>🤖 <strong className="text-foreground">AI-Powered</strong> by Gemini</span>
              <span>🇰🇪 <strong className="text-foreground">Made in Nairobi</strong></span>
              <span>🔒 <strong className="text-foreground">Bank-grade</strong> security</span>
              <span>📱 <strong className="text-foreground">Mobile-first</strong> design</span>
              <span>💰 <strong className="text-foreground">100% Free</strong></span>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="section-eyebrow">Features</p>
            <h2 className="text-3xl font-bold text-foreground mt-2">Everything you need to master your money</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="glass-card-hover flex gap-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-28 px-6 border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-eyebrow">How It Works</p>
          <h2 className="text-3xl font-bold text-foreground mt-2 mb-16">Three steps to financial clarity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Track", desc: "Log your income and expenses with our intuitive interface" },
              { step: "02", title: "Analyze", desc: "AI processes your patterns and delivers actionable insights" },
              { step: "03", title: "Optimize", desc: "Follow personalized tips to improve your financial health" },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="text-4xl font-black text-primary/20 mb-3">{s.step}</div>
                <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-28 px-6 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-eyebrow">Pricing</p>
            <h2 className="text-3xl font-bold text-foreground mt-2">Simple, transparent pricing</h2>
            <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto">Start free and upgrade when you need advanced analytics and AI insights.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                className={`glass-card relative flex flex-col ${plan.highlighted ? "border-primary/40 ring-1 ring-primary/20" : ""}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="pill-badge bg-primary text-primary-foreground text-[10px] font-bold">Recommended</span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{plan.desc}</p>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/dashboard"
                  className={plan.highlighted ? "btn-primary text-center" : "btn-ghost text-center"}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-20 px-6 border-t border-border/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground">Ready to take control?</h2>
          <p className="text-sm text-muted-foreground mt-3">Join thousands of Kenyans already managing their finances with Finova.</p>
          <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2 mt-8">
            Get Started Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div>
              <h3 className="text-lg font-bold text-primary">Finova</h3>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">The Digital Ledger</p>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">AI-powered personal finance tracker built for Kenyans.</p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Product</h4>
              <div className="space-y-2">
                <a href="#features" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
                <a href="#pricing" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
                <Link to="/demo/dashboard" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Demo</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Connect</h4>
              <div className="space-y-2">
                <a href="https://www.linkedin.com/in/rachelmaina" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
                <a href="https://github.com/Wanjiruuuuuu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Github className="w-4 h-4" /> GitHub
                </a>
                <a href="mailto:rachelwajiru07@gmail.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="w-4 h-4" /> Email
                </a>
                <a href="tel:+254728437261" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Phone className="w-4 h-4" /> +254 728 437 261
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Legal</h4>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
          <div className="border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">© 2025 Finova — The Digital Ledger. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">Built by Rachel Maina · Nairobi, Kenya 🇰🇪</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
