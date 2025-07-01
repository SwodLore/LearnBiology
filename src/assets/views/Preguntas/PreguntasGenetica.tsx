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
    pregunta: '¿Cuál es la molécula que contiene la información genética?',
    opciones: ['ADN', 'ARN', 'Proteína', 'Lípido'],
    respuesta: 'ADN',
    pista: 'Tiene forma de doble hélice.',
    imagen: 'https://img.freepik.com/vector-gratis/personaje-dibujos-animados-nina-cientifica-equipos-laboratorio_1308-102788.jpg?semt=ais_items_boosted&w=740',
  },
  {
    pregunta: '¿Cómo se llama la unidad básica de la herencia?',
    opciones: ['Gen', 'Cromosoma', 'Núcleo', 'Alelo'],
    respuesta: 'Gen',
    pista: 'Es un segmento de ADN que codifica una característica.',
    imagen: 'https://img.freepik.com/vector-gratis/concepto-biologia-iconos-dibujos-animados-ciencia-retro_1284-7504.jpg',
  },
  {
    pregunta: '¿Cuántos cromosomas tiene el ser humano normalmente?',
    opciones: ['46', '23', '44', '92'],
    respuesta: '46',
    pista: 'Son 23 pares.',
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpiv0pbqxo3xa-gILT6FhqFOAVTpMz-XCIiw&s',
  },
  {
    pregunta: '¿Cómo se llama el proceso por el cual el ADN se copia a ARN?',
    opciones: ['Transcripción', 'Traducción', 'Replicación', 'Mutación'],
    respuesta: 'Transcripción',
    pista: 'Es el primer paso para sintetizar proteínas.',
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuC2ozn852T6jofKaEeFIU8GckE-t10uj65A&s',
  },
  {
    pregunta: '¿Qué es un alelo?',
    opciones: ['Una variante de un gen', 'Un tipo de célula', 'Una proteína', 'Un cromosoma'],
    respuesta: 'Una variante de un gen',
    pista: 'Puede ser dominante o recesivo.',
    imagen: 'https://cdn.pixabay.com/photo/2017/02/09/11/21/dna-2059441_1280.png',
  },
  {
    pregunta: '¿Cómo se llama el cambio en la secuencia del ADN?',
    opciones: ['Mutación', 'Transcripción', 'Traducción', 'Duplicación'],
    respuesta: 'Mutación',
    pista: 'Puede ser beneficiosa, neutra o perjudicial.',
    imagen: 'https://cdn.pixabay.com/photo/2020/05/21/03/17/dna-5199210_1280.jpg',
  },
  {
    pregunta: '¿Qué científico es conocido como el padre de la genética?',
    opciones: ['Gregor Mendel', 'Charles Darwin', 'James Watson', 'Rosalind Franklin'],
    respuesta: 'Gregor Mendel',
    pista: 'Estudió los guisantes y las leyes de la herencia.',
    imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Gregor_Mendel_2.jpg/800px-Gregor_Mendel_2.jpg',
  },
  {
    pregunta: '¿Qué es un fenotipo?',
    opciones: ['La manifestación observable de un gen', 'La secuencia de ADN', 'El número de cromosomas', 'Un tipo de mutación'],
    respuesta: 'La manifestación observable de un gen',
    pista: 'Es lo que se puede ver, como el color de ojos.',
    imagen: 'https://cdn.pixabay.com/photo/2017/05/15/15/36/eye-2319839_1280.jpg',
  },
  {
    pregunta: '¿Qué bases nitrogenadas forman el ADN?',
    opciones: ['Adenina, Timina, Citosina, Guanina', 'Adenina, Uracilo, Citosina, Guanina', 'Adenina, Timina, Citosina, Uracilo', 'Adenina, Guanina, Uracilo, Timina'],
    respuesta: 'Adenina, Timina, Citosina, Guanina',
    pista: 'Son cuatro letras: A, T, C y G.',
    imagen: 'https://cdn.pixabay.com/photo/2017/03/23/05/13/dna-2165955_1280.png',
  },
  {
    pregunta: '¿Qué es un cariotipo?',
    opciones: ['El conjunto de cromosomas de un individuo', 'Un tipo de gen', 'Una mutación', 'Una proteína'],
    respuesta: 'El conjunto de cromosomas de un individuo',
    pista: 'Se representa en un gráfico ordenado por pares.',
    imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Karyotype_Chromosomes.png/640px-Karyotype_Chromosomes.png',
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

export const PreguntasGenetica = () => {
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
      puntos >= 90 ? '¡Excelente trabajo, eres un genio de la genética! 🧬' :
      puntos >= 60 ? '¡Muy bien, sigue así! 💪' :
      '¡Puedes mejorar, sigue practicando! 🧪';

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/90 rounded-xl shadow-2xl p-10 text-center max-w-xl w-full space-y-6"
        >
          <h1 className="text-4xl font-bold text-purple-900">🏁 Resultados Finales</h1>
          <BioBuddy size="w-32" />
          <p className="text-2xl font-semibold text-purple-800">
            Obtuviste <span className="text-purple-600">{puntos}</span> puntos
          </p>
          <p className="text-lg text-purple-700 italic">{mensaje}</p>
          <button
            className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
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
          className="flex items-center gap-2 text-purple-800 font-semibold hover:underline hover:text-purple-900 transition"
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
          className="w-32 h-32 mb-2 rounded-full shadow-lg border-4 border-purple-200"
        />
        <h2 className="text-2xl font-bold text-purple-900 text-center">
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
                    ? 'bg-white text-purple-900 border-purple-300 hover:bg-purple-200'
                    : isSelected && esCorrecto
                      ? 'bg-purple-400 text-white border-purple-400'
                      : isSelected && !esCorrecto
                        ? 'bg-purple-700 text-white border-purple-700'
                        : 'bg-white text-purple-900 border-purple-300'}
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
            <p className="text-purple-900 font-bold text-2xl mt-4">¡Muy bien, {preguntaActual.respuesta} es correcto!</p>
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
            <h3 className="text-xl font-bold text-purple-800 mb-3">💡 ¡Pista!</h3>
            <p className="text-purple-700 mb-4">{preguntaActual.pista}</p>
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
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
