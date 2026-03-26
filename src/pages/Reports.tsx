import { motion } from "framer-motion";
import { Download, FileText, BarChart3 } from "lucide-react";
import { mockTransactions, monthlyData, categoryIcons } from "@/data/mockData";
import { getCategoryColor } from "@/data/categoryColors";
import { useIsDemo } from "@/contexts/DemoContext";
import { useTransactions } from "@/hooks/useFinanceData";

export default function Reports() {
  const isDemo = useIsDemo();
  const { data: realTransactions } = useTransactions();
  const transactions = isDemo ? mockTransactions : (realTransactions || []);

  // Build monthly data from real transactions
  const realMonthlyData = isDemo ? monthlyData : (() => {
    if (transactions.length === 0) return [];
    const monthMap: Record<string, { income: number; expenses: number }> = {};
    transactions.forEach(t => {
      const m = t.date.slice(0, 7);
      if (!monthMap[m]) monthMap[m] = { income: 0, expenses: 0 };
      if (t.type === "income") monthMap[m].income += Number(t.amount);
      else monthMap[m].expenses += Number(t.amount);
    });
    return Object.entries(monthMap).sort().map(([m, v]) => ({
      month: new Date(m + "-01").toLocaleDateString("en", { month: "short", year: "2-digit" }),
      income: v.income,
      expenses: v.expenses,
      savings: v.income - v.expenses,
    }));
  })();

  const spendingByCat = (() => {
    const catMap: Record<string, number> = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      catMap[t.category] = (catMap[t.category] || 0) + Number(t.amount);
    });
    return Object.entries(catMap).map(([name, value]) => ({ name, value, color: getCategoryColor(name) })).sort((a, b) => b.value - a.value);
  })();

  const hasEnoughData = realMonthlyData.length >= 1;
  const hasTwoMonths = realMonthlyData.length >= 2;

  const bestMonth = hasTwoMonths ? realMonthlyData.reduce((a, b) => b.savings > a.savings ? b : a) : null;
  const worstMonth = hasTwoMonths ? realMonthlyData.reduce((a, b) => b.savings < a.savings ? b : a) : null;
  const avgSpending = hasEnoughData ? Math.round(realMonthlyData.reduce((a, b) => a + b.expenses, 0) / realMonthlyData.length) : 0;

  const handleExportCSV = () => {
    const headers = "Date,Description,Category,Type,Amount\n";
    const rows = transactions.map(t => `${t.date},${t.description},${t.category},${t.type},${t.amount}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "finova-transactions.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF();
    doc.setFillColor(11, 19, 38); doc.rect(0, 0, 210, 297, "F");
    doc.setTextColor(218, 226, 253); doc.setFontSize(20);
    doc.text("Finova — Financial Report", 20, 25);
    doc.setFontSize(10); doc.setTextColor(198, 198, 205);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 33);
    autoTable(doc, {
      startY: 45,
      head: [["Month", "Income", "Expenses", "Net Savings", "Efficiency"]],
      body: realMonthlyData.map(m => [m.month, `KES ${m.income.toLocaleString()}`, `KES ${m.expenses.toLocaleString()}`, `KES ${m.savings.toLocaleString()}`, `${m.income > 0 ? Math.round((m.savings / m.income) * 100) : 0}%`]),
      styles: { fillColor: [23, 31, 51], textColor: [218, 226, 253], fontSize: 9 },
      headStyles: { fillColor: [78, 222, 163], textColor: [11, 19, 38], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [17, 25, 44] },
    });
    doc.save("finova-report.pdf");
  };

  // Empty state
  if (!isDemo && transactions.length === 0) {
    const currentMonthName = new Date().toLocaleDateString("en", { month: "long" });
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <BarChart3 className="w-16 h-16 text-primary/30 mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">No reports yet</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Your first monthly report will be ready at the end of {currentMonthName}. Keep adding transactions!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="section-eyebrow">Analytical Engine</p>
          <h1 className="text-2xl font-bold text-foreground">Financial Reports</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportPDF} className="btn-ghost flex items-center gap-2"><FileText className="w-4 h-4" /> Export PDF</button>
          <button onClick={handleExportCSV} className="btn-primary flex items-center gap-2"><Download className="w-4 h-4" /> Export CSV</button>
        </div>
      </div>

      {hasTwoMonths && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs text-muted-foreground">Best Month</p>
            <p className="text-xl font-bold text-primary">{bestMonth?.month}</p>
            <p className="text-sm text-muted-foreground">KES {bestMonth?.savings.toLocaleString()} saved</p>
          </motion.div>
          <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <p className="text-xs text-muted-foreground">Average Spending</p>
            <p className="text-xl font-bold text-foreground">KES {avgSpending.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Per month average</p>
          </motion.div>
          <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <p className="text-xs text-muted-foreground">Worst Month</p>
            <p className="text-xl font-bold text-expense">{worstMonth?.month}</p>
            <p className="text-sm text-muted-foreground">KES {worstMonth?.savings.toLocaleString()} saved</p>
          </motion.div>
        </div>
      )}

      <div className="glass-card !p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
              <th className="text-left px-6 py-3">Month</th>
              <th className="text-right px-6 py-3">Gross Income</th>
              <th className="text-right px-6 py-3">Total Expenses</th>
              <th className="text-right px-6 py-3">Net Savings</th>
              <th className="text-right px-6 py-3">Efficiency</th>
            </tr>
          </thead>
          <tbody>
            {realMonthlyData.map((m, i) => {
              const eff = m.income > 0 ? Math.round((m.savings / m.income) * 100) : 0;
              return (
                <tr key={m.month} className={`border-b border-border/50 ${i % 2 === 0 ? "bg-secondary/10" : ""}`}>
                  <td className="px-6 py-3 font-semibold text-foreground">{m.month}</td>
                  <td className="px-6 py-3 text-right text-primary font-medium">KES {m.income.toLocaleString()}</td>
                  <td className="px-6 py-3 text-right text-muted-foreground">KES {m.expenses.toLocaleString()}</td>
                  <td className={`px-6 py-3 text-right font-bold ${m.savings >= 0 ? "text-primary" : "text-expense"}`}>KES {m.savings.toLocaleString()}</td>
                  <td className="px-6 py-3 text-right">
                    <span className={`pill-badge ${eff >= 50 ? "bg-primary/10 text-primary" : eff >= 30 ? "bg-warning/10 text-warning" : "bg-expense/10 text-expense"}`}>{eff}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {spendingByCat.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4">Top Spending Categories</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {spendingByCat.slice(0, 4).map((cat, i) => {
              const total = spendingByCat.reduce((a, c) => a + c.value, 0);
              const pct = total > 0 ? Math.round((cat.value / total) * 100) : 0;
              return (
                <motion.div key={cat.name} className="glass-card" style={{ borderTop: `3px solid ${cat.color}` }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{categoryIcons[cat.name] || "📋"}</span>
                    <span className="text-sm font-semibold text-foreground">{cat.name}</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">KES {cat.value.toLocaleString()}</p>
                  <div className="progress-bar mt-2">
                    <div className="progress-bar-fill" style={{ width: `${pct}%`, background: cat.color }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{pct}% of total</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
