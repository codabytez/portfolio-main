"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

const ASCII_LINES = [
  "██╗  ██╗ ██████╗ ██╗  ██╗ ",
  "██║  ██║██╔═████╗██║  ██║ ",
  "███████║██║██╔██║███████║ ",
  "╚════██║████╔╝██║╚════██║ ",
  "     ██║╚██████╔╝     ██║ ",
  "     ╚═╝ ╚═════╝      ╚═╝ ",
];

const GLITCH_CHARS = "!<>-_/[]{}=+*^?#@$%&|\\~░▒▓";

const COLS = 17;
const ROWS = 9;
const TICK_MS = 150;

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Pt = [number, number];
type Mode = "glitch" | "playing" | "gameover";

const OPPOSITE: Record<Dir, Dir> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

const DELTA: Record<Dir, Pt> = {
  UP: [0, -1],
  DOWN: [0, 1],
  LEFT: [-1, 0],
  RIGHT: [1, 0],
};

const DIR_KEYS: Record<string, Dir> = {
  ArrowUp: "UP",
  ArrowDown: "DOWN",
  ArrowLeft: "LEFT",
  ArrowRight: "RIGHT",
  w: "UP",
  s: "DOWN",
  a: "LEFT",
  d: "RIGHT",
};

function randFood(snake: Pt[]): Pt {
  const occupied = new Set(snake.map(([x, y]) => `${x},${y}`));
  let pt: Pt;
  do {
    pt = [Math.floor(Math.random() * COLS), Math.floor(Math.random() * ROWS)];
  } while (occupied.has(`${pt[0]},${pt[1]}`));
  return pt;
}

const INIT_SNAKE: Pt[] = [
  [8, 4],
  [8, 5],
  [8, 6],
];

export default function NotFoundAscii() {
  const [mode, setMode] = useState<Mode>("glitch");
  const [glitchLines, setGlitchLines] = useState(ASCII_LINES);
  const [lineOffsets, setLineOffsets] = useState<number[]>(Array(ASCII_LINES.length).fill(0));
  const [bursting, setBursting] = useState(false);
  const [snake, setSnake] = useState<Pt[]>(INIT_SNAKE);
  const [food, setFood] = useState<Pt>(() => randFood(INIT_SNAKE));
  const [score, setScore] = useState(0);

  // Refs for game loop to avoid stale closures
  const modeRef = useRef<Mode>("glitch");
  const nextDirRef = useRef<Dir>("UP");
  const snakeRef = useRef<Pt[]>(INIT_SNAKE);
  const foodRef = useRef<Pt>(food);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);
  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  // --- GLITCH EFFECT ---
  useEffect(() => {
    if (mode !== "glitch") return;

    let timeout: ReturnType<typeof setTimeout>;

    function corruptLines(count: number) {
      const result = ASCII_LINES.map((l) => l);
      for (let i = 0; i < count; i++) {
        const li = Math.floor(Math.random() * ASCII_LINES.length);
        const line = ASCII_LINES[li];
        const nonSpace = [...line]
          .map((c, idx) => (c !== " " ? idx : -1))
          .filter((idx) => idx >= 0);
        if (!nonSpace.length) continue;
        const ci = nonSpace[Math.floor(Math.random() * nonSpace.length)];
        const corrupt = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        result[li] = result[li].slice(0, ci) + corrupt + result[li].slice(ci + 1);
      }
      return result;
    }

    function scrambleLine(li: number) {
      const result = ASCII_LINES.map((l) => l);
      result[li] = [...ASCII_LINES[li]]
        .map((c) => (c === " " ? c : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]))
        .join("");
      return result;
    }

    function triggerBurst() {
      const totalFrames = 3 + Math.floor(Math.random() * 4);
      let frame = 0;

      function nextFrame() {
        if (modeRef.current !== "glitch") return;
        if (frame >= totalFrames) {
          setGlitchLines(ASCII_LINES);
          setBursting(false);
          timeout = setTimeout(triggerBurst, 1200 + Math.random() * 2500);
          return;
        }

        const intensity = Math.random() < 0.35 ? 10 : 5;
        const lines =
          Math.random() < 0.3
            ? scrambleLine(Math.floor(Math.random() * ASCII_LINES.length))
            : corruptLines(intensity);

        const offsets = ASCII_LINES.map(() =>
          Math.random() < 0.5 ? (Math.random() - 0.5) * 24 : 0,
        );

        setGlitchLines(lines);
        setLineOffsets(offsets);
        setBursting(true);
        frame++;
        timeout = setTimeout(nextFrame, 40 + Math.random() * 55);
      }

      nextFrame();
    }

    timeout = setTimeout(triggerBurst, 800 + Math.random() * 1200);
    return () => {
      clearTimeout(timeout);
      setGlitchLines(ASCII_LINES);
      setLineOffsets(Array(ASCII_LINES.length).fill(0));
      setBursting(false);
    };
  }, [mode]);

  // --- START / RESTART ---
  const startGame = useCallback((initialDir: Dir = "UP") => {
    const newFood = randFood(INIT_SNAKE);
    snakeRef.current = INIT_SNAKE;
    foodRef.current = newFood;
    nextDirRef.current = initialDir;
    setSnake(INIT_SNAKE);
    setFood(newFood);
    setScore(0);
    setMode("playing");
  }, []);

  // --- KEY HANDLER ---
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const dir = DIR_KEYS[e.key];

      if (e.key === "Escape") {
        if (modeRef.current !== "glitch") setMode("glitch");
        return;
      }

      if (!dir) return;
      e.preventDefault();

      if (modeRef.current === "glitch" || modeRef.current === "gameover") {
        startGame(dir);
      } else if (dir !== OPPOSITE[nextDirRef.current]) {
        nextDirRef.current = dir;
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [startGame]);

  // --- GAME TICK ---
  useEffect(() => {
    if (mode !== "playing") return;

    const tick = setInterval(() => {
      const dir = nextDirRef.current;
      const s = snakeRef.current;
      const f = foodRef.current;
      const [dx, dy] = DELTA[dir];
      const [hx, hy] = s[0];
      const nx = hx + dx;
      const ny = hy + dy;

      // Collision
      if (
        nx < 0 ||
        nx >= COLS ||
        ny < 0 ||
        ny >= ROWS ||
        s.some(([sx, sy]) => sx === nx && sy === ny)
      ) {
        setMode("gameover");
        modeRef.current = "gameover";
        return;
      }

      const ate = f[0] === nx && f[1] === ny;
      const newSnake: Pt[] = [[nx, ny], ...(ate ? s : s.slice(0, -1))];
      const newFood = ate ? randFood(newSnake) : f;

      snakeRef.current = newSnake;
      foodRef.current = newFood;
      setSnake(newSnake);
      if (ate) {
        setFood(newFood);
        setScore((sc) => sc + 1);
      }
    }, TICK_MS);

    return () => clearInterval(tick);
  }, [mode]);

  // --- RENDER: GLITCH ---
  if (mode === "glitch") {
    return (
      <div className="flex flex-col items-center gap-3">
        <div
          className={[
            "text-heading-h6 text-center",
            bursting ? "text-[#43D9AD]" : "text-theme-foreground",
          ].join(" ")}
          style={bursting ? { textShadow: "-3px 0 #ff637e, 3px 0 #43D9AD" } : undefined}
        >
          {glitchLines.map((line, i) => (
            <p
              key={i}
              className={[i < glitchLines.length - 1 ? "mb-0" : "", "whitespace-pre"]
                .filter(Boolean)
                .join(" ")}
              style={{ transform: `translateX(${lineOffsets[i] ?? 0}px)` }}
            >
              {line}
            </p>
          ))}
        </div>
        <p className="text-body-sm text-theme-foreground animate-pulse opacity-50">
          press ↑ ↓ ← → to play snake
        </p>
      </div>
    );
  }

  // --- RENDER: GAME ---
  const snakeSet = new Set(snake.map(([x, y]) => `${x},${y}`));
  const headKey = `${snake[0][0]},${snake[0][1]}`;

  return (
    <div className="flex flex-col gap-2">
      <div className="text-body-sm text-theme-foreground flex justify-between">
        <span>
          {"// score: "}
          {score}
        </span>
        <span className="opacity-40">esc to exit</span>
      </div>

      <div
        className="border-theme-theme-stroke relative border"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 20px)`,
          gridTemplateRows: `repeat(${ROWS}, 20px)`,
        }}
      >
        {Array.from({ length: ROWS }, (_, y) =>
          Array.from({ length: COLS }, (_, x) => {
            const key = `${x},${y}`;
            const isHead = key === headKey;
            const isBody = !isHead && snakeSet.has(key);
            const isFood = food[0] === x && food[1] === y;

            return (
              <div
                key={key}
                className="border-theme-theme-stroke/20 flex items-center justify-center border"
                style={{ width: 20, height: 20 }}
              >
                {isHead && (
                  <div className="h-3.5 w-3.5 rounded-sm" style={{ background: "#43D9AD" }} />
                )}
                {isBody && (
                  <div
                    className="h-3.5 w-3.5 rounded-sm"
                    style={{ background: "#43D9AD", opacity: 0.45 }}
                  />
                )}
                {isFood && (
                  <Image src="/snake/snake-food.svg" alt="" width={14} height={14} unoptimized />
                )}
              </div>
            );
          }),
        )}

        {mode === "gameover" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div
              className="rounded-2 flex h-12 w-full flex-col items-center justify-center shadow-[inset_1px_5px_11px_0px_rgba(2,18,27,0.71)]"
              style={{ backgroundColor: "rgba(1,22,39,0.84)" }}
            >
              <p className="text-heading-h5 text-primitive-teal-400">GAME OVER!</p>
            </div>
            <button
              className="flex cursor-pointer items-center justify-center"
              onClick={() => startGame()}
            >
              <p className="text-body-sm text-theme-foreground">start-again</p>
            </button>
          </div>
        )}
      </div>

      <p className="text-body-sm text-theme-foreground opacity-40">wasd / arrow keys to move</p>
    </div>
  );
}
