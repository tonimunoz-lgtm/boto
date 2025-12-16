import React, { useState, useEffect } from 'react';
import { RegistroScreen } from './RegistroScreen';
import { WaitingGameScreen } from './WaitingGameScreen';
import { GameScreen } from './GameScreen';
import { listenToGameState } from '../services/firebaseService';

export function StudentScreen() {
  const [screen, setScreen] = useState('registro');
  const [groupId, setGroupId] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const unsubscribe = listenToGameState((state) => {
      if (state === 'playing') {
        setGameStarted(true);
        setScreen('game');
      }
    });
    return () => unsubscribe;
  }, []);

  if (screen === 'registro') {
    return <RegistroScreen />;
  }

  if (screen === 'waiting') {
    return <WaitingGameScreen />;
  }

  if (screen === 'game' && groupId) {
    return <GameScreen groupId={groupId} groupName={groupName} />;
  }

  return <RegistroScreen />;
}
