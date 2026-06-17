"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";

// ─── Game constants ───────────────────────────────────────────────────────────
const COLS = 12;
const ROWS = 20;
const CELL = 20; // logical px per grid cell → 240 × 400 canvas
const TOTAL_FOOD = 10;
const SPEED = 140; // ms per tick

// ─── Types ────────────────────────────────────────────────────────────────────
type Dir = "U" | "D" | "L" | "R";
type Phase = "idle" | "playing" | "over" | "won";
type Pt = { x: number; y: number };

const OPP: Record<Dir, Dir> = { U: "D", D: "U", L: "R", R: "L" };
const DXY: Record<Dir, Pt> = {
  U: { x: 0, y: -1 },
  D: { x: 0, y: 1 },
  L: { x: -1, y: 0 },
  R: { x: 1, y: 0 },
};

const INIT_SNAKE: Pt[] = [
  { x: 5, y: 10 },
  { x: 5, y: 11 },
  { x: 5, y: 12 },
];

function randomFood(snake: Pt[]): Pt {
  let p: Pt;
  do {
    p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some((s) => s.x === p.x && s.y === p.y));
  return p;
}

// ─── Canvas helpers ───────────────────────────────────────────────────────────
function rrect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SnakeGame({ className }: { className?: string }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [eaten, setEaten] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snakeRef = useRef<Pt[]>(INIT_SNAKE.map((p) => ({ ...p })));
  const dirRef = useRef<Dir>("U");
  const nextDirRef = useRef<Dir>("U");
  const foodRef = useRef<Pt>(randomFood(INIT_SNAKE));
  const eatenRef = useRef(0);
  const phaseRef = useRef<Phase>("idle");

  // ─── Rendering ─────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    // Background
    ctx.fillStyle = "#1d293d";
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);

    // Food
    const f = foodRef.current;
    ctx.save();
    ctx.shadowColor = "#00d5be";
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#00d5be";
    ctx.beginPath();
    ctx.arc(f.x * CELL + CELL / 2, f.y * CELL + CELL / 2, CELL / 2 - 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Snake body (back to front so head renders on top)
    const snake = snakeRef.current;
    for (let i = snake.length - 1; i >= 0; i--) {
      const seg = snake[i];
      const isHead = i === 0;
      ctx.save();
      ctx.shadowColor = "#00d5be";
      ctx.shadowBlur = isHead ? 18 : 4;
      ctx.fillStyle = isHead ? "#00d5be" : "#175e56";
      rrect(ctx, seg.x * CELL + 2, seg.y * CELL + 2, CELL - 4, CELL - 4, isHead ? 5 : 3);
      ctx.fill();
      ctx.restore();
    }
  }, []);

  // ─── Start / restart ───────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    snakeRef.current = INIT_SNAKE.map((p) => ({ ...p }));
    dirRef.current = "U";
    nextDirRef.current = "U";
    foodRef.current = randomFood(INIT_SNAKE);
    eatenRef.current = 0;
    setEaten(0);
    phaseRef.current = "playing";
    setPhase("playing");
  }, []);

  // ─── Steering (keyboard + button clicks) ───────────────────────────────────
  const steer = useCallback((d: Dir) => {
    if (phaseRef.current !== "playing") return;
    if (d !== OPP[dirRef.current]) nextDirRef.current = d;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (phaseRef.current !== "playing") startGame();
        return;
      }
      const map: Record<string, Dir> = {
        ArrowUp: "U",
        ArrowDown: "D",
        ArrowLeft: "L",
        ArrowRight: "R",
      };
      const d = map[e.key];
      if (!d) return;
      e.preventDefault();
      steer(d);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [steer, startGame]);

  // ─── Game loop ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "playing") return;

    const tick = () => {
      dirRef.current = nextDirRef.current;
      const head = snakeRef.current[0];
      const d = DXY[dirRef.current];
      const nh: Pt = { x: head.x + d.x, y: head.y + d.y };

      // Wall collision
      if (nh.x < 0 || nh.x >= COLS || nh.y < 0 || nh.y >= ROWS) {
        phaseRef.current = "over";
        setPhase("over");
        draw();
        return;
      }

      // Self collision
      if (snakeRef.current.some((s) => s.x === nh.x && s.y === nh.y)) {
        phaseRef.current = "over";
        setPhase("over");
        draw();
        return;
      }

      const ateFood = nh.x === foodRef.current.x && nh.y === foodRef.current.y;
      if (ateFood) {
        const newEaten = eatenRef.current + 1;
        eatenRef.current = newEaten;
        setEaten(newEaten);
        snakeRef.current = [nh, ...snakeRef.current];
        if (newEaten >= TOTAL_FOOD) {
          phaseRef.current = "won";
          setPhase("won");
          draw();
          return;
        }
        foodRef.current = randomFood(snakeRef.current);
      } else {
        snakeRef.current = [nh, ...snakeRef.current.slice(0, -1)];
      }

      draw();
    };

    const id = setInterval(tick, SPEED);
    return () => clearInterval(id);
  }, [phase, draw]);

  // Draw on mount and phase transitions
  useEffect(() => {
    draw();
  }, [draw, phase]);

  const foodRemaining = TOTAL_FOOD - eaten;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className={[
        "border-theme-theme-stroke rounded-3 relative flex gap-6 overflow-hidden border p-7",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Glassmorphism backdrop */}
      <div
        aria-hidden
        className="rounded-3 pointer-events-none absolute inset-0 backdrop-blur-[32px]"
        style={{
          backgroundImage:
            "linear-gradient(152deg, rgba(23,85,83,0.7) 1.7%, rgba(67,217,173,0.091) 81.8%)",
        }}
      />

      {/* ── Game board ─────────────────────────────────────────────────────── */}
      <div className="bg-primitive-slate-800 rounded-2 relative h-101.25 w-60 shrink-0 overflow-hidden shadow-[inset_1px_5px_11px_0px_rgba(2,18,27,0.71)]">
        <canvas
          ref={canvasRef}
          width={COLS * CELL}
          height={ROWS * CELL}
          className="block h-full w-full"
        />

        {/* Idle: start-game button */}
        {phase === "idle" && (
          <div
            className="absolute inset-0 flex items-end justify-center"
            style={{ paddingBottom: "70px" }}
          >
            <Button variant="primary" onClick={startGame}>
              start-game
            </Button>
          </div>
        )}

        {/* Game over / won: banner + action text */}
        {(phase === "over" || phase === "won") && (
          <>
            <div
              className="rounded-2 absolute right-0 left-0 flex h-12 flex-col items-center justify-center shadow-[inset_1px_5px_11px_0px_rgba(2,18,27,0.71)]"
              style={{ top: "264px", backgroundColor: "rgba(1,22,39,0.84)" }}
            >
              <p className="text-heading-h5 text-primitive-teal-400">
                {phase === "won" ? "WELL DONE!" : "GAME OVER!"}
              </p>
            </div>
            <button
              className="absolute right-0 left-0 flex cursor-pointer items-center justify-center"
              style={{ top: "333px" }}
              onClick={startGame}
            >
              <p className="text-body-sm text-theme-foreground">
                {phase === "won" ? "play-again" : "start-again"}
              </p>
            </button>
          </>
        )}
      </div>

      {/* ── Right panel ────────────────────────────────────────────────────── */}
      <div className="relative flex w-45 shrink-0 flex-col items-end justify-between self-stretch">
        <div className="flex w-full flex-col gap-6">
          {/* Keyboard / arrow buttons */}
          <div className="bg-primitive-slate-800 gap-button-left-right rounded-3 flex w-full flex-col items-center justify-center p-[10px]">
            <p className="text-body-sm text-primitive-slate-50 w-full">
              {"// use keyboard"}
              <br />
              {"// arrows to play"}
            </p>
            <div className="flex h-17 flex-col items-center justify-center gap-3">
              {/* Up */}
              <button
                className="bg-primitive-grey-950 border-theme-theme-stroke rounded-3 flex min-h-px w-[48px] flex-1 cursor-pointer items-center justify-center border p-1.5"
                onClick={() => steer("U")}
                aria-label="Move up"
              >
                <i
                  className="ri-arrow-down-s-fill text-primitive-grey-50 rotate-180 text-[18px] leading-none"
                  aria-hidden
                />
              </button>
              {/* Down / Left / Right */}
              <div className="flex shrink-0 items-end justify-center gap-3">
                <button
                  className="bg-primitive-grey-950 border-theme-theme-stroke rounded-3 flex w-[48px] cursor-pointer items-center justify-center border p-1.5"
                  onClick={() => steer("L")}
                  aria-label="Move left"
                >
                  <i
                    className="ri-arrow-down-s-fill text-primitive-grey-50 rotate-90 text-[18px] leading-none"
                    aria-hidden
                  />
                </button>
                <button
                  className="bg-primitive-grey-950 border-theme-theme-stroke rounded-3 flex w-[48px] cursor-pointer items-center justify-center border p-1.5"
                  onClick={() => steer("D")}
                  aria-label="Move down"
                >
                  <i
                    className="ri-arrow-down-s-fill text-primitive-grey-50 text-[18px] leading-none"
                    aria-hidden
                  />
                </button>
                <button
                  className="bg-primitive-grey-950 border-theme-theme-stroke rounded-3 flex w-[48px] cursor-pointer items-center justify-center border p-1.5"
                  onClick={() => steer("R")}
                  aria-label="Move right"
                >
                  <i
                    className="ri-arrow-down-s-fill text-primitive-grey-50 -rotate-90 text-[18px] leading-none"
                    aria-hidden
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Food tracker */}
          <div className="flex w-full flex-col items-center justify-center gap-3 px-[10px]">
            <p className="text-body-sm text-primitive-slate-50 w-full">{"// food left"}</p>
            <div className="flex w-34 flex-col gap-3">
              {[0, 5].map((rowStart) => (
                <div key={rowStart} className="flex gap-3">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const idx = rowStart + i;
                    return (
                      <Image
                        key={idx}
                        src={
                          idx < foodRemaining
                            ? "/snake/food-dot-active.svg"
                            : "/snake/food-dot-inactive.svg"
                        }
                        alt=""
                        width={21}
                        height={21}
                        className="size-5.25"
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skip button */}
        <button className="border-primitive-slate-50 rounded-3 px-button-left-right py-button-top-bottom hover:bg-primitive-slate-800 cursor-pointer border transition-colors">
          <p className="text-body-sm text-theme-heading-foreground whitespace-nowrap">skip</p>
        </button>
      </div>

      {/* Corner bolts */}
      <Image
        src="/snake/bolt-up-left.svg"
        alt=""
        width={13}
        height={13}
        className="absolute top-3 left-3"
        aria-hidden
      />
      <Image
        src="/snake/bolt-down-left.svg"
        alt=""
        width={13}
        height={13}
        className="absolute bottom-3 left-3"
        aria-hidden
      />
      <Image
        src="/snake/bolt-down-right.svg"
        alt=""
        width={13}
        height={13}
        className="absolute right-3 bottom-3"
        aria-hidden
      />
      <Image
        src="/snake/bolt-up-right.svg"
        alt=""
        width={13}
        height={13}
        className="absolute top-3 right-3"
        aria-hidden
      />

      {/* Inner glint */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[inherit] shadow-[inset_0px_2px_0px_0px_rgba(255,255,255,0.3)]"
      />
    </div>
  );
}
