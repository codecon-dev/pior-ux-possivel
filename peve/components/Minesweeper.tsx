"use client";

import React, { useState, useEffect, useCallback } from "react";

// Tipos para o jogo
type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

type GameStatus = "playing" | "won" | "lost";

interface MinesweeperProps {
  width?: number;
  height?: number;
  mineCount?: number;
}

const Minesweeper: React.FC<MinesweeperProps> = ({
  width = 10,
  height = 10,
  mineCount = 15,
}) => {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
  const [flagsUsed, setFlagsUsed] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Inicializar o tabuleiro
  const initializeBoard = useCallback(() => {
    const newBoard: Cell[][] = [];

    // Criar tabuleiro vazio
    for (let row = 0; row < height; row++) {
      newBoard[row] = [];
      for (let col = 0; col < width; col++) {
        newBoard[row][col] = {
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        };
      }
    }

    // Colocar minas aleatoriamente
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
      const row = Math.floor(Math.random() * height);
      const col = Math.floor(Math.random() * width);

      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calcular números de minas vizinhas
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const newRow = row + dr;
              const newCol = col + dc;
              if (
                newRow >= 0 &&
                newRow < height &&
                newCol >= 0 &&
                newCol < width &&
                newBoard[newRow][newCol].isMine
              ) {
                count++;
              }
            }
          }
          newBoard[row][col].neighborMines = count;
        }
      }
    }

    setBoard(newBoard);
    setGameStatus("playing");
    setFlagsUsed(0);
    setRevealedCount(0);
    setTimer(0);
    setGameStarted(false);
  }, [width, height, mineCount]);

  // Inicializar jogo quando componente monta
  useEffect(() => {
    // Usar uma função separada para evitar o warning do React
    const initialize = () => {
      const newBoard: Cell[][] = [];

      // Criar tabuleiro vazio
      for (let row = 0; row < height; row++) {
        newBoard[row] = [];
        for (let col = 0; col < width; col++) {
          newBoard[row][col] = {
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            neighborMines: 0,
          };
        }
      }

      // Colocar minas aleatoriamente
      let minesPlaced = 0;
      while (minesPlaced < mineCount) {
        const row = Math.floor(Math.random() * height);
        const col = Math.floor(Math.random() * width);

        if (!newBoard[row][col].isMine) {
          newBoard[row][col].isMine = true;
          minesPlaced++;
        }
      }

      // Calcular números de minas vizinhas
      for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
          if (!newBoard[row][col].isMine) {
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                const newRow = row + dr;
                const newCol = col + dc;
                if (
                  newRow >= 0 &&
                  newRow < height &&
                  newCol >= 0 &&
                  newCol < width &&
                  newBoard[newRow][newCol].isMine
                ) {
                  count++;
                }
              }
            }
            newBoard[row][col].neighborMines = count;
          }
        }
      }

      setBoard(newBoard);
      setGameStatus("playing");
      setFlagsUsed(0);
      setRevealedCount(0);
      setTimer(0);
      setGameStarted(false);
    };

    initialize();
  }, [width, height, mineCount]);

  // Timer do jogo
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && gameStatus === "playing") {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameStatus]);

  // Revelar célula e células vizinhas vazias
  const revealCell = (row: number, col: number) => {
    if (
      gameStatus !== "playing" ||
      board[row][col].isRevealed ||
      board[row][col].isFlagged
    ) {
      return;
    }

    if (!gameStarted) {
      setGameStarted(true);
    }

    const newBoard = [...board];
    const cellsToReveal: [number, number][] = [[row, col]];
    let newRevealedCount = revealedCount;

    while (cellsToReveal.length > 0) {
      const [currentRow, currentCol] = cellsToReveal.pop()!;

      if (
        currentRow < 0 ||
        currentRow >= height ||
        currentCol < 0 ||
        currentCol >= width ||
        newBoard[currentRow][currentCol].isRevealed ||
        newBoard[currentRow][currentCol].isFlagged
      ) {
        continue;
      }

      newBoard[currentRow][currentCol].isRevealed = true;
      newRevealedCount++;

      // Se clicou em uma mina
      if (newBoard[currentRow][currentCol].isMine) {
        setGameStatus("lost");
        // Revelar todas as minas
        for (let r = 0; r < height; r++) {
          for (let c = 0; c < width; c++) {
            if (newBoard[r][c].isMine) {
              newBoard[r][c].isRevealed = true;
            }
          }
        }
        break;
      }

      // Se a célula não tem minas vizinhas, revelar células vizinhas
      if (newBoard[currentRow][currentCol].neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            cellsToReveal.push([currentRow + dr, currentCol + dc]);
          }
        }
      }
    }

    setBoard(newBoard);
    setRevealedCount(newRevealedCount);

    // Verificar vitória
    if (
      newRevealedCount === width * height - mineCount &&
      gameStatus === "playing"
    ) {
      setGameStatus("won");
    }
  };

  // Alternar bandeira
  const toggleFlag = (row: number, col: number) => {
    if (gameStatus !== "playing" || board[row][col].isRevealed) {
      return;
    }

    const newBoard = [...board];
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;

    setBoard(newBoard);
    setFlagsUsed((prev) =>
      newBoard[row][col].isFlagged ? prev + 1 : prev - 1
    );
  };

  // Manipular clique na célula
  const handleCellClick = (row: number, col: number, isRightClick: boolean) => {
    if (isRightClick) {
      toggleFlag(row, col);
    } else {
      revealCell(row, col);
    }
  };

  // Obter classe CSS para a célula
  const getCellClass = (cell: Cell) => {
    let baseClass =
      "w-8 h-8 border border-gray-400 flex items-center justify-center text-sm font-bold cursor-pointer select-none";

    if (cell.isRevealed) {
      if (cell.isMine) {
        baseClass += " bg-red-500 text-white";
      } else {
        baseClass += " bg-gray-200";
        if (cell.neighborMines > 0) {
          const colors = [
            "",
            "text-blue-600",
            "text-green-600",
            "text-red-600",
            "text-purple-600",
            "text-yellow-600",
            "text-pink-600",
            "text-black",
            "text-gray-600",
          ];
          baseClass += ` ${colors[cell.neighborMines]}`;
        }
      }
    } else {
      baseClass += " bg-gray-300 hover:bg-gray-250";
      if (cell.isFlagged) {
        baseClass += " bg-yellow-300";
      }
    }

    return baseClass;
  };

  // Obter conteúdo da célula
  const getCellContent = (cell: Cell) => {
    if (cell.isFlagged && !cell.isRevealed) {
      return "🚩";
    }
    if (cell.isRevealed) {
      if (cell.isMine) {
        return "💣";
      }
      if (cell.neighborMines > 0) {
        return cell.neighborMines.toString();
      }
    }
    return "";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getStatusEmoji = () => {
    switch (gameStatus) {
      case "won":
        return "🎉";
      case "lost":
        return "💀";
      default:
        return "🙂";
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Campo Minado</h2>

      {/* Painel de controle */}
      <div className="flex items-center gap-6 mb-4 p-3 bg-gray-100 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Bandeiras:</span>
          <span className="text-lg font-bold text-red-600">
            {mineCount - flagsUsed}
          </span>
        </div>

        <button
          onClick={initializeBoard}
          className="text-2xl hover:scale-110 transition-transform"
        >
          {getStatusEmoji()}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Tempo:</span>
          <span className="text-lg font-bold text-blue-600">
            {formatTime(timer)}
          </span>
        </div>
      </div>

      {/* Status do jogo */}
      {gameStatus !== "playing" && (
        <div className="mb-4 p-3 rounded-lg text-center">
          {gameStatus === "won" && (
            <div className="text-green-600 font-bold">
              🎉 Parabéns! Você venceu! 🎉
            </div>
          )}
          {gameStatus === "lost" && (
            <div className="text-red-600 font-bold">
              💥 Game Over! Clique na carinha para jogar novamente 💥
            </div>
          )}
        </div>
      )}

      {/* Tabuleiro */}
      <div className="inline-block border-2 border-gray-600 bg-gray-600">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={getCellClass(cell)}
                onClick={() => handleCellClick(rowIndex, colIndex, false)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleCellClick(rowIndex, colIndex, true);
                }}
              >
                {getCellContent(cell)}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Instruções */}
      <div className="mt-4 text-sm text-gray-600 max-w-md text-center">
        <p>
          <strong>Como jogar:</strong>
        </p>
        <p>• Clique esquerdo para revelar uma célula</p>
        <p>• Clique direito para marcar/desmarcar com bandeira</p>
        <p>• Números indicam quantas minas estão ao redor</p>
        <p>• Evite as minas e revele todas as células seguras!</p>
      </div>

      {/* Configurações do jogo */}
      <div className="mt-4 text-xs text-gray-500">
        Tabuleiro: {width}x{height} | Minas: {mineCount}
      </div>
    </div>
  );
};

export default Minesweeper;
