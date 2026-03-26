import { motion } from "framer-motion";
import { Star, MessageCircle, Linkedin, Calendar } from "lucide-react";
import { advisors } from "@/data/advisors";
import { Link } from "react-router-dom";

const WA_LINK = "https://wa.me/254728437261?text=Hi%2C%20I%20found%20you%20on%20Finova%20and%20I%27d%20like%20to%20book%20a%20financial%20advisory%20session.";

export default function Advisors() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <p className="section-eyebrow">Expert Network</p>
        <h1 className="text-2xl font-bold text-foreground">Connect with a Certified Financial Advisor</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
          Real experts. Real guidance. Your financial future, accelerated.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {advisors.map((advisor, i) => (
          <motion.div
            key={advisor.id}
            className="glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex gap-4">
              <img
                src={`https://ui-avatars.com/api/?name=${advisor.firstName}+${advisor.lastName}&background=${advisor.avatarColor}&color=fff&size=200&rounded=true`}
                alt={`${advisor.firstName} ${advisor.lastName}`}
                className="w-16 h-16 rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-foreground">{advisor.firstName} {advisor.lastName}</h3>
                <p className="text-xs text-primary font-medium">{advisor.title}</p>
                <p className="text-xs text-muted-foreground">{advisor.yearsExperience} years · {advisor.previousEmployers.join(", ")}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-warning fill-warning" />
                  <span className="text-xs text-foreground font-semibold">{advisor.rating}</span>
                  <span className="text-xs text-muted-foreground">· {advisor.clientsHelped} clients helped</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{advisor.bio}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {advisor.expertise.map(e => (
                <span key={e} className="pill-badge bg-primary/10 text-primary text-[10px]">{e}</span>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs flex items-center gap-1.5 flex-1 justify-center"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </a>
              <Link
                to={`/advisors/${advisor.id}`}
                className="btn-ghost text-xs flex items-center gap-1.5 flex-1 justify-center"
              >
                <Calendar className="w-3.5 h-3.5" /> View Profile
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
