"use client";

import React, { useState } from "react";
import VolumeSlider from "./VolumeSlider";

const VolumeControl: React.FC = () => {
  const [currentVolume, setCurrentVolume] = useState(5);
  const [toleranceMargin, setToleranceMargin] = useState(20);

  const handleVolumeChange = (volume: number) => {
    setCurrentVolume(volume);
    // Aqui você pode integrar com sua lógica de áudio
    console.log(`Volume definido para: ${volume}/10`);
  };

  const handleToleranceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToleranceMargin(Number(e.target.value));
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        Controle de Volume Avançado
      </h2>

      {/* Controle de margem de tolerância */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Margem de Tolerância: {toleranceMargin}px
        </label>
        <input
          type="range"
          min="5"
          max="50"
          value={toleranceMargin}
          onChange={handleToleranceChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>Mais Preciso (5px)</span>
          <span>Mais Tolerante (50px)</span>
        </div>
      </div>

      {/* Slider de volume */}
      <VolumeSlider
        initialVolume={currentVolume}
        onVolumeChange={handleVolumeChange}
        toleranceMargin={toleranceMargin}
      />

      {/* Status atual */}
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
          Status Atual:
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          <strong>Volume:</strong> {currentVolume.toFixed(2)}/10 (
          {((currentVolume / 10) * 100).toFixed(1)}%)
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          <strong>Margem de Erro:</strong> {toleranceMargin}px
        </p>
      </div>

      {/* Instruções */}
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>
          <strong>Como usar:</strong>
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Clique e arraste a bolinha azul para ajustar o volume</li>
          <li>
            Mantenha o cursor próximo à linha (dentro da margem de tolerância)
          </li>
          <li>Se sair da área válida, o volume volta para 0 automaticamente</li>
          <li>
            Ajuste a margem de tolerância acima para mais precisão ou facilidade
          </li>
        </ul>
      </div>
    </div>
  );
};

export default VolumeControl;
