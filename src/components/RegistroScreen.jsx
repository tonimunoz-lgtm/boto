import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { registerGroup, listenToGameState } from '../services/firebaseService';

export function RegistroScreen() {
  const [groupName, setGroupName] = useState('');
  const [registered, setRegistered] = useState(false);
  const [groupId, setGroupId] = useState(null);
  const [error, setError] = useState('');

  const handleRegister = () => {
    if (!groupName.trim()) {
      setError('Por favor introduce un nombre');
      return;
    }
    try {
      const id = registerGroup(groupName.trim());
      setGroupId(id);
      setRegistered(true);
    } catch (err) {
      setError('Error al registrarse. Intenta de nuevo.');
      console.error(err);
    }
  };

  if (registered) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">¡Registrado!</h1>
          <p className="text-xl text-gray-700 mb-2">Grupo: <strong>{groupName}</strong></p>
          <p className="text-lg text-gray-600 mb-6">ID: {groupId}</p>
          <p className="text-gray-600 mb-8">Espera a que comience el juego...</p>
          <div className="mt-8 animate-pulse">
            <div className="h-2 bg-green-300 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">QUINTO</h1>
        <p className="text-center text-gray-600 mb-8 text-lg">EN STREAMING</p>
        
        <label className="block text-lg font-semibold text-gray-700 mb-4">
          Nombre del Grupo/Curso
        </label>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
          placeholder="Ej: 2ºA, 3ºB, etc."
          className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg text-lg mb-4 focus:outline-none focus:border-blue-600"
          autoFocus
        />
        
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        
        <button
          onClick={handleRegister}
          disabled={!groupName.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg text-lg transition"
        >
          REGISTRARSE
        </button>
      </div>
    </div>
  );
}
