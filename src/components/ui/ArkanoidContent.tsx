"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";

const CANVAS_W = 240;
const CANVAS_H = 405;
const PADDLE_W = 60;
const PADDLE_H = 10;
const PADDLE_Y = CANVAS_H - 30;
const BALL_R = 6;
const BRICK_COLS = 8;
const BRICK_ROWS = 5;
const BRICK_W = 24;
const BRICK_H = 12;
const BRICK_GAP = 4;
const BRICK_OFFSET_X = (CANVAS_W - (BRICK_COLS * (BRICK_W + BRICK_GAP) - BRICK_GAP)) / 2;
const BRICK_OFFSET_Y = 40;
const PADDLE_SPEED = 5;
const INIT_SPEED = 3.2;
const MAX_SPEED = 5.5;
const MAX_LIVES = 3;

const BRICK_COLORS = ["#ff637e", "#ff8904", "#fdc700", "#00d5be", "#7c86ff"];

type Phase = "idle" | "playing" | "over" | "won";
type Ball = { x: number; y: number; vx: number; vy: number };
type Brick = { x: number; y: number; alive: boolean; color: string };

function makeBricks(): Brick[] {
  const bricks: Brick[] = [];
  for (let row = 0; row < BRICK_ROWS; row++) {
    for (let col = 0; col < BRICK_COLS; col++) {
      bricks.push({
        x: BRICK_OFFSET_X + col * (BRICK_W + BRICK_GAP),
        y: BRICK_OFFSET_Y + row * (BRICK_H + BRICK_GAP),
        alive: true,
        color: BRICK_COLORS[row],
      });
    }
  }
  return bricks;
}

function initBall(paddleX: number): Ball {
  return {
    x: paddleX + PADDLE_W / 2,
    y: PADDLE_Y - BALL_R - 2,
    vx: (Math.random() < 0.5 ? 1 : -1) * 1.8,
    vy: -INIT_SPEED,
  };
}

export default function ArkanoidContent({ onChangeGame }: { onChangeGame: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef<Phase>("idle");
  const ballRef = useRef<Ball>(initBall(CANVAS_W / 2 - PADDLE_W / 2));
  const paddleRef = useRef({ x: CANVAS_W / 2 - PADDLE_W / 2 });
  const bricksRef = useRef<Brick[]>(makeBricks());
  const livesRef = useRef(MAX_LIVES);
  const scoreRef = useRef(0);
  const keysRef = useRef({ left: false, right: false });
  const rafRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#1d293d";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Bricks
    for (const brick of bricksRef.current) {
      if (!brick.alive) continue;
      ctx.save();
      ctx.shadowColor = brick.color;
      ctx.shadowBlur = 5;
      ctx.fillStyle = brick.color;
      ctx.beginPath();
      ctx.roundRect(brick.x, brick.y, BRICK_W, BRICK_H, 2);
      ctx.fill();
      ctx.restore();
    }

    // Paddle
    ctx.save();
    ctx.shadowColor = "#00d5be";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#00d5be";
    ctx.beginPath();
    ctx.roundRect(paddleRef.current.x, PADDLE_Y, PADDLE_W, PADDLE_H, 4);
    ctx.fill();
    ctx.restore();

    // Ball
    ctx.save();
    ctx.shadowColor = "#00d5be";
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#00d5be";
    ctx.beginPath();
    ctx.arc(ballRef.current.x, ballRef.current.y, BALL_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }, []);

  const resetBall = useCallback(() => {
    ballRef.current = initBall(paddleRef.current.x);
    draw();
  }, [draw]);

  const startGame = useCallback(() => {
    paddleRef.current = { x: CANVAS_W / 2 - PADDLE_W / 2 };
    bricksRef.current = makeBricks();
    livesRef.current = MAX_LIVES;
    scoreRef.current = 0;
    setScore(0);
    setLives(MAX_LIVES);
    ballRef.current = initBall(CANVAS_W / 2 - PADDLE_W / 2);
    phaseRef.current = "playing";
    setPhase("playing");
  }, []);

  // Game loop
  useEffect(() => {
    if (phase !== "playing") return;

    const loop = () => {
      if (phaseRef.current !== "playing") return;

      // Paddle movement
      const p = paddleRef.current;
      if (keysRef.current.left) p.x = Math.max(0, p.x - PADDLE_SPEED);
      if (keysRef.current.right) p.x = Math.min(CANVAS_W - PADDLE_W, p.x + PADDLE_SPEED);

      // Ball movement
      const b = ballRef.current;
      b.x += b.vx;
      b.y += b.vy;

      // Wall collisions
      if (b.x - BALL_R <= 0) {
        b.x = BALL_R;
        b.vx = Math.abs(b.vx);
      }
      if (b.x + BALL_R >= CANVAS_W) {
        b.x = CANVAS_W - BALL_R;
        b.vx = -Math.abs(b.vx);
      }
      if (b.y - BALL_R <= 0) {
        b.y = BALL_R;
        b.vy = Math.abs(b.vy);
      }

      // Paddle collision
      if (
        b.vy > 0 &&
        b.y + BALL_R >= PADDLE_Y &&
        b.y + BALL_R <= PADDLE_Y + PADDLE_H + Math.abs(b.vy) &&
        b.x >= p.x - BALL_R &&
        b.x <= p.x + PADDLE_W + BALL_R
      ) {
        b.y = PADDLE_Y - BALL_R;
        const hit = (b.x - p.x) / PADDLE_W; // 0–1
        const angle = (hit - 0.5) * 2; // -1 to 1
        const speed = Math.min(Math.sqrt(b.vx * b.vx + b.vy * b.vy) + 0.08, MAX_SPEED);
        b.vx = angle * speed * 0.85;
        b.vy = -Math.sqrt(Math.max(speed * speed - b.vx * b.vx, 1));
      }

      // Ball out of bounds (missed paddle)
      if (b.y - BALL_R > CANVAS_H) {
        const newLives = livesRef.current - 1;
        livesRef.current = newLives;
        setLives(newLives);
        if (newLives <= 0) {
          phaseRef.current = "over";
          setPhase("over");
          draw();
          return;
        }
        resetBall();
      }

      // Brick collisions
      for (const brick of bricksRef.current) {
        if (!brick.alive) continue;

        const ballL = b.x - BALL_R;
        const ballR = b.x + BALL_R;
        const ballT = b.y - BALL_R;
        const ballB = b.y + BALL_R;
        const brickR = brick.x + BRICK_W;
        const brickB = brick.y + BRICK_H;

        if (ballR <= brick.x || ballL >= brickR || ballB <= brick.y || ballT >= brickB) continue;

        brick.alive = false;
        const newScore = scoreRef.current + 10;
        scoreRef.current = newScore;
        setScore(newScore);

        // Speed up slightly on each hit
        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (speed < MAX_SPEED) {
          const ratio = Math.min(speed + 0.05, MAX_SPEED) / speed;
          b.vx *= ratio;
          b.vy *= ratio;
        }

        // Reflect off the closest face
        const overlapL = ballR - brick.x;
        const overlapR = brickR - ballL;
        const overlapT = ballB - brick.y;
        const overlapB = brickB - ballT;
        if (Math.min(overlapL, overlapR) < Math.min(overlapT, overlapB)) {
          b.vx = overlapL < overlapR ? -Math.abs(b.vx) : Math.abs(b.vx);
        } else {
          b.vy = overlapT < overlapB ? -Math.abs(b.vy) : Math.abs(b.vy);
        }
        break;
      }

      // Win check
      if (bricksRef.current.every((br) => !br.alive)) {
        phaseRef.current = "won";
        setPhase("won");
        draw();
        return;
      }

      draw();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, draw, resetBall]);

  // Keyboard
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        keysRef.current.left = true;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        keysRef.current.right = true;
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") keysRef.current.left = false;
      if (e.key === "ArrowRight") keysRef.current.right = false;
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  // Mouse control
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onMove = (e: MouseEvent) => {
      if (phaseRef.current !== "playing") return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_W / rect.width;
      const mouseX = (e.clientX - rect.left) * scaleX;
      paddleRef.current.x = Math.max(0, Math.min(CANVAS_W - PADDLE_W, mouseX - PADDLE_W / 2));
    };
    canvas.addEventListener("mousemove", onMove);
    return () => canvas.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    draw();
  }, [draw, phase]);

  return (
    <>
      {/* Board */}
      <div className="bg-primitive-slate-800 rounded-2 relative h-101.25 w-60 shrink-0 overflow-hidden shadow-[inset_1px_5px_11px_0px_rgba(2,18,27,0.71)]">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="block h-full w-full"
        />

        {phase === "idle" && (
          <div
            className="absolute inset-0 flex items-end justify-center"
            style={{ paddingBottom: "70px" }}
          >
            <Button variant="primary" onClick={startGame}>
              start-game
            </Button>
          </div>
        )}

        {(phase === "over" || phase === "won") && (
          <>
            <div
              className="rounded-2 absolute right-0 left-0 flex h-12 flex-col items-center justify-center shadow-[inset_1px_5px_11px_0px_rgba(2,18,27,0.71)]"
              style={{ top: "264px", backgroundColor: "rgba(1,22,39,0.84)" }}
            >
              <p className="text-heading-h5 text-primitive-teal-400">
                {phase === "won" ? "YOU WIN!" : "GAME OVER!"}
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
          {/* Score */}
          <div className="bg-primitive-slate-800 rounded-3 flex w-full flex-col gap-2 p-[10px]">
            <p className="text-body-sm text-primitive-slate-50">{"// score"}</p>
            <p className="text-heading-h5 text-primitive-teal-400">{score}</p>
          </div>

          {/* Lives */}
          <div className="flex w-full flex-col gap-3 px-[10px]">
            <p className="text-body-sm text-primitive-slate-50">{"// lives"}</p>
            <div className="flex gap-2">
              {Array.from({ length: MAX_LIVES }).map((_, i) => (
                <div
                  key={i}
                  className="h-3 w-3 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: i < lives ? "#00d5be" : "#314158",
                    boxShadow: i < lives ? "0 0 6px #00d5be" : "none",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="bg-primitive-slate-800 rounded-3 flex w-full flex-col gap-1 p-[10px]">
            <p className="text-body-sm text-primitive-slate-50">{"// controls"}</p>
            <p className="text-body-sm text-theme-foreground opacity-60">{"← → or mouse"}</p>
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
