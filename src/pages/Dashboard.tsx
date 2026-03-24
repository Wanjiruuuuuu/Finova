import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowUpRight, Brain } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { mockTransactions, mockBudgets, monthlyData, spendingByCategory, categoryIcons } from "@/data/mockData";
import { FAB } from "@/components/FAB";
import { AddTransactionModal } from "@/components/AddTransactionModal";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);

  const totalIncome = mockTransactions.filter(t => t.type === "income").reduce((a, t) => a + t.amount, 0);
  const totalExpenses = mockTransactions.filter(t => t.type === "expense").reduce((a, t) => a + t.amount, 0);
  const balance = totalIncome - totalExpenses;
  const savingsRate = Math.round(((totalIncome - totalExpenses) / totalIncome) * 100);
  const recentTx = mockTransactions.slice(0, 5);
  const totalSpending = spendingByCategory.reduce((a, c) => a + c.value, 0);

  const stats = [
    { label: "Total Balance", value: `KES ${balance.toLocaleString()}`, trend: "+8.2%", up: true, color: "text-foreground" },
    { label: "Monthly Income", value: `KES ${totalIncome.toLocaleString()}`, trend: "+12%", up: true, color: "text-primary" },
    { label: "Monthly Expenses", value: `KES ${totalExpenses.toLocaleString()}`, trend: "-12%", up: false, color: "text-expense" },
  ];

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
        {/* Savings Rate */}
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
        {/* Net Worth Chart */}
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

        {/* Spending Doughnut */}
        <motion.div className="glass-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <h3 className="text-sm font-semibold text-foreground mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={spendingByCategory} innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={0}>
                {spendingByCategory.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-lg font-bold">
                KES {(totalSpending / 1000).toFixed(0)}k
              </text>
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
            {spendingByCategory.slice(0, 6).map(c => (
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
                  {tx.type === "income" ? "+" : "-"}KES {tx.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="glass-card space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <h3 className="text-sm font-semibold text-foreground">Budget Progress</h3>
          {mockBudgets.slice(0, 3).map(b => {
            const pct = Math.round((b.spent / b.limit) * 100);
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

          {/* AI mini card */}
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
      <AddTransactionModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={() => {}} />
    </div>
  );
}

