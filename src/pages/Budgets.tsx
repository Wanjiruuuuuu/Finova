import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Plus } from "lucide-react";
import { mockBudgets, categoryIcons, categories } from "@/data/mockData";
import { useIsDemo } from "@/contexts/DemoContext";
import { useBudgets, useAddBudget, useTransactions } from "@/hooks/useFinanceData";
import { toast } from "sonner";

export default function Budgets() {
  const isDemo = useIsDemo();
  const { data: realBudgets } = useBudgets();
  const { data: realTransactions } = useTransactions();
  const addBudget = useAddBudget();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newCategory, setNewCategory] = useState(categories[0]);
  const [newLimit, setNewLimit] = useState("");

  const transactions = isDemo ? [] : (realTransactions || []);

  const budgets = isDemo ? mockBudgets : (realBudgets || []).map(b => {
    const spent = transactions.filter(t => t.type === "expense" && t.category === b.category).reduce((a, t) => a + Number(t.amount), 0);
    return { ...b, spent, limit: Number(b.limit) };
  });

  const totalSpent = budgets.reduce((a, b) => a + (b.spent || 0), 0);
  const totalLimit = budgets.reduce((a, b) => a + Number(b.limit), 0);
  const remaining = totalLimit - totalSpent;
  const daysRemaining = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate();

  const alerts = budgets.filter(b => b.spent && (b.spent / Number(b.limit)) >= 0.8);

  const handleAddGoal = () => {
    if (!newLimit || isDemo) return;
    const currentMonth = new Date().toISOString().slice(0, 7);
    addBudget.mutate(
      { category: newCategory, limit: parseFloat(newLimit), month: currentMonth },
      {
        onSuccess: () => { toast.success("Budget goal added!"); setNewLimit(""); setShowAddGoal(false); },
        onError: (e) => toast.error(e.message),
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <motion.div className="glass-card xl:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="section-eyebrow">Monthly Budget Performance</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-foreground">KES {totalSpent.toLocaleString()}</span>
            <span className="text-lg text-muted-foreground">/ KES {totalLimit.toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Spent</p>
              <p className="text-sm font-bold text-foreground">KES {totalSpent.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Remaining</p>
              <p className="text-sm font-bold text-primary">KES {remaining.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Days Remaining</p>
              <p className="text-sm font-bold text-foreground">{daysRemaining}</p>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowAddGoal(!showAddGoal)} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Goal
            </button>
            <button className="btn-ghost">Edit Budget</button>
          </div>

          {showAddGoal && (
            <motion.div className="mt-4 flex gap-3" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <select className="input-dark flex-1" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input className="input-dark w-32" placeholder="Limit (KES)" type="number" value={newLimit} onChange={e => setNewLimit(e.target.value)} />
              <button className="btn-primary" onClick={handleAddGoal}>Save</button>
            </motion.div>
          )}
        </motion.div>

        <motion.div className="glass-card border border-expense/20" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-expense" />
            <h3 className="text-sm font-bold text-foreground">Active Alerts</h3>
          </div>
          {alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No budget alerts. You're on track!</p>
          ) : (
            <div className="space-y-3">
              {alerts.map(b => {
                const pct = Math.round(((b.spent || 0) / Number(b.limit)) * 100);
                return (
                  <div key={b.id} className="rounded-lg bg-expense/5 p-3 border border-expense/10">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-foreground">{b.category}</span>
                      <span className="text-expense font-bold">{pct}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      KES {(b.spent || 0).toLocaleString()} of KES {Number(b.limit).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {budgets.map((b, i) => {
          const pct = Math.round(((b.spent || 0) / Number(b.limit)) * 100);
          const status = pct >= 100 ? "critical" : pct >= 75 ? "caution" : "safe";
          const statusColor = status === "critical" ? "text-expense" : status === "caution" ? "text-warning" : "text-primary";
          const barClass = status === "critical" ? "progress-bar-fill-danger" : status === "caution" ? "progress-bar-fill-warning" : "progress-bar-fill-primary";
          const borderClass = status === "critical" ? "border-expense/20" : "";

          return (
            <motion.div
              key={b.id}
              className={`glass-card ${borderClass ? `border ${borderClass}` : ""}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                  status === "critical" ? "bg-expense/10" : status === "caution" ? "bg-warning/10" : "bg-primary/10"
                }`}>
                  {categoryIcons[b.category] || "📋"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{b.category}</p>
                  <p className={`text-lg font-bold ${statusColor}`}>{pct}%</p>
                </div>
              </div>
              <div className="progress-bar">
                <div className={barClass} style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>KES {(b.spent || 0).toLocaleString()} spent</span>
                <span>KES {Number(b.limit).toLocaleString()} limit</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
