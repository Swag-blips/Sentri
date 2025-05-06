import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

export const storeTenant = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    apiKey: v.string(),
    tenantId: v.string(),
  },
  handler: async (ctx, args) => {
    const tenant = await ctx.db.insert("tenants", {
      name: args.name,
      email: args.email,
      password: args.password,
      apiKey: args.apiKey,
      tenantId: args.tenantId,
    });

    return tenant
  },
});
