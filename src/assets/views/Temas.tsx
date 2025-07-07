import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import nervioso from '../temas/sistema-nervioso.avif';
import digestivo from '../temas/sistema-digestivo.jpeg';
import circulatorio from '../temas/sistema-circulatorio.png';
import respiratorio from '../temas/sistema-respiratorio.jpg';
import genetica from '../temas/genetica.jpg';
import microbiologia from '../temas/microbiologia.png';
import BioBuddy from '../components/BioBuddy';

const temas = [
  {
    nombre: 'Sistema Nervioso',
    descripcion: 'Explora el funcionamiento del cerebro, nervios y sentidos.',
    color: 'from-purple-300 to-purple-500',
    ruta: '/preguntas/sistema-nervioso',
    imagen: nervioso,
  },
  {
    nombre: 'Sistema Digestivo',
    descripcion: 'Aprende sobre el proceso de digestión y absorción de nutrientes.',
    color: 'from-yellow-200 to-yellow-400',
    ruta: '/preguntas/sistema-digestivo',
    imagen: digestivo,
  },
  {
    nombre: 'Sistema Circulatorio',
    descripcion: 'Descubre cómo la sangre recorre todo tu cuerpo.',
    color: 'from-red-200 to-red-400',
    ruta: '/preguntas/sistema-circulatorio',
    imagen: circulatorio,
  },
  {
    nombre: 'Sistema Respiratorio',
    descripcion: 'Conoce cómo obtenemos oxígeno y eliminamos CO₂.',
    color: 'from-blue-200 to-blue-400',
    ruta: '/preguntas/sistema-respiratorio',
    imagen: respiratorio,
  },
  {
    nombre: 'Genética',
    descripcion: 'Aprende sobre el ADN, los genes y la herencia.',
    color: 'from-purple-200 to-purple-400',
    ruta: '/preguntas/genetica',
    imagen: genetica,
  },
  {
    nombre: 'Microbiología',
    descripcion: 'Descubre el mundo de los microorganismos.',
    color: 'from-lime-200 to-lime-400',
    ruta: '/preguntas/microbiologia',
    imagen: microbiologia,
  },
];

export const Temas = () => {
  const [nombre, setNombre] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const nombreGuardado = localStorage.getItem('nombreUsuario');
    if (nombreGuardado) setNombre(nombreGuardado);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex flex-col items-center py-10 px-4">
      <div className="w-full flex justify-end pr-6 mb-4">
        {nombre && (
          <span className="text-green-900 font-semibold text-lg">Hola, {nombre} 👋</span>
        )}
      </div>

      <motion.h2
        className="text-3xl font-bold mb-8 text-green-900 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Elige un tema de biología
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {temas.map((tema, index) => (
          <motion.div
            key={tema.nombre}
            className={`rounded-xl shadow-xl p-4 bg-gradient-to-br ${tema.color} hover:scale-105 transition cursor-pointer`}
            onClick={() => navigate(tema.ruta)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <img
              src={tema.imagen}
              alt={tema.nombre}
              className="w-full h-40 object-contain mb-4 rounded-md"
            />
            <h3 className="text-xl font-bold text-gray-800 mb-2">{tema.nombre}</h3>
            <p className="text-gray-900">{tema.descripcion}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-10 flex justify-center w-full">
        <button
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition text-xl font-bold"
          onClick={() => navigate('/juego')}
        >
          Juego
        </button>
        <button
          className="px-8 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition text-xl font-bold"
          onClick={() => navigate('/rompecabezas')}
        >
          Rompecabeza
        </button>
      </div>
      <div className="fixed bottom-4 right-4 flex items-center gap-3 z-50">
        <BioBuddy size="w-20" />
        <div className="bg-white/80 text-green-900 rounded-xl px-4 py-2 shadow-lg font-semibold max-w-xs">
          "¡Vamos {nombre || 'explorador'}! La biología está llena de sorpresas. 🌿🔬"
        </div>
      </div>
    </div>
  );
};
