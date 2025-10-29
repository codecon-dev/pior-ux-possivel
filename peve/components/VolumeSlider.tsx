"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

interface VolumeSliderProps {
  initialVolume?: number;
  onVolumeChange?: (volume: number) => void;
  toleranceMargin?: number; // Margem de erro em pixels
  className?: string;
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({
  initialVolume = 0,
  onVolumeChange,
  toleranceMargin = 20, // 20px de margem de erro por padrão
  className = "",
}) => {
  const [volume, setVolume] = useState(initialVolume);
  const [isDragging, setIsDragging] = useState(false);
  const [isValidPosition, setIsValidPosition] = useState(true);
  const [tempVolume, setTempVolume] = useState(initialVolume); // Volume temporário durante o drag
  const [knobPosition, setKnobPosition] = useState({ x: 0, y: 0 }); // Posição livre da bolinha
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Offset do clique inicial
  const [hasBeenInvalid, setHasBeenInvalid] = useState(false); // Rastreia se ficou vermelho durante o drag
  const sliderRef = useRef<SVGSVGElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calcula a posição da bolinha baseada no volume (0-10)
  const getKnobPosition = useCallback((vol: number) => {
    return (vol / 10) * 100; // Converte para porcentagem
  }, []);

  // Calcula a posição Y da curva baseada na posição X (8 curvas)
  const getCurveY = useCallback((x: number) => {
    if (!sliderRef.current || !containerRef.current) return 64;

    const rect = sliderRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    const relativeX = x - rect.left;
    const width = rect.width;

    // Normaliza X para 0-1
    const normalizedX = Math.max(0, Math.min(1, relativeX / width));

    // 8 curvas: cada uma ocupa 1/8 = 0.125 do espaço
    const segments = 8;
    const segmentSize = 1 / segments;
    const currentSegment = Math.floor(normalizedX / segmentSize);
    const segmentProgress = (normalizedX % segmentSize) / segmentSize;

    // Alterna entre cima (24) e baixo (104), começando com cima
    const isUp = currentSegment % 2 === 0;
    const controlY = isUp ? 24 : 104;

    // Curva quadrática de Bézier dentro do segmento atual
    // P0 = (0, 64), P1 = (0.5, controlY), P2 = (1, 64)
    const t = segmentProgress;
    const p0 = 64;
    const p1 = controlY;
    const p2 = 64;

    const svgY = (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;

    // Converte coordenada SVG para coordenada do container
    const containerY = (svgY / 128) * containerRect.height;

    return containerY;
  }, []);

  // Calcula a posição livre da bolinha baseada nas coordenadas do mouse
  const getFreePosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return { x: 0, y: 0 };

      const rect = containerRef.current.getBoundingClientRect();
      return {
        x: clientX - rect.left - dragOffset.x,
        y: clientY - rect.top - dragOffset.y,
      };
    },
    [dragOffset]
  );

  // Inicializa a posição da bolinha baseada no volume inicial
  useEffect(() => {
    if (sliderRef.current && !isDragging && containerRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const sliderPosition = getKnobPosition(volume);
      const x = (sliderPosition / 100) * rect.width;
      const y = getCurveY(rect.left + x);

      setKnobPosition({
        x: (sliderPosition / 100) * rect.width,
        y: y,
      });
    }
  }, [volume, getKnobPosition, isDragging, getCurveY]);

  // Verifica se a posição está dentro da margem de tolerância da curva
  const isPositionValid = useCallback(
    (x: number, y: number) => {
      if (!sliderRef.current || !containerRef.current) return false;

      const rect = sliderRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      // Converte coordenadas da tela para coordenadas do container
      const containerY = y - containerRect.top;
      const expectedY = getCurveY(x);

      // Verifica se está dentro da margem vertical da curva
      const verticalDistance = Math.abs(containerY - expectedY);

      // Verifica se está dentro dos limites horizontais do slider
      const horizontalValid = x >= rect.left && x <= rect.right;

      return horizontalValid && verticalDistance <= toleranceMargin;
    },
    [toleranceMargin, getCurveY]
  );

  // Converte posição do mouse para valor de volume
  const getVolumeFromPosition = useCallback((x: number) => {
    if (!sliderRef.current) return 0;

    const rect = sliderRef.current.getBoundingClientRect();
    const relativeX = x - rect.left;
    const percentage = Math.max(
      0,
      Math.min(100, (relativeX / rect.width) * 100)
    );

    // Retorna valor preciso sem arredondar para movimento livre
    return Number(((percentage / 100) * 10).toFixed(2));
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current || !knobRef.current) return;

      setIsDragging(true);
      setHasBeenInvalid(false); // Reseta o flag ao iniciar novo drag

      // Calcula o offset entre o clique e o centro da bolinha
      const knobRect = knobRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      const currentKnobX =
        knobRect.left + knobRect.width / 2 - containerRect.left;
      const currentKnobY =
        knobRect.top + knobRect.height / 2 - containerRect.top;

      setDragOffset({
        x: e.clientX - containerRect.left - currentKnobX,
        y: e.clientY - containerRect.top - currentKnobY,
      });

      // Inicializa a posição atual da bolinha
      setKnobPosition({
        x: currentKnobX,
        y: currentKnobY,
      });

      const newVolume = getVolumeFromPosition(e.clientX);
      const valid = isPositionValid(e.clientX, e.clientY);

      setTempVolume(newVolume);
      setIsValidPosition(valid);

      // Se já começar inválido, marca o flag
      if (!valid) {
        setHasBeenInvalid(true);
      }

      if (valid) {
        onVolumeChange?.(newVolume);
      }
    },
    [getVolumeFromPosition, isPositionValid, onVolumeChange]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      // Atualiza a posição livre da bolinha
      const containerRect = containerRef.current.getBoundingClientRect();
      const newPosition = {
        x: e.clientX - containerRect.left - dragOffset.x,
        y: e.clientY - containerRect.top - dragOffset.y,
      };
      setKnobPosition(newPosition);

      const valid = isPositionValid(e.clientX, e.clientY);
      setIsValidPosition(valid);

      // Se ficou inválido em qualquer momento, marca o flag
      if (!valid) {
        setHasBeenInvalid(true);
      }

      // Sempre atualiza o volume temporário baseado na posição do mouse
      const newVolume = getVolumeFromPosition(e.clientX);
      setTempVolume(newVolume);

      if (valid) {
        // Só chama onVolumeChange quando está em posição válida
        onVolumeChange?.(newVolume);
      }
    },
    [
      isDragging,
      isPositionValid,
      getVolumeFromPosition,
      onVolumeChange,
      dragOffset,
    ]
  );

  const handleMouseUp = useCallback(() => {
    if (isValidPosition && !hasBeenInvalid) {
      // Se soltar em posição válida E nunca ficou inválido durante o drag, mantém o volume
      setVolume(tempVolume);
      onVolumeChange?.(tempVolume);
    } else {
      // Se soltar em posição inválida OU ficou inválido em algum momento, volta para 0
      setVolume(0);
      setTempVolume(0);
      onVolumeChange?.(0);
    }
    setIsDragging(false);
    setIsValidPosition(true);
    setHasBeenInvalid(false); // Reseta o flag
    // Reset da posição livre
    setKnobPosition({ x: 0, y: 0 });
  }, [isValidPosition, hasBeenInvalid, tempVolume, onVolumeChange]);

  // Event listeners para mouse
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Touch events para dispositivos móveis
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!containerRef.current || !knobRef.current) return;

      const touch = e.touches[0];
      setIsDragging(true);
      setHasBeenInvalid(false); // Reseta o flag ao iniciar novo drag

      // Calcula o offset entre o toque e o centro da bolinha
      const knobRect = knobRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      const currentKnobX =
        knobRect.left + knobRect.width / 2 - containerRect.left;
      const currentKnobY =
        knobRect.top + knobRect.height / 2 - containerRect.top;

      setDragOffset({
        x: touch.clientX - containerRect.left - currentKnobX,
        y: touch.clientY - containerRect.top - currentKnobY,
      });

      // Inicializa a posição atual da bolinha
      setKnobPosition({
        x: currentKnobX,
        y: currentKnobY,
      });

      const newVolume = getVolumeFromPosition(touch.clientX);
      const valid = isPositionValid(touch.clientX, touch.clientY);

      setTempVolume(newVolume);
      setIsValidPosition(valid);

      // Se já começar inválido, marca o flag
      if (!valid) {
        setHasBeenInvalid(true);
      }

      if (valid) {
        onVolumeChange?.(newVolume);
      }
    },
    [getVolumeFromPosition, isPositionValid, onVolumeChange]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || !containerRef.current) return;

      const touch = e.touches[0];

      // Atualiza a posição livre da bolinha
      const containerRect = containerRef.current.getBoundingClientRect();
      const newPosition = {
        x: touch.clientX - containerRect.left - dragOffset.x,
        y: touch.clientY - containerRect.top - dragOffset.y,
      };
      setKnobPosition(newPosition);

      const valid = isPositionValid(touch.clientX, touch.clientY);
      setIsValidPosition(valid);

      // Se ficou inválido em qualquer momento, marca o flag
      if (!valid) {
        setHasBeenInvalid(true);
      }

      // Sempre atualiza o volume temporário baseado na posição do touch
      const newVolume = getVolumeFromPosition(touch.clientX);
      setTempVolume(newVolume);

      if (valid) {
        // Só chama onVolumeChange quando está em posição válida
        onVolumeChange?.(newVolume);
      }
    },
    [
      isDragging,
      isPositionValid,
      getVolumeFromPosition,
      onVolumeChange,
      dragOffset,
    ]
  );

  const handleTouchEnd = useCallback(() => {
    if (isValidPosition && !hasBeenInvalid) {
      // Se soltar em posição válida E nunca ficou inválido durante o drag, mantém o volume
      setVolume(tempVolume);
      onVolumeChange?.(tempVolume);
    } else {
      // Se soltar em posição inválida OU ficou inválido em algum momento, volta para 0
      setVolume(0);
      setTempVolume(0);
      onVolumeChange?.(0);
    }
    setIsDragging(false);
    setIsValidPosition(true);
    setHasBeenInvalid(false); // Reseta o flag
    // Reset da posição livre
    setKnobPosition({ x: 0, y: 0 });
  }, [isValidPosition, hasBeenInvalid, tempVolume, onVolumeChange]);

  return (
    <div className={`w-full max-w-md mx-auto p-6 ${className}`}>
      {/* Display do volume atual */}
      <div className="text-center mb-4">
        <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Volume: {(isDragging ? tempVolume : volume).toFixed(2)}/10
        </span>
      </div>

      {/* Container principal com movimento livre */}
      <div ref={containerRef} className="relative h-32 w-full">
        {/* Container do slider com curva SVG */}
        <div className="absolute top-0 left-0 w-full h-full">
          {/* SVG com curva */}
          <svg
            ref={sliderRef}
            width="100%"
            height="100%"
            viewBox="0 0 400 128"
            preserveAspectRatio="none"
            className="cursor-pointer select-none"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Curva de fundo (cinza) - 8 curvas acentuadas */}
            <path
              d="M 0 64 Q 25 24 50 64 Q 75 104 100 64 Q 125 24 150 64 Q 175 104 200 64 Q 225 24 250 64 Q 275 104 300 64 Q 325 24 350 64 Q 375 104 400 64"
              stroke="rgb(209 213 219)"
              strokeWidth="3"
              fill="none"
              className="dark:stroke-gray-600"
            />

            {/* Curva de progresso (azul) - segue as 8 curvas */}
            {volume > 0 && (
              <path
                d={(() => {
                  const segments = 8;
                  const segmentWidth = 400 / segments; // 50px por segmento
                  const currentSegment = Math.floor((volume / 10) * segments);
                  const segmentProgress = ((volume / 10) * segments) % 1;

                  let path = "M 0 64";

                  for (
                    let i = 0;
                    i < Math.min(segments, Math.ceil((volume / 10) * segments));
                    i++
                  ) {
                    const x1 = i * segmentWidth;
                    const x2 = x1 + segmentWidth / 2;
                    const x3 = (i + 1) * segmentWidth;

                    const y2 = i % 2 === 0 ? 24 : 104; // Alterna entre cima e baixo

                    if (i < currentSegment) {
                      // Segmento completo
                      path += ` Q ${x2} ${y2} ${x3} 64`;
                    } else if (i === currentSegment) {
                      // Segmento parcial
                      const partialX2 =
                        x1 + (segmentWidth / 2) * segmentProgress;
                      const partialX3 = x1 + segmentWidth * segmentProgress;
                      const partialY2 = 64 + (y2 - 64) * segmentProgress;
                      const partialY3 = 64;

                      if (segmentProgress > 0.5) {
                        path += ` Q ${x2} ${y2} ${partialX3} ${partialY3}`;
                      } else if (segmentProgress > 0) {
                        path += ` Q ${partialX2} ${partialY2} ${
                          x1 + segmentWidth * 0.5
                        } 64`;
                      }
                    }
                  }

                  return path;
                })()}
                stroke="rgb(59 130 246)"
                strokeWidth="3"
                fill="none"
                className="transition-all duration-150"
              />
            )}

            {/* Área clicável invisível sobre a curva */}
            <path
              d="M 0 64 Q 25 24 50 64 Q 75 104 100 64 Q 125 24 150 64 Q 175 104 200 64 Q 225 24 250 64 Q 275 104 300 64 Q 325 24 350 64 Q 375 104 400 64"
              stroke="transparent"
              strokeWidth="28"
              fill="none"
              className="cursor-pointer"
            />
          </svg>

          {/* Labels para as 8 curvas */}
          <div className="absolute -bottom-6 left-0 w-full flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>0</span>
            <span>1.25</span>
            <span>2.5</span>
            <span>3.75</span>
            <span>5</span>
            <span>6.25</span>
            <span>7.5</span>
            <span>8.75</span>
            <span>10</span>
          </div>

          {/* Área de tolerância visual (opcional - para debug) */}
          {process.env.NODE_ENV === "development" && (
            <div
              className="absolute top-1/2 left-0 w-full border-2 border-dashed border-red-300 opacity-30 pointer-events-none"
              style={{
                height: `${toleranceMargin * 2}px`,
                transform: "translateY(-50%)",
              }}
            />
          )}
        </div>

        {/* Bolinha com movimento livre */}
        <div
          ref={knobRef}
          className={`absolute w-6 h-6 rounded-full cursor-grab transition-colors duration-75 shadow-lg ${
            isDragging
              ? isValidPosition
                ? "bg-blue-600 scale-110 cursor-grabbing"
                : "bg-red-500 scale-110 cursor-grabbing"
              : "bg-blue-500 hover:bg-blue-600 hover:scale-105"
          }`}
          style={{
            left: isDragging
              ? `${knobPosition.x}px`
              : `calc(${getKnobPosition(volume)}% + 0px)`,
            top: isDragging ? `${knobPosition.y}px` : `calc(50% + 0px)`,
            transform: "translate(-50%, -50%)",
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        />
      </div>

      {isDragging && (hasBeenInvalid || !isValidPosition) && (
        <div className="text-red-500 text-sm mt-1">
          {!isValidPosition
            ? "Mantenha sobre a curva! Se sair, voltará para 0 ao soltar."
            : "Saiu da curva! Voltará para 0 ao soltar mesmo se voltar."}
        </div>
      )}
    </div>
  );
};

export default VolumeSlider;
