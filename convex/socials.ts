import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const SOCIAL_PLATFORM = v.union(
  v.literal("github"),
  v.literal("linkedin"),
  v.literal("x"),
  v.literal("instagram"),
);

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("socials").order("asc").collect();
  },
});

export const upsert = mutation({
  args: {
    platform: SOCIAL_PLATFORM,
    url: v.string(),
    handle: v.optional(v.string()),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("socials")
      .withIndex("by_platform", (q) => q.eq("platform", args.platform))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("socials", args);
    }
  },
});

export const remove = mutation({
  args: { platform: SOCIAL_PLATFORM },
  handler: async (ctx, { platform }) => {
    const existing = await ctx.db
      .query("socials")
      .withIndex("by_platform", (q) => q.eq("platform", platform))
      .first();
    if (existing) await ctx.db.delete(existing._id);
  },
});
