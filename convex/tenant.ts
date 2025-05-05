import { v } from "convex/values";
import { query } from "./_generated/server";

export const getUser = query({
  args: { email: v.string() },
});
