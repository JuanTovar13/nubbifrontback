import { createClient, SupabaseClient } from "@supabase/supabase-js";

const useSupabase = (): SupabaseClient => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);
  return supabase;
};

export default useSupabase;