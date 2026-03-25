import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const demoTransactions = [
  { description: "Naivas Supermarket", amount: 3450, category: "Food & Dining", type: "expense", date: "2025-03-22" },
  { description: "Salary - March", amount: 185000, category: "Salary", type: "income", date: "2025-03-01" },
  { description: "Uber Ride to CBD", amount: 650, category: "Transport", type: "expense", date: "2025-03-21" },
  { description: "Kenya Power Bill", amount: 4200, category: "Utilities", type: "expense", date: "2025-03-15" },
  { description: "Artcaffe Lunch", amount: 2100, category: "Food & Dining", type: "expense", date: "2025-03-20" },
  { description: "Safaricom Airtime", amount: 500, category: "Utilities", type: "expense", date: "2025-03-19" },
  { description: "Netflix Subscription", amount: 1100, category: "Entertainment", type: "expense", date: "2025-03-18" },
  { description: "Freelance Project", amount: 45000, category: "Freelance", type: "income", date: "2025-03-10" },
  { description: "Rent Payment", amount: 35000, category: "Housing", type: "expense", date: "2025-03-05" },
  { description: "Java House Coffee", amount: 450, category: "Food & Dining", type: "expense", date: "2025-03-17" },
  { description: "Gym Membership", amount: 5000, category: "Health", type: "expense", date: "2025-03-03" },
  { description: "Jumia Shopping", amount: 7800, category: "Shopping", type: "expense", date: "2025-03-14" },
  { description: "Coursera Subscription", amount: 4500, category: "Education", type: "expense", date: "2025-03-12" },
  { description: "M-Pesa Investment", amount: 10000, category: "Investment", type: "expense", date: "2025-03-08" },
  { description: "Bolt Ride", amount: 380, category: "Transport", type: "expense", date: "2025-03-16" },
  { description: "Nairobi Water Bill", amount: 1800, category: "Utilities", type: "expense", date: "2025-03-13" },
  { description: "Carrefour Groceries", amount: 5600, category: "Food & Dining", type: "expense", date: "2025-03-11" },
  { description: "Side Gig Payment", amount: 22000, category: "Freelance", type: "income", date: "2025-02-25" },
  { description: "Pharmacy - Meds", amount: 1200, category: "Health", type: "expense", date: "2025-02-20" },
  { description: "Salary - February", amount: 185000, category: "Salary", type: "income", date: "2025-02-01" },
];

const demoBudgets = [
  { category: "Food & Dining", limit: 15000, month: "2025-03" },
  { category: "Transport", limit: 5000, month: "2025-03" },
  { category: "Housing", limit: 40000, month: "2025-03" },
  { category: "Entertainment", limit: 3000, month: "2025-03" },
  { category: "Utilities", limit: 8000, month: "2025-03" },
  { category: "Shopping", limit: 10000, month: "2025-03" },
  { category: "Health", limit: 7000, month: "2025-03" },
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const userId = claimsData.claims.sub;

    // Delete existing user data
    await supabase.from("transactions").delete().eq("user_id", userId);
    await supabase.from("budgets").delete().eq("user_id", userId);
    await supabase.from("notifications").delete().eq("user_id", userId);

    // Insert demo transactions
    const { error: txError } = await supabase.from("transactions").insert(
      demoTransactions.map(t => ({ ...t, user_id: userId }))
    );
    if (txError) throw txError;

    // Insert demo budgets
    const { error: budgetError } = await supabase.from("budgets").insert(
      demoBudgets.map(b => ({ ...b, user_id: userId }))
    );
    if (budgetError) throw budgetError;

    // Insert welcome notifications
    await supabase.from("notifications").insert([
      { user_id: userId, title: "Welcome to Finova!", message: "Demo data has been loaded. Explore your dashboard!", type: "success" },
      { user_id: userId, title: "Budget Alert", message: "Food & Dining is at 77% of your monthly limit", type: "warning" },
      { user_id: userId, title: "Housing Budget", message: "You've spent 87.5% of your housing budget", type: "warning" },
    ]);

    return new Response(JSON.stringify({ success: true, message: "Demo data seeded" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Seed error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
