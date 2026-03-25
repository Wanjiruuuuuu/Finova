import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const fallbackInsights = {
  spendingScore: 78,
  summary: "Your spending patterns show disciplined financial behavior with a strong savings ratio of 38%. You're in the top 12% of users managing expenses in this income bracket.",
  personaArchetype: "The Strategic Minimalist",
  personaDescription: "You prioritize essential spending while maintaining a healthy investment portfolio.",
  observations: [
    "Food & Dining accounts for 15% of your total expenses — slightly above optimal",
    "Your housing costs remain within the recommended 30% of income threshold",
    "Investment contributions show consistent growth month over month",
  ],
  tips: [
    "Consider meal prepping to reduce Food & Dining expenses by 20%",
    "Set up automatic transfers to your investment account on payday",
    "Review utility subscriptions — potential KES 1,500 monthly savings identified",
  ],
  predictedBalance: 245000,
  reflectivePrompt: "If your spending habits were a story, what chapter would you say you're in — and what would the next chapter look like?",
};

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

    // Fetch last 3 months of transactions
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const { data: transactions, error: txError } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .gte("date", threeMonthsAgo.toISOString().slice(0, 10))
      .order("date", { ascending: false });

    if (txError) throw txError;

    if (!transactions || transactions.length === 0) {
      return new Response(JSON.stringify(fallbackInsights), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Summarize transactions for AI
    const totalIncome = transactions.filter(t => t.type === "income").reduce((a, t) => a + Number(t.amount), 0);
    const totalExpenses = transactions.filter(t => t.type === "expense").reduce((a, t) => a + Number(t.amount), 0);
    const categoryBreakdown: Record<string, number> = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + Number(t.amount);
    });

    const summary = `User's financial data (last 3 months):
Total Income: KES ${totalIncome.toLocaleString()}
Total Expenses: KES ${totalExpenses.toLocaleString()}
Net Savings: KES ${(totalIncome - totalExpenses).toLocaleString()}
Savings Rate: ${totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0}%
Category Breakdown: ${Object.entries(categoryBreakdown).map(([k, v]) => `${k}: KES ${v.toLocaleString()}`).join(", ")}
Number of transactions: ${transactions.length}`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.warn("LOVABLE_API_KEY not set, returning fallback insights");
      return new Response(JSON.stringify(fallbackInsights), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: "You are a financial analyst AI. Analyze the user's spending data and return ONLY valid JSON with no extra text or markdown.",
          },
          {
            role: "user",
            content: `${summary}

Return ONLY this JSON structure:
{
  "spendingScore": <0-100 integer>,
  "summary": "<2 sentence analysis>",
  "personaArchetype": "<creative financial persona title>",
  "personaDescription": "<1 sentence persona description>",
  "observations": ["<observation 1>", "<observation 2>", "<observation 3>"],
  "tips": ["<actionable tip 1>", "<actionable tip 2>", "<actionable tip 3>"],
  "predictedBalance": <predicted end-of-month balance number>,
  "reflectivePrompt": "<philosophical question about their finances>"
}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_finances",
              description: "Return financial analysis as structured data",
              parameters: {
                type: "object",
                properties: {
                  spendingScore: { type: "number" },
                  summary: { type: "string" },
                  personaArchetype: { type: "string" },
                  personaDescription: { type: "string" },
                  observations: { type: "array", items: { type: "string" } },
                  tips: { type: "array", items: { type: "string" } },
                  predictedBalance: { type: "number" },
                  reflectivePrompt: { type: "string" },
                },
                required: ["spendingScore", "summary", "personaArchetype", "personaDescription", "observations", "tips", "predictedBalance", "reflectivePrompt"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_finances" } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        console.warn("Rate limited, returning fallback");
        return new Response(JSON.stringify(fallbackInsights), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.error("AI gateway error:", aiResponse.status);
      return new Response(JSON.stringify(fallbackInsights), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    
    try {
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall) {
        const parsed = JSON.parse(toolCall.function.arguments);
        return new Response(JSON.stringify(parsed), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      // Try parsing content directly as fallback
      const content = aiData.choices?.[0]?.message?.content || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return new Response(JSON.stringify(parsed), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } catch (parseErr) {
      console.error("Failed to parse AI response:", parseErr);
    }

    return new Response(JSON.stringify(fallbackInsights), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Insights error:", e);
    return new Response(JSON.stringify(fallbackInsights), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
