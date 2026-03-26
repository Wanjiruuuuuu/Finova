
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS income_source text,
  ADD COLUMN IF NOT EXISTS income_range text,
  ADD COLUMN IF NOT EXISTS financial_goals jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{"transaction_alerts": true, "budget_warnings": true, "weekly_summary": true, "ai_insights": true, "tips_advice": true}'::jsonb,
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS plan text NOT NULL DEFAULT 'free';

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
