import { useState } from "react";
import { X } from "lucide-react";
import { categories } from "@/data/mockData";

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (tx: { description: string; amount: number; category: string; type: "income" | "expense"; date: string }) => void;
}

export function AddTransactionModal({ open, onClose, onAdd }: AddTransactionModalProps) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;
    onAdd({ description, amount: parseFloat(amount), category, type, date });
    setDescription(""); setAmount(""); setCategory(categories[0]); setType("expense");
    onClose();
  };

  const blockInvalidChars = (e: React.KeyboardEvent) => {
    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') e.preventDefault();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">Add Transaction</h2>
          <button onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex rounded-lg overflow-hidden border border-border">
            <button type="button" onClick={() => setType("expense")} className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${type === "expense" ? "bg-expense/20 text-expense" : "text-muted-foreground"}`}>Expense</button>
            <button type="button" onClick={() => setType("income")} className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${type === "income" ? "bg-primary/20 text-primary" : "text-muted-foreground"}`}>Income</button>
          </div>

          <input className="input-dark" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
          <input
            className="input-dark"
            placeholder="Amount (KES)"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            onKeyDown={blockInvalidChars}
            required
          />
          <select className="input-dark" value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input className="input-dark" type="date" value={date} onChange={e => setDate(e.target.value)} />
          <button type="submit" className="btn-primary w-full">Add Transaction</button>
        </form>
      </div>
    </div>
  );
}
