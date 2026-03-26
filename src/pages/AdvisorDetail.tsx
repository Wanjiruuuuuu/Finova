import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, MessageCircle, Linkedin, Clock, Briefcase } from "lucide-react";
import { advisors } from "@/data/advisors";

const WA_LINK = "https://wa.me/254728437261?text=Hi%2C%20I%20found%20you%20on%20Finova%20and%20I%27d%20like%20to%20book%20a%20financial%20advisory%20session.";

const testimonials = [
  { name: "Jane M.", text: "Incredibly insightful advice. Helped me restructure my portfolio for better returns.", rating: 5 },
  { name: "Peter K.", text: "Clear, actionable guidance that transformed my approach to budgeting.", rating: 5 },
  { name: "Sarah W.", text: "Patient and thorough. Answered all my questions about retirement planning.", rating: 4 },
];

export default function AdvisorDetail() {
  const { id } = useParams();
  const advisor = advisors.find(a => a.id === id);

  if (!advisor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Advisor not found.</p>
        <Link to="/advisors" className="btn-primary mt-4">Back to Advisors</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Link to="/advisors" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Advisors
      </Link>

      <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex gap-4 items-start">
          <img
            src={`https://ui-avatars.com/api/?name=${advisor.firstName}+${advisor.lastName}&background=${advisor.avatarColor}&color=fff&size=200&rounded=true`}
            alt={`${advisor.firstName} ${advisor.lastName}`}
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h1 className="text-xl font-bold text-foreground">{advisor.firstName} {advisor.lastName}</h1>
            <p className="text-sm text-primary font-medium">{advisor.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{advisor.specialization}</p>
            <div className="flex items-center gap-2 mt-2">
              <Star className="w-4 h-4 text-warning fill-warning" />
              <span className="text-sm font-bold text-foreground">{advisor.rating}</span>
              <span className="text-xs text-muted-foreground">· {advisor.clientsHelped} clients helped</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-sm font-bold text-foreground mb-3">About</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{advisor.bio}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {advisor.expertise.map(e => (
            <span key={e} className="pill-badge bg-primary/10 text-primary">{e}</span>
          ))}
        </div>
      </motion.div>

      <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <h2 className="text-sm font-bold text-foreground mb-3">Work History</h2>
        <div className="space-y-3">
          {advisor.previousEmployers.map((emp, i) => (
            <div key={emp} className="flex items-center gap-3">
              <Briefcase className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">{emp}</p>
                <p className="text-xs text-muted-foreground">{advisor.yearsExperience - i * 3}+ years</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-sm font-bold text-foreground mb-3">Client Testimonials</h2>
        <div className="space-y-3">
          {testimonials.map((t, i) => (
            <div key={i} className="rounded-lg bg-secondary/30 p-3">
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-3 h-3 text-warning fill-warning" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground italic">"{t.text}"</p>
              <p className="text-[10px] text-muted-foreground mt-1">— {t.name}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="w-3.5 h-3.5" /> Usually responds within 2 hours
      </div>

      <div className="flex gap-3">
        <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2 flex-1 justify-center">
          <MessageCircle className="w-4 h-4" /> Connect on WhatsApp
        </a>
      </div>
    </div>
  );
}
