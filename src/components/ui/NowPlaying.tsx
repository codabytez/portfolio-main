"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

type Track = {
  isPlaying: boolean;
  name: string;
  artist: string;
  albumArt?: string;
  url: string;
  progressMs: number;
  durationMs: number;
};

function fmt(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

// Pre-baked waveform heights (px) — mimics real audio waveform shape
const BARS = [
  4, 6, 10, 16, 9, 18, 13, 7, 20, 14, 8, 22, 15, 6, 19, 11, 5, 21, 13, 7, 24, 16, 9, 20, 12, 6, 22,
  14, 7, 18, 11, 5, 21, 13, 7, 23, 15, 8, 19, 12, 6, 22, 14, 7, 18, 11, 5, 20, 13, 7,
];
const BAR_COUNT = BARS.length;

export default function NowPlaying({ delay = 0 }: { delay?: number }) {
  const [track, setTrack] = useState<Track | null>(null);
  const [progressMs, setProgressMs] = useState(0);
  const [copied, setCopied] = useState(false);
  const syncRef = useRef<{ progressMs: number; syncedAt: number } | null>(null);
  const emptyStreakRef = useRef(0);

  async function fetchNowPlaying() {
    try {
      const res = await fetch("/api/spotify/now-playing");
      const data = await res.json();
      if (data.name) {
        emptyStreakRef.current = 0;
        setTrack(data);
        if (data.isPlaying) {
          setProgressMs(data.progressMs);
          syncRef.current = { progressMs: data.progressMs, syncedAt: Date.now() };
        } else {
          setProgressMs(data.progressMs);
          syncRef.current = null;
        }
      } else {
        // only hide after two consecutive empty responses to survive transient 204s
        emptyStreakRef.current += 1;
        if (emptyStreakRef.current >= 2) {
          setTrack(null);
          syncRef.current = null;
        }
      }
    } catch {
      // silently fail
    }
  }

  useEffect(() => {
    const initial = setTimeout(fetchNowPlaying, 0);
    const poll = setInterval(fetchNowPlaying, 5_000);
    return () => {
      clearTimeout(initial);
      clearInterval(poll);
    };
  }, []);

  useEffect(() => {
    if (!track?.isPlaying) return;
    const tick = setInterval(() => {
      if (!syncRef.current) return;
      const elapsed = Date.now() - syncRef.current.syncedAt;
      const next = Math.min(syncRef.current.progressMs + elapsed, track.durationMs);
      setProgressMs(next);
    }, 1_000);
    return () => clearInterval(tick);
  }, [track]);

  const playedBarCount = track ? Math.floor((progressMs / track.durationMs) * BAR_COUNT) : 0;

  return (
    <AnimatePresence>
      {track && (
        <motion.a
          href={track.url}
          target="_blank"
          rel="noopener noreferrer"
          className="border-theme-theme-stroke/20 bg-primitive-slate-900/80 hover:border-theme-theme-stroke/40 flex w-full max-w-lg items-center gap-4 rounded-xl border px-2 py-2 backdrop-blur-sm transition-colors"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ type: "spring", stiffness: 360, damping: 28, delay }}
        >
          {/* Album art */}
          <div className="relative size-11 shrink-0 overflow-hidden rounded-md">
            {track.albumArt ? (
              <Image src={track.albumArt} alt={track.name} fill className="object-cover" />
            ) : (
              <div className="bg-primitive-slate-700 size-full" />
            )}
          </div>

          {/* Track info */}
          <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:w-28 sm:flex-none lg:w-auto lg:flex-1 xl:w-28 xl:flex-none">
            <p className="text-body-sm text-theme-heading-foreground truncate leading-tight font-semibold">
              {track.name}
            </p>
            <p className="text-body-xs text-theme-foreground/50 truncate leading-tight">
              {track.artist}
            </p>
          </div>

          {/* Waveform */}
          <div className="hidden h-7 flex-1 items-end gap-px sm:flex lg:hidden xl:flex">
            {BARS.map((h, i) => {
              const played = i < playedBarCount;
              if (played && track?.isPlaying) {
                return (
                  <motion.span
                    key={i}
                    className="bg-primitive-teal-400 w-1 shrink-0 rounded-sm"
                    animate={{ height: [h * 0.5, h, h * 0.55] }}
                    transition={{
                      duration: 0.6 + (i % 5) * 0.1,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: (i % 7) * 0.08,
                    }}
                  />
                );
              }
              return (
                <span
                  key={i}
                  className={`w-1 shrink-0 rounded-sm ${played ? "bg-primitive-teal-400" : "bg-primitive-slate-600"}`}
                  style={{ height: h }}
                />
              );
            })}
          </div>

          {/* Timestamp */}
          <span className="text-theme-foreground/50 hidden shrink-0 font-mono text-[11px] tabular-nums sm:inline">
            {fmt(progressMs)} / {fmt(track.durationMs)}
          </span>

          {/* Share */}
          <button
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              try {
                if (navigator.share) {
                  await navigator.share({
                    title: track.name,
                    text: `${track.name} by ${track.artist}`,
                    url: track.url,
                  });
                } else {
                  await navigator.clipboard.writeText(track.url);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }
              } catch {
                // user cancelled or permission denied
              }
            }}
            className="bg-primitive-slate-700 hover:bg-primitive-slate-600 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors"
            aria-label="Share track"
          >
            {copied ? (
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 7l3.5 3.5L11 3" />
              </svg>
            ) : (
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 2H2.5A1.5 1.5 0 0 0 1 3.5v7A1.5 1.5 0 0 0 2.5 12h7A1.5 1.5 0 0 0 11 10.5V8" />
                <path d="M8 1h4v4" />
                <path d="M12 1L6 7" />
              </svg>
            )}
          </button>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
