import { internalAction, internalMutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string) {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
  });
  const data = await res.json();
  return data.access_token as string;
}

export const refresh = internalAction({
  args: {},
  handler: async (ctx) => {
    const clientId = process.env.SPOTIFY_CLIENT_ID!;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
    const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN!;

    const accessToken = await getAccessToken(clientId, clientSecret, refreshToken);

    const [tracksRes, artistsRes] = await Promise.all([
      fetch("https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=short_term", {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      fetch("https://api.spotify.com/v1/me/top/artists?limit=5&time_range=short_term", {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    ]);

    const [tracksData, artistsData] = await Promise.all([tracksRes.json(), artistsRes.json()]);

    type SpotifyTrack = {
      id: string;
      name: string;
      artists: { name: string }[];
      album: { images: { url: string }[] };
      external_urls: { spotify: string };
    };
    type SpotifyArtist = {
      id: string;
      name: string;
      images: { url: string }[];
      external_urls: { spotify: string };
    };

    const topTracks = (tracksData.items ?? []).map((t: SpotifyTrack) => ({
      id: t.id,
      name: t.name,
      artist: t.artists.map((a) => a.name).join(", "),
      albumArt: t.album?.images?.[1]?.url ?? t.album?.images?.[0]?.url,
      url: t.external_urls.spotify,
    }));

    const topArtists = (artistsData.items ?? []).map((a: SpotifyArtist) => ({
      id: a.id,
      name: a.name,
      image: a.images?.[1]?.url ?? a.images?.[0]?.url,
      url: a.external_urls.spotify,
    }));

    await ctx.runMutation(internal.spotify.save, { topTracks, topArtists });
  },
});

export const save = internalMutation({
  args: {
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
  },
  handler: async (ctx, { topTracks, topArtists }) => {
    const existing = await ctx.db.query("spotifySnapshot").first();
    const doc = { topTracks, topArtists, fetchedAt: Date.now() };
    if (existing) {
      await ctx.db.patch(existing._id, doc);
    } else {
      await ctx.db.insert("spotifySnapshot", doc);
    }
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("spotifySnapshot").first();
  },
});
