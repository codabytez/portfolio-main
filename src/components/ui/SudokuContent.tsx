"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";

// Each puzzle is an 81-char string, 0 = empty
const PUZZLES = [
  {
    puzzle: "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
    solution: "534678912672195348198342567859761423426853791713924856961537284287419635345286179",
  },
  {
    puzzle: "010920000000000700340008010006500002000090800030001069005040000000300000800006070",
    solution: "617923854498651723342578916196547382754392861238816469925764138461385297883269574",
  },
];

type Phase = "idle" | "playing" | "won" | "over";
type GameMode = "classic" | "chill";

export default function SudokuContent({ onChangeGame }: { onChangeGame: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [board, setBoard] = useState<number[]>(Array(81).fill(0));
  const [given, setGiven] = useState<boolean[]>(Array(81).fill(false));
  const [solution, setSolution] = useState<number[]>(Array(81).fill(0));
  const [selected, setSelected] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [wrong, setWrong] = useState<Set<number>>(new Set());
  const [gameMode, setGameMode] = useState<GameMode>("classic");
  const gameModeRef = useRef<GameMode>("classic");

  function startGame(mode: GameMode = gameModeRef.current) {
    gameModeRef.current = mode;
    setGameMode(mode);
    const p = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
    const puzzleNums = p.puzzle.split("").map(Number);
    const solutionNums = p.solution.split("").map(Number);
    setBoard(puzzleNums);
    setGiven(puzzleNums.map((n) => n !== 0));
    setSolution(solutionNums);
    setSelected(null);
    setMistakes(0);
    setWrong(new Set());
    setPhase("playing");
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (phase !== "playing") return;

      if (e.key === "ArrowUp" && selected !== null && selected >= 9) {
        e.preventDefault();
        setSelected(selected - 9);
        return;
      }
      if (e.key === "ArrowDown" && selected !== null && selected < 72) {
        e.preventDefault();
        setSelected(selected + 9);
        return;
      }
      if (e.key === "ArrowLeft" && selected !== null && selected % 9 !== 0) {
        e.preventDefault();
        setSelected(selected - 1);
        return;
      }
      if (e.key === "ArrowRight" && selected !== null && selected % 9 !== 8) {
        e.preventDefault();
        setSelected(selected + 1);
        return;
      }

      if (selected === null || given[selected]) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        setBoard((b) => {
          const next = [...b];
          next[selected] = 0;
          return next;
        });
        setWrong((w) => {
          const s = new Set(w);
          s.delete(selected);
          return s;
        });
        return;
      }

      if (e.key >= "1" && e.key <= "9") {
        e.preventDefault();
        const num = parseInt(e.key);
        const isCorrect = num === solution[selected];
        setBoard((b) => {
          const next = [...b];
          next[selected] = num;
          return next;
        });

        if (!isCorrect) {
          const newMistakes = mistakes + 1;
          setMistakes(newMistakes);
          setWrong((w) => new Set([...w, selected]));
          if (gameModeRef.current === "classic" && newMistakes >= 3) setPhase("over");
        } else {
          setWrong((w) => {
            const s = new Set(w);
            s.delete(selected);
            return s;
          });
          setBoard((b) => {
            const next = [...b];
            next[selected] = num;
            if (next.every((v, i) => v === solution[i])) setPhase("won");
            return next;
          });
        }
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, selected, given, solution, mistakes]);

  // Compute highlights
  const highlights = new Set<number>();
  const sameNum = new Set<number>();
  if (selected !== null) {
    const row = Math.floor(selected / 9);
    const col = selected % 9;
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 9; i++) {
      highlights.add(row * 9 + i);
      highlights.add(i * 9 + col);
    }
    for (let r = boxRow; r < boxRow + 3; r++)
      for (let c = boxCol; c < boxCol + 3; c++) highlights.add(r * 9 + c);
    const selVal = board[selected];
    if (selVal !== 0)
      board.forEach((v, i) => {
        if (v === selVal) sameNum.add(i);
      });
  }

  return (
    <>
      {/* Board area */}
      <div className="bg-primitive-slate-800 rounded-2 relative h-101.25 w-60 shrink-0 overflow-hidden shadow-[inset_1px_5px_11px_0px_rgba(2,18,27,0.71)]">
        {phase === "idle" ? (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{ paddingBottom: "40px" }}
          >
            <p className="text-body-sm text-primitive-slate-400">{"// choose mode"}</p>
            <Button variant="primary" onClick={() => startGame("classic")}>
              classic
            </Button>
            <Button variant="default" onClick={() => startGame("chill")}>
              chill
            </Button>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="grid grid-cols-3 p-px"
              style={{ gap: "2px", backgroundColor: "#62748e" }}
            >
              {Array.from({ length: 9 }, (_, boxIdx) => {
                const boxRow = Math.floor(boxIdx / 3);
                const boxCol = boxIdx % 3;
                return (
                  <div
                    key={boxIdx}
                    className="grid grid-cols-3"
                    style={{ gap: "1px", backgroundColor: "#45556c" }}
                  >
                    {Array.from({ length: 9 }, (_, cellIdx) => {
                      const row = boxRow * 3 + Math.floor(cellIdx / 3);
                      const col = boxCol * 3 + (cellIdx % 3);
                      const idx = row * 9 + col;
                      const value = board[idx];
                      const isSelected = selected === idx;
                      const isHighlighted = highlights.has(idx);
                      const isSameNum = sameNum.has(idx);
                      const isWrong = wrong.has(idx);
                      const isGiven = given[idx];

                      return (
                        <div
                          key={cellIdx}
                          onClick={() => setSelected(idx)}
                          className="flex h-6 w-6 cursor-pointer items-center justify-center"
                          style={{
                            backgroundColor: isSelected
                              ? "rgba(0,185,165,0.22)"
                              : isSameNum
                                ? "rgba(0,185,165,0.10)"
                                : isHighlighted
                                  ? "#1e2d42"
                                  : "#0f172b",
                          }}
                        >
                          {value !== 0 && (
                            <span
                              className="text-[11px] leading-none font-bold select-none"
                              style={{
                                color: isWrong ? "#ff637e" : isGiven ? "#f8fafc" : "#00d5be",
                              }}
                            >
                              {value}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {(phase === "won" || phase === "over") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div
              className="rounded-2 flex h-12 w-full flex-col items-center justify-center shadow-[inset_1px_5px_11px_0px_rgba(2,18,27,0.71)]"
              style={{ backgroundColor: "rgba(1,22,39,0.84)" }}
            >
              <p className="text-heading-h5 text-primitive-teal-400">
                {phase === "won" ? "SOLVED!" : "GAME OVER!"}
              </p>
            </div>
            <Button variant="primary" onClick={() => startGame("classic")}>
              classic
            </Button>
            <Button variant="default" onClick={() => startGame("chill")}>
              chill
            </Button>
          </div>
        )}
      </div>

      {/* Right panel */}
      <div className="relative flex w-45 shrink-0 flex-col items-end justify-between self-stretch">
        <div className="flex w-full flex-col gap-6">
          {/* Mistakes — classic only */}
          {gameMode === "classic" && (
            <div className="bg-primitive-slate-800 rounded-3 flex w-full flex-col gap-3 p-[10px]">
              <p className="text-body-sm text-primitive-slate-50">{"// mistakes"}</p>
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-3 w-3 rounded-full transition-all duration-200"
                    style={{
                      backgroundColor: i < mistakes ? "#ff637e" : "#314158",
                      boxShadow: i < mistakes ? "0 0 6px #ff637e" : "none",
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="bg-primitive-slate-800 rounded-3 flex w-full flex-col gap-2 p-[10px]">
            <p className="text-body-sm text-primitive-slate-50">{"// controls"}</p>
            <p className="text-body-sm text-theme-foreground opacity-60">{"click + 1-9"}</p>
            <p className="text-body-sm text-theme-foreground opacity-60">{"↑↓←→ navigate"}</p>
            <p className="text-body-sm text-theme-foreground opacity-60">{"⌫ to clear"}</p>
          </div>

          {/* New puzzle */}
          {phase !== "idle" && (
            <div className="px-[10px]">
              <button
                onClick={() => startGame()}
                className="bg-primitive-grey-950 border-theme-theme-stroke rounded-3 hover:bg-primitive-slate-700 flex w-full cursor-pointer items-center justify-center gap-2 border p-2 transition-colors"
              >
                <i
                  className="ri-refresh-line text-primitive-teal-400 text-[16px] leading-none"
                  aria-hidden
                />
                <p className="text-body-sm text-theme-heading-foreground">new-puzzle</p>
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
