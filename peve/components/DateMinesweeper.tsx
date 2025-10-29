"use client";

import React, { useState, useCallback } from "react";

// Tipos para o jogo de data
type Cell = {
  value: number | null;
  isMine: boolean;
  isRevealed: boolean;
  isTarget: boolean;
};

type GameStep = "day" | "month" | "year";
type GameStatus = "playing" | "completed";

interface DateMinesweeperProps {
  onDateSelected?: (date: { day: number; month: number; year: number }) => void;
}

const DateMinesweeper: React.FC<DateMinesweeperProps> = ({
  onDateSelected,
}) => {
  const [currentStep, setCurrentStep] = useState<GameStep>("day");
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
  const [selectedDate, setSelectedDate] = useState({
    day: 0,
    month: 0,
    year: 0,
  });
  const [board, setBoard] = useState<Cell[][]>([]);
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
  const [, setValidNumbers] = useState<number[]>([]);
  const [, setTargetNumber] = useState<number>(0);
  const [resetKey, setResetKey] = useState<number>(0);

  // Configurações para cada etapa
  const getStepConfigs = () => ({
    day: {
      title: "📅 Selecione o Dia",
      boardWidth: 10,
      boardHeight: 10,
      mines: 70, // 100 - 30 = 70 minas
      validNumbers: Array.from({ length: 31 }, (_, i) => i + 1), // 1-31
      validCount: 30,
      prompt: "Clique em um número de 1 a 31 para o dia",
    },
    month: {
      title: "📅 Selecione o Mês",
      boardWidth: 8,
      boardHeight: 8,
      mines: 52, // 64 - 12 = 52 minas
      validNumbers: Array.from({ length: 12 }, (_, i) => i + 1), // 1-12
      validCount: 12,
      prompt: "Clique em um número de 1 a 12 para o mês",
    },
    year: {
      title: "📅 Selecione o Ano",
      boardWidth: 8,
      boardHeight: 8,
      mines: 54, // 64 - 10 = 54 minas
      validNumbers: Array.from({ length: 10 }, (_, i) => i), // 0-9
      validCount: 10,
      prompt: "Clique em um dígito de 0 a 9 para completar 199X",
    },
  });

  // Inicializar tabuleiro para a etapa atual
  const initializeBoard = useCallback(() => {
    const stepConfigs = getStepConfigs();
    const config = stepConfigs[currentStep];
    const newBoard: Cell[][] = [];
    const totalCells = config.boardWidth * config.boardHeight;

    // Criar array com todos os valores possíveis
    const allValues: Array<number | null> = [];

    // Adicionar números válidos (quantidade limitada pela validCount)
    const shuffledValidNumbers = [...config.validNumbers].sort(
      () => Math.random() - 0.5
    );
    const selectedValidNumbers = shuffledValidNumbers.slice(
      0,
      config.validCount
    );
    allValues.push(...selectedValidNumbers);

    // Adicionar minas
    for (let i = 0; i < config.mines; i++) {
      allValues.push(null);
    }

    // Preencher com células vazias se necessário
    while (allValues.length < totalCells) {
      allValues.push(null);
    }

    // Embaralhar valores
    for (let i = allValues.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allValues[i], allValues[j]] = [allValues[j], allValues[i]];
    }

    // Criar tabuleiro
    let valueIndex = 0;
    for (let row = 0; row < config.boardHeight; row++) {
      newBoard[row] = [];
      for (let col = 0; col < config.boardWidth; col++) {
        const value = allValues[valueIndex++];
        newBoard[row][col] = {
          value: value,
          isMine: value === null,
          isRevealed: false,
          isTarget: value !== null && selectedValidNumbers.includes(value),
        };
      }
    }

    setBoard(newBoard);
    setBoardSize({ width: config.boardWidth, height: config.boardHeight });
    setValidNumbers(selectedValidNumbers);

    // Definir número alvo baseado na etapa
    let target = 0;
    switch (currentStep) {
      case "day":
        target = Math.floor(Math.random() * 31) + 1;
        break;
      case "month":
        target = Math.floor(Math.random() * 12) + 1;
        break;
      case "year":
        target = Math.floor(Math.random() * 10); // 0-9
        break;
    }
    setTargetNumber(target);
  }, [currentStep]);

  // Inicializar quando a etapa muda ou quando o jogo reseta
  React.useEffect(() => {
    initializeBoard();
  }, [initializeBoard, resetKey]);

  // Manipular clique na célula
  const handleCellClick = (row: number, col: number) => {
    if (gameStatus !== "playing" || board[row][col].isRevealed) {
      return;
    }

    const newBoard = [...board];
    const cell = newBoard[row][col];
    cell.isRevealed = true;

    // Se clicou em uma mina, resetar TODO o jogo (volta para o dia)
    if (cell.isMine) {
      // Revelar todas as minas
      for (let r = 0; r < boardSize.height; r++) {
        for (let c = 0; c < boardSize.width; c++) {
          if (newBoard[r][c].isMine) {
            newBoard[r][c].isRevealed = true;
          }
        }
      }
      setBoard(newBoard);

      // Resetar todo o jogo após um breve delay
      setTimeout(() => {
        resetGame();
      }, 1500);
      return;
    }

    // Se clicou em um número válido
    if (cell.value !== null) {
      const newSelectedDate = { ...selectedDate };

      switch (currentStep) {
        case "day":
          newSelectedDate.day = cell.value;
          setSelectedDate(newSelectedDate);
          setCurrentStep("month");
          break;
        case "month":
          newSelectedDate.month = cell.value;
          setSelectedDate(newSelectedDate);
          setCurrentStep("year");
          break;
        case "year":
          newSelectedDate.year = 1990 + cell.value; // 199X onde X é o dígito selecionado
          setSelectedDate(newSelectedDate);
          setGameStatus("completed");
          onDateSelected?.(newSelectedDate);
          break;
      }
    }

    setBoard(newBoard);
  };

  // Resetar jogo
  const resetGame = () => {
    setCurrentStep("day");
    setGameStatus("playing");
    setSelectedDate({ day: 0, month: 0, year: 0 });
    setTargetNumber(0);
    // Incrementar resetKey para forçar re-renderização
    setResetKey((prev) => prev + 1);
  };

  // Obter classe CSS para a célula
  const getCellClass = (cell: Cell) => {
    let baseClass =
      "w-12 h-12 border border-gray-400 flex items-center justify-center text-xs font-bold cursor-pointer select-none transition-all duration-200";

    if (cell.isRevealed) {
      if (cell.isMine) {
        baseClass += " bg-red-500 text-white";
      } else if (cell.value !== null) {
        baseClass += " bg-green-200 text-green-800 hover:bg-green-300";
      } else {
        baseClass += " bg-gray-200";
      }
    } else {
      baseClass += " bg-blue-300 hover:bg-blue-400 text-white";
    }

    return baseClass;
  };

  // Obter conteúdo da célula
  const getCellContent = (cell: Cell) => {
    if (!cell.isRevealed) {
      return "?";
    }

    if (cell.isMine) {
      return "💣";
    }

    if (cell.value !== null) {
      return cell.value.toString();
    }

    return "";
  };

  const config = getStepConfigs()[currentStep];
  const getMonthName = (month: number) => {
    const months = [
      "",
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return months[month] || "";
  };

  if (gameStatus === "completed") {
    return (
      <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-xl max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-green-600">
          🎉 Data Selecionada! 🎉
        </h2>

        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-gray-800 mb-4">
            {selectedDate.day.toString().padStart(2, "0")}/
            {selectedDate.month.toString().padStart(2, "0")}/{selectedDate.year}
          </div>
          <div className="text-xl text-gray-600">
            {selectedDate.day} de {getMonthName(selectedDate.month)} de{" "}
            {selectedDate.year}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8 w-full max-w-md">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {selectedDate.day}
            </div>
            <div className="text-sm text-blue-500">Dia</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {selectedDate.month}
            </div>
            <div className="text-sm text-green-500">Mês</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {selectedDate.year}
            </div>
            <div className="text-sm text-purple-500">Ano</div>
          </div>
        </div>

        <button
          onClick={resetGame}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
        >
          🔄 Selecionar Nova Data
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-xl max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{config.title}</h2>

      {/* Progresso das etapas */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            currentStep === "day"
              ? "bg-blue-500 text-white"
              : selectedDate.day > 0
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          <span className="font-bold">1</span>
          <span>Dia</span>
          {selectedDate.day > 0 && <span>({selectedDate.day})</span>}
        </div>
        <div className="w-4 h-1 bg-gray-300"></div>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            currentStep === "month"
              ? "bg-blue-500 text-white"
              : selectedDate.month > 0
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          <span className="font-bold">2</span>
          <span>Mês</span>
          {selectedDate.month > 0 && <span>({selectedDate.month})</span>}
        </div>
        <div className="w-4 h-1 bg-gray-300"></div>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            currentStep === "year"
              ? "bg-blue-500 text-white"
              : selectedDate.year > 0
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          <span className="font-bold">3</span>
          <span>Ano</span>
          {selectedDate.year > 0 && <span>({selectedDate.year})</span>}
        </div>
      </div>

      {/* Informações da etapa atual */}
      <div className="text-center mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-lg font-medium mb-2">{config.prompt}</p>
        <div className="flex justify-center gap-6 text-sm text-gray-600">
          <span>
            📊 Números válidos: <strong>{config.validCount}</strong>
          </span>
          <span>
            💣 Minas: <strong>{config.mines}</strong>
          </span>
          <span>
            📏 Tabuleiro:{" "}
            <strong>
              {config.boardWidth}×{config.boardHeight}
            </strong>
          </span>
        </div>
      </div>

      {/* Tabuleiro */}
      <div className="inline-block border-2 border-gray-600 bg-gray-600 mb-6">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={getCellClass(cell)}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {getCellContent(cell)}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Instruções */}
      <div className="text-center text-sm text-gray-600 max-w-2xl">
        <p className="mb-2">
          <strong>📋 Como jogar:</strong>
        </p>
        <p>• Clique nas células para revelar números ou minas</p>
        <p>
          • Se encontrar um <strong>número válido</strong>, avança para a
          próxima etapa
        </p>
        <p>
          • Se encontrar uma <strong>mina (💣)</strong>, o jogo reseta
        </p>
        <p>• Células vazias não fazem nada</p>
        <p>• Complete as 3 etapas para selecionar sua data!</p>
      </div>

      {/* Botão de reset */}
      <button
        onClick={resetGame}
        className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
      >
        🔄 Recomeçar
      </button>
    </div>
  );
};

export default DateMinesweeper;
