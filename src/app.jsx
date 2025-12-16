import React, { useState } from 'react';
import { StudentScreen } from './components/StudentScreen';
import { StreamingScreen } from './components/StreamingScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('menu');

  if (currentScreen === 'menu') {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-4">QUINTO</h1>
          <p className="text-2xl text-white mb-12">Sistema de Streaming</p>
          
          <div className="space-y-4 max-w-sm mx-auto">
            <button
              onClick={() => setCurrentScreen('student')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-lg text-xl transition shadow-lg"
            >
              👨‍🎓 Soy Estudiante
            </button>
            <button
              onClick={() => setCurrentScreen('streaming')}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-lg text-xl transition shadow-lg"
            >
              📡 Centro de Streaming
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'student') {
    return <StudentScreen />;
  }

  if (currentScreen === 'streaming') {
    return <StreamingScreen />;
  }
}
