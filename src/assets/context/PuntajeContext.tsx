// src/assets/context/PuntajeContext.tsx
// (Este archivo está correcto, no necesita cambios)

import { createContext, useContext, useState, useEffect } from 'react';

interface PuntajeContextProps {
  puntos: number;
  setPuntos: (p: number | ((prevPuntos: number) => number)) => void; // Hacemos el tipo más flexible
}

const PuntajeContext = createContext<PuntajeContextProps>({
  puntos: 0,
  setPuntos: () => {},
});

export const usePuntaje = () => useContext(PuntajeContext);

export const PuntajeProvider = ({ children }: { children: React.ReactNode }) => {
  const [puntos, setPuntos] = useState(() => Number(localStorage.getItem('puntos') || '0'));

  // Este useEffect es clave: cada vez que 'puntos' cambie, lo guarda.
  useEffect(() => {
    localStorage.setItem('puntos', puntos.toString());
  }, [puntos]);

  return (
    <PuntajeContext.Provider value={{ puntos, setPuntos }}>
      {children}
    </PuntajeContext.Provider>
  );
};