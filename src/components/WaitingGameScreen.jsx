import React, { useState, useEffect } from 'react';
import { listenToGameState } from '../services/firebaseService';

export function WaitingGameScreen() {
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const unsubscribe = listenToGameState((state) => {
      if (state === 'playing') {
        setGameStarted(true);
      }
    });
    return () => unsubscribe;
  }, []);

  if (gameStarted) {
    return null; // El componente padre manejará esto
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-8 animate-bounce">QUINTO</h1>
        <p className="text-3xl text-white font-semibold mb-8">Esperando que comience el juego...</p>
        <div className="flex gap-4 justify-center">
          <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}
