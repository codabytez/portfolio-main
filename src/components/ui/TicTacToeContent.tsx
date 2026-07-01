"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";

type Player = "X" | "O";
type Cell = Player | null;
type Phase = "idle" | "playing" | "won" | "draw";
type Mode = "friend" | "easy" | "medium" | "hard";

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
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return { winner: board[a] as Player, line };
  }
  return null;
}

function minimax(board: Cell[], isMaximizing: boolean): number {
  const result = checkWinner(board);
  if (result) return result.winner === "O" ? 10 : -10;
  if (board.every(Boolean)) return 0;
  const scores: number[] = [];
  for (let i = 0; i < 9; i++) {
    if (board[i]) continue;
    const next = [...board] as Cell[];
    next[i] = isMaximizing ? "O" : "X";
    scores.push(minimax(next, !isMaximizing));
  }
  return isMaximizing ? Math.max(...scores) : Math.min(...scores);
}

function pickMove(board: Cell[], mode: Mode): number {
  const empty = board.map((c, i) => (c ? -1 : i)).filter((i) => i >= 0);
  const random = empty[Math.floor(Math.random() * empty.length)];

  if (mode === "easy") return random;

  // medium: 50% minimax, 50% random
  if (mode === "medium" && Math.random() < 0.5) return random;

  // hard (and medium 50%): full minimax
  let best = -Infinity,
    move = random;
  for (const i of empty) {
    const next = [...board] as Cell[];
    next[i] = "O";
    const score = minimax(next, false);
    if (score > best) {
      best = score;
      move = i;
    }
  }
  return move;
}

const EMPTY: Cell[] = Array(9).fill(null);

export default function TicTacToeContent({ onChangeGame }: { onChangeGame: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [mode, setMode] = useState<Mode>("hard");
  const [board, setBoard] = useState<Cell[]>(EMPTY);
  const [turn, setTurn] = useState<Player>("X");
  const [winLine, setWinLine] = useState<number[] | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });
  const [aiThinking, setAiThinking] = useState(false);
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const isAi = mode !== "friend";

  function startGame(m: Mode = mode) {
    setMode(m);
    setBoard([...EMPTY]);
    setTurn("X");
    setWinLine(null);
    setWinner(null);
    setAiThinking(false);
    setPhase("playing");
  }

  function applyMove(currentBoard: Cell[], idx: number, player: Player): Cell[] | null {
    const next = currentBoard.map((c, i) => (i === idx ? player : c)) as Cell[];
    const result = checkWinner(next);
    const isDraw = !result && next.every(Boolean);
    setBoard(next);
    if (result) {
      setWinLine(result.line);
      setWinner(result.winner);
      setScore((s) => ({ ...s, [result.winner]: s[result.winner] + 1 }));
      setPhase("won");
      return null;
    }
    if (isDraw) {
      setScore((s) => ({ ...s, draws: s.draws + 1 }));
      setPhase("draw");
      return null;
    }
    return next;
  }

  function handleCell(idx: number) {
    if (phase !== "playing" || board[idx] || aiThinking) return;

    if (isAi) {
      if (turn !== "X") return;
      const next = applyMove(board, idx, "X");
      if (!next) return;
      setAiThinking(true);
      setTurn("O");
      aiTimerRef.current = setTimeout(() => {
        const move = pickMove(next, mode);
        applyMove(next, move, "O");
        setAiThinking(false);
        setTurn("X");
      }, 420);
    } else {
      const next = applyMove(board, idx, turn);
      if (next) setTurn(turn === "X" ? "O" : "X");
    }
  }

  useEffect(() => () => clearTimeout(aiTimerRef.current), []);

  const modeButtons = (
    <>
      <p className="text-body-sm text-primitive-slate-400">{"// vs AI"}</p>
      <Button variant="primary" onClick={() => startGame("easy")}>
        easy
      </Button>
      <Button variant="default" onClick={() => startGame("medium")}>
        medium
      </Button>
      <Button variant="default" onClick={() => startGame("hard")}>
        hard
      </Button>
      <Button variant="default" onClick={() => startGame("friend")}>
        vs friend
      </Button>
    </>
  );

  const turnLabel = () => {
    if (phase !== "playing") return "—";
    if (isAi) {
      if (aiThinking) return "thinking...";
      return turn === "X" ? "your turn" : "AI's turn";
    }
    return `${turn}'s turn`;
  };

  return (
    <>
      {/* Board */}
      <div className="bg-primitive-slate-800 rounded-2 relative h-101.25 w-60 shrink-0 overflow-hidden shadow-[inset_1px_5px_11px_0px_rgba(2,18,27,0.71)]">
        {phase === "idle" ? (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{ paddingBottom: "20px" }}
          >
            {modeButtons}
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
                    disabled={!!cell || phase !== "playing" || aiThinking}
                    className={[
                      "border-theme-theme-stroke rounded-2 flex cursor-pointer items-center justify-center border transition-colors duration-100",
                      !cell && phase === "playing" && !aiThinking
                        ? "hover:bg-primitive-slate-700"
                        : "",
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

        {(phase === "won" || phase === "draw") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div
              className="rounded-2 flex h-12 w-full flex-col items-center justify-center shadow-[inset_1px_5px_11px_0px_rgba(2,18,27,0.71)]"
              style={{ backgroundColor: "rgba(1,22,39,0.84)" }}
            >
              <p className="text-heading-h5 text-primitive-teal-400">
                {phase === "draw"
                  ? "DRAW!"
                  : isAi
                    ? winner === "X"
                      ? "YOU WIN!"
                      : "AI WINS!"
                    : `${winner} WINS!`}
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">{modeButtons}</div>
          </div>
        )}
      </div>

      {/* Right panel */}
      <div className="relative flex w-45 shrink-0 flex-col items-end justify-between self-stretch">
        <div className="flex w-full flex-col gap-6">
          <div className="bg-primitive-slate-800 rounded-3 flex w-full flex-col gap-2 p-[10px]">
            <p className="text-body-sm text-primitive-slate-50">{"// turn"}</p>
            <p
              className={[
                "text-body-sm font-bold",
                phase !== "playing"
                  ? "text-theme-foreground opacity-30"
                  : aiThinking
                    ? "text-primitive-slate-400"
                    : turn === "X"
                      ? "text-primitive-rose-400"
                      : "text-primitive-teal-400",
              ].join(" ")}
            >
              {turnLabel()}
            </p>
          </div>

          {isAi && phase === "playing" && (
            <div className="flex w-full flex-col gap-1 px-[10px]">
              <p className="text-body-sm text-primitive-slate-50">{"// difficulty"}</p>
              <p className="text-body-sm text-primitive-teal-400">{mode}</p>
            </div>
          )}

          <div className="flex w-full flex-col gap-3 px-[10px]">
            <p className="text-body-sm text-primitive-slate-50">{"// score"}</p>
            <div className="flex w-full flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-body-sm text-primitive-rose-400">{isAi ? "you" : "player-X"}</p>
                <p className="text-body-sm text-theme-heading-foreground">{score.X}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-body-sm text-primitive-teal-400">{isAi ? "ai" : "player-O"}</p>
                <p className="text-body-sm text-theme-heading-foreground">{score.O}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-body-sm text-theme-foreground">draws</p>
                <p className="text-body-sm text-theme-heading-foreground">{score.draws}</p>
              </div>
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
