"use client";

import { useState } from "react";

export default function CancelAccountPage() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardError, setCardError] = useState("");
  const [passwordAttempts, setPasswordAttempts] = useState({
    step3: 0,
    step5: 0,
    step7: 0,
  });
  const [nameAttempts, setNameAttempts] = useState(0);
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = (stepNumber: number) => {
    setPasswordError("");

    // Validação de campos mínimos (3 caracteres cada)
    if (username.length < 3 || password.length < 3) {
      setPasswordError("Todos os campos devem ter pelo menos 3 caracteres.");
      return;
    }

    const currentStep = step === 3 ? "step3" : step === 5 ? "step5" : "step7";

    if (passwordAttempts[currentStep] === 0) {
      setPasswordError(
        "Esta senha já existe no nosso banco de dados. Tente outra."
      );
      setPasswordAttempts((prev) => ({
        ...prev,
        [currentStep]: 1,
      }));
      return;
    }

    // Limpar campos ao avançar para próximo step
    setUsername("");
    setPassword("");
    setPasswordError("");
    setStep(stepNumber);
  };

  const handleCardSubmit = () => {
    setCardError("");
    setNameError("");

    // Validação de campos mínimos (3 caracteres cada)
    if (
      cardNumber.length < 3 ||
      cardName.length < 3 ||
      cardExpiry.length < 3 ||
      cardCvv.length < 3
    ) {
      setCardError("Todos os campos devem ter pelo menos 3 caracteres.");
      return;
    }

    // Primeira tentativa com nome: mostra que não é o nome correto
    if (cardName.trim().length > 0 && nameAttempts === 0) {
      setNameError(
        "Parece que este não é o seu nome. Por favor coloque o nome correto."
      );
      setNameAttempts(1);
      return;
    }

    // A partir da segunda tentativa, se tem dados do cartão, mostra erro de saldo
    if (nameAttempts >= 1 && cardNumber && cardExpiry && cardCvv) {
      setCardError("Saldo insuficiente. Você não tem dinheiro na conta.");
      return;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
              <h1 className="text-2xl font-bold text-red-600 mb-6 text-center">
                ⚠️ ATENÇÃO
              </h1>
              <p className="text-gray-800 mb-8 text-center leading-relaxed">
                Você tem certeza que quer deletar a sua conta e apagar todos os
                seus dados?
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => setStep(2)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  Sim
                </button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="min-h-screen bg-white flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <h1 className="text-8xl font-bold text-green-600 text-center">
                OBRIGADO
              </h1>
            </div>
            <footer className="p-2 text-center">
              <p className="text-xs text-gray-500">
                <a
                  href="#"
                  className="underline hover:text-gray-700"
                  onClick={(e) => {
                    e.preventDefault();
                    setStep(3);
                  }}
                >
                  Sua conta foi desativada e seus dados serão excluídos dentro
                  de 10 anos. Cobranças adicionais ainda podem ser efetuadas
                  durante o período.
                </a>
              </p>
            </footer>
          </div>
        );

      case 3:
        return (
          <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
                Login
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Usuário
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="nope"
                    data-lpignore="true"
                    spellCheck={false}
                    name="username-step3-nocomplete"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Senha
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    data-lpignore="true"
                    spellCheck={false}
                    name="password-step3-nocomplete"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  {passwordError && (
                    <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                  )}
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => handleLogin(4)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                  >
                    Enter
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
              <div className="text-6xl mb-4">😅</div>
              <h2 className="text-2xl font-bold text-yellow-800 mb-6">Ops!</h2>
              <p className="text-gray-800 mb-8 leading-relaxed">
                Essa conta foi apagada. Deseja tentar reativá-la?
              </p>
              <button
                onClick={() => setStep(5)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Tentar
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-purple-800 mb-6 text-center">
                Reativação de Conta
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Usuário
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="nope"
                    data-lpignore="true"
                    spellCheck={false}
                    name="username-step5-nocomplete"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Senha
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    data-lpignore="true"
                    spellCheck={false}
                    name="password-step5-nocomplete"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                  {passwordError && (
                    <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                  )}
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => handleLogin(6)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                  >
                    Enter
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
              <div className="text-6xl mb-4">🤷‍♂️</div>
              <h2 className="text-2xl font-bold text-red-800 mb-6">Não deu</h2>
              <p className="text-gray-800 mb-8 leading-relaxed">
                Não conseguimos reativar sua conta. Tentar de novo?
              </p>
              <button
                onClick={() => setStep(7)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Sim
              </button>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-indigo-800 mb-6 text-center">
                Última Tentativa
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Usuário
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="nope"
                    data-lpignore="true"
                    spellCheck={false}
                    name="username-step7-nocomplete"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Senha
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    data-lpignore="true"
                    spellCheck={false}
                    name="password-step7-nocomplete"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                  {passwordError && (
                    <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                  )}
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => handleLogin(8)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                  >
                    Enter
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
              <div className="text-6xl mb-4">💸</div>
              <h2 className="text-2xl font-bold text-orange-800 mb-6">
                Nova Oferta!
              </h2>
              <p className="text-gray-800 mb-8 leading-relaxed">
                Que tal uma exclusão premium? Quer apagar sua conta
                imediatamente?
              </p>
              <button
                onClick={() => setStep(9)}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Sim
              </button>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">💳</div>
                <h2 className="text-2xl font-bold text-green-800">
                  Exclusão Premium - Apenas R$ 49,99
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Exclusão instantânea dos dados! Oferta por tempo limitado!
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Número do Cartão
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    autoComplete="nope"
                    data-lpignore="true"
                    spellCheck={false}
                    name="card-number-nocomplete"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nome no Cartão
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="João Silva"
                    autoComplete="nope"
                    data-lpignore="true"
                    spellCheck={false}
                    name="card-name-nocomplete"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  />
                  {nameError && (
                    <p className="text-red-500 text-sm mt-2">{nameError}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Validade
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/AA"
                      autoComplete="nope"
                      data-lpignore="true"
                      spellCheck={false}
                      name="card-expiry-nocomplete"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      autoComplete="nope"
                      data-lpignore="true"
                      spellCheck={false}
                      name="card-cvv-nocomplete"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>
                {cardError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p className="font-bold">Erro no Pagamento:</p>
                    <p>{cardError}</p>
                  </div>
                )}
                <div className="pt-4">
                  <button
                    onClick={() => {
                      if (!cardError) {
                        handleCardSubmit();
                      } else if (
                        cardError &&
                        cardNumber &&
                        cardExpiry &&
                        cardCvv
                      ) {
                        alert(
                          "Ops! Você não tem dinheiro suficiente no banco para isso! 💸\n\nParece que sua conta está mais vazia que sua paciência tentando cancelar esta conta! 😂\n\nTente novamente quando conseguir juntar uns trocados! 💰"
                        );
                        setStep(1);
                        // Limpar todos os campos
                        setUsername("");
                        setPassword("");
                        setCardNumber("");
                        setCardName("");
                        setCardExpiry("");
                        setCardCvv("");
                        // Reset dos contadores e erros
                        setPasswordAttempts({
                          step3: 0,
                          step5: 0,
                          step7: 0,
                        });
                        setNameAttempts(0);
                        setPasswordError("");
                        setNameError("");
                        setCardError("");
                      }
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                  >
                    Pagar e Excluir Conta
                  </button>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  * Taxa de processamento adicional de R$ 15,99 será cobrada
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Algo deu errado!</h1>
              <button
                onClick={() => {
                  // Limpar todos os campos
                  setUsername("");
                  setPassword("");
                  setCardNumber("");
                  setCardName("");
                  setCardExpiry("");
                  setCardCvv("");
                  // Reset dos contadores e erros
                  setPasswordAttempts({
                    step3: 0,
                    step5: 0,
                    step7: 0,
                  });
                  setNameAttempts(0);
                  setPasswordError("");
                  setNameError("");
                  setCardError("");
                  setStep(1);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Recomeçar
              </button>
            </div>
          </div>
        );
    }
  };

  return renderStep();
}
