"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";

export type GameId = "snake" | "life" | "ttt" | "arkanoid" | "sudoku";

type Game = {
  id: GameId;
  name: string;
  tag: string;
  rules: string[];
};

const GAMES: Game[] = [
  {
    id: "arkanoid",
    name: "arkanoid.exe",
    tag: "// breakout",
    rules: [
      "move the paddle with ← → or mouse",
      "bounce the ball to break bricks",
      "don't let the ball fall past the paddle",
      "clear all bricks to win",
    ],
  },
  {
    id: "snake",
    name: "snake_game.exe",
    tag: "// classic",
    rules: [
      "use arrow keys to steer the snake",
      "eat food dots to grow",
      "avoid walls and your own tail",
      "collect all 10 to win",
    ],
  },
  {
    id: "life",
    name: "game_of_life.exe",
    tag: "// zero-player",
    rules: [
      "a live cell with 2-3 neighbors survives",
      "a dead cell with 3 neighbors comes alive",
      "everything else dies or stays dead",
      "hit randomize and watch it evolve",
    ],
  },
  {
    id: "ttt",
    name: "tic_tac_toe.exe",
    tag: "// 2-player",
    rules: [
      "two players take turns — X goes first",
      "click a cell to place your mark",
      "get 3 in a row to win",
      "horizontal, vertical, or diagonal",
    ],
  },
  {
    id: "sudoku",
    name: "sudoku.exe",
    tag: "// puzzle",
    rules: [
      "fill the 9×9 grid with numbers 1-9",
      "no repeats in any row, column, or box",
      "click a cell then press 1-9 to fill",
      "3 mistakes and it's game over",
    ],
  },
];

type Props = {
  open: boolean;
  current: GameId;
  onSelect: (id: GameId) => void;
  onClose: () => void;
};

export default function GameSelectorModal({ open, current, onSelect, onClose }: Props) {
  const [hovered, setHovered] = useState<GameId | null>(null);

  const activeRules = GAMES.find((g) => g.id === (hovered ?? current))?.rules ?? [];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(2, 6, 24, 0.85)", backdropFilter: "blur(4px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-body-sm text-theme-foreground opacity-60">{"// select a game"}</p>

            <div className="flex gap-4">
              {GAMES.map((game) => {
                const isActive = game.id === current;
                return (
                  <button
                    key={game.id}
                    onClick={() => onSelect(game.id)}
                    onMouseEnter={() => setHovered(game.id)}
                    onMouseLeave={() => setHovered(null)}
                    className={[
                      "border-theme-theme-stroke rounded-3 flex w-40 cursor-pointer flex-col gap-2 border p-4 text-left transition-colors duration-150",
                      isActive
                        ? "bg-primitive-slate-800 border-primitive-slate-500"
                        : "hover:bg-primitive-slate-800/60",
                    ].join(" ")}
                  >
                    <p className="text-body-sm text-theme-heading-foreground">{game.name}</p>
                    <p className="text-body-sm text-primitive-teal-400">{game.tag}</p>
                  </button>
                );
              })}
            </div>

            {/* Rules section */}
            <div className="flex w-full flex-col gap-2">
              <p className="text-body-sm text-theme-foreground opacity-60">{"// how to play"}</p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={hovered ?? current}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="flex flex-col gap-1"
                >
                  {activeRules.map((rule) => (
                    <p key={rule} className="text-body-sm text-theme-foreground">
                      <span className="text-primitive-teal-400 mr-2">→</span>
                      {rule}
                    </p>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
