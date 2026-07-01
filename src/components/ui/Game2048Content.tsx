"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";

type Phase = "idle" | "playing" | "won" | "over";
type Board = number[][];
type Dir = "left" | "right" | "up" | "down";

// ─── Board logic ──────────────────────────────────────────────────────────────
function makeEmpty(): Board {
  return Array.from({ length: 4 }, () => Array(4).fill(0));
}

function addTile(board: Board): Board {
  const empty: [number, number][] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (!board[r][c]) empty.push([r, c]);
  if (!empty.length) return board;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const next = board.map((row) => [...row]);
  next[r][c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function slideRow(row: number[]): { out: number[]; gained: number } {
  const nums = row.filter(Boolean);
  let gained = 0;
  const out: number[] = [];
  let i = 0;
  while (i < nums.length) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      out.push(nums[i] * 2);
      gained += nums[i] * 2;
      i += 2;
    } else {
      out.push(nums[i++]);
    }
  }
  while (out.length < 4) out.push(0);
  return { out, gained };
}

function applyMove(board: Board, dir: Dir): { next: Board; gained: number; moved: boolean } {
  const T = (b: Board): Board => b[0].map((_, c) => b.map((r) => r[c]));
  const R = (b: Board): Board => b.map((r) => [...r].reverse());

  let b = board.map((r) => [...r]);
  if (dir === "right") b = R(b);
  else if (dir === "up") b = T(b);
  else if (dir === "down") b = R(T(b));

  let gained = 0;
  let moved = false;
  b = b.map((row) => {
    const { out, gained: g } = slideRow(row);
    gained += g;
    if (out.join() !== row.join()) moved = true;
    return out;
  });

  if (dir === "right") b = R(b);
  else if (dir === "up") b = T(b);
  else if (dir === "down") b = T(R(b));

  return { next: b, gained, moved };
}

function hasWon(board: Board) {
  return board.flat().some((v) => v >= 2048);
}

function isOver(board: Board) {
  if (board.flat().includes(0)) return false;
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) {
      if (c < 3 && board[r][c] === board[r][c + 1]) return false;
      if (r < 3 && board[r][c] === board[r + 1][c]) return false;
    }
  return true;
}

const COLORS: Record<number, [string, string]> = {
  0: ["#0f172b", "transparent"],
  2: ["#314158", "#cbd5e1"],
  4: ["#45556c", "#e2e8f0"],
  8: ["#c05200", "#fff"],
  16: ["#b91c4c", "#fff"],
  32: ["#4338ca", "#fff"],
  64: ["#009688", "#fff"],
  128: ["#b45309", "#fff"],
  256: ["#9a3412", "#fff"],
  512: ["#be185d", "#fff"],
  1024: ["#3730a3", "#fff"],
  2048: ["#00d5be", "#020618"],
};

function tileColors(v: number): [string, string] {
  return COLORS[v] ?? ["#00d5be", "#020618"];
}

function tileFontSize(v: number): string {
  if (v >= 1024) return "9px";
  if (v >= 128) return "11px";
  return "13px";
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Game2048Content({ onChangeGame }: { onChangeGame: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [board, setBoard] = useState<Board>(makeEmpty());
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const keepGoingRef = useRef(false);

  useEffect(() => {
    try {
      setTimeout(() => setBest(parseInt(localStorage.getItem("2048-best") ?? "0", 10) || 0), 0);
    } catch {}
  }, []);

  function start() {
    keepGoingRef.current = false;
    setBoard(addTile(addTile(makeEmpty())));
    setScore(0);
    setPhase("playing");
  }

  useEffect(() => {
    if (phase !== "playing") return;

    function onKey(e: KeyboardEvent) {
      const MAP: Record<string, Dir> = {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
        ArrowDown: "down",
      };
      const dir = MAP[e.key];
      if (!dir) return;
      e.preventDefault();

      setBoard((prev) => {
        const { next, gained, moved } = applyMove(prev, dir);
        if (!moved) return prev;
        const withTile = addTile(next);

        setScore((s) => {
          const ns = s + gained;
          setBest((b) => {
            if (ns > b) {
              try {
                localStorage.setItem("2048-best", String(ns));
              } catch {}
              return ns;
            }
            return b;
          });
          return ns;
        });

        if (!keepGoingRef.current && hasWon(withTile)) {
          setTimeout(() => setPhase("won"), 0);
        } else if (isOver(withTile)) {
          setTimeout(() => setPhase("over"), 0);
        }

        return withTile;
      });
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  return (
    <>
      <div className="bg-primitive-slate-800 rounded-2 relative h-101.25 w-60 shrink-0 overflow-hidden shadow-[inset_1px_5px_11px_0px_rgba(2,18,27,0.71)]">
        {phase === "idle" ? (
          <div
            className="absolute inset-0 flex items-end justify-center"
            style={{ paddingBottom: "70px" }}
          >
            <Button variant="primary" onClick={start}>
              start-game
            </Button>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded p-1.5" style={{ backgroundColor: "#0a1120" }}>
              <div className="grid grid-cols-4 gap-1.5">
                {board.flat().map((val, i) => {
                  const [bg, color] = tileColors(val);
                  return (
                    <div
                      key={i}
                      className="flex h-12 w-12 items-center justify-center rounded font-bold"
                      style={{ backgroundColor: bg, color, fontSize: tileFontSize(val) }}
                    >
                      {val > 0 ? val : ""}
                    </div>
                  );
                })}
              </div>
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
                {phase === "won" ? "YOU WIN!" : "GAME OVER!"}
              </p>
            </div>
            {phase === "won" && (
              <Button
                variant="default"
                onClick={() => {
                  keepGoingRef.current = true;
                  setPhase("playing");
                }}
              >
                keep going
              </Button>
            )}
            <Button variant="primary" onClick={start}>
              new game
            </Button>
          </div>
        )}
      </div>

      <div className="relative flex w-45 shrink-0 flex-col items-end justify-between self-stretch">
        <div className="flex w-full flex-col gap-6">
          <div className="bg-primitive-slate-800 rounded-3 flex w-full flex-col gap-2 p-[10px]">
            <p className="text-body-sm text-primitive-slate-50">{"// score"}</p>
            <p className="text-heading-h5 text-primitive-teal-400">{score}</p>
          </div>
          <div className="flex w-full flex-col gap-1 px-[10px]">
            <p className="text-body-sm text-primitive-slate-50">{"// best"}</p>
            <p className="text-heading-h5 text-primitive-teal-400">{best}</p>
          </div>
          <div className="bg-primitive-slate-800 rounded-3 flex w-full flex-col gap-1 p-[10px]">
            <p className="text-body-sm text-primitive-slate-50">{"// controls"}</p>
            <p className="text-body-sm text-theme-foreground opacity-60">↑↓←→ to slide</p>
            <p className="text-body-sm text-theme-foreground opacity-60">reach 2048 to win</p>
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
