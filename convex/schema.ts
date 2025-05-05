import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tenants: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.string(),
    tenantId: v.string(),
    apiKey: v.string(),
  }).index("by_email", ["email"]),
});
