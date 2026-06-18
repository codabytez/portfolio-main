import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("aboutSections").collect();
  },
});

export const getByKey = query({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    return await ctx.db
      .query("aboutSections")
      .withIndex("by_key", (q) => q.eq("key", key as never))
      .first();
  },
});

export const upsert = mutation({
  args: {
    key: v.string(),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { key, title, content }) => {
    const existing = await ctx.db
      .query("aboutSections")
      .withIndex("by_key", (q) => q.eq("key", key as never))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { title, content });
    } else {
      await ctx.db.insert("aboutSections", { key: key as never, title, content });
    }
  },
});
