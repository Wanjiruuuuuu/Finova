export interface Advisor {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  specialization: string;
  yearsExperience: number;
  previousEmployers: string[];
  bio: string;
  expertise: string[];
  rating: number;
  clientsHelped: number;
  avatarColor: string;
}

export const advisors: Advisor[] = [
  {
    id: "1",
    firstName: "Amara",
    lastName: "Osei-Bonsu",
    title: "Senior Financial Planner",
    specialization: "Investment portfolios and wealth management",
    yearsExperience: 12,
    previousEmployers: ["Goldman Sachs Kenya", "Equity Bank"],
    bio: "Amara brings over a decade of experience in investment portfolio management and wealth building strategies. She specializes in helping high-net-worth individuals grow and protect their assets.",
    expertise: ["Wealth Management", "Portfolio Strategy", "Risk Analysis"],
    rating: 4.9,
    clientsHelped: 340,
    avatarColor: "7c3aed",
  },
  {
    id: "2",
    firstName: "David",
    lastName: "Kimani",
    title: "Certified Financial Analyst",
    specialization: "Debt management and savings optimization",
    yearsExperience: 8,
    previousEmployers: ["Stanbic Bank", "KCB Group"],
    bio: "David is passionate about helping individuals break free from debt cycles and build sustainable savings habits. His data-driven approach has helped hundreds of Kenyans achieve financial freedom.",
    expertise: ["Debt Strategy", "Savings Plans", "Financial Literacy"],
    rating: 4.8,
    clientsHelped: 215,
    avatarColor: "2563eb",
  },
  {
    id: "3",
    firstName: "Priya",
    lastName: "Sharma",
    title: "Wealth Management Advisor",
    specialization: "Retirement planning and long-term investments",
    yearsExperience: 15,
    previousEmployers: ["Barclays Africa", "Standard Chartered"],
    bio: "With 15 years in wealth management, Priya helps clients plan for retirement and build long-term investment portfolios. She combines global market insight with local expertise.",
    expertise: ["Retirement Planning", "Long-term Investments", "Tax Efficiency"],
    rating: 4.9,
    clientsHelped: 410,
    avatarColor: "dc2626",
  },
  {
    id: "4",
    firstName: "Marcus",
    lastName: "Adeyemi",
    title: "Personal Finance Coach",
    specialization: "Youth financial literacy and budgeting",
    yearsExperience: 6,
    previousEmployers: ["Safaricom Finance", "M-Pesa Foundation"],
    bio: "Marcus focuses on empowering young professionals with practical financial skills. His coaching programs have helped hundreds of millennials start budgeting and investing confidently.",
    expertise: ["Budgeting", "Financial Literacy", "Youth Finance"],
    rating: 4.7,
    clientsHelped: 180,
    avatarColor: "ea580c",
  },
  {
    id: "5",
    firstName: "Catherine",
    lastName: "Wanjiku",
    title: "Tax and Financial Consultant",
    specialization: "Tax optimization and business finance",
    yearsExperience: 10,
    previousEmployers: ["PwC Kenya", "Deloitte East Africa"],
    bio: "Catherine specializes in helping both individuals and SMEs navigate Kenya's tax landscape. Her expertise in tax optimization has saved clients millions in unnecessary payments.",
    expertise: ["Tax Planning", "Business Finance", "Compliance"],
    rating: 4.8,
    clientsHelped: 290,
    avatarColor: "0891b2",
  },
  {
    id: "6",
    firstName: "James",
    lastName: "Omondi",
    title: "Investment Advisor",
    specialization: "Stock market and cryptocurrency",
    yearsExperience: 9,
    previousEmployers: ["Nairobi Securities Exchange", "CBA Bank"],
    bio: "James is an expert in equities and emerging digital assets. He helps clients navigate both traditional stock markets and the rapidly evolving cryptocurrency landscape.",
    expertise: ["Stock Trading", "Crypto Assets", "Market Analysis"],
    rating: 4.7,
    clientsHelped: 195,
    avatarColor: "4f46e5",
  },
  {
    id: "7",
    firstName: "Sofia",
    lastName: "Mendes",
    title: "Microfinance and SME Advisor",
    specialization: "Small business finance and women entrepreneurs",
    yearsExperience: 7,
    previousEmployers: ["World Bank Kenya", "Equity Foundation"],
    bio: "Sofia is dedicated to empowering small business owners, particularly women entrepreneurs, with access to capital and financial management skills.",
    expertise: ["Microfinance", "SME Growth", "Women in Business"],
    rating: 4.8,
    clientsHelped: 250,
    avatarColor: "be185d",
  },
  {
    id: "8",
    firstName: "Robert",
    lastName: "Njoroge",
    title: "Estate and Retirement Planner",
    specialization: "Long-term wealth and inheritance planning",
    yearsExperience: 18,
    previousEmployers: ["Old Mutual Kenya", "Jubilee Insurance"],
    bio: "Robert is one of Kenya's most experienced estate planners. With 18 years in the industry, he specializes in helping families build generational wealth and plan smooth asset transitions.",
    expertise: ["Estate Planning", "Inheritance", "Wealth Preservation"],
    rating: 4.9,
    clientsHelped: 380,
    avatarColor: "047857",
  },
];
