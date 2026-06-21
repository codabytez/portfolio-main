import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const SOCIAL_PLATFORM = v.union(
  v.literal("github"),
  v.literal("linkedin"),
  v.literal("x"),
  v.literal("instagram"),
);

const ABOUT_KEY = v.union(
  v.literal("bio"),
  v.literal("interests"),
  v.literal("education"),
  v.literal("experience"),
  v.literal("skills"),
  v.literal("certificates"),
  v.literal("music"),
  v.literal("movies"),
  v.literal("games"),
);

export default defineSchema({
  // Singleton — profile info used in header, hero, meta
  profile: defineTable({
    name: v.string(), // "Michael Weaver"
    slug: v.string(), // "michael-weaver" (used in header link)
    tagline: v.string(), // shown under name on home page
  }),

  // One doc per about section key — content is plain text, formatted as JSDoc in the editor
  aboutSections: defineTable({
    key: ABOUT_KEY,
    title: v.string(), // "Bio", "Education", etc.
    content: v.string(), // multi-line plain text; each line becomes " * {line}"
  }).index("by_key", ["key"]),

  // Portfolio projects
  projects: defineTable({
    name: v.string(),
    slug: v.string(), // "_ui-animations"
    description: v.string(),
    imageUrl: v.optional(v.string()),
    tech: v.array(v.string()),
    primaryTech: v.optional(v.string()),
    longDescription: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    liveUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    order: v.number(),
    published: v.optional(v.boolean()),
  }),

  // Singleton — contact details
  contact: defineTable({
    email: v.string(),
    phone: v.optional(v.string()),
  }),

  // Spotify top tracks + artists, refreshed daily by scheduled action
  spotifySnapshot: defineTable({
    topTracks: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        artist: v.string(),
        albumArt: v.optional(v.string()),
        url: v.string(),
      }),
    ),
    topArtists: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        image: v.optional(v.string()),
        url: v.string(),
      }),
    ),
    fetchedAt: v.number(),
  }),

  // Social links used across header, footer, and contact sidebar
  socials: defineTable({
    platform: SOCIAL_PLATFORM,
    url: v.string(),
    handle: v.optional(v.string()), // "@username" display text
    order: v.number(),
  }).index("by_platform", ["platform"]),
});
