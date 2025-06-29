import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Howl } from 'howler';
import { useProgreso } from '../Layout';
import BioBuddy from '../../components/BioBuddy';

const correcto = new Howl({ src: ['/sounds/win.mp3'] });
const incorrecto = new Howl({ src: ['/sounds/lose.mp3'] });

const preguntasOriginales = [
  {
    pregunta: '¿Cuál es el órgano principal donde ocurre la absorción de nutrientes?',
    opciones: ['Intestino delgado', 'Estómago', 'Hígado', 'Esófago'],
    respuesta: 'Intestino delgado',
    pista: 'Es un tubo largo y enrollado después del estómago.',
    imagen: 'https://cdn.pixabay.com/photo/2016/03/31/19/14/anatomy-1299820_1280.png',
  },
  {
    pregunta: '¿Qué función tiene el estómago?',
    opciones: ['Mezclar y descomponer los alimentos', 'Absorber agua', 'Producir insulina', 'Transportar oxígeno'],
    respuesta: 'Mezclar y descomponer los alimentos',
    pista: 'Aquí los alimentos se mezclan con jugos gástricos.',
    imagen: 'https://cdn.pixabay.com/photo/2012/04/13/00/22/stomach-31224_1280.png',
  },
  {
    pregunta: '¿Cómo se llama el proceso de mover los alimentos a lo largo del tubo digestivo?',
    opciones: ['Peristalsis', 'Difusión', 'Osmosis', 'Filtración'],
    respuesta: 'Peristalsis',
    pista: 'Son movimientos musculares ondulatorios.',
    imagen: 'https://cdn.pixabay.com/photo/2016/03/31/19/14/anatomy-1299820_1280.png',
  },
  {
    pregunta: '¿Qué órgano produce la bilis?',
    opciones: ['Hígado', 'Páncreas', 'Estómago', 'Intestino grueso'],
    respuesta: 'Hígado',
    pista: 'Es el órgano más grande del abdomen.',
    imagen: 'https://cdn.pixabay.com/photo/2012/04/13/00/22/liver-31225_1280.png',
  },
  {
    pregunta: '¿Cuál es la función principal del intestino grueso?',
    opciones: ['Absorber agua y formar heces', 'Producir enzimas', 'Almacenar bilis', 'Descomponer proteínas'],
    respuesta: 'Absorber agua y formar heces',
    pista: 'Aquí se recupera el agua antes de la eliminación.',
    imagen: 'https://cdn.pixabay.com/photo/2016/03/31/19/14/anatomy-1299820_1280.png',
  },
  {
    pregunta: '¿Qué enzima descompone los carbohidratos en la boca?',
    opciones: ['Amilasa', 'Lipasa', 'Pepsina', 'Tripsina'],
    respuesta: 'Amilasa',
    pista: 'Es producida por las glándulas salivales.',
    imagen: 'https://cdn.pixabay.com/photo/2012/04/13/00/22/stomach-31224_1280.png',
  },
  {
    pregunta: '¿Qué órgano conecta la boca con el estómago?',
    opciones: ['Esófago', 'Tráquea', 'Duodeno', 'Colon'],
    respuesta: 'Esófago',
    pista: 'Es un tubo muscular que transporta el bolo alimenticio.',
    imagen: 'https://cdn.pixabay.com/photo/2012/04/13/00/22/stomach-31224_1280.png',
  },
  {
    pregunta: '¿Qué función tiene el páncreas en la digestión?',
    opciones: ['Produce enzimas digestivas', 'Absorbe nutrientes', 'Almacena glucógeno', 'Filtra toxinas'],
    respuesta: 'Produce enzimas digestivas',
    pista: 'Sus jugos ayudan a descomponer grasas, proteínas y carbohidratos.',
    imagen: 'https://cdn.pixabay.com/photo/2012/04/13/00/22/liver-31225_1280.png',
  },
  {
    pregunta: '¿Cómo se llama la mezcla semilíquida de alimentos y jugos gástricos?',
    opciones: ['Quimo', 'Bolo', 'Quilo', 'Plasma'],
    respuesta: 'Quimo',
    pista: 'Se forma en el estómago antes de pasar al intestino delgado.',
    imagen: 'https://cdn.pixabay.com/photo/2016/03/31/19/14/anatomy-1299820_1280.png',
  },
  {
    pregunta: '¿Qué parte del intestino delgado recibe el quimo primero?',
    opciones: ['Duodeno', 'Yeyuno', 'Íleon', 'Colon'],
    respuesta: 'Duodeno',
    pista: 'Es la primera porción del intestino delgado.',
    imagen: 'https://cdn.pixabay.com/photo/2012/04/13/00/22/stomach-31224_1280.png',
  },
];

function shuffleArray(array: any[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const PreguntasSistemaDigestivo = () => {
  const [indice, setIndice] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [felicitando, setFelicitando] = useState(false);
  const navigate = useNavigate();
  const [preguntas] = useState(() => shuffleArray(preguntasOriginales));
  const { setProgreso } = useProgreso();

  useEffect(() => {
    const progresoAnterior = JSON.parse(localStorage.getItem('progreso') || '[]');
    const nuevoProgreso = [indice, preguntas.length];
    const igual = JSON.stringify(progresoAnterior) === JSON.stringify(nuevoProgreso);
    if (!igual) {
      setProgreso(indice, preguntas.length);
      localStorage.setItem('progreso', JSON.stringify(nuevoProgreso));
    }
  }, [indice, preguntas.length, setProgreso]);

  const handleRespuesta = (opcion: string) => {
    setRespuestaSeleccionada(opcion);
    if (opcion === preguntaActual.respuesta) {
      correcto.play();
      setFelicitando(true);
      const puntos = Number(localStorage.getItem('puntos') || '0') + 10;
      localStorage.setItem('puntos', puntos.toString());
      setTimeout(() => {
        setFelicitando(false);
        setRespuestaSeleccionada('');
        setIndice((i) => i + 1);
      }, 1200);
    } else {
      incorrecto.play();
      setMostrarModal(true);
    }
  };

  const preguntaActual = preguntas[indice];
  const opciones = useMemo(() => {
    return preguntaActual ? shuffleArray(preguntaActual.opciones) : [];
  }, [preguntaActual]);

  if (!preguntaActual) {
    const puntos = Number(localStorage.getItem('puntos') || '0');
    const mensaje =
      puntos >= 90 ? '¡Excelente trabajo, eres un genio de la biología! 🧬' :
      puntos >= 60 ? '¡Muy bien, sigue así! 💪' :
      '¡Puedes mejorar, sigue practicando! 🌱';

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-300 px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/90 rounded-xl shadow-2xl p-10 text-center max-w-xl w-full space-y-6"
        >
          <h1 className="text-4xl font-bold text-yellow-900">🏁 Resultados Finales</h1>
          <BioBuddy size="w-32" />
          <p className="text-2xl font-semibold text-yellow-800">
            Obtuviste <span className="text-yellow-600">{puntos}</span> puntos
          </p>
          <p className="text-lg text-yellow-700 italic">{mensaje}</p>
          <button
            className="mt-6 px-6 py-3 bg-yellow-600 text-white rounded-lg shadow hover:bg-yellow-700 transition"
            onClick={() => {
              localStorage.removeItem('puntos');
              navigate('/temas');
            }}
          >
            Volver a los temas
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[70vh] w-full px-4">
      <div className="w-full max-w-xl mb-6 px-4">
        <button
          className="flex items-center gap-2 text-yellow-800 font-semibold hover:underline hover:text-yellow-900 transition"
          onClick={() => {
            localStorage.removeItem('puntos');
            navigate('/temas');
            window.location.reload();
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a temas
        </button>
      </div>

      <motion.div
        key={indice}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/90 rounded-xl shadow-lg p-8 flex flex-col items-center max-w-xl w-full space-y-6"
      >
        <img
          src={preguntaActual.imagen}
          alt="Pregunta"
          className="w-32 h-32 mb-2 rounded-full shadow-lg border-4 border-yellow-200"
        />
        <h2 className="text-2xl font-bold text-yellow-900 text-center">
          {preguntaActual.pregunta}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {opciones.map((op) => {
            const isSelected = respuestaSeleccionada === op;
            const esCorrecto = op === preguntaActual.respuesta;

            return (
              <motion.button
                key={op}
                onClick={() => !respuestaSeleccionada && handleRespuesta(op)}
                whileHover={{ scale: !respuestaSeleccionada ? 1.03 : 1 }}
                className={`
                  px-6 py-3 rounded-lg shadow font-semibold text-lg border-2
                  ${!respuestaSeleccionada
                    ? 'bg-white text-yellow-900 border-yellow-300 hover:bg-yellow-200'
                    : isSelected && esCorrecto
                      ? 'bg-yellow-400 text-white border-yellow-400'
                      : isSelected && !esCorrecto
                        ? 'bg-red-400 text-white border-red-400'
                        : 'bg-white text-yellow-900 border-yellow-300'
                  }
                  transition-all duration-200
                `}
              >
                {op}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {felicitando && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/90 rounded-xl shadow-lg p-6 flex flex-col items-center"
          >
            <BioBuddy size="w-24" />
            <p className="text-yellow-900 font-bold text-2xl mt-4">¡Muy bien, {preguntaActual.respuesta} es correcto!</p>
          </motion.div>
        </div>
      )}

      {mostrarModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center"
          >
            <h3 className="text-xl font-bold text-yellow-800 mb-3">💡 ¡Pista!</h3>
            <p className="text-yellow-700 mb-4">{preguntaActual.pista}</p>
            <button
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
              onClick={() => {
                setMostrarModal(false);
                setRespuestaSeleccionada('');
              }}
            >
              Intentar de nuevo
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
