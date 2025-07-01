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
    pregunta: '¿Qué es la microbiología?',
    opciones: ['El estudio de los microorganismos', 'El estudio de los planetas', 'El estudio de los minerales', 'El estudio de los mamíferos'],
    respuesta: 'El estudio de los microorganismos',
    pista: 'Incluye bacterias, virus, hongos y protozoos.',
    imagen: 'https://cdn.pixabay.com/photo/2017/01/31/13/14/bacteria-2029366_1280.png',
  },
  {
    pregunta: '¿Cuál de estos NO es un microorganismo?',
    opciones: ['Árbol', 'Bacteria', 'Virus', 'Hongo'],
    respuesta: 'Árbol',
    pista: 'Es un ser vivo visible a simple vista.',
    imagen: 'https://cdn.pixabay.com/photo/2016/03/31/19/14/bacteria-1299821_1280.png',
  },
  {
    pregunta: '¿Qué estructura permite a las bacterias moverse?',
    opciones: ['Flagelo', 'Pared celular', 'Cápsula', 'Ribosoma'],
    respuesta: 'Flagelo',
    pista: 'Es como una cola que gira.',
    imagen: 'https://cdn.pixabay.com/photo/2012/04/13/00/22/bacteria-31229_1280.png',
  },
  {
    pregunta: '¿Cómo se llama el proceso por el cual una bacteria se divide en dos?',
    opciones: ['Fisión binaria', 'Fotosíntesis', 'Fermentación', 'Endocitosis'],
    respuesta: 'Fisión binaria',
    pista: 'Es una forma de reproducción asexual.',
    imagen: 'https://cdn.pixabay.com/photo/2017/01/31/13/14/bacteria-2029366_1280.png',
  },
  {
    pregunta: '¿Qué microorganismo causa la gripe?',
    opciones: ['Virus', 'Bacteria', 'Hongo', 'Protozoo'],
    respuesta: 'Virus',
    pista: 'No se puede tratar con antibióticos.',
    imagen: 'https://cdn.pixabay.com/photo/2016/03/31/19/14/bacteria-1299821_1280.png',
  },
  {
    pregunta: '¿Qué es un antibiótico?',
    opciones: ['Un medicamento que mata bacterias', 'Un virus', 'Un hongo', 'Un nutriente'],
    respuesta: 'Un medicamento que mata bacterias',
    pista: 'No sirve para tratar infecciones virales.',
    imagen: 'https://cdn.pixabay.com/photo/2012/04/13/00/22/bacteria-31229_1280.png',
  },
  {
    pregunta: '¿Qué microorganismo es responsable de la fermentación del pan?',
    opciones: ['Levadura', 'Bacteria', 'Virus', 'Protozoo'],
    respuesta: 'Levadura',
    pista: 'Es un hongo unicelular.',
    imagen: 'https://cdn.pixabay.com/photo/2017/01/31/13/14/bacteria-2029366_1280.png',
  },
  {
    pregunta: '¿Cómo se llama el estudio de los virus?',
    opciones: ['Virología', 'Bacteriología', 'Micología', 'Parasitología'],
    respuesta: 'Virología',
    pista: 'Es una rama de la microbiología.',
    imagen: 'https://cdn.pixabay.com/photo/2016/03/31/19/14/bacteria-1299821_1280.png',
  },
  {
    pregunta: '¿Qué célula del sistema inmune ataca a los microorganismos invasores?',
    opciones: ['Glóbulo blanco', 'Glóbulo rojo', 'Plaqueta', 'Neurona'],
    respuesta: 'Glóbulo blanco',
    pista: 'También se llaman leucocitos.',
    imagen: 'https://cdn.pixabay.com/photo/2012/04/13/00/22/bacteria-31229_1280.png',
  },
  {
    pregunta: '¿Qué instrumento se utiliza para observar microorganismos?',
    opciones: ['Microscopio', 'Telescopio', 'Estetoscopio', 'Termómetro'],
    respuesta: 'Microscopio',
    pista: 'Permite ver objetos muy pequeños.',
    imagen: 'https://cdn.pixabay.com/photo/2017/01/31/13/14/bacteria-2029366_1280.png',
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

export const PreguntasMicrobiologia = () => {
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
  const opciones = useMemo(() => preguntaActual ? shuffleArray(preguntaActual.opciones) : [], [preguntaActual]);

  if (!preguntaActual) {
    const puntos = Number(localStorage.getItem('puntos') || '0');
    const mensaje =
      puntos >= 90 ? '¡Excelente trabajo, eres un genio de la microbiología! 🦠' :
      puntos >= 60 ? '¡Muy bien, sigue así! 🧬' :
      '¡Puedes mejorar, sigue practicando! 🔬';

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-lime-100 to-green-100 px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/90 rounded-xl shadow-2xl p-10 text-center max-w-xl w-full space-y-6"
        >
          <h1 className="text-4xl font-bold text-lime-900">🏁 Resultados Finales</h1>
          <BioBuddy size="w-32" />
          <p className="text-2xl font-semibold text-lime-800">
            Obtuviste <span className="text-lime-600">{puntos}</span> puntos
          </p>
          <p className="text-lg text-lime-700 italic">{mensaje}</p>
          <button
            className="mt-6 px-6 py-3 bg-lime-600 text-white rounded-lg shadow hover:bg-lime-700 transition"
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
          className="flex items-center gap-2 text-lime-800 font-semibold hover:underline hover:text-lime-900 transition"
          onClick={() => {
            navigate('/temas');
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
          className="w-32 h-32 mb-2 rounded-full shadow-lg border-4 border-lime-200"
        />
        <h2 className="text-2xl font-bold text-lime-900 text-center">
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
                    ? 'bg-white text-lime-900 border-lime-300 hover:bg-lime-200'
                    : isSelected && esCorrecto
                      ? 'bg-lime-400 text-white border-lime-400'
                      : isSelected && !esCorrecto
                        ? 'bg-lime-700 text-white border-lime-700'
                        : 'bg-white text-lime-900 border-lime-300'}
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
            <p className="text-lime-900 font-bold text-2xl mt-4">¡Muy bien, {preguntaActual.respuesta} es correcto!</p>
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
            <h3 className="text-xl font-bold text-lime-800 mb-3">💡 ¡Pista!</h3>
            <p className="text-lime-700 mb-4">{preguntaActual.pista}</p>
            <button
              className="px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition"
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