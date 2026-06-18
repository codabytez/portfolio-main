"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

type Player = "X" | "O";
type Cell = Player | null;
type Phase = "idle" | "playing" | "won" | "draw";

const WINS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner(board: Cell[]): { winner: Player; line: number[] } | null {
  for (const line of WINS) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line };
    }
  }
  return null;
}

const EMPTY_BOARD: Cell[] = Array(9).fill(null);

export default function TicTacToeContent({ onChangeGame }: { onChangeGame: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [board, setBoard] = useState<Cell[]>(EMPTY_BOARD);
  const [turn, setTurn] = useState<Player>("X");
  const [winLine, setWinLine] = useState<number[] | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });

  function startGame() {
    setBoard(EMPTY_BOARD);
    setTurn("X");
    setWinLine(null);
    setWinner(null);
    setPhase("playing");
  }

  function handleCell(idx: number) {
    if (phase !== "playing" || board[idx]) return;

    const next = board.map((c, i) => (i === idx ? turn : c));
    const result = checkWinner(next);
    const isDraw = !result && next.every(Boolean);

    setBoard(next);

    if (result) {
      setWinLine(result.line);
      setWinner(result.winner);
      setScore((s) => ({ ...s, [result.winner]: s[result.winner] + 1 }));
      setPhase("won");
    } else if (isDraw) {
      setScore((s) => ({ ...s, draws: s.draws + 1 }));
      setPhase("draw");
    } else {
      setTurn(turn === "X" ? "O" : "X");
    }
  }

  return (
    <>
      {/* Board area */}
      <div className="bg-primitive-slate-800 rounded-2 relative h-101.25 w-60 shrink-0 overflow-hidden shadow-[inset_1px_5px_11px_0px_rgba(2,18,27,0.71)]">
        {phase === "idle" ? (
          <div
            className="absolute inset-0 flex items-end justify-center"
            style={{ paddingBottom: "70px" }}
          >
            <Button variant="primary" onClick={startGame}>
              start-game
            </Button>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: "repeat(3, 72px)",
                gridTemplateRows: "repeat(3, 72px)",
              }}
            >
              {board.map((cell, i) => {
                const isWinCell = winLine?.includes(i);
                return (
                  <button
                    key={i}
                    onClick={() => handleCell(i)}
                    disabled={!!cell || phase !== "playing"}
                    className={[
                      "border-theme-theme-stroke rounded-2 flex cursor-pointer items-center justify-center border transition-colors duration-100",
                      !cell && phase === "playing" ? "hover:bg-primitive-slate-700" : "",
                      isWinCell ? "bg-primitive-slate-700" : "bg-primitive-slate-900",
                    ].join(" ")}
                  >
                    {cell === "X" && (
                      <span
                        className={[
                          "text-heading-h4 leading-none font-bold",
                          isWinCell ? "text-primitive-rose-300" : "text-primitive-rose-400",
                        ].join(" ")}
                      >
                        X
                      </span>
                    )}
                    {cell === "O" && (
                      <span
                        className={[
                          "text-heading-h4 leading-none font-bold",
                          isWinCell ? "text-primitive-teal-300" : "text-primitive-teal-400",
                        ].join(" ")}
                      >
                        O
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Result banner */}
        {(phase === "won" || phase === "draw") && (
          <>
            <div
              className="rounded-2 absolute right-0 left-0 flex h-12 flex-col items-center justify-center shadow-[inset_1px_5px_11px_0px_rgba(2,18,27,0.71)]"
              style={{ top: "264px", backgroundColor: "rgba(1,22,39,0.84)" }}
            >
              <p className="text-heading-h5 text-primitive-teal-400">
                {phase === "draw" ? "DRAW!" : `${winner} WINS!`}
              </p>
            </div>
            <button
              className="absolute right-0 left-0 flex cursor-pointer items-center justify-center"
              style={{ top: "333px" }}
              onClick={startGame}
            >
              <p className="text-body-sm text-theme-foreground">play-again</p>
            </button>
          </>
        )}
      </div>

      {/* Right panel */}
      <div className="relative flex w-45 shrink-0 flex-col items-end justify-between self-stretch">
        <div className="flex w-full flex-col gap-6">
          {/* Turn indicator */}
          <div className="bg-primitive-slate-800 rounded-3 flex w-full flex-col gap-2 p-[10px]">
            <p className="text-body-sm text-primitive-slate-50">{"// turn"}</p>
            <p
              className={[
                "text-heading-h5 font-bold",
                phase !== "playing"
                  ? "text-theme-foreground opacity-30"
                  : turn === "X"
                    ? "text-primitive-rose-400"
                    : "text-primitive-teal-400",
              ].join(" ")}
            >
              {phase === "playing" ? `${turn}'s turn` : "—"}
            </p>
          </div>

          {/* Score */}
          <div className="flex w-full flex-col gap-3 px-[10px]">
            <p className="text-body-sm text-primitive-slate-50">{"// score"}</p>
            <div className="flex w-full flex-col gap-2">
              {(["X", "O", "draws"] as const).map((key) => (
                <div key={key} className="flex items-center justify-between">
                  <p
                    className={[
                      "text-body-sm",
                      key === "X"
                        ? "text-primitive-rose-400"
                        : key === "O"
                          ? "text-primitive-teal-400"
                          : "text-theme-foreground",
                    ].join(" ")}
                  >
                    {key === "draws" ? "draws" : `player-${key}`}
                  </p>
                  <p className="text-body-sm text-theme-heading-foreground">{score[key]}</p>
                </div>
              ))}
            </div>
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
