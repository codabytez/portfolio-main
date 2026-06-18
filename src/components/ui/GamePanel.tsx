"use client";

import { useState } from "react";
import Image from "next/image";
import GameSelectorModal, { type GameId } from "@/components/ui/GameSelectorModal";
import SnakeContent from "@/components/ui/SnakeContent";
import GameOfLifeContent from "@/components/ui/GameOfLifeContent";
import TicTacToeContent from "@/components/ui/TicTacToeContent";
import ArkanoidContent from "@/components/ui/ArkanoidContent";
import SudokuContent from "@/components/ui/SudokuContent";

export default function GamePanel({ className }: { className?: string }) {
  const [activeGame, setActiveGame] = useState<GameId>("arkanoid");
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);

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

      {activeGame === "snake" && <SnakeContent onChangeGame={openModal} />}
      {activeGame === "life" && <GameOfLifeContent onChangeGame={openModal} />}
      {activeGame === "ttt" && <TicTacToeContent onChangeGame={openModal} />}
      {activeGame === "arkanoid" && <ArkanoidContent onChangeGame={openModal} />}
      {activeGame === "sudoku" && <SudokuContent onChangeGame={openModal} />}

      <GameSelectorModal
        open={modalOpen}
        current={activeGame}
        onSelect={(id) => {
          setActiveGame(id);
          setModalOpen(false);
        }}
        onClose={() => setModalOpen(false)}
      />

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
