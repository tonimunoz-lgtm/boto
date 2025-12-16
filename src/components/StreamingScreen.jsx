import React, { useState, useEffect, useRef } from 'react';
import { Volume2 } from 'lucide-react';
import { listenToGroups, setGameState, listenToClaims, updateClaimStatus } from '../services/firebaseService';

export function StreamingScreen() {
  const [groups, setGroups] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentClaim, setCurrentClaim] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [verifiedClaims, setVerifiedClaims] = useState([]);

  useEffect(() => {
    const unsubscribeGroups = listenToGroups(setGroups);
    const unsubscribeClaims = listenToClaims((claim) => {
      if (claim && claim.status === 'pending') {
        setCurrentClaim(claim);
        setShowNotification(true);
        playAlertSound();
      }
    });

    return () => {
      unsubscribeGroups();
      unsubscribeClaims();
    };
  }, []);

  const playAlertSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      
      // Primera frecuencia
      oscillator.frequency.value = 800;
      gain.gain.setValueAtTime(0.5, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);

      // Segunda frecuencia
      const osc2 = audioContext.createOscillator();
      osc2.connect(gain);
      osc2.frequency.value = 1000;
      gain.gain.setValueAtTime(0.5, audioContext.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
      osc2.start(audioContext.currentTime + 0.3);
      osc2.stop(audioContext.currentTime + 0.6);
    } catch (err) {
      console.log('Audio no disponible');
    }
  };

  const handleStartGame = () => {
    if (groups.length > 0) {
      setGameState('playing');
      setGameStarted(true);
    }
  };

  const handleClaimVerification = (isValid) => {
    if (currentClaim) {
      updateClaimStatus(currentClaim.id, isValid ? 'approved' : 'rejected');
      setVerifiedClaims([...verifiedClaims, { ...currentClaim, result: isValid ? 'approved' : 'rejected' }]);
      setShowNotification(false);
      setTimeout(() => setCurrentClaim(null), 500);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center">📡 CENTRO DE STREAMING</h1>

        {/* Sección de grupos registrados */}
        <div className="bg-gray-700 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            👥 Grupos Registrados
            <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-semibold">{groups.length}</span>
          </h2>
          {groups.length === 0 ? (
            <p className="text-gray-300 text-lg">Esperando que se registren grupos...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {groups.map(group => (
                <div 
                  key={group.id} 
                  className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4 text-center hover:from-blue-700 hover:to-blue-800 transition transform hover:scale-105 shadow-md"
                >
                  <p className="text-lg font-bold">{group.name}</p>
                  <p className="text-xs opacity-75 mt-1">Registrado</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botón de inicio */}
        {!gameStarted ? (
          <button
            onClick={handleStartGame}
            disabled={groups.length === 0}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-lg text-2xl mb-8 transition shadow-lg disabled:cursor-not-allowed"
          >
            {groups.length === 0 ? '⏳ Esperando grupos...' : '▶️  INICIAR JUEGO'}
          </button>
        ) : (
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white text-center py-4 rounded-lg text-2xl font-bold mb-8 shadow-lg animate-pulse">
            ✅ JUEGO EN MARCHA
          </div>
        )}

        {/* Historial de verificaciones */}
        {verifiedClaims.length > 0 && (
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">📋 Historial de Reclamaciones</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {verifiedClaims.map((claim, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-lg flex justify-between items-center ${
                    claim.result === 'approved' 
                      ? 'bg-green-900 border border-green-600' 
                      : 'bg-red-900 border border-red-600'
                  }`}
                >
                  <div>
                    <p className="font-bold">{claim.groupName}</p>
                    <p className="text-sm opacity-75">{claim.type.toUpperCase()} - {claim.numbers}</p>
                  </div>
                  <p className="text-lg font-bold">
                    {claim.result === 'approved' ? '✅' : '❌'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Alerta de reclamación */}
      {showNotification && currentClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-2xl p-12 max-w-md w-full text-center animate-pulse">
            <div className="relative mb-8">
              <Volume2 className="w-20 h-20 mx-auto text-yellow-300 animate-bounce" />
            </div>
            
            <h2 className="text-5xl font-bold mb-6 text-yellow-300">¡ALERTA!</h2>
            
            <div className="mb-6">
              <p className="text-lg text-red-100 mb-3">Grupo:</p>
              <p className="text-4xl font-bold bg-white text-red-600 py-4 px-4 rounded-lg shadow-lg">
                {currentClaim.groupName || 'Desconocido'}
              </p>
            </div>

            <div className="mb-6 text-center">
              <p className="text-3xl font-bold mb-3">
                {currentClaim.type === 'linea' ? '📋 LÍNEA' : '🎯 QUINTO'}
              </p>
              <p className="text-lg text-red-100">Números:</p>
              <p className="text-2xl font-bold text-yellow-300 bg-black bg-opacity-30 py-3 px-4 rounded-lg mt-2">
                {currentClaim.numbers}
              </p>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => handleClaimVerification(false)}
                className="flex-1 bg-red-900 hover:bg-red-950 text-white font-bold py-4 rounded-lg text-xl transition transform hover:scale-105 shadow-lg border-2 border-red-700"
              >
                ✗ ERROR
              </button>
              <button
                onClick={() => handleClaimVerification(true)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg text-xl transition transform hover:scale-105 shadow-lg border-2 border-green-500"
              >
                ✓ OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
