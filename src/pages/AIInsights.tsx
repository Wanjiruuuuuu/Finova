import { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Eye, Lightbulb, Sparkles } from "lucide-react";
import { mockInsights } from "@/data/mockData";
import { useIsDemo } from "@/contexts/DemoContext";
import { useInsights } from "@/hooks/useFinanceData";

export default function AIInsights() {
  const [refreshKey, setRefreshKey] = useState(0);
  const isDemo = useIsDemo();

  const { data: realInsights, isLoading: realLoading, refetch } = useInsights();
  
  const loading = !isDemo && realLoading;
  const insights = isDemo ? mockInsights : (realInsights || mockInsights);

  const handleRefresh = () => {
    if (isDemo) {
      // Fake loading for demo
      setRefreshKey(k => k + 1);
      return;
    }
    refetch();
  };

  const scoreOffset = 553 - (553 * insights.spendingScore / 100);

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
                  <circle
                    cx="100" cy="100" r="88" fill="none" stroke="#4edea3" strokeWidth="8"
                    strokeDasharray="553" strokeDashoffset={scoreOffset}
                    strokeLinecap="round" transform="rotate(-90 100 100)"
                    className="animate-score-circle"
                    style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                  />
                  <text x="100" y="92" textAnchor="middle" className="fill-foreground text-4xl font-bold" style={{ fontSize: 42 }}>
                    {insights.spendingScore}
                  </text>
                  <text x="100" y="118" textAnchor="middle" className="fill-muted-foreground text-xs font-semibold tracking-widest" style={{ fontSize: 11 }}>
                    SCORE
                  </text>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-2">Spending Score</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{insights.summary}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="pill-badge bg-primary/10 text-primary">Top 12%</span>
                  <span className="pill-badge bg-secondary text-muted-foreground">Disciplined</span>
                  <span className="pill-badge bg-secondary text-muted-foreground">Growing</span>
                </div>
              </div>
            </motion.div>

            <motion.div className="glass-card border-l-4 border-l-primary" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <p className="section-eyebrow">Persona Archetype</p>
              <h3 className="text-xl font-bold text-foreground mt-1">{insights.personaArchetype}</h3>
              <p className="text-sm text-muted-foreground italic mt-2">"{insights.personaDescription}"</p>
              <div className="flex items-center gap-2 mt-4 text-xs text-primary font-semibold">
                <Sparkles className="w-4 h-4" /> Elite Tier Insights
              </div>
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

            <motion.div
              className="rounded-xl p-6 border border-primary/20"
              style={{ background: 'linear-gradient(135deg, #131b2e, #2d3449)' }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-primary">Gemini Reflective Prompt</span>
              </div>
              <p className="text-lg text-foreground italic leading-relaxed">"{insights.reflectivePrompt}"</p>
              <div className="flex gap-4 mt-4">
                <button className="text-xs font-semibold text-primary hover:underline">Write Reflection</button>
                <button className="text-xs font-semibold text-muted-foreground hover:underline">Dismiss</button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
