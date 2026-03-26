import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Eye, Lightbulb, Sparkles, Brain, Users, ChevronRight } from "lucide-react";
import { mockInsights } from "@/data/mockData";
import { useIsDemo } from "@/contexts/DemoContext";
import { useInsights, useTransactions } from "@/hooks/useFinanceData";
import { Link, useLocation } from "react-router-dom";
import { FinovaLogo } from "@/components/FinovaLogo";

const emptyStateContent = [
  { icon: "📊", text: "Did you know? The average Kenyan spends 45% of their income on food and transport combined. Add your transactions to see how you compare." },
  { icon: "💡", text: "The 50/30/20 rule: 50% needs, 30% wants, 20% savings. Finova can tell you which category you're in." },
  { icon: "📈", text: "Compound interest on savings of KES 5,000/month at 8% annual return = KES 900,000 in 10 years." },
  { icon: "😄", text: "Why did the banker switch careers? He lost interest. (Add your first transaction to get started!)" },
  { icon: "💪", text: "What do you call a financial advisor who works out? A hedge fund manager. (Your insights are waiting...)" },
  { icon: "🍞", text: "Why is money called dough? Because we all knead it. (Track it here!)" },
  { icon: "💬", text: "'A budget is telling your money where to go instead of wondering where it went.' — Dave Ramsey" },
  { icon: "🌟", text: "'Financial freedom is available to those who learn about it and work for it.' Start today." },
  { icon: "💰", text: "'It's not your salary that makes you rich, it's your spending habits.' Add your first transaction." },
];

export default function AIInsights() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [emptyIdx, setEmptyIdx] = useState(0);
  const isDemo = useIsDemo();
  const location = useLocation();
  const prefix = location.pathname.startsWith("/demo") ? "/demo" : "";

  const { data: realInsights, isLoading: realLoading, refetch, isFetching } = useInsights();
  const { data: realTransactions } = useTransactions();

  const transactions = isDemo ? [] : (realTransactions || []);
  const hasNoData = !isDemo && transactions.length === 0;

  const loading = !isDemo && (realLoading || isFetching);
  const insights = isDemo ? mockInsights : (realInsights || mockInsights);

  // Rotate empty state content
  useEffect(() => {
    if (!hasNoData) return;
    const interval = setInterval(() => setEmptyIdx(i => (i + 1) % emptyStateContent.length), 8000);
    return () => clearInterval(interval);
  }, [hasNoData]);

  const handleRefresh = () => {
    if (isDemo) {
      setRefreshKey(k => k + 1);
      return;
    }
    refetch();
  };

  const scoreOffset = 553 - (553 * insights.spendingScore / 100);

  // Empty state for users with no transactions
  if (hasNoData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <FinovaLogo size={48} className="animate-pulse mb-6" />
        <div className="glass-card max-w-md w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={emptyIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-center py-4"
            >
              <span className="text-3xl mb-3 block">{emptyStateContent[emptyIdx].icon}</span>
              <p className="text-sm text-muted-foreground leading-relaxed">{emptyStateContent[emptyIdx].text}</p>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-1 mt-4">
            {emptyStateContent.map((_, i) => (
              <span key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === emptyIdx ? "bg-primary" : "bg-border"}`} />
            ))}
          </div>
        </div>
        <Link to={`${prefix}/transactions`} className="btn-primary mt-6 flex items-center gap-2">
          Add Your First Transaction <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="section-eyebrow">Intelligence Suite</p>
          <h1 className="text-2xl font-bold text-foreground">AI Insights</h1>
        </div>
        <button onClick={handleRefresh} className="btn-primary flex items-center gap-2 self-start">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Analysis
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className={`glass-card animate-pulse ${i <= 2 ? "xl:col-span-2" : ""}`}>
              <div className="h-4 bg-secondary rounded w-1/3 mb-3" />
              <div className="h-20 bg-secondary rounded" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <motion.div className="glass-card xl:col-span-2 flex flex-col sm:flex-row items-center gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="relative">
                <svg width="160" height="160" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="88" fill="none" stroke="hsl(217,19%,17%)" strokeWidth="8" />
                  <circle cx="100" cy="100" r="88" fill="none" stroke="#4edea3" strokeWidth="8" strokeDasharray="553" strokeDashoffset={scoreOffset} strokeLinecap="round" transform="rotate(-90 100 100)" className="animate-score-circle" style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
                  <text x="100" y="92" textAnchor="middle" className="fill-foreground text-4xl font-bold" style={{ fontSize: 42 }}>{insights.spendingScore}</text>
                  <text x="100" y="118" textAnchor="middle" className="fill-muted-foreground text-xs font-semibold tracking-widest" style={{ fontSize: 11 }}>SCORE</text>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-2">Spending Score</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{insights.summary}</p>
              </div>
            </motion.div>
            <motion.div className="glass-card border-l-4 border-l-primary" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <p className="section-eyebrow">Persona Archetype</p>
              <h3 className="text-xl font-bold text-foreground mt-1">{insights.personaArchetype}</h3>
              <p className="text-sm text-muted-foreground italic mt-2">"{insights.personaDescription}"</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Key Observations</h3>
              </div>
              <div className="space-y-3">
                {insights.observations.map((obs: string, i: number) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-xs font-bold text-primary mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                    <p className="text-sm text-muted-foreground leading-relaxed">{obs}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Saving Tips</h3>
              </div>
              <div className="grid gap-3">
                {insights.tips.map((tip: string, i: number) => (
                  <div key={i} className="rounded-lg bg-secondary/50 p-3">
                    <p className="text-sm text-foreground font-medium">{tip}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <p className="section-eyebrow">Predicted End-of-Month</p>
              <p className="text-3xl font-bold text-primary mt-2">KES {insights.predictedBalance.toLocaleString()}</p>
              <div className="flex gap-1 mt-3">
                {[60, 75, 90, 85, 95, 88, 92].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm" style={{ height: h * 0.4, background: '#4edea3', opacity: 0.3 + (i * 0.1) }} />
                ))}
              </div>
            </motion.div>
            <motion.div className="rounded-xl p-6 border border-primary/20" style={{ background: 'linear-gradient(135deg, #131b2e, #2d3449)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-primary">Gemini Reflective Prompt</span>
              </div>
              <p className="text-lg text-foreground italic leading-relaxed">"{insights.reflectivePrompt}"</p>
            </motion.div>
          </div>

          {/* Advisor teaser */}
          <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-foreground">Want a human perspective on your finances?</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex -space-x-2">
                    {["7c3aed", "2563eb", "dc2626"].map((c, i) => (
                      <img key={i} src={`https://ui-avatars.com/api/?name=A+${i}&background=${c}&color=fff&size=32&rounded=true`} className="w-8 h-8 rounded-full border-2 border-background" alt="" />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">8 certified advisors available</span>
                </div>
              </div>
              <Link to={`${prefix}/advisors`} className="btn-ghost text-xs flex items-center gap-1">
                Meet the Advisors <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
