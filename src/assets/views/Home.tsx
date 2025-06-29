import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BioBuddy from '../components/BioBuddy';
import fondoBiologia from '../fondos/background-biology.jpg';

export const Home = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [inputNombre, setInputNombre] = useState('');

  useEffect(() => {
    const nombreGuardado = localStorage.getItem('nombreUsuario');
    if (nombreGuardado) {
      setNombre(nombreGuardado);
    }
  }, []);

  const handleGuardarNombre = () => {
    if (inputNombre.trim()) {
      setNombre(inputNombre.trim());
      localStorage.setItem('nombreUsuario', inputNombre.trim());
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${fondoBiologia})` }}
    >
      {/* Filtro verde y blur */}
      <div className="absolute inset-0 bg-green-100/60 backdrop-blur-sm"></div>

      {/* Contenedor principal */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center w-[90%] max-w-md bg-white/90 rounded-2xl shadow-2xl p-8 border border-green-300"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Mascota BioBuddy animada */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="mb-4"
        >
          <BioBuddy size="w-32" />
        </motion.div>

        {/* Título principal */}
        <h1 className="text-4xl font-bold mb-2 text-green-900 text-center leading-snug drop-shadow">
          ¡Bienvenido a <span className="text-green-600">bioaventura</span>!
        </h1>

        {/* Texto o formulario */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {nombre ? (
            <>
              <p className="text-lg mb-6 text-green-800 text-center">
                Hola, <span className="font-semibold">{nombre}</span> 👋<br />
                ¡Aprende biología de forma divertida con <strong>BioBuddy</strong>!
              </p>
              <button
                className="px-6 py-3 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition w-full"
                onClick={() => navigate('/temas')}
              >
                Elegir tema
              </button>
            </>
          ) : (
            <>
              <p className="text-lg mb-4 text-green-800 text-center">¿Cómo te llamas?</p>
              <input
                className="mb-4 px-4 py-2 rounded-lg border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-300 w-full shadow-sm"
                type="text"
                value={inputNombre}
                onChange={(e) => setInputNombre(e.target.value)}
                placeholder="Escribe tu nombre"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleGuardarNombre();
                }}
              />
              <button
                className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition w-full"
                onClick={handleGuardarNombre}
              >
                Guardar nombre
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};
