export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: TransactionType;
  date: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  month: string;
}

export const categories = [
  "Food & Dining", "Transport", "Housing", "Entertainment", "Health",
  "Shopping", "Education", "Salary", "Freelance", "Utilities", "Investment", "Other"
];

export const categoryIcons: Record<string, string> = {
  "Food & Dining": "🍽️", Transport: "🚗", Housing: "🏠", Entertainment: "🎬",
  Health: "💊", Shopping: "🛍️", Education: "📚", Salary: "💰",
  Freelance: "💻", Utilities: "⚡", Investment: "📈", Other: "📋",
};

export const categoryColors: Record<string, string> = {
  "Food & Dining": "#4edea3", Transport: "#60a5fa", Housing: "#f59e0b",
  Entertainment: "#a78bfa", Health: "#f87171", Shopping: "#fb923c",
  Education: "#34d399", Salary: "#4edea3", Freelance: "#818cf8",
  Utilities: "#fbbf24", Investment: "#2dd4bf", Other: "#94a3b8",
};

export const mockTransactions: Transaction[] = [
  { id: "1", description: "Naivas Supermarket", amount: 3450, category: "Food & Dining", type: "expense", date: "2025-03-22" },
  { id: "2", description: "Salary - March", amount: 185000, category: "Salary", type: "income", date: "2025-03-01" },
  { id: "3", description: "Uber Ride to CBD", amount: 650, category: "Transport", type: "expense", date: "2025-03-21" },
  { id: "4", description: "Kenya Power Bill", amount: 4200, category: "Utilities", type: "expense", date: "2025-03-15" },
  { id: "5", description: "Artcaffe Lunch", amount: 2100, category: "Food & Dining", type: "expense", date: "2025-03-20" },
  { id: "6", description: "Safaricom Airtime", amount: 500, category: "Utilities", type: "expense", date: "2025-03-19" },
  { id: "7", description: "Netflix Subscription", amount: 1100, category: "Entertainment", type: "expense", date: "2025-03-18" },
  { id: "8", description: "Freelance Project - Kes", amount: 45000, category: "Freelance", type: "income", date: "2025-03-10" },
  { id: "9", description: "Rent Payment", amount: 35000, category: "Housing", type: "expense", date: "2025-03-05" },
  { id: "10", description: "Java House Coffee", amount: 450, category: "Food & Dining", type: "expense", date: "2025-03-17" },
  { id: "11", description: "Gym Membership", amount: 5000, category: "Health", type: "expense", date: "2025-03-03" },
  { id: "12", description: "Jumia Shopping", amount: 7800, category: "Shopping", type: "expense", date: "2025-03-14" },
  { id: "13", description: "Coursera Subscription", amount: 4500, category: "Education", type: "expense", date: "2025-03-12" },
  { id: "14", description: "M-Pesa Investment", amount: 10000, category: "Investment", type: "expense", date: "2025-03-08" },
  { id: "15", description: "Bolt Ride", amount: 380, category: "Transport", type: "expense", date: "2025-03-16" },
  { id: "16", description: "Nairobi Water Bill", amount: 1800, category: "Utilities", type: "expense", date: "2025-03-13" },
  { id: "17", description: "Carrefour Groceries", amount: 5600, category: "Food & Dining", type: "expense", date: "2025-03-11" },
  { id: "18", description: "Side Gig Payment", amount: 22000, category: "Freelance", type: "income", date: "2025-02-25" },
  { id: "19", description: "Pharmacy - Meds", amount: 1200, category: "Health", type: "expense", date: "2025-02-20" },
  { id: "20", description: "Salary - February", amount: 185000, category: "Salary", type: "income", date: "2025-02-01" },
];

export const mockBudgets: Budget[] = [
  { id: "1", category: "Food & Dining", limit: 15000, spent: 11600, month: "2025-03" },
  { id: "2", category: "Transport", limit: 5000, spent: 1030, month: "2025-03" },
  { id: "3", category: "Housing", limit: 40000, spent: 35000, month: "2025-03" },
  { id: "4", category: "Entertainment", limit: 3000, spent: 1100, month: "2025-03" },
  { id: "5", category: "Utilities", limit: 8000, spent: 6500, month: "2025-03" },
  { id: "6", category: "Shopping", limit: 10000, spent: 7800, month: "2025-03" },
  { id: "7", category: "Health", limit: 7000, spent: 5000, month: "2025-03" },
];

export const mockInsights = {
  spendingScore: 78,
  summary: "Your spending patterns show disciplined financial behavior with a strong savings ratio of 38%. You're in the top 12% of users managing expenses in this income bracket.",
  personaArchetype: "The Strategic Minimalist",
  personaDescription: "You prioritize essential spending while maintaining a healthy investment portfolio.",
  observations: [
    "Food & Dining accounts for 15% of your total expenses — slightly above optimal",
    "Your housing costs remain within the recommended 30% of income threshold",
    "Investment contributions show consistent growth month over month"
  ],
  tips: [
    "Consider meal prepping to reduce Food & Dining expenses by 20%",
    "Set up automatic transfers to your investment account on payday",
    "Review utility subscriptions — potential KES 1,500 monthly savings identified"
  ],
  predictedBalance: 245000,
  reflectivePrompt: "If your spending habits were a story, what chapter would you say you're in — and what would the next chapter look like?"
};

export const monthlyData = [
  { month: "Oct", income: 185000, expenses: 82000, savings: 103000 },
  { month: "Nov", income: 207000, expenses: 91000, savings: 116000 },
  { month: "Dec", income: 195000, expenses: 105000, savings: 90000 },
  { month: "Jan", income: 185000, expenses: 78000, savings: 107000 },
  { month: "Feb", income: 207000, expenses: 86200, savings: 120800 },
  { month: "Mar", income: 230000, expenses: 84730, savings: 145270 },
];

export const spendingByCategory = [
  { name: "Food & Dining", value: 11600, color: "#4edea3" },
  { name: "Housing", value: 35000, color: "#f59e0b" },
  { name: "Shopping", value: 7800, color: "#fb923c" },
  { name: "Utilities", value: 6500, color: "#fbbf24" },
  { name: "Health", value: 5000, color: "#f87171" },
  { name: "Transport", value: 1030, color: "#60a5fa" },
  { name: "Other", value: 17800, color: "#94a3b8" },
];
