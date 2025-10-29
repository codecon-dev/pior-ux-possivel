"use client";

import VolumeSlider from "@/components/VolumeSlider";

export default function Home() {
  const handleVolumeChange = (volume: number) => {
    console.log("Volume alterado para:", volume);
  };

  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 font-sans dark:bg-black">
      <section className="w-full max-w-2xl p-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
            🔊 Controle de Volume
          </h2>
          <VolumeSlider
            initialVolume={0}
            onVolumeChange={handleVolumeChange}
            toleranceMargin={10}
          />
        </div>
      </section>
    </div>
  );
}
