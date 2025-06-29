import React, { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  const [tiempo, setTiempo] = useState(0);
  const [puntos, setPuntos] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cronómetro global
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTiempo((t) => t + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Leer puntos de localStorage si se usan globalmente
  useEffect(() => {
    const puntosGuardados = localStorage.getItem('puntos');
    if (puntosGuardados) setPuntos(Number(puntosGuardados));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-blue-200 relative">
      {/* Cronómetro y puntuación global */}
      <div className="absolute top-4 right-8 flex items-center gap-6 z-50">
        <div className="bg-white/80 rounded-lg px-4 py-2 shadow text-green-900 font-semibold flex items-center gap-2">
          <span>⏱️</span>
          <span>{tiempo}s</span>
        </div>
        <div className="bg-white/80 rounded-lg px-4 py-2 shadow text-green-900 font-semibold flex items-center gap-2">
          <span>⭐</span>
          <span>{puntos}</span>
        </div>
      </div>
      <div className="pt-20">
        <Outlet />
      </div>
    </div>
  );
}; 