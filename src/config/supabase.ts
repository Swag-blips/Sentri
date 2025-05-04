import { createClient } from "@supabase/supabase-js";

const apiKey = process.env.SUPABASE_API_KEY as string;
const supabaseUrl = process.env.SUPABASE_URL as string;

let supabase;

if (!supabase) {
  supabase = createClient(supabaseUrl, apiKey);
}


export default supabase;
