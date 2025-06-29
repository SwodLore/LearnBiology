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
    pregunta: '¿Cuál es el órgano principal del sistema circulatorio?',
    opciones: ['Corazón', 'Pulmón', 'Hígado', 'Riñón'],
    respuesta: 'Corazón',
    pista: 'Es el encargado de bombear la sangre.',
    imagen: 'https://cdn.pixabay.com/photo/2012/04/13/00/22/heart-31226_1280.png',
  },
  {
    pregunta: '¿Cómo se llaman los vasos sanguíneos que llevan sangre del corazón a los órganos?',
    opciones: ['Arterias', 'Venas', 'Capilares', 'Linfa'],
    respuesta: 'Arterias',
    pista: 'Transportan sangre rica en oxígeno desde el corazón.',
    imagen: 'https://cdn.pixabay.com/photo/2016/03/31/19/14/anatomy-1299820_1280.png',
  },
  {
    pregunta: '¿Qué componente de la sangre transporta oxígeno?',
    opciones: ['Glóbulos rojos', 'Plaquetas', 'Glóbulos blancos', 'Plasma'],
    respuesta: 'Glóbulos rojos',
    pista: 'Contienen hemoglobina.',
    imagen: 'https://cdn.pixabay.com/photo/2017/01/31/13/14/brain-2029366_1280.png',
  },
  {
    pregunta: '¿Cómo se llama la circulación que va del corazón a los pulmones y regresa?',
    opciones: ['Circulación pulmonar', 'Circulación sistémica', 'Circulación linfática', 'Circulación portal'],
    respuesta: 'Circulación pulmonar',
    pista: 'Permite oxigenar la sangre en los pulmones.',
    imagen: 'https://cdn.pixabay.com/photo/2012/04/13/00/22/heart-31226_1280.png',
  },
  {
    pregunta: '¿Qué válvula separa la aurícula izquierda del ventrículo izquierdo?',
    opciones: ['Válvula mitral', 'Válvula tricúspide', 'Válvula pulmonar', 'Válvula aórtica'],
    respuesta: 'Válvula mitral',
    pista: 'Tiene dos valvas y está en el lado izquierdo del corazón.',
    imagen: 'https://cdn.pixabay.com/photo/2016/03/31/19/14/anatomy-1299820_1280.png',
  },
  {
    pregunta: '¿Qué función tienen las venas?',
    opciones: ['Llevar sangre de los órganos al corazón', 'Llevar sangre del corazón a los órganos', 'Filtrar la sangre', 'Transportar hormonas'],
    respuesta: 'Llevar sangre de los órganos al corazón',
    pista: 'Transportan sangre con menos oxígeno.',
    imagen: 'https://cdn.pixabay.com/photo/2012/04/13/00/22/heart-31226_1280.png',
  },
  {
    pregunta: '¿Qué célula sanguínea es responsable de la coagulación?',
    opciones: ['Plaquetas', 'Glóbulos rojos', 'Glóbulos blancos', 'Linfocitos'],
    respuesta: 'Plaquetas',
    pista: 'Son fragmentos celulares que ayudan a detener el sangrado.',
    imagen: 'https://cdn.pixabay.com/photo/2017/01/31/13/14/brain-2029366_1280.png',
  },
  {
    pregunta: '¿Cómo se llama el vaso sanguíneo más pequeño?',
    opciones: ['Capilar', 'Arteria', 'Vena', 'Aorta'],
    respuesta: 'Capilar',
    pista: 'Permite el intercambio de gases y nutrientes con los tejidos.',
    imagen: 'https://cdn.pixabay.com/photo/2016/03/31/19/14/anatomy-1299820_1280.png',
  },
  {
    pregunta: '¿Qué parte del corazón recibe la sangre de todo el cuerpo?',
    opciones: ['Aurícula derecha', 'Ventrículo derecho', 'Aurícula izquierda', 'Ventrículo izquierdo'],
    respuesta: 'Aurícula derecha',
    pista: 'Es la primera cavidad que recibe la sangre desoxigenada.',
    imagen: 'https://cdn.pixabay.com/photo/2012/04/13/00/22/heart-31226_1280.png',
  },
  {
    pregunta: '¿Qué nombre recibe el líquido amarillento que compone más de la mitad de la sangre?',
    opciones: ['Plasma', 'Linfocito', 'Plaqueta', 'Hemoglobina'],
    respuesta: 'Plasma',
    pista: 'Es la parte líquida de la sangre.',
    imagen: 'https://cdn.pixabay.com/photo/2016/03/31/19/14/anatomy-1299820_1280.png',
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

export const PreguntasSistemaCirculatorio = () => {
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
      puntos >= 90 ? '¡Excelente trabajo, eres un genio del sistema circulatorio! ❤️' :
      puntos >= 60 ? '¡Muy bien, sigue así! 💪' :
      '¡Puedes mejorar, sigue practicando! 🫀';

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-100 to-pink-100 px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/90 rounded-xl shadow-2xl p-10 text-center max-w-xl w-full space-y-6"
        >
          <h1 className="text-4xl font-bold text-red-900">🏁 Resultados Finales</h1>
          <BioBuddy size="w-32" />
          <p className="text-2xl font-semibold text-red-800">
            Obtuviste <span className="text-red-600">{puntos}</span> puntos
          </p>
          <p className="text-lg text-red-700 italic">{mensaje}</p>
          <button
            className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
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
          className="flex items-center gap-2 text-red-800 font-semibold hover:underline hover:text-red-900 transition"
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
          className="w-32 h-32 mb-2 rounded-full shadow-lg border-4 border-red-200"
        />
        <h2 className="text-2xl font-bold text-red-900 text-center">
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
                    ? 'bg-white text-red-900 border-red-300 hover:bg-red-200'
                    : isSelected && esCorrecto
                      ? 'bg-red-400 text-white border-red-400'
                      : isSelected && !esCorrecto
                        ? 'bg-red-700 text-white border-red-700'
                        : 'bg-white text-red-900 border-red-300'}
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
            <p className="text-red-900 font-bold text-2xl mt-4">¡Muy bien, {preguntaActual.respuesta} es correcto!</p>
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
            <h3 className="text-xl font-bold text-red-800 mb-3">💡 ¡Pista!</h3>
            <p className="text-red-700 mb-4">{preguntaActual.pista}</p>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
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
