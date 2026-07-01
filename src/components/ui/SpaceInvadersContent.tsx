"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";

type Phase = "idle" | "playing" | "won" | "over";
type GameMode = "classic" | "endless";

// ─── Constants ────────────────────────────────────────────────────────────────
const W = 240,
  H = 405;
const COLS = 8,
  ROWS = 4;
const E_W = 18,
  E_H = 12,
  E_GAP_X = 10,
  E_GAP_Y = 8;
const GRID_W = COLS * (E_W + E_GAP_X) - E_GAP_X;
const GRID_OFF_X = (W - GRID_W) / 2;
const GRID_OFF_Y = 30;

const PLAYER_W = 30,
  PLAYER_H = 12;
const PLAYER_Y = H - 32;
const PLAYER_SPEED = 3;

const BULLET_W = 3,
  BULLET_H = 10;
const BULLET_SPEED = 6;
const E_BULLET_SPEED = 2.5;

const ENEMY_COLORS = [
  "#ff637e",
  "#ff637e",
  "#7c86ff",
  "#7c86ff",
  "#00d5be",
  "#00d5be",
  "#fdc700",
  "#fdc700",
];

// ─── Types ────────────────────────────────────────────────────────────────────
type Enemy = { x: number; y: number; row: number; col: number; alive: boolean };
type Bullet = { x: number; y: number };

// ─── HS ───────────────────────────────────────────────────────────────────────
function getHS() {
  try {
    return parseInt(localStorage.getItem("si-hs-endless") ?? "0", 10) || 0;
  } catch {
    return 0;
  }
}
function setHS(n: number) {
  try {
    localStorage.setItem("si-hs-endless", String(n));
  } catch {}
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SpaceInvadersContent({ onChangeGame }: { onChangeGame: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameMode, setGameMode] = useState<GameMode>("classic");

  // Mutable game state in refs (for RAF loop)
  const stateRef = useRef({
    enemies: [] as Enemy[],
    bullets: [] as Bullet[],
    enemyBullets: [] as Bullet[],
    playerX: W / 2 - PLAYER_W / 2,
    dirX: 1, // enemy swarm direction
    enemySpeed: 0.4,
    score: 0,
    wave: 0,
    keys: { left: false, right: false, fire: false },
    fireCooldown: 0,
    enemyFireTimer: 0,
    mode: "classic" as GameMode,
    phase: "idle" as Phase,
  });
  const rafRef = useRef(0);

  useEffect(() => {
    setTimeout(() => setHighScore(getHS()), 0);
  }, []);

  function makeEnemies(waveIndex: number): Enemy[] {
    const enemies: Enemy[] = [];
    const speed = 0.4 + waveIndex * 0.12;
    stateRef.current.enemySpeed = speed;
    const startY = GRID_OFF_Y;
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        enemies.push({
          x: GRID_OFF_X + c * (E_W + E_GAP_X),
          y: startY + r * (E_H + E_GAP_Y),
          row: r,
          col: c,
          alive: true,
        });
    return enemies;
  }

  function startGame(mode: GameMode) {
    setGameMode(mode);
    const s = stateRef.current;
    s.mode = mode;
    s.phase = "playing";
    s.score = 0;
    s.wave = 0;
    s.dirX = 1;
    s.playerX = W / 2 - PLAYER_W / 2;
    s.bullets = [];
    s.enemyBullets = [];
    s.fireCooldown = 0;
    s.enemyFireTimer = 0;
    s.enemies = makeEnemies(0);
    setScore(0);
    setPhase("playing");
  }

  function endGame(won: boolean) {
    cancelAnimationFrame(rafRef.current);
    const s = stateRef.current;
    s.phase = won ? "won" : "over";
    if (s.mode === "endless" && s.score > getHS()) {
      setHS(s.score);
      setHighScore(s.score);
    }
    setPhase(won ? "won" : "over");
  }

  // ─── RAF loop ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function tick() {
      const s = stateRef.current;
      if (!ctx) return;

      // Input
      if (s.keys.left) s.playerX = Math.max(0, s.playerX - PLAYER_SPEED);
      if (s.keys.right) s.playerX = Math.min(W - PLAYER_W, s.playerX + PLAYER_SPEED);

      s.fireCooldown = Math.max(0, s.fireCooldown - 1);
      if (s.keys.fire && s.fireCooldown === 0) {
        s.bullets.push({ x: s.playerX + PLAYER_W / 2 - BULLET_W / 2, y: PLAYER_Y - BULLET_H });
        s.fireCooldown = 18;
      }

      // Move player bullets
      s.bullets = s.bullets.filter((b) => b.y > -BULLET_H);
      s.bullets.forEach((b) => {
        b.y -= BULLET_SPEED;
      });

      // Move enemy bullets
      s.enemyBullets = s.enemyBullets.filter((b) => b.y < H + BULLET_H);
      s.enemyBullets.forEach((b) => {
        b.y += E_BULLET_SPEED;
      });

      // Move enemies
      const alive = s.enemies.filter((e) => e.alive);
      if (alive.length > 0) {
        const hitWall = alive.some(
          (e) =>
            (s.dirX > 0 && e.x + E_W + s.enemySpeed > W) || (s.dirX < 0 && e.x - s.enemySpeed < 0),
        );
        if (hitWall) {
          s.dirX *= -1;
          s.enemies.forEach((e) => {
            e.y += 8;
          });
        } else {
          s.enemies.forEach((e) => {
            e.x += s.dirX * s.enemySpeed;
          });
        }

        // Enemy fire
        s.enemyFireTimer--;
        if (s.enemyFireTimer <= 0) {
          const shooter = alive[Math.floor(Math.random() * alive.length)];
          s.enemyBullets.push({ x: shooter.x + E_W / 2 - BULLET_W / 2, y: shooter.y + E_H });
          s.enemyFireTimer = 50 + Math.floor(Math.random() * 60);
        }
      }

      // Bullet-enemy collisions
      for (const bullet of s.bullets) {
        for (const enemy of s.enemies) {
          if (!enemy.alive) continue;
          if (
            bullet.x < enemy.x + E_W &&
            bullet.x + BULLET_W > enemy.x &&
            bullet.y < enemy.y + E_H &&
            bullet.y + BULLET_H > enemy.y
          ) {
            enemy.alive = false;
            bullet.y = -999;
            s.score += 10 + (3 - Math.min(enemy.row, 3)) * 5;
            setScore(s.score);
          }
        }
      }

      // Enemy bullet hits player
      const px = s.playerX,
        py = PLAYER_Y;
      for (const b of s.enemyBullets) {
        if (
          b.x < px + PLAYER_W &&
          b.x + BULLET_W > px &&
          b.y < py + PLAYER_H &&
          b.y + BULLET_H > py
        ) {
          endGame(false);
          return;
        }
      }

      // Enemies reach bottom
      if (s.enemies.some((e) => e.alive && e.y + E_H >= PLAYER_Y)) {
        endGame(false);
        return;
      }

      // All enemies dead
      if (s.enemies.every((e) => !e.alive)) {
        if (s.mode === "classic") {
          endGame(true);
          return;
        }
        // Endless: next wave
        s.wave++;
        s.enemies = makeEnemies(s.wave);
        s.bullets = [];
        s.enemyBullets = [];
        s.enemyFireTimer = 80;
      }

      // ─── Draw ────────────────────────────────────────────────────────────
      ctx.clearRect(0, 0, W, H);

      // Stars
      ctx.fillStyle = "rgba(148,163,184,0.2)";
      for (let i = 0; i < 40; i++) {
        // Deterministic stars using hash
        const sx = (i * 97 + 13) % W;
        const sy = (i * 53 + 7) % H;
        ctx.fillRect(sx, sy, 1, 1);
      }

      // Enemies
      for (const e of s.enemies) {
        if (!e.alive) continue;
        const color = ENEMY_COLORS[e.row % ENEMY_COLORS.length];
        ctx.fillStyle = color;
        // Simple UFO shape
        ctx.fillRect(e.x + 4, e.y, E_W - 8, E_H * 0.5);
        ctx.fillRect(e.x, e.y + E_H * 0.4, E_W, E_H * 0.6);
        // Eyes
        ctx.fillStyle = "#020618";
        ctx.fillRect(e.x + 4, e.y + E_H * 0.5, 3, 3);
        ctx.fillRect(e.x + E_W - 7, e.y + E_H * 0.5, 3, 3);
      }

      // Player ship
      ctx.fillStyle = "#00d5be";
      ctx.fillRect(px + 12, py, 6, 4);
      ctx.fillRect(px + 6, py + 4, 18, 4);
      ctx.fillRect(px, py + 8, PLAYER_W, PLAYER_H - 8);
      // Nozzle glow
      ctx.fillStyle = "rgba(0,213,190,0.4)";
      ctx.fillRect(px + 12, py + PLAYER_H, 6, 3);

      // Player bullets
      ctx.fillStyle = "#fdc700";
      for (const b of s.bullets) ctx.fillRect(b.x, b.y, BULLET_W, BULLET_H);

      // Enemy bullets
      ctx.fillStyle = "#ff637e";
      for (const b of s.enemyBullets) ctx.fillRect(b.x, b.y, BULLET_W, BULLET_H);

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

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
      if (e.key === " ") {
        e.preventDefault();
        s.keys.fire = true;
      }
    }
    function onUp(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") s.keys.left = false;
      if (e.key === "ArrowRight") s.keys.right = false;
      if (e.key === " ") s.keys.fire = false;
    }

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      s.keys = { left: false, right: false, fire: false };
    };
  }, [phase]);

  return (
    <>
      <div className="bg-primitive-slate-800 rounded-2 relative h-101.25 w-60 shrink-0 overflow-hidden shadow-[inset_1px_5px_11px_0px_rgba(2,18,27,0.71)]">
        <canvas ref={canvasRef} width={W} height={H} className="absolute inset-0" />

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
          {gameMode === "endless" && (
            <div className="flex w-full flex-col gap-1 px-[10px]">
              <p className="text-body-sm text-primitive-slate-50">{"// best"}</p>
              <p className="text-heading-h5 text-primitive-teal-400">{highScore}</p>
            </div>
          )}
          <div className="bg-primitive-slate-800 rounded-3 flex w-full flex-col gap-1 p-[10px]">
            <p className="text-body-sm text-primitive-slate-50">{"// controls"}</p>
            <p className="text-body-sm text-theme-foreground opacity-60">←→ to move</p>
            <p className="text-body-sm text-theme-foreground opacity-60">space to fire</p>
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
