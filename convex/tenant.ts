import { v } from "convex/values";
import { query } from "./_generated/server";

export const getTenant = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    return tenant;
  },
});
