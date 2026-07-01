"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";

type Phase = "idle" | "playing" | "won" | "over";
type GameMode = "classic" | "endless";

// ─── Board ────────────────────────────────────────────────────────────────────
const COLS = 10,
  ROWS = 18;
const CELL = 22; // px per cell
const BOARD_W = COLS * CELL; // 220
const BOARD_H = ROWS * CELL; // 396
const OFF_X = (240 - BOARD_W) / 2; // 10
const OFF_Y = (405 - BOARD_H) / 2; // ~4

const CLASSIC_WIN_LINES = 20;

// ─── Pieces ───────────────────────────────────────────────────────────────────
type PieceType = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type Matrix = number[][];

// Each piece defined as 4 rotation states (each a 4×4 or smaller matrix)
const PIECES: Matrix[][] = [
  // I
  [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
  ],
  // O
  [
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
  ],
  // T
  [
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
  // S
  [
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
  // Z
  [
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0],
    ],
  ],
  // J
  [
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
  ],
  // L
  [
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0],
    ],
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
  ],
];

const PIECE_COLORS = [
  "#00d5be", // I - teal
  "#fdc700", // O - yellow
  "#7c86ff", // T - indigo
  "#43d787", // S - green
  "#ff637e", // Z - rose
  "#60a5fa", // J - blue
  "#ff8904", // L - orange
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function emptyCells(): (string | null)[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function pieceMatrix(type: PieceType, rot: number): Matrix {
  return PIECES[type][rot % PIECES[type].length];
}

function pieceCells(type: PieceType, rot: number): [number, number][] {
  const m = pieceMatrix(type, rot);
  const cells: [number, number][] = [];
  for (let r = 0; r < m.length; r++)
    for (let c = 0; c < m[r].length; c++) if (m[r][c]) cells.push([r, c]);
  return cells;
}

function collides(
  board: (string | null)[][],
  type: PieceType,
  rot: number,
  pr: number,
  pc: number,
): boolean {
  for (const [dr, dc] of pieceCells(type, rot)) {
    const r = pr + dr,
      c = pc + dc;
    if (r >= ROWS || c < 0 || c >= COLS) return true;
    if (r >= 0 && board[r][c]) return true;
  }
  return false;
}

function lockPiece(
  board: (string | null)[][],
  type: PieceType,
  rot: number,
  pr: number,
  pc: number,
): (string | null)[][] {
  const next = board.map((row) => [...row]);
  const color = PIECE_COLORS[type];
  for (const [dr, dc] of pieceCells(type, rot)) {
    const r = pr + dr,
      c = pc + dc;
    if (r >= 0) next[r][c] = color;
  }
  return next;
}

function clearLines(board: (string | null)[][]): { board: (string | null)[][]; cleared: number } {
  const kept = board.filter((row) => row.some((c) => !c));
  const cleared = ROWS - kept.length;
  const newRows = Array.from({ length: cleared }, () => Array(COLS).fill(null));
  return { board: [...newRows, ...kept], cleared };
}

function randomPiece(): PieceType {
  return Math.floor(Math.random() * 7) as PieceType;
}

function ghostRow(
  board: (string | null)[][],
  type: PieceType,
  rot: number,
  pr: number,
  pc: number,
): number {
  let r = pr;
  while (!collides(board, type, rot, r + 1, pc)) r++;
  return r;
}

// ─── HS ───────────────────────────────────────────────────────────────────────
function getHS() {
  try {
    return parseInt(localStorage.getItem("tetris-hs") ?? "0", 10) || 0;
  } catch {
    return 0;
  }
}
function saveHS(n: number) {
  try {
    localStorage.setItem("tetris-hs", String(n));
  } catch {}
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function TetrisContent({ onChangeGame }: { onChangeGame: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [gameMode, setGameMode] = useState<GameMode>("classic");

  const stateRef = useRef({
    board: emptyCells(),
    type: 0 as PieceType,
    rot: 0,
    pr: 0, // piece row
    pc: 0, // piece col
    next: 0 as PieceType,
    score: 0,
    lines: 0,
    level: 1,
    mode: "classic" as GameMode,
    phase: "idle" as Phase,
    keys: { left: false, right: false, down: false, rotate: false, drop: false },
    rotatePending: false,
    dropPending: false,
    moveCooldown: 0,
    lastDrop: 0,
  });
  const rafRef = useRef(0);

  useEffect(() => {
    setTimeout(() => setHighScore(getHS()), 0);
  }, []);

  function spawnPiece() {
    const s = stateRef.current;
    s.type = s.next;
    s.rot = 0;
    s.pr = -1;
    s.pc = Math.floor(COLS / 2) - 2;
    s.next = randomPiece();
    // Check immediate collision = game over
    if (collides(s.board, s.type, s.rot, s.pr, s.pc)) {
      endGame();
    }
  }

  function endGame() {
    const s = stateRef.current;
    cancelAnimationFrame(rafRef.current);
    if (s.score > getHS()) {
      saveHS(s.score);
      setHighScore(s.score);
    }
    s.phase = "over";
    setPhase("over");
  }

  function startGame(mode: GameMode) {
    setGameMode(mode);
    const s = stateRef.current;
    s.mode = mode;
    s.phase = "playing";
    s.board = emptyCells();
    s.score = 0;
    s.lines = 0;
    s.level = 1;
    s.next = randomPiece();
    s.moveCooldown = 0;
    s.lastDrop = performance.now();
    spawnPiece();
    setScore(0);
    setLines(0);
    setLevel(1);
    setPhase("playing");
  }

  // ─── RAF game loop ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const LINE_SCORES = [0, 100, 300, 500, 800];

    function tick(now: number) {
      const s = stateRef.current;
      if (!ctx || s.phase !== "playing") return;

      // Gravity interval (ms) based on level
      const interval = Math.max(80, 700 - (s.level - 1) * 60);

      // Rotate
      if (s.rotatePending) {
        s.rotatePending = false;
        const newRot = (s.rot + 1) % PIECES[s.type].length;
        if (!collides(s.board, s.type, newRot, s.pr, s.pc)) {
          s.rot = newRot;
        } else if (!collides(s.board, s.type, newRot, s.pr, s.pc - 1)) {
          s.rot = newRot;
          s.pc--;
        } else if (!collides(s.board, s.type, newRot, s.pr, s.pc + 1)) {
          s.rot = newRot;
          s.pc++;
        }
      }

      // Hard drop
      if (s.dropPending) {
        s.dropPending = false;
        s.pr = ghostRow(s.board, s.type, s.rot, s.pr, s.pc);
        s.board = lockPiece(s.board, s.type, s.rot, s.pr, s.pc);
        const { board: clearedBoard, cleared } = clearLines(s.board);
        s.board = clearedBoard;
        s.lines += cleared;
        s.level = Math.floor(s.lines / 10) + 1;
        s.score += LINE_SCORES[cleared] ?? 0;
        setScore(s.score);
        setLines(s.lines);
        setLevel(s.level);
        if (s.mode === "classic" && s.lines >= CLASSIC_WIN_LINES) {
          cancelAnimationFrame(rafRef.current);
          s.phase = "won";
          setPhase("won");
          return;
        }
        s.lastDrop = now;
        spawnPiece();
      }

      // Lateral movement
      if (s.moveCooldown > 0) {
        s.moveCooldown--;
      } else {
        if (s.keys.left && !collides(s.board, s.type, s.rot, s.pr, s.pc - 1)) {
          s.pc--;
          s.moveCooldown = 6;
        }
        if (s.keys.right && !collides(s.board, s.type, s.rot, s.pr, s.pc + 1)) {
          s.pc++;
          s.moveCooldown = 6;
        }
      }

      // Gravity / soft drop
      const dropInterval = s.keys.down ? Math.min(interval, 60) : interval;
      if (now - s.lastDrop >= dropInterval) {
        s.lastDrop = now;
        if (!collides(s.board, s.type, s.rot, s.pr + 1, s.pc)) {
          s.pr++;
        } else {
          s.board = lockPiece(s.board, s.type, s.rot, s.pr, s.pc);
          const { board: clearedBoard, cleared } = clearLines(s.board);
          s.board = clearedBoard;
          s.lines += cleared;
          s.level = Math.floor(s.lines / 10) + 1;
          s.score += LINE_SCORES[cleared] ?? 0;
          setScore(s.score);
          setLines(s.lines);
          setLevel(s.level);
          if (s.mode === "classic" && s.lines >= CLASSIC_WIN_LINES) {
            cancelAnimationFrame(rafRef.current);
            s.phase = "won";
            setPhase("won");
            return;
          }
          spawnPiece();
        }
      }

      // ─── Draw ──────────────────────────────────────────────────────────────
      ctx.clearRect(0, 0, 240, 405);

      // Board bg
      ctx.fillStyle = "#0a1120";
      ctx.fillRect(OFF_X, OFF_Y, BOARD_W, BOARD_H);

      // Grid lines
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 0.5;
      for (let r = 0; r <= ROWS; r++) {
        ctx.beginPath();
        ctx.moveTo(OFF_X, OFF_Y + r * CELL);
        ctx.lineTo(OFF_X + BOARD_W, OFF_Y + r * CELL);
        ctx.stroke();
      }
      for (let c = 0; c <= COLS; c++) {
        ctx.beginPath();
        ctx.moveTo(OFF_X + c * CELL, OFF_Y);
        ctx.lineTo(OFF_X + c * CELL, OFF_Y + BOARD_H);
        ctx.stroke();
      }

      // Locked cells
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const color = s.board[r][c];
          if (!color) continue;
          ctx.fillStyle = color;
          ctx.fillRect(OFF_X + c * CELL + 1, OFF_Y + r * CELL + 1, CELL - 2, CELL - 2);
          // Highlight
          ctx.fillStyle = "rgba(255,255,255,0.15)";
          ctx.fillRect(OFF_X + c * CELL + 1, OFF_Y + r * CELL + 1, CELL - 2, 3);
        }
      }

      // Ghost piece
      const ghostR = ghostRow(s.board, s.type, s.rot, s.pr, s.pc);
      if (ghostR !== s.pr) {
        ctx.fillStyle = `${PIECE_COLORS[s.type]}33`;
        for (const [dr, dc] of pieceCells(s.type, s.rot)) {
          const r = ghostR + dr,
            c = s.pc + dc;
          if (r >= 0) ctx.fillRect(OFF_X + c * CELL + 1, OFF_Y + r * CELL + 1, CELL - 2, CELL - 2);
        }
      }

      // Active piece
      ctx.fillStyle = PIECE_COLORS[s.type];
      for (const [dr, dc] of pieceCells(s.type, s.rot)) {
        const r = s.pr + dr,
          c = s.pc + dc;
        if (r >= 0) {
          ctx.fillRect(OFF_X + c * CELL + 1, OFF_Y + r * CELL + 1, CELL - 2, CELL - 2);
          ctx.fillStyle = "rgba(255,255,255,0.15)";
          ctx.fillRect(OFF_X + c * CELL + 1, OFF_Y + r * CELL + 1, CELL - 2, 3);
          ctx.fillStyle = PIECE_COLORS[s.type];
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Keyboard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "playing") return;
    const s = stateRef.current;

    function onDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        s.keys.left = true;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        s.keys.right = true;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        s.keys.down = true;
      }
      if (e.key === "ArrowUp" || e.key === "x") {
        e.preventDefault();
        s.rotatePending = true;
      }
      if (e.key === " ") {
        e.preventDefault();
        s.dropPending = true;
      }
    }
    function onUp(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") s.keys.left = false;
      if (e.key === "ArrowRight") s.keys.right = false;
      if (e.key === "ArrowDown") s.keys.down = false;
    }

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      s.keys = { left: false, right: false, down: false, rotate: false, drop: false };
    };
  }, [phase]);

  return (
    <>
      <div className="bg-primitive-slate-800 rounded-2 relative h-101.25 w-60 shrink-0 overflow-hidden shadow-[inset_1px_5px_11px_0px_rgba(2,18,27,0.71)]">
        <canvas ref={canvasRef} width={240} height={405} className="absolute inset-0" />

        {phase === "idle" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{ paddingBottom: "40px" }}
          >
            <p className="text-body-sm text-primitive-slate-400">{"// choose mode"}</p>
            <Button variant="primary" onClick={() => startGame("classic")}>
              classic
            </Button>
            <Button variant="default" onClick={() => startGame("endless")}>
              endless
            </Button>
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
            <Button variant="primary" onClick={() => startGame("classic")}>
              classic
            </Button>
            <Button variant="default" onClick={() => startGame("endless")}>
              endless
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
            <p className="text-heading-h5 text-primitive-teal-400">{highScore}</p>
          </div>
          <div className="flex w-full flex-col gap-1 px-[10px]">
            <p className="text-body-sm text-primitive-slate-50">{"// lines"}</p>
            <p className="text-heading-h5 text-primitive-teal-400">
              {gameMode === "classic" ? `${lines}/${CLASSIC_WIN_LINES}` : lines}
            </p>
          </div>
          <div className="flex w-full flex-col gap-1 px-[10px]">
            <p className="text-body-sm text-primitive-slate-50">{"// level"}</p>
            <p className="text-heading-h5 text-primitive-teal-400">{level}</p>
          </div>
          <div className="bg-primitive-slate-800 rounded-3 flex w-full flex-col gap-1 p-[10px]">
            <p className="text-body-sm text-primitive-slate-50">{"// controls"}</p>
            <p className="text-body-sm text-theme-foreground opacity-60">←→ move</p>
            <p className="text-body-sm text-theme-foreground opacity-60">↑ / x rotate</p>
            <p className="text-body-sm text-theme-foreground opacity-60">↓ soft drop</p>
            <p className="text-body-sm text-theme-foreground opacity-60">space hard drop</p>
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
