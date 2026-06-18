import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const TECH = v.union(
  v.literal("react"),
  v.literal("react-native"),
  v.literal("nextjs"),
  v.literal("html"),
  v.literal("css"),
  v.literal("vue"),
  v.literal("svelte"),
  v.literal("angular"),
  v.literal("gatsby"),
  v.literal("flutter"),
);

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("projects").order("asc").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
    tech: v.array(TECH),
    primaryTech: v.optional(TECH),
    longDescription: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    liveUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("projects", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("projects"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    tech: v.optional(v.array(TECH)),
    primaryTech: v.optional(TECH),
    longDescription: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    liveUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
