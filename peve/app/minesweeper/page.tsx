import Minesweeper from "@/components/Minesweeper";

export default function MinesweeperPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎮 Campo Minado
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Um clássico jogo de Campo Minado (Minesweeper) construído com React
            e TypeScript. Use sua lógica para encontrar todas as minas
            escondidas no tabuleiro!
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          {/* Jogo Principal */}
          <div className="bg-white rounded-xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-center mb-4 text-gray-700">
              🟦 Nível Intermediário
            </h2>
            <Minesweeper width={16} height={16} mineCount={40} />
          </div>

          {/* Outros níveis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
            {/* Nível Fácil */}
            <div className="bg-white rounded-xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-center mb-4 text-green-600">
                🟢 Nível Fácil
              </h2>
              <div className="flex justify-center">
                <Minesweeper width={9} height={9} mineCount={10} />
              </div>
            </div>

            {/* Nível Difícil */}
            <div className="bg-white rounded-xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-center mb-4 text-red-600">
                🔴 Nível Difícil
              </h2>
              <div className="flex justify-center">
                <Minesweeper width={12} height={12} mineCount={30} />
              </div>
            </div>
          </div>

          {/* Informações sobre o jogo */}
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-4xl">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              📖 Como Jogar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-blue-600">
                  🎯 Objetivo
                </h3>
                <p className="text-gray-600 mb-4">
                  Revelar todas as células que não contêm minas, usando as
                  pistas numéricas para deduzir onde as minas estão localizadas.
                </p>

                <h3 className="text-lg font-semibold mb-2 text-green-600">
                  🖱️ Controles
                </h3>
                <ul className="text-gray-600 space-y-1">
                  <li>
                    • <strong>Clique esquerdo:</strong> Revelar célula
                  </li>
                  <li>
                    • <strong>Clique direito:</strong> Marcar com bandeira
                  </li>
                  <li>
                    • <strong>Carinha sorridente:</strong> Reiniciar jogo
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-purple-600">
                  🔢 Números
                </h3>
                <p className="text-gray-600 mb-4">
                  Os números indicam quantas minas estão nas 8 células
                  adjacentes. Use essa informação para deduzir onde as minas
                  estão.
                </p>

                <h3 className="text-lg font-semibold mb-2 text-orange-600">
                  🏆 Vitória
                </h3>
                <p className="text-gray-600">
                  Você vence quando revela todas as células seguras. Você perde
                  se clicar em uma mina.
                </p>
              </div>
            </div>
          </div>

          {/* Estatísticas dos níveis */}
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-4xl w-full">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
              📊 Níveis de Dificuldade
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl mb-2">🟢</div>
                <h3 className="font-semibold text-green-600">Fácil</h3>
                <p className="text-sm text-gray-600">9×9 tabuleiro</p>
                <p className="text-sm text-gray-600">10 minas</p>
                <p className="text-xs text-gray-500">~12% de minas</p>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-2">🟦</div>
                <h3 className="font-semibold text-blue-600">Intermediário</h3>
                <p className="text-sm text-gray-600">16×16 tabuleiro</p>
                <p className="text-sm text-gray-600">40 minas</p>
                <p className="text-xs text-gray-500">~16% de minas</p>
              </div>

              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl mb-2">🔴</div>
                <h3 className="font-semibold text-red-600">Difícil</h3>
                <p className="text-sm text-gray-600">12×12 tabuleiro</p>
                <p className="text-sm text-gray-600">30 minas</p>
                <p className="text-xs text-gray-500">~21% de minas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
