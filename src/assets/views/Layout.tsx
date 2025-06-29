import {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Contexto para progreso
interface ProgresoContextType {
  total: number;
  actual: number;
  setProgreso: (actual: number, total: number) => void;
}
const ProgresoContext = createContext<ProgresoContextType>({
  total: 0,
  actual: 0,
  setProgreso: () => {},
});

export const useProgreso = () => useContext(ProgresoContext);

interface PuntajeContextType {
  puntos: number;
  setPuntos: (p: number) => void;
}
const PuntajeContext = createContext<PuntajeContextType>({
  puntos: 0,
  setPuntos: () => {},
});
export const usePuntaje = () => useContext(PuntajeContext);

// Componente global de estrellas
export const PuntajeEstrellas = () => {
  const { puntos } = usePuntaje();
  return (
    <div className="fixed top-4 right-4 bg-white/90 shadow-md px-4 py-2 rounded-lg flex items-center gap-2 z-50">
      <span className="text-yellow-500 text-xl">⭐</span>
      <span className="text-green-800 font-semibold">{puntos} pts</span>
    </div>
  );
};

export const Layout = () => {
  const [tiempo, setTiempo] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [progreso, setProgresoState] = useState({ actual: 0, total: 0 });
  const setProgreso = (actual: number, total: number) =>
    setProgresoState({ actual, total });

  const porcentaje =
    progreso.total > 0 ? Math.round((progreso.actual / progreso.total) * 100) : 0;

  const [puntos, setPuntos] = useState(() =>
    Number(localStorage.getItem('puntos') || '0')
  );

  useEffect(() => {
    intervalRef.current = setInterval(() => setTiempo((t) => t + 1), 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'puntos') {
        setPuntos(Number(e.newValue || '0'));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <ProgresoContext.Provider value={{ ...progreso, setProgreso }}>
      <PuntajeContext.Provider value={{ puntos, setPuntos }}>
        <div className="min-h-screen bg-gradient-to-br from-green-200 to-blue-100">
          {/* Barra superior con progreso, tiempo y puntos */}
          <div className="w-full bg-green-600 py-3 px-6 flex justify-between items-center fixed top-0 left-0 z-50 shadow-md">
            {/* Progreso circular */}
            <div className="w-14 h-14">
              <CircularProgressbarWithChildren
                value={porcentaje}
                styles={buildStyles({
                  pathColor: '#fff',
                  trailColor: '#ffffff33',
                })}
              >
                <div className="text-white text-sm font-semibold">{porcentaje}%</div>
              </CircularProgressbarWithChildren>
            </div>

            {/* Cronómetro */}
            <div className="flex items-center gap-4 text-white font-semibold text-lg">
              <div className="flex items-center gap-2">
                <span className="text-xl">⏱️</span>
                <span>{tiempo}s</span>
              </div>
            </div>
          </div>

          {/* Estrellas visibles siempre */}
          <PuntajeEstrellas />

          {/* Contenido renderizado */}
          <motion.div
            className="pt-24 px-4 pb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </PuntajeContext.Provider>
    </ProgresoContext.Provider>
  );
};