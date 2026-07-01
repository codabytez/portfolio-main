"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

type Phase = "idle" | "playing" | "won" | "over";
type Difficulty = "easy" | "hard";

type Cell = {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  adj: number;
};

type Config = { rows: number; cols: number; mines: number; cell: number };

const CONFIGS: Record<Difficulty, Config> = {
  easy: { rows: 9, cols: 9, mines: 10, cell: 24 },
  hard: { rows: 16, cols: 16, mines: 40, cell: 14 },
};

// ─── Grid helpers ─────────────────────────────────────────────────────────────
function makeGrid(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ mine: false, revealed: false, flagged: false, adj: 0 })),
  );
}

function neighbors(r: number, c: number, rows: number, cols: number): [number, number][] {
  const out: [number, number][] = [];
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) out.push([nr, nc]);
    }
  return out;
}

function plantMines(grid: Cell[][], mines: number, safeR: number, safeC: number): Cell[][] {
  const rows = grid.length,
    cols = grid[0].length;
  const safe = new Set<number>();
  for (const [nr, nc] of [[safeR, safeC], ...neighbors(safeR, safeC, rows, cols)] as [
    number,
    number,
  ][])
    safe.add(nr * cols + nc);

  const candidates: number[] = [];
  for (let i = 0; i < rows * cols; i++) if (!safe.has(i)) candidates.push(i);

  // Fisher-Yates shuffle first `mines` elements
  for (let i = 0; i < mines && i < candidates.length; i++) {
    const j = i + Math.floor(Math.random() * (candidates.length - i));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  const next = grid.map((row) => row.map((c) => ({ ...c })));
  for (let i = 0; i < mines; i++) {
    const idx = candidates[i];
    next[Math.floor(idx / cols)][idx % cols].mine = true;
  }

  // Compute adjacency
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (!next[r][c].mine)
        next[r][c].adj = neighbors(r, c, rows, cols).filter(([nr, nc]) => next[nr][nc].mine).length;

  return next;
}

function floodReveal(grid: Cell[][], startR: number, startC: number): Cell[][] {
  const rows = grid.length,
    cols = grid[0].length;
  const next = grid.map((row) => row.map((c) => ({ ...c })));
  const queue: [number, number][] = [[startR, startC]];
  const visited = new Set<number>();

  while (queue.length) {
    const [r, c] = queue.shift()!;
    const key = r * cols + c;
    if (visited.has(key)) continue;
    visited.add(key);
    if (next[r][c].flagged || next[r][c].mine) continue;
    next[r][c].revealed = true;
    if (next[r][c].adj === 0)
      for (const [nr, nc] of neighbors(r, c, rows, cols))
        if (!next[nr][nc].revealed) queue.push([nr, nc]);
  }

  return next;
}

const ADJ_COLORS = [
  "",
  "#00d5be",
  "#7c86ff",
  "#ff637e",
  "#fdc700",
  "#ff8904",
  "#00bcd4",
  "#f44336",
  "#9e9e9e",
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function MinesweeperContent({ onChangeGame }: { onChangeGame: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [firstClick, setFirstClick] = useState(true);
  const [flagCount, setFlagCount] = useState(0);
  const [time, setTime] = useState(0);

  const cfg = CONFIGS[difficulty];

  useEffect(() => {
    if (phase !== "playing") return;
    const t = setInterval(() => setTime((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  function start(d: Difficulty = difficulty) {
    setDifficulty(d);
    setGrid(makeGrid(CONFIGS[d].rows, CONFIGS[d].cols));
    setFirstClick(true);
    setFlagCount(0);
    setTime(0);
    setPhase("playing");
  }

  function handleReveal(r: number, c: number) {
    if (phase !== "playing") return;
    setGrid((prev) => {
      const cell = prev[r][c];
      if (cell.revealed || cell.flagged) return prev;

      let g = prev;
      if (firstClick) {
        g = plantMines(prev, cfg.mines, r, c);
        setFirstClick(false);
      }

      if (g[r][c].mine) {
        // Reveal all mines
        const revealed = g.map((row) =>
          row.map((cell) => (cell.mine ? { ...cell, revealed: true } : cell)),
        );
        setTimeout(() => setPhase("over"), 0);
        return revealed;
      }

      const revealed = floodReveal(g, r, c);

      // Win check: all non-mine cells revealed
      const won = revealed.flat().every((cell) => cell.mine || cell.revealed);
      if (won) setTimeout(() => setPhase("won"), 0);

      return revealed;
    });
  }

  function handleFlag(e: React.MouseEvent, r: number, c: number) {
    e.preventDefault();
    if (phase !== "playing") return;
    setGrid((prev) => {
      const cell = prev[r][c];
      if (cell.revealed) return prev;
      const next = prev.map((row) => row.map((c) => ({ ...c })));
      next[r][c].flagged = !next[r][c].flagged;
      setFlagCount((fc) => fc + (next[r][c].flagged ? 1 : -1));
      return next;
    });
  }

  return (
    <>
      <div className="bg-primitive-slate-800 rounded-2 relative h-101.25 w-60 shrink-0 overflow-hidden shadow-[inset_1px_5px_11px_0px_rgba(2,18,27,0.71)]">
        {phase === "idle" ? (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{ paddingBottom: "40px" }}
          >
            <p className="text-body-sm text-primitive-slate-400">{"// choose difficulty"}</p>
            <Button variant="primary" onClick={() => start("easy")}>
              easy 9×9
            </Button>
            <Button variant="default" onClick={() => start("hard")}>
              hard 16×16
            </Button>
          </div>
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ overflow: "auto" }}
          >
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${cfg.cols}, ${cfg.cell}px)`,
                gap: "1px",
                backgroundColor: "#45556c",
                border: "1px solid #45556c",
              }}
            >
              {grid.map((row, r) =>
                row.map((cell, c) => {
                  const key = `${r}-${c}`;
                  let bg = "#0f172b";
                  if (cell.revealed) bg = cell.mine ? "#7f1d1d" : "#1a2540";

                  return (
                    <div
                      key={key}
                      onClick={() => handleReveal(r, c)}
                      onContextMenu={(e) => handleFlag(e, r, c)}
                      className="flex cursor-pointer items-center justify-center select-none"
                      style={{ width: cfg.cell, height: cfg.cell, backgroundColor: bg }}
                    >
                      {!cell.revealed && cell.flagged && (
                        <span style={{ fontSize: cfg.cell * 0.55, lineHeight: 1 }}>🚩</span>
                      )}
                      {cell.revealed && cell.mine && (
                        <span style={{ fontSize: cfg.cell * 0.55, lineHeight: 1 }}>💣</span>
                      )}
                      {cell.revealed && !cell.mine && cell.adj > 0 && (
                        <span
                          className="leading-none font-bold"
                          style={{ fontSize: cfg.cell * 0.55, color: ADJ_COLORS[cell.adj] }}
                        >
                          {cell.adj}
                        </span>
                      )}
                    </div>
                  );
                }),
              )}
            </div>
          </div>
        )}

        {(phase === "won" || phase === "over") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div
              className="rounded-2 flex h-12 w-full flex-col items-center justify-center"
              style={{ backgroundColor: "rgba(1,22,39,0.92)" }}
            >
              <p className="text-heading-h5 text-primitive-teal-400">
                {phase === "won" ? "YOU WIN!" : "BOOM!"}
              </p>
            </div>
            <Button variant="primary" onClick={() => start("easy")}>
              easy 9×9
            </Button>
            <Button variant="default" onClick={() => start("hard")}>
              hard 16×16
            </Button>
          </div>
        )}
      </div>

      <div className="relative flex w-45 shrink-0 flex-col items-end justify-between self-stretch">
        <div className="flex w-full flex-col gap-6">
          <div className="bg-primitive-slate-800 rounded-3 flex w-full flex-col gap-2 p-[10px]">
            <p className="text-body-sm text-primitive-slate-50">{"// mines left"}</p>
            <p className="text-heading-h5 text-primitive-teal-400">
              {phase === "idle" ? "—" : Math.max(0, cfg.mines - flagCount)}
            </p>
          </div>
          <div className="flex w-full flex-col gap-1 px-[10px]">
            <p className="text-body-sm text-primitive-slate-50">{"// time"}</p>
            <p className="text-heading-h5 text-primitive-teal-400">
              {phase === "idle" ? "—" : `${time}s`}
            </p>
          </div>
          <div className="bg-primitive-slate-800 rounded-3 flex w-full flex-col gap-1 p-[10px]">
            <p className="text-body-sm text-primitive-slate-50">{"// controls"}</p>
            <p className="text-body-sm text-theme-foreground opacity-60">left-click reveal</p>
            <p className="text-body-sm text-theme-foreground opacity-60">right-click flag</p>
          </div>
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
