import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Key, ChevronRight, Trash2 } from "lucide-react";
import { useIsDemo } from "@/contexts/DemoContext";
import { useProfile, useUpdateProfile } from "@/hooks/useFinanceData";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function SettingsPage() {
  const isDemo = useIsDemo();
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();

  const [currency, setCurrency] = useState(profile?.currency || "KES");
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const currencies = ["KES", "USD", "GBP"];

  const displayName = isDemo ? "Rachel Maina" : (fullName || profile?.full_name || "");
  const displayEmail = isDemo ? "rachel@finova.app" : (user?.email || "");
  const initial = displayName.charAt(0).toUpperCase() || "U";

  const handleSave = () => {
    if (isDemo) return;
    updateProfile.mutate(
      { full_name: fullName, bio, currency },
      {
        onSuccess: () => toast.success("Profile updated!"),
        onError: (e) => toast.error(e.message),
      }
    );
  };

  // Sync state when profile loads
  useState(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setBio(profile.bio || "");
      setCurrency(profile.currency || "KES");
    }
  });

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-sm font-bold text-foreground mb-4">Profile</h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-2xl font-bold">{initial}</div>
          <div>
            <p className="text-foreground font-semibold">{displayName || "User"}</p>
            <p className="text-sm text-muted-foreground">{displayEmail}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
            <input className="input-dark" value={isDemo ? "Rachel Maina" : fullName} onChange={e => setFullName(e.target.value)} disabled={isDemo} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Email</label>
            <input className="input-dark opacity-60" value={displayEmail} readOnly />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Bio</label>
            <textarea className="input-dark min-h-[80px] resize-none" placeholder="Tell us about yourself..." value={isDemo ? "" : bio} onChange={e => setBio(e.target.value)} disabled={isDemo} />
          </div>
          <button className="btn-primary" onClick={handleSave} disabled={isDemo || updateProfile.isPending}>
            {updateProfile.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>

      <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-sm font-bold text-foreground mb-4">Preferences</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Primary Currency</label>
            <div className="flex gap-2">
              {currencies.map(c => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${currency === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Date Format</label>
            <select className="input-dark">
              <option>DD/MM/YYYY</option>
              <option>MM/DD/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </motion.div>

      <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-sm font-bold text-foreground mb-4">Security</h2>
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors text-left">
            <Shield className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Add extra security to your account</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors text-left">
            <Key className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Password Protocols</p>
              <p className="text-xs text-muted-foreground">Manage your password settings</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </motion.div>

      <motion.div className="glass-card border border-expense/20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-sm font-bold text-expense mb-2">Danger Zone</h2>
        <p className="text-xs text-muted-foreground mb-4">This action cannot be undone. Please be certain.</p>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-expense/10 text-expense text-sm font-semibold hover:bg-expense/20 transition-colors">
          <Trash2 className="w-4 h-4" /> Delete Account
        </button>
      </motion.div>
    </div>
  );
}
