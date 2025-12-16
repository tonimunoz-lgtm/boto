import React, { useState, useEffect, useRef } from 'react';
import { submitClaim, listenToClaimUpdates } from '../services/firebaseService';

export function GameScreen({ groupId, groupName }) {
  const [claimType, setClaimType] = useState(null);
  const [numbers, setNumbers] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [claimStatus, setClaimStatus] = useState(null);
  const [currentClaimId, setCurrentClaimId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const audioRef = useRef(null);

  useEffect(() => {
    if (currentClaimId) {
      const unsubscribe = listenToClaimUpdates(currentClaimId, (status) => {
        if (status === 'approved') {
          setStatusMessage('✓ ¡CORRECTO!');
          setClaimStatus('success');
          playSound('success');
        } else if (status === 'rejected') {
          setStatusMessage('✗ ERROR - Números incorrectos');
          setClaimStatus('error');
          playSound('error');
        }
      });
      return () => unsubscribe;
    }
  }, [currentClaimId]);

  const playSound = (type) => {
    // Sonidos simples usando Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    
    if (type === 'success') {
      oscillator.frequency.value = 800;
      gain.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } else {
      oscillator.frequency.value = 300;
      gain.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  };

  const handleSubmitClaim = (type) => {
    setClaimType(type);
    setNumbers('');
    setClaimStatus(null);
    setStatusMessage('');
  };

  const handleSendNumbers = async () => {
    const numArray = numbers.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    
    if (numArray.length === 0) {
      setStatusMessage('Por favor introduce números');
      return;
    }

    setSubmitting(true);
    try {
      const claimId = submitClaim(groupId, groupName, claimType, numArray);
      setCurrentClaimId(claimId);
      setClaimStatus('waiting');
      setStatusMessage('Comprobando números...');
      setClaimType(null);
      setNumbers('');
    } catch (err) {
      setStatusMessage('Error al enviar. Intenta de nuevo.');
      console.error(err);
    }
    setSubmitting(false);
  };

  if (claimStatus === 'success') {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-8xl font-bold text-white mb-6">✓</h1>
          <p className="text-5xl text-white font-bold mb-8">¡CORRECTO!</p>
          <p className="text-2xl text-white opacity-90">Esperando siguiente bola...</p>
        </div>
      </div>
    );
  }

  if (claimStatus === 'error') {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-8xl font-bold text-white mb-6">✗</h1>
          <p className="text-4xl text-white font-bold mb-8">ERROR</p>
          <p className="text-2xl text-white opacity-90 mb-8">Números incorrectos</p>
          <button
            onClick={() => setClaimStatus(null)}
            className="bg-white text-red-600 font-bold py-4 px-8 rounded-lg text-xl hover:bg-gray-200 transition"
          >
            Continuar jugando
          </button>
        </div>
      </div>
    );
  }

  if (claimStatus === 'waiting') {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin mb-6">
            <div className="w-16 h-16 border-4 border-white border-t-yellow-300 rounded-full mx-auto"></div>
          </div>
          <p className="text-3xl text-white font-bold">Comprobando números...</p>
        </div>
      </div>
    );
  }

  if (claimType) {
    const requiredNumbers = claimType === 'linea' ? 5 : 15;
    const numList = numbers.split(',').map(n => n.trim()).filter(n => n);

    return (
      <div className="w-full h-screen bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full">
          <h2 className="text-3xl font-bold text-center mb-6 text-indigo-700">
            {claimType === 'linea' ? 'LÍNEA' : 'QUINTO'}
          </h2>
          
          <p className="text-gray-700 mb-4">Introduce los {requiredNumbers} números separados por comas:</p>
          <input
            type="text"
            value={numbers}
            onChange={(e) => setNumbers(e.target.value)}
            placeholder="Ej: 1, 5, 10, 15, 20"
            className="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg mb-4 focus:outline-none focus:border-indigo-600"
            autoFocus
          />
          
          <div className="mb-6 text-sm text-gray-600">
            Números ingresados: <strong>{numList.length}/{requiredNumbers}</strong>
          </div>
          
          {statusMessage && (
            <p className="text-red-600 text-sm mb-4">{statusMessage}</p>
          )}
          
          <div className="flex gap-4">
            <button
              onClick={() => { setClaimType(null); setNumbers(''); setStatusMessage(''); }}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSendNumbers}
              disabled={numList.length !== requiredNumbers || submitting}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
            >
              {submitting ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-pink-500 to-red-600 flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-2xl text-white font-semibold mb-12">¿Tienes números?</p>
        <div className="flex gap-8 justify-center flex-col md:flex-row">
          <button
            onClick={() => handleSubmitClaim('linea')}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-6 px-12 rounded-xl text-3xl transition transform hover:scale-105 shadow-lg"
          >
            LÍNEA
          </button>
          <button
            onClick={() => handleSubmitClaim('quinto')}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-12 rounded-xl text-3xl transition transform hover:scale-105 shadow-lg"
          >
            QUINTO
          </button>
        </div>
      </div>
    </div>
  );
}
