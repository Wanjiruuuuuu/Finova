import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock, User, ArrowRight, Phone, Check, ChevronRight, Camera, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { FinovaLogo } from "@/components/FinovaLogo";
import { Link } from "react-router-dom";

const incomeSourceOptions = ["Employed Full-time", "Self-employed/Freelance", "Business Owner", "Student", "Multiple Sources", "Other"];
const incomeRangeOptions = ["Under KES 20,000", "KES 20,000–50,000", "KES 50,000–100,000", "KES 100,000–200,000", "Over KES 200,000", "Prefer not to say"];
const goalOptions = ["Save more money", "Pay off debt", "Build emergency fund", "Invest", "Track spending", "Plan for retirement", "Buy property", "Other"];
const currencyOptions = ["KES", "USD", "GBP"];

export default function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [incomeSource, setIncomeSource] = useState("");
  const [incomeRange, setIncomeRange] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [currency, setCurrency] = useState("KES");
  const [bio, setBio] = useState("");
  const [notifPrefs, setNotifPrefs] = useState({ transaction_alerts: true, budget_warnings: true, weekly_summary: true, ai_insights: true, tips_advice: true });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session && mode === "login") navigate("/dashboard");
    });
  }, [navigate, mode]);

  const passwordValid = password.length >= 8 && /\d/.test(password) && /[^a-zA-Z0-9]/.test(password);
  const passwordsMatch = password === confirmPassword;

  const formatPhone = (val: string) => {
    let cleaned = val.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('07')) cleaned = '+254' + cleaned.slice(1);
    return cleaned;
  };

  const handleSignup = async () => {
    if (!passwordValid) { toast.error("Password must be 8+ chars with 1 number and 1 special character"); return; }
    if (!passwordsMatch) { toast.error("Passwords don't match"); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: firstName, last_name: lastName } },
      });
      if (error) throw error;
      toast.success("Account created! Check your email to verify.");
      // After signup, update profile with onboarding data
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({
          full_name: firstName,
          last_name: lastName,
          phone: formatPhone(phone),
          income_source: incomeSource,
          income_range: incomeRange,
          financial_goals: goals,
          currency,
          bio,
          notification_preferences: notifPrefs,
        }).eq("user_id", user.id);
      }
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleGoal = (g: string) => setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

  const toggleNotif = (key: string) => setNotifPrefs(prev => ({ ...prev, [key]: !(prev as any)[key] }));

  // Login form
  if (mode === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0b1326' }}>
        <motion.div className="glass-card w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FinovaLogo size={28} />
              <h1 className="text-2xl font-bold text-primary">Finova</h1>
            </div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">Your Digital Ledger</p>
            <p className="text-sm text-muted-foreground mt-4">Welcome back</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input className="input-dark pl-10" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input className="input-dark pl-10" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
              {loading ? "Please wait..." : "Log In"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
          <div className="mt-6 text-center">
            <button onClick={() => { setMode("signup"); setStep(1); }} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Don't have an account? Sign Up
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Multi-step signup
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: '#0b1326' }}>
      <motion.div className="glass-card w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FinovaLogo size={28} />
            <h1 className="text-2xl font-bold text-primary">Finova</h1>
          </div>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">Your Digital Ledger</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                {step > s ? <Check className="w-3.5 h-3.5" /> : s}
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 rounded ${step > s ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mb-4">Step {step} of 3</p>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
              <p className="text-sm font-semibold text-foreground mb-2">Create your account</p>
              <div className="grid grid-cols-2 gap-3">
                <input className="input-dark" placeholder="First Name *" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                <input className="input-dark" placeholder="Last Name *" value={lastName} onChange={e => setLastName(e.target.value)} required />
              </div>
              <input className="input-dark" type="email" placeholder="Email *" value={email} onChange={e => setEmail(e.target.value)} required />
              <input className="input-dark" type="password" placeholder="Password (8+ chars, 1 number, 1 special) *" value={password} onChange={e => setPassword(e.target.value)} required />
              {password && !passwordValid && <p className="text-[10px] text-expense">Min 8 chars, 1 number, 1 special character</p>}
              <input className="input-dark" type="password" placeholder="Confirm Password *" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              {confirmPassword && !passwordsMatch && <p className="text-[10px] text-expense">Passwords don't match</p>}
              <input className="input-dark" type="tel" placeholder="Phone (+254... or 07...) *" value={phone} onChange={e => setPhone(e.target.value)} required />
              <button
                onClick={() => {
                  if (!firstName || !lastName || !email || !password || !confirmPassword || !phone) { toast.error("Fill all required fields"); return; }
                  if (!passwordValid) { toast.error("Password requirements not met"); return; }
                  if (!passwordsMatch) { toast.error("Passwords don't match"); return; }
                  setStep(2);
                }}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <p className="text-sm font-semibold text-foreground mb-2">Financial Profile</p>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Primary income source</label>
                <select className="input-dark" value={incomeSource} onChange={e => setIncomeSource(e.target.value)}>
                  <option value="">Select...</option>
                  {incomeSourceOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Monthly income range</label>
                <select className="input-dark" value={incomeRange} onChange={e => setIncomeRange(e.target.value)}>
                  <option value="">Select...</option>
                  {incomeRangeOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Financial goals (select all that apply)</label>
                <div className="grid grid-cols-2 gap-2">
                  {goalOptions.map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGoal(g)}
                      className={`text-xs text-left px-3 py-2 rounded-lg border transition-colors ${goals.includes(g) ? "bg-primary/10 border-primary/30 text-primary" : "border-border text-muted-foreground hover:border-primary/20"}`}
                    >
                      {goals.includes(g) && <Check className="w-3 h-3 inline mr-1" />}{g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Currency preference</label>
                <div className="flex gap-2">
                  {currencyOptions.map(c => (
                    <button key={c} type="button" onClick={() => setCurrency(c)} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${currency === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{c}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-ghost flex-1">Back</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1 flex items-center justify-center gap-2">Continue <ChevronRight className="w-4 h-4" /></button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <p className="text-sm font-semibold text-foreground mb-2">Personalization</p>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Short bio (optional)</label>
                <input className="input-dark" placeholder="Senior Portfolio Manager at..." maxLength={120} value={bio} onChange={e => setBio(e.target.value)} />
                <p className="text-[10px] text-muted-foreground mt-0.5">{bio.length}/120</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Notification preferences</label>
                <div className="space-y-2">
                  {[
                    { key: "transaction_alerts", label: "New transaction alerts" },
                    { key: "budget_warnings", label: "Budget limit warnings" },
                    { key: "weekly_summary", label: "Weekly summary" },
                    { key: "ai_insights", label: "AI insights ready" },
                    { key: "tips_advice", label: "Tips and advice" },
                  ].map(n => (
                    <label key={n.key} className="flex items-center justify-between text-sm text-muted-foreground cursor-pointer">
                      <span>{n.label}</span>
                      <button
                        type="button"
                        onClick={() => toggleNotif(n.key)}
                        className={`w-10 h-5 rounded-full transition-colors relative ${(notifPrefs as any)[n.key] ? "bg-primary" : "bg-border"}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${(notifPrefs as any)[n.key] ? "left-5" : "left-0.5"}`} />
                      </button>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-ghost flex-1">Back</button>
                <button onClick={handleSignup} className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={loading}>
                  {loading ? "Creating..." : "Create Account"} {!loading && <Sparkles className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 text-center">
          <button onClick={() => { setMode("login"); setStep(1); }} className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Already have an account? Log In
          </button>
        </div>
      </motion.div>
    </div>
  );
}
