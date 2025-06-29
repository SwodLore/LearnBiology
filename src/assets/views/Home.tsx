import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [inputNombre, setInputNombre] = useState('');

  // Cargar nombre guardado
  useEffect(() => {
    const nombreGuardado = localStorage.getItem('nombreUsuario');
    if (nombreGuardado) {
      setNombre(nombreGuardado);
    }
  }, []);

  // Guardar nombre
  const handleGuardarNombre = () => {
    if (inputNombre.trim()) {
      setNombre(inputNombre.trim());
      localStorage.setItem('nombreUsuario', inputNombre.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 to-blue-200 relative">
      <div className="flex flex-col items-center justify-center w-full max-w-md bg-white/80 rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-4 text-green-900">¡Bienvenido a learnBiology!</h1>
        {nombre ? (
          <>
            <p className="text-lg mb-8 text-green-800">Hola, <span className="font-semibold">{nombre}</span> 👋. ¡Aprende biología de forma divertida, al estilo Duolingo!</p>
            <button
              className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition"
              onClick={() => navigate('/temas')}
            >
              Elegir tema
            </button>
          </>
        ) : (
          <>
            <p className="text-lg mb-4 text-green-800">¿Cómo te llamas?</p>
            <input
              className="mb-4 px-4 py-2 rounded border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-300 w-full"
              type="text"
              value={inputNombre}
              onChange={e => setInputNombre(e.target.value)}
              placeholder="Escribe tu nombre"
              onKeyDown={e => { if (e.key === 'Enter') handleGuardarNombre(); }}
            />
            <button
              className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition w-full"
              onClick={handleGuardarNombre}
            >
              Guardar nombre
            </button>
          </>
        )}
      </div>
    </div>
  );
};