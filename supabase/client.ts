import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase credentials not found in environment variables");
    throw new Error("Supabase credentials not found");
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};
