import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 120;

type Point = { x: number; y: number };

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  const directionRef = useRef(direction);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        setIsPaused(prev => !prev);
        return;
      }

      if (gameOver) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    },
    [gameOver]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8 pt-16">
      <div className="mb-6 text-center w-full flex justify-between items-end border-b-4 border-[#f0f] pb-2">
        <h2 className="text-4xl font-black tracking-widest text-[#f0f] glitch-text" data-text="SNAKE_PROTOCOL">
          SNAKE_PROTOCOL
        </h2>
        <div className="text-3xl text-[#0ff]">
          DATA_YIELD: {score.toString().padStart(4, '0')}
        </div>
      </div>

      <div className="relative p-2 bg-[#f0f] shadow-[0_0_15px_#f0f]">
        <div 
          className="grid bg-black overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(70vw, 450px)',
            height: 'min(70vw, 450px)',
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some(segment => segment.x === x && segment.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={i}
                className={`w-full h-full border-[1px] border-[#333] ${
                  isHead
                    ? 'bg-[#0ff] shadow-[0_0_10px_#0ff]'
                    : isSnake
                    ? 'bg-[#0aa]'
                    : isFood
                    ? 'bg-[#f0f] shadow-[0_0_15px_#f0f] animate-pulse'
                    : 'bg-transparent'
                }`}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {(gameOver || isPaused) && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 border-4 border-[#f0f]">
            {gameOver ? (
              <>
                <h3 className="text-5xl font-bold text-[#f0f] mb-4 glitch-text" data-text="SYSTEM_FAILURE">
                  SYSTEM_FAILURE
                </h3>
                <p className="text-[#0ff] text-2xl mb-8">FINAL_YIELD: {score}</p>
                <button
                  onClick={resetGame}
                  className="px-8 py-4 text-2xl font-bold text-black bg-[#0ff] hover:bg-[#f0f] hover:text-white transition-colors border-4 border-transparent hover:border-[#0ff] active:scale-95"
                >
                  REBOOT_SEQUENCE
                </button>
              </>
            ) : (
              <h3 className="text-5xl font-bold text-[#0ff] glitch-text" data-text="EXECUTION_HALTED">
                EXECUTION_HALTED
              </h3>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-8 text-xl text-[#f0f] text-center">
        INPUT_VECTOR: [W,A,S,D] OR [ARROWS]
        <br />
        INTERRUPT: [SPACE]
      </div>
    </div>
  );
}
