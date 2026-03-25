import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Brain, Database } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { mockTransactions, mockBudgets, monthlyData, spendingByCategory, categoryIcons } from "@/data/mockData";
import { FAB } from "@/components/FAB";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { useIsDemo } from "@/contexts/DemoContext";
import { useTransactions, useBudgets, useAddTransaction, useSeedData } from "@/hooks/useFinanceData";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const isDemo = useIsDemo();
  
  const { data: realTransactions } = useTransactions();
  const { data: realBudgets } = useBudgets();
  const addTransaction = useAddTransaction();
  const seedData = useSeedData();

  const transactions = isDemo ? mockTransactions : (realTransactions || []);
  const budgets = isDemo ? mockBudgets : (realBudgets || []);

  const totalIncome = transactions.filter(t => t.type === "income").reduce((a, t) => a + Number(t.amount), 0);
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((a, t) => a + Number(t.amount), 0);
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;
  const recentTx = transactions.slice(0, 5);

  // Build spending by category from real data
  const spendingByCat = isDemo ? spendingByCategory : (() => {
    const catMap: Record<string, number> = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      catMap[t.category] = (catMap[t.category] || 0) + Number(t.amount);
    });
    const colors: Record<string, string> = {
      "Food & Dining": "#4edea3", Transport: "#60a5fa", Housing: "#f59e0b",
      Entertainment: "#a78bfa", Health: "#f87171", Shopping: "#fb923c",
      Education: "#34d399", Utilities: "#fbbf24", Investment: "#2dd4bf", Other: "#94a3b8",
    };
    return Object.entries(catMap).map(([name, value]) => ({ name, value, color: colors[name] || "#94a3b8" }));
  })();
  const totalSpending = spendingByCat.reduce((a, c) => a + c.value, 0);

  // Budget data for progress bars
  const budgetItems = isDemo ? mockBudgets : budgets.map(b => {
    const spent = transactions.filter(t => t.type === "expense" && t.category === b.category).reduce((a, t) => a + Number(t.amount), 0);
    return { ...b, spent, limit: Number(b.limit) };
  });

  const stats = [
    { label: "Total Balance", value: `KES ${balance.toLocaleString()}`, trend: "+8.2%", up: true, color: "text-foreground" },
    { label: "Monthly Income", value: `KES ${totalIncome.toLocaleString()}`, trend: "+12%", up: true, color: "text-primary" },
    { label: "Monthly Expenses", value: `KES ${totalExpenses.toLocaleString()}`, trend: "-12%", up: false, color: "text-expense" },
  ];

  const handleAddTransaction = (tx: { description: string; amount: number; category: string; type: "income" | "expense"; date: string }) => {
    if (isDemo) return;
    addTransaction.mutate(tx, {
      onSuccess: () => toast.success("Transaction added!"),
      onError: (e) => toast.error(e.message),
    });
  };

  const handleSeedData = () => {
    seedData.mutate(undefined, {
      onSuccess: () => toast.success("Demo data loaded!"),
      onError: (e) => toast.error(e.message),
    });
  };

  // Empty state for real users with no data
  if (!isDemo && transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Database className="w-16 h-16 text-primary/30 mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">No transactions yet</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          Start tracking your finances by adding your first transaction, or load demo data to explore Finova.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setModalOpen(true)} className="btn-primary">Add Transaction</button>
          <button onClick={handleSeedData} className="btn-ghost" disabled={seedData.isPending}>
            {seedData.isPending ? "Loading..." : "Load Demo Data"}
          </button>
        </div>
        <AddTransactionModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAddTransaction} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} className="glass-card" custom={i} initial="hidden" animate="visible" variants={fadeUp}>
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            <p className={`stat-value ${stat.color}`}>{stat.value}</p>
            <div className={`pill-badge mt-2 ${stat.up ? "bg-primary/10 text-primary" : "bg-expense/10 text-expense"}`}>
              {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {stat.trend} vs last month
            </div>
          </motion.div>
        ))}
        <motion.div className="glass-card border-l-4 border-l-primary" custom={3} initial="hidden" animate="visible" variants={fadeUp}>
          <p className="text-xs text-muted-foreground mb-1">Savings Rate</p>
          <p className="stat-value text-primary">{savingsRate}%</p>
          <div className="progress-bar mt-3">
            <div className="progress-bar-fill-primary" style={{ width: `${savingsRate}%` }} />
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <motion.div className="glass-card xl:col-span-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h3 className="text-sm font-semibold text-foreground mb-4">Net Worth Overview</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4edea3" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4edea3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#c6c6cd', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#c6c6cd', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: 'rgba(23,31,51,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#dae2fd' }}
                formatter={(value: number) => [`KES ${value.toLocaleString()}`, '']}
              />
              <Area type="monotone" dataKey="savings" stroke="#4edea3" strokeWidth={3} fill="url(#tealGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="glass-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <h3 className="text-sm font-semibold text-foreground mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={spendingByCat} innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={0}>
                {spendingByCat.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-lg font-bold">
                KES {totalSpending > 0 ? (totalSpending / 1000).toFixed(0) + "k" : "0"}
              </text>
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
            {spendingByCat.slice(0, 6).map(c => (
              <div key={c.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                {c.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions + Budget */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <motion.div className="glass-card xl:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <h3 className="text-sm font-semibold text-foreground mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {recentTx.map(tx => (
              <div key={tx.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-lg">
                  {categoryIcons[tx.category] || "📋"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{tx.category} · {tx.date}</p>
                </div>
                <p className={`text-sm font-bold ${tx.type === "income" ? "text-primary" : "text-expense"}`}>
                  {tx.type === "income" ? "+" : "-"}KES {Number(tx.amount).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="glass-card space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <h3 className="text-sm font-semibold text-foreground">Budget Progress</h3>
          {budgetItems.slice(0, 3).map(b => {
            const pct = Math.round((b.spent / Number(b.limit)) * 100);
            const barClass = pct >= 100 ? "progress-bar-fill-danger" : pct >= 75 ? "progress-bar-fill-warning" : "progress-bar-fill-primary";
            return (
              <div key={b.id}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{b.category}</span>
                  <span className={pct >= 100 ? "text-expense" : pct >= 75 ? "text-warning" : "text-primary"}>{pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className={barClass} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
              </div>
            );
          })}

          <div className="border border-primary/20 rounded-lg p-3 mt-2">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary">AI Insight</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your Food & Dining spending is trending 15% higher this month. Consider meal prepping to stay within budget.
            </p>
          </div>
        </motion.div>
      </div>

      <FAB onClick={() => setModalOpen(true)} />
      <AddTransactionModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAddTransaction} />
    </div>
  );
}
