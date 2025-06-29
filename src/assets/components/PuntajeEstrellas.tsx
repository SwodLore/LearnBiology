// src/components/PuntajeEstrellas.tsx (o donde lo tengas)
// ✨ VERSIÓN CORREGIDA Y SIMPLIFICADA

import { usePuntaje } from '../context/PuntajeContext'; // Asegúrate que la ruta es correcta

export const PuntajeEstrellas = () => {
  // Obtenemos los puntos directamente del contexto centralizado
  const { puntos } = usePuntaje();

  return (
    <div className="fixed top-4 right-4 bg-white/90 shadow-md px-4 py-2 rounded-lg flex items-center gap-2 z-50">
      <span className="text-yellow-500 text-xl">⭐</span>
      <span className="text-green-800 font-semibold">{puntos} pts</span>
    </div>
  );
};