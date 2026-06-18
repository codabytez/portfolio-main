"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";

const COLS = 24;
const ROWS = 40;
const CELL = 10;
const SPEED = 100;

type Phase = "idle" | "playing" | "paused";

function randomGrid(): boolean[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => Math.random() < 0.35),
  );
}

function emptyGrid(): boolean[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(false));
}

function nextGen(grid: boolean[][]): boolean[][] {
  return grid.map((row, y) =>
    row.map((alive, x) => {
      let neighbors = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dy === 0 && dx === 0) continue;
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS && grid[ny][nx]) neighbors++;
        }
      }
      return alive ? neighbors === 2 || neighbors === 3 : neighbors === 3;
    }),
  );
}

export default function GameOfLifeContent({ onChangeGame }: { onChangeGame: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [generation, setGeneration] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<boolean[][]>(emptyGrid());
  const phaseRef = useRef<Phase>("idle");

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.fillStyle = "#1d293d";
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);

    const grid = gridRef.current;
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (!grid[y][x]) continue;
        ctx.save();
        ctx.shadowColor = "#00d5be";
        ctx.shadowBlur = 6;
        ctx.fillStyle = "#00d5be";
        ctx.beginPath();
        ctx.roundRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2, 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }, []);

  const start = useCallback((initialGrid?: boolean[][]) => {
    const grid = initialGrid ?? randomGrid();
    gridRef.current = grid;
    setGeneration(0);
    phaseRef.current = "playing";
    setPhase("playing");
  }, []);

  const randomize = useCallback(() => {
    gridRef.current = randomGrid();
    setGeneration(0);
    draw();
  }, [draw]);

  const step = useCallback(() => {
    gridRef.current = nextGen(gridRef.current);
    setGeneration((g) => g + 1);
    draw();
  }, [draw]);

  const togglePause = useCallback(() => {
    if (phaseRef.current === "playing") {
      phaseRef.current = "paused";
      setPhase("paused");
    } else if (phaseRef.current === "paused") {
      phaseRef.current = "playing";
      setPhase("playing");
    }
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => {
      gridRef.current = nextGen(gridRef.current);
      setGeneration((g) => g + 1);
      draw();
    }, SPEED);
    return () => clearInterval(id);
  }, [phase, draw]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <>
      {/* Game board */}
      <div className="bg-primitive-slate-800 rounded-2 relative h-101.25 w-60 shrink-0 overflow-hidden shadow-[inset_1px_5px_11px_0px_rgba(2,18,27,0.71)]">
        <canvas
          ref={canvasRef}
          width={COLS * CELL}
          height={ROWS * CELL}
          className="block h-full w-full"
        />

        {phase === "idle" && (
          <div
            className="absolute inset-0 flex items-end justify-center"
            style={{ paddingBottom: "70px" }}
          >
            <Button variant="primary" onClick={() => start()}>
              start-game
            </Button>
          </div>
        )}
      </div>

      {/* Right panel */}
      <div className="relative flex w-45 shrink-0 flex-col items-end justify-between self-stretch">
        <div className="flex w-full flex-col gap-6">
          {/* Generation counter */}
          <div className="bg-primitive-slate-800 rounded-3 flex w-full flex-col gap-2 p-[10px]">
            <p className="text-body-sm text-primitive-slate-50">{"// generation"}</p>
            <p className="text-heading-h5 text-primitive-teal-400">{generation}</p>
          </div>

          {/* Controls */}
          {phase !== "idle" && (
            <div className="flex w-full flex-col gap-3 px-[10px]">
              <p className="text-body-sm text-primitive-slate-50">{"// controls"}</p>
              <button
                onClick={togglePause}
                className="bg-primitive-grey-950 border-theme-theme-stroke rounded-3 hover:bg-primitive-slate-700 flex w-full cursor-pointer items-center justify-center gap-2 border p-2 transition-colors"
              >
                <i
                  className={[
                    phase === "playing" ? "ri-pause-fill" : "ri-play-fill",
                    "text-primitive-teal-400 text-[16px] leading-none",
                  ].join(" ")}
                  aria-hidden
                />
                <p className="text-body-sm text-theme-heading-foreground">
                  {phase === "playing" ? "pause" : "resume"}
                </p>
              </button>
              <button
                onClick={randomize}
                className="bg-primitive-grey-950 border-theme-theme-stroke rounded-3 hover:bg-primitive-slate-700 flex w-full cursor-pointer items-center justify-center gap-2 border p-2 transition-colors"
              >
                <i
                  className="ri-shuffle-line text-primitive-teal-400 text-[16px] leading-none"
                  aria-hidden
                />
                <p className="text-body-sm text-theme-heading-foreground">randomize</p>
              </button>
              <button
                onClick={step}
                disabled={phase === "playing"}
                className="bg-primitive-grey-950 border-theme-theme-stroke rounded-3 hover:bg-primitive-slate-700 flex w-full cursor-pointer items-center justify-center gap-2 border p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-30"
              >
                <i
                  className="ri-skip-right-fill text-primitive-teal-400 text-[16px] leading-none"
                  aria-hidden
                />
                <p className="text-body-sm text-theme-heading-foreground">step</p>
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onChangeGame}
          className="border-primitive-slate-50 rounded-3 px-button-left-right py-button-top-bottom hover:bg-primitive-slate-800 cursor-pointer border transition-colors"
        >
          <p className="text-body-sm text-theme-heading-foreground whitespace-nowrap">
            change-game
          </p>
        </button>
      </div>
    </>
  );
}
