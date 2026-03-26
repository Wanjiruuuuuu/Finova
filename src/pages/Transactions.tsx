import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Trash2, Plus } from "lucide-react";
import { mockTransactions, categoryIcons, categories } from "@/data/mockData";
import { FAB } from "@/components/FAB";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { useIsDemo } from "@/contexts/DemoContext";
import { useTransactions, useAddTransaction, useDeleteTransaction } from "@/hooks/useFinanceData";
import { toast } from "sonner";

const PER_PAGE = 10;

export default function Transactions() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date-desc");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const isDemo = useIsDemo();

  const { data: realTransactions } = useTransactions();
  const addTransaction = useAddTransaction();
  const deleteTransaction = useDeleteTransaction();

  const transactions = isDemo ? mockTransactions : (realTransactions || []);

  const filtered = useMemo(() => {
    let result = [...transactions];
    if (search) result = result.filter(t => t.description.toLowerCase().includes(search.toLowerCase()));
    if (catFilter !== "All") result = result.filter(t => t.category === catFilter);
    result.sort((a, b) => {
      switch (sortBy) {
        case "date-desc": return b.date.localeCompare(a.date);
        case "date-asc": return a.date.localeCompare(b.date);
        case "amount-desc": return Number(b.amount) - Number(a.amount);
        case "amount-asc": return Number(a.amount) - Number(b.amount);
        default: return 0;
      }
    });
    return result;
  }, [transactions, search, catFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleAdd = (tx: { description: string; amount: number; category: string; type: "income" | "expense"; date: string }) => {
    if (isDemo) return;
    addTransaction.mutate(tx, {
      onSuccess: () => toast.success("Transaction added!"),
      onError: (e) => toast.error(e.message),
    });
  };

  const handleDelete = (id: string) => {
    if (isDemo) return;
    if (!confirm("Delete this transaction?")) return;
    deleteTransaction.mutate(id, {
      onSuccess: () => toast.success("Transaction deleted"),
      onError: (e) => toast.error(e.message),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground">Monitoring activity across your accounts</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2 self-start">
          <Plus className="w-4 h-4" /> Quick Add
        </button>
      </div>

      <div className="glass-card flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input className="input-dark pl-10" placeholder="Search transactions..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="input-dark sm:w-48" value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }}>
          <option value="All">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input-dark sm:w-44" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>
      </div>

      <div className="glass-card overflow-x-auto !p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
              <th className="text-left px-6 py-3">Date</th>
              <th className="text-left px-6 py-3">Description</th>
              <th className="text-left px-6 py-3">Category</th>
              <th className="text-right px-6 py-3">Amount</th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((tx, i) => (
              <motion.tr key={tx.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border/50 hover:bg-secondary/30 transition-colors group">
                <td className="px-6 py-3">
                  <span className="text-foreground">{new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                  <span className="text-muted-foreground text-xs ml-1">{new Date(tx.date).getFullYear()}</span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-base">{categoryIcons[tx.category] || "📋"}</div>
                    <span className="font-semibold text-foreground">{tx.description}</span>
                  </div>
                </td>
                <td className="px-6 py-3"><span className="pill-badge bg-secondary text-muted-foreground">{tx.category}</span></td>
                <td className="px-6 py-3 text-right">
                  <span className={`font-bold ${tx.type === "income" ? "text-primary" : "text-expense"}`}>
                    {tx.type === "income" ? "+" : "-"}KES {Number(tx.amount).toLocaleString()}
                  </span>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{tx.type === "income" ? "INCOME" : "EXPENSE"}</p>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(tx.id)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:text-expense hover:bg-expense/10 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {((page-1)*PER_PAGE)+1} to {Math.min(page*PER_PAGE, filtered.length)} of {filtered.length} entries</span>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${page === i + 1 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}>{i + 1}</button>
            ))}
          </div>
        </div>
      )}

      <FAB onClick={() => setModalOpen(true)} />
      <AddTransactionModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAdd} />
    </div>
  );
}
