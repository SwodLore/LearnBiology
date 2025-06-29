import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Howl } from 'howler';
import { useProgreso } from '../Layout';
import BioBuddy from '../../components/BioBuddy';
import { usePuntaje } from '../../context/PuntajeContext';
const correcto = new Howl({ src: ['/sounds/win.mp3'] });
const incorrecto = new Howl({ src: ['/sounds/lose.mp3'] });

const preguntasOriginales = [
  {
    pregunta: '¿Cuál es la célula principal del sistema nervioso?',
    opciones: ['Neurona', 'Glóbulo rojo', 'Osteocito', 'Miocito'],
    respuesta: 'Neurona',
    pista: 'Es la célula encargada de transmitir impulsos eléctricos.',
    imagen: 'https://cdn.pixabay.com/photo/2017/01/31/13/14/brain-2029366_1280.png',
  },
  {
    pregunta: '¿Qué parte del cerebro controla el equilibrio?',
    opciones: ['Cerebelo', 'Bulbo raquídeo', 'Corteza frontal', 'Hipotálamo'],
    respuesta: 'Cerebelo',
    pista: 'Está en la parte posterior e inferior del encéfalo.',
    imagen: 'https://cdn.pixabay.com/photo/2013/07/12/15/55/brain-150935_1280.png',
  },
  {
    pregunta: '¿Cómo se llama la sustancia que recubre y protege los axones?',
    opciones: ['Mielina', 'Dopamina', 'Serotonina', 'Glucosa'],
    respuesta: 'Mielina',
    pista: 'Es una vaina aislante que acelera la transmisión nerviosa.',
    imagen: 'https://cdn.pixabay.com/photo/2016/03/31/19/14/brain-1299821_1280.png',
  },
  {
    pregunta: '¿Cuál es la función principal de la médula espinal?',
    opciones: ['Transmitir señales entre el cerebro y el cuerpo', 'Bombear sangre', 'Producir hormonas', 'Filtrar sangre'],
    respuesta: 'Transmitir señales entre el cerebro y el cuerpo',
    pista: 'Es la autopista de información del sistema nervioso central.',
    imagen: 'https://cdn.pixabay.com/photo/2012/04/13/00/22/spine-31223_1280.png',
  },
  {
    pregunta: '¿Qué nombre recibe la conexión entre dos neuronas?',
    opciones: ['Sinapsis', 'Axón', 'Dendrita', 'Soma'],
    respuesta: 'Sinapsis',
    pista: 'Es el espacio donde se transmiten los impulsos nerviosos.',
    imagen: 'https://cdn.pixabay.com/photo/2017/01/31/13/14/brain-2029366_1280.png',
  },
  {
    pregunta: '¿Qué parte del sistema nervioso controla los movimientos voluntarios?',
    opciones: ['Sistema nervioso somático', 'Sistema nervioso autónomo', 'Sistema endocrino', 'Sistema linfático'],
    respuesta: 'Sistema nervioso somático',
    pista: 'Es la parte que permite mover los músculos de manera consciente.',
    imagen: 'https://cdn.pixabay.com/photo/2013/07/12/15/55/brain-150935_1280.png',
  },
  {
    pregunta: '¿Cuál de estos NO es un neurotransmisor?',
    opciones: ['Insulina', 'Dopamina', 'Serotonina', 'Acetilcolina'],
    respuesta: 'Insulina',
    pista: 'Es una hormona relacionada con la glucosa, no con la transmisión nerviosa.',
    imagen: 'https://cdn.pixabay.com/photo/2016/03/31/19/14/brain-1299821_1280.png',
  },
  {
    pregunta: '¿Qué estructura protege al cerebro de golpes?',
    opciones: ['Cráneo', 'Meninges', 'Piel', 'Ventrículos'],
    respuesta: 'Cráneo',
    pista: 'Es una estructura ósea muy dura.',
    imagen: 'https://cdn.pixabay.com/photo/2012/04/13/00/22/spine-31223_1280.png',
  },
  {
    pregunta: '¿Qué parte del sistema nervioso regula la respiración y el ritmo cardíaco?',
    opciones: ['Bulbo raquídeo', 'Cerebelo', 'Tálamo', 'Hipocampo'],
    respuesta: 'Bulbo raquídeo',
    pista: 'Está en la base del encéfalo y controla funciones vitales automáticas.',
    imagen: 'https://cdn.pixabay.com/photo/2013/07/12/15/55/brain-150935_1280.png',
  },
  {
    pregunta: '¿Cómo se llaman las prolongaciones que reciben información en la neurona?',
    opciones: ['Dendritas', 'Axones', 'Sinapsis', 'Nodos de Ranvier'],
    respuesta: 'Dendritas',
    pista: 'Son ramificaciones que reciben señales de otras neuronas.',
    imagen: 'https://cdn.pixabay.com/photo/2017/01/31/13/14/brain-2029366_1280.png',
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

export const PreguntasSistemaNervioso = () => {
  const [indice, setIndice] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [felicitando, setFelicitando] = useState(false);
  const navigate = useNavigate();
  const [preguntas] = useState(() => shuffleArray(preguntasOriginales));
  const { setProgreso } = useProgreso();
  const { puntos, setPuntos } = usePuntaje();
  

  useEffect(() => {
    const progresoAnterior = JSON.parse(localStorage.getItem('progreso') || '[]');
    const nuevoProgreso = [indice, preguntas.length];
    const igual = JSON.stringify(progresoAnterior) === JSON.stringify(nuevoProgreso);
    if (!igual) {
      setProgreso(indice, preguntas.length);
      localStorage.setItem('progreso', JSON.stringify(nuevoProgreso)); // opcional
    }
  }, [indice, preguntas.length, setProgreso]);


  const handleRespuesta = (opcion: string) => {
    setRespuestaSeleccionada(opcion);
    if (opcion === preguntaActual.respuesta) {
      correcto.play();
      setFelicitando(true);
      setPuntos((puntosAnteriores) => puntosAnteriores + 10);
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
  
  const preguntaActual = preguntas[indice]; // Esto puede ser undefined, así que lo tratamos abajo
const opciones = useMemo(() => {
  return preguntaActual ? shuffleArray(preguntaActual.opciones) : [];
}, [preguntaActual]);

if (!preguntaActual) {
  const mensaje =
    puntos >= 90 ? '¡Excelente trabajo, eres un genio de la biología! 🧬' :
    puntos >= 60 ? '¡Muy bien, sigue así! 💪' :
    '¡Puedes mejorar, sigue practicando! 🌱';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100 px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/90 rounded-xl shadow-2xl p-10 text-center max-w-xl w-full space-y-6"
      >
        <h1 className="text-4xl font-bold text-green-900">🏁 Resultados Finales</h1>
        <BioBuddy size="w-32" />
        <p className="text-2xl font-semibold text-green-800">
          Obtuviste <span className="text-green-600">{puntos}</span> puntos
        </p>
        <p className="text-lg text-green-700 italic">{mensaje}</p>
        <button
          className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
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
          className="flex items-center gap-2 text-green-800 font-semibold hover:underline hover:text-green-900 transition"
          onClick={() => {
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
          className="w-32 h-32 mb-2 rounded-full shadow-lg border-4 border-green-200"
        />
        <h2 className="text-2xl font-bold text-green-900 text-center">
          {preguntaActual.pregunta}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {opciones.map((op) => {
            const isSelected = respuestaSeleccionada === op;
            const correcto = op === preguntaActual.respuesta;

            return (
              <motion.button
                key={op}
                onClick={() => !respuestaSeleccionada && handleRespuesta(op)}
                whileHover={{ scale: !respuestaSeleccionada ? 1.03 : 1 }}
                className={`
                  px-6 py-3 rounded-lg shadow font-semibold text-lg border-2
                  ${!respuestaSeleccionada
                    ? 'bg-white text-green-900 border-green-300 hover:bg-green-200'
                    : isSelected && correcto
                      ? 'bg-green-400 text-white border-green-400'
                      : isSelected && !correcto
                        ? 'bg-red-400 text-white border-red-400'
                        : 'bg-white text-green-900 border-green-300'
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
            <p className="text-green-900 font-bold text-2xl mt-4">¡Muy bien, {preguntaActual.respuesta} es correcto!</p>
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
            <h3 className="text-xl font-bold text-green-800 mb-3">💡 ¡Pista!</h3>
            <p className="text-green-700 mb-4">{preguntaActual.pista}</p>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
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

