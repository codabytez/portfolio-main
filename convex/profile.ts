import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("profile").first();
  },
});

export const upsert = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    tagline: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("profile").first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("profile", args);
    }
  },
});
