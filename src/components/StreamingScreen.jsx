import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Volume2 } from 'lucide-react';
import { listenToGroups, setGameState, listenToClaims, updateClaimStatus } from '../services/firebaseService';


export function StreamingScreen() {
  const [groups, setGroups] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentClaim, setCurrentClaim] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const audioRef = useRef(null);

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
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    gain.gain.setValueAtTime(0.5, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
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
      setShowNotification(false);
      setTimeout(() => setCurrentClaim(null), 500);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white">
      <h1 className="text-5xl font-bold mb-8">CENTRO DE STREAMING</h1>

      {/* Sección de grupos registrados */}
      <div className="bg-gray-700 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Grupos Registrados ({groups.length})</h2>
        {groups.length === 0 ? (
          <p className="text-gray-300">Esperando que se registren grupos...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {groups.map(group => (
              <div key={group.id} className="bg-blue-600 rounded-lg p-4 text-center hover:bg-blue-700 transition">
                <p className="text-lg font-bold">{group.name}</p>
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
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-4 rounded-lg text-2xl mb-8 transition"
        >
          {groups.length === 0 ? 'Esperando grupos...' : 'INICIAR JUEGO'}
        </button>
      ) : (
        <div className="bg-green-600 text-white text-center py-4 rounded-lg text-2xl font-bold mb-8 animate-pulse">
          ✓ JUEGO EN MARCHA
        </div>
      )}

      {/* Alerta de reclamación */}
      {showNotification && currentClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-red-600 rounded-2xl shadow-2xl p-12 max-w-md w-full text-center animate-bounce">
            <Volume2 className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
            <h2 className="text-4xl font-bold mb-6">¡ALERTA!</h2>
            
            <p className="text-2xl mb-4 font-semibold">Grupo:</p>
            <p className="text-3xl font-bold bg-white text-red-600 py-4 px-4 rounded-lg mb-6
