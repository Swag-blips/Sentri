import { createClient, SupabaseClient } from "@supabase/supabase-js";

import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.SUPABASE_API_KEY as string;
const supabaseUrl = process.env.SUPABASE_URL as string;

let supabase: SupabaseClient | null = null;

if (!supabase) {
  supabase = createClient(supabaseUrl, apiKey);
}

export default supabase;
