"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// ─── Script ───────────────────────────────────────────────────────────────────
type ScriptLine = { main: string; suffix?: string; final?: boolean };

const LINES: ScriptLine[] = [
  { main: "> initializing portfolio..." },
  { main: "> loading modules", suffix: " ............. [OK]" },
  { main: "> mounting components", suffix: " ......... [OK]" },
  { main: "> syncing data", suffix: " ................ [OK]" },
  { main: "" },
  { main: "> all systems go.", final: true },
];

const CHAR_DELAY = 22;
const LINE_PAUSE = 120;

// ─── Particles ────────────────────────────────────────────────────────────────
const N = 60;
const MAX_DIST = 110;
const MOUSE_R = 160;
const MOUSE_STR = 0.032;

type Pt = { x: number; y: number; vx: number; vy: number };

function spawnParticles(w: number, h: number): Pt[] {
  return Array.from({ length: N }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
  }));
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [linesDone, setLinesDone] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [allDone, setAllDone] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Pt[]>([]);
  const rafRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Show only once per session
  useEffect(() => {
    const seen = sessionStorage.getItem("portfolio-loaded");
    if (seen) {
      setTimeout(() => setVisible(false), 0);
    } else {
      sessionStorage.setItem("portfolio-loaded", "1");
    }
  }, []);

  const dismiss = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => setVisible(false), 750);
  }, [exiting]);

  // ─── Canvas: particle network + mouse gravity ─────────────────────────────
  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (particlesRef.current.length === 0)
        particlesRef.current = spawnParticles(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouse);

    const tick = () => {
      const { width: w, height: h } = canvas;
      const pts = particlesRef.current;
      const { x: mx, y: my } = mouseRef.current;

      ctx.clearRect(0, 0, w, h);

      for (const p of pts) {
        const dx = mx - p.x,
          dy = my - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MOUSE_R && d > 0) {
          const f = (1 - d / MOUSE_R) * MOUSE_STR;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.x = (p.x + p.vx + w) % w;
        p.y = (p.y + p.vy + h) % h;
      }

      // Connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x,
            dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,213,190,${(1 - d / MAX_DIST) * 0.3})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      // Dots
      for (const p of pts) {
        ctx.beginPath();
        ctx.fillStyle = "rgba(0,213,190,0.55)";
        ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [visible]);

  // ─── Typing sequence ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!visible) return;

    let lineIdx = 0;
    let charIdx = 0;

    const advance = () => {
      const line = LINES[lineIdx];
      if (!line) {
        setAllDone(true);
        return;
      }

      if (charIdx <= line.main.length) {
        setCurrentText(line.main.slice(0, charIdx));
        charIdx++;
        timerRef.current = setTimeout(advance, line.main === "" ? 0 : CHAR_DELAY);
      } else {
        setLinesDone(lineIdx + 1);
        lineIdx++;
        charIdx = 0;
        setCurrentText("");
        timerRef.current = setTimeout(advance, LINE_PAUSE);
      }
    };

    timerRef.current = setTimeout(advance, 400);
    return () => clearTimeout(timerRef.current);
  }, [visible]);

  // Auto-dismiss 1.8s after sequence finishes
  useEffect(() => {
    if (!allDone) return;
    const t = setTimeout(dismiss, 1800);
    return () => clearTimeout(t);
  }, [allDone, dismiss]);

  // Any key or click to skip
  useEffect(() => {
    if (!visible) return;
    const onKey = () => dismiss();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, dismiss]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] } }}
          onClick={dismiss}
          className="fixed inset-0 z-100 flex cursor-pointer items-center justify-center overflow-hidden"
          style={{ background: "#020618" }}
        >
          {/* Particle canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

          {/* Scanlines */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)",
            }}
          />

          {/* Terminal panel */}
          <div className="relative z-10 w-full max-w-110 px-6" onClick={(e) => e.stopPropagation()}>
            <div
              className="overflow-hidden rounded border font-mono text-sm"
              style={{
                borderColor: "rgba(0,213,190,0.25)",
                backgroundColor: "rgba(2,6,24,0.88)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 0 0 1px rgba(0,213,190,0.08), 0 0 40px rgba(0,213,190,0.06)",
              }}
            >
              {/* Title bar */}
              <div
                className="flex items-center gap-2 border-b px-4 py-2.5"
                style={{ borderColor: "rgba(0,213,190,0.15)" }}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#ff637e" }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#fdc700" }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#00d5be" }} />
                <span className="ml-2 text-xs" style={{ color: "rgba(0,213,190,0.4)" }}>
                  portfolio.init
                </span>
              </div>

              {/* Lines */}
              <div className="space-y-1 px-5 py-5">
                {LINES.slice(0, linesDone).map((line, i) => (
                  <div key={i} style={{ minHeight: "1.4em" }}>
                    <span
                      style={{
                        color: line.final ? "#00d5be" : "rgba(144,161,185,0.85)",
                        textShadow: line.final ? "0 0 14px rgba(0,213,190,0.55)" : "none",
                      }}
                    >
                      {line.main}
                    </span>
                    {line.suffix && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.18 }}
                        style={{
                          color: "#00d5be",
                          textShadow: "0 0 8px rgba(0,213,190,0.45)",
                        }}
                      >
                        {line.suffix}
                      </motion.span>
                    )}
                  </div>
                ))}

                {/* Currently typing */}
                {!allDone && linesDone < LINES.length && (
                  <div style={{ minHeight: "1.4em" }}>
                    <span style={{ color: "rgba(144,161,185,0.85)" }}>{currentText}</span>
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                      style={{ color: "#00d5be" }}
                    >
                      ▋
                    </motion.span>
                  </div>
                )}

                {/* Press any key */}
                {allDone && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-center text-xs"
                  >
                    <motion.span
                      animate={{ opacity: [0.35, 0.9, 0.35] }}
                      transition={{ duration: 1.3, repeat: Infinity }}
                      style={{ color: "rgba(0,213,190,0.6)" }}
                    >
                      [ press any key ]
                    </motion.span>
                  </motion.p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
