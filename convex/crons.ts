import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.weekly(
  "refresh spotify snapshot",
  { dayOfWeek: "monday", hourUTC: 6, minuteUTC: 0 },
  internal.spotify.refresh,
);

export default crons;
