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
    pregunta: '¿Cuál es el órgano principal del sistema respiratorio?',
    opciones: ['Pulmones', 'Corazón', 'Hígado', 'Riñón'],
    respuesta: 'Pulmones',
    pista: 'Son dos y se encuentran en el tórax.',
    imagen: 'https://cdn.pixabay.com/photo/2012/04/13/00/22/lungs-31227_1280.png',
  },
  {
    pregunta: '¿Por dónde entra el aire al sistema respiratorio?',
    opciones: ['Nariz', 'Oído', 'Ojo', 'Piel'],
    respuesta: 'Nariz',
    pista: 'También filtra y humedece el aire.',
    imagen: 'https://cdn.pixabay.com/photo/2016/03/31/19/14/anatomy-1299820_1280.png',
  },
  {
    pregunta: '¿Cómo se llama el tubo que conecta la garganta con los pulmones?',
    opciones: ['Tráquea', 'Esófago', 'Bronquio', 'Laringe'],
    respuesta: 'Tráquea',
    pista: 'Es un tubo cartilaginoso que se divide en dos bronquios.',
    imagen: 'https://cdn.pixabay.com/photo/2012/04/13/00/22/lungs-31227_1280.png',
  },
  {
    pregunta: '¿Qué estructura impide que los alimentos entren en la tráquea?',
    opciones: ['Epiglotis', 'Lengua', 'Úvula', 'Amígdala'],
    respuesta: 'Epiglotis',
    pista: 'Es una tapa que cierra el paso durante la deglución.',
    imagen: 'https://cdn.pixabay.com/photo/2016/03/31/19/14/anatomy-1299820_1280.png',
  },
  {
    pregunta: '¿Cómo se llaman las pequeñas bolsas de aire donde ocurre el intercambio de gases?',
    opciones: ['Alvéolos', 'Bronquios', 'Bronquiolos', 'Vellosidades'],
    respuesta: 'Alvéolos',
    pista: 'Son estructuras microscópicas en los pulmones.',
    imagen: 'https://cdn.pixabay.com/photo/2012/04/13/00/22/lungs-31227_1280.png',
  },
  {
    pregunta: '¿Qué gas se elimina principalmente al exhalar?',
    opciones: ['Dióxido de carbono', 'Oxígeno', 'Nitrógeno', 'Helio'],
    respuesta: 'Dióxido de carbono',
    pista: 'Es un desecho del metabolismo celular.',
    imagen: 'https://cdn.pixabay.com/photo/2016/03/31/19/14/anatomy-1299820_1280.png',
  },
  {
    pregunta: '¿Qué músculo es fundamental para la respiración?',
    opciones: ['Diafragma', 'Bíceps', 'Cuádriceps', 'Trapecio'],
    respuesta: 'Diafragma',
    pista: 'Se encuentra debajo de los pulmones y se mueve al respirar.',
    imagen: 'https://cdn.pixabay.com/photo/2012/04/13/00/22/lungs-31227_1280.png',
  },
  {
    pregunta: '¿Cómo se llaman los tubos que llevan el aire a cada pulmón?',
    opciones: ['Bronquios', 'Alvéolos', 'Tráquea', 'Laringe'],
    respuesta: 'Bronquios',
    pista: 'Son dos, uno para cada pulmón.',
    imagen: 'https://cdn.pixabay.com/photo/2016/03/31/19/14/anatomy-1299820_1280.png',
  },
  {
    pregunta: '¿Qué ocurre en los alvéolos pulmonares?',
    opciones: ['Intercambio de gases', 'Producción de glóbulos rojos', 'Digestión', 'Filtración de sangre'],
    respuesta: 'Intercambio de gases',
    pista: 'Aquí el oxígeno pasa a la sangre y el CO₂ sale de ella.',
    imagen: 'https://cdn.pixabay.com/photo/2012/04/13/00/22/lungs-31227_1280.png',
  },
  {
    pregunta: '¿Qué nombre recibe el proceso de entrada y salida de aire en los pulmones?',
    opciones: ['Ventilación', 'Fotosíntesis', 'Digestión', 'Circulación'],
    respuesta: 'Ventilación',
    pista: 'Incluye la inspiración y la espiración.',
    imagen: 'https://cdn.pixabay.com/photo/2016/03/31/19/14/anatomy-1299820_1280.png',
  },
];

function shuffleArray(array : any[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const PreguntasSistemaRespiratorio = () => {
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
      puntos >= 90 ? '¡Excelente trabajo, eres un genio del sistema respiratorio! 🫁' :
      puntos >= 60 ? '¡Muy bien, sigue así! 💪' :
      '¡Puedes mejorar, sigue practicando! 🌬️';

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-cyan-100 px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/90 rounded-xl shadow-2xl p-10 text-center max-w-xl w-full space-y-6"
        >
          <h1 className="text-4xl font-bold text-blue-900">🏁 Resultados Finales</h1>
          <BioBuddy size="w-32" />
          <p className="text-2xl font-semibold text-blue-800">
            Obtuviste <span className="text-blue-600">{puntos}</span> puntos
          </p>
          <p className="text-lg text-blue-700 italic">{mensaje}</p>
          <button
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
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
          className="flex items-center gap-2 text-blue-800 font-semibold hover:underline hover:text-blue-900 transition"
          onClick={() => {
            navigate('/temas');
            window.location.reload();
          }}
        >
          ← Volver a temas
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
          className="w-32 h-32 mb-2 rounded-full shadow-lg border-4 border-blue-200"
        />
        <h2 className="text-2xl font-bold text-blue-900 text-center">
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
                    ? 'bg-white text-blue-900 border-blue-300 hover:bg-blue-200'
                    : isSelected && esCorrecto
                      ? 'bg-blue-400 text-white border-blue-400'
                      : isSelected && !esCorrecto
                        ? 'bg-blue-700 text-white border-blue-700'
                        : 'bg-white text-blue-900 border-blue-300'}
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
            <p className="text-blue-900 font-bold text-2xl mt-4">¡Muy bien, {preguntaActual.respuesta} es correcto!</p>
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
            <h3 className="text-xl font-bold text-blue-800 mb-3">💡 ¡Pista!</h3>
            <p className="text-blue-700 mb-4">{preguntaActual.pista}</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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