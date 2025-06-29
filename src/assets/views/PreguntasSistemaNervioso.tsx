import React, { useState } from 'react';

const preguntas = [
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

export const PreguntasSistemaNervioso = () => {
  const [indice, setIndice] = useState(0);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState('');
  const [animacion, setAnimacion] = useState('');

  const preguntaActual = preguntas[indice];

  const handleRespuesta = (opcion: string) => {
    setRespuestaSeleccionada(opcion);
    if (opcion === preguntaActual.respuesta) {
      setAnimacion('animate-bounce');
      setTimeout(() => {
        setAnimacion('');
        setRespuestaSeleccionada('');
        setIndice((prev) => prev + 1);
        // Sumar puntos
        const puntos = Number(localStorage.getItem('puntos') || '0') + 10;
        localStorage.setItem('puntos', puntos.toString());
      }, 900);
    } else {
      setMostrarModal(true);
    }
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setRespuestaSeleccionada('');
  };

  if (indice >= preguntas.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-3xl font-bold text-green-900 mb-4">¡Felicidades!</h2>
        <p className="text-lg text-green-800 mb-4">Has completado todas las preguntas del Sistema Nervioso.</p>
        <img src="https://cdn.pixabay.com/photo/2017/01/31/13/14/brain-2029366_1280.png" alt="Cerebro" className="w-40 h-40 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className={`bg-white/90 rounded-xl shadow-lg p-8 flex flex-col items-center max-w-xl w-full ${animacion} transition-all duration-500`}>
        <img src={preguntaActual.imagen} alt="Pregunta" className="w-32 h-32 mb-4 rounded-full shadow-lg border-4 border-green-200 animate-fade-in" />
        <h2 className="text-2xl font-bold text-green-900 mb-6 text-center animate-fade-in">{preguntaActual.pregunta}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {preguntaActual.opciones.map((opcion) => (
            <button
              key={opcion}
              className={`px-6 py-3 rounded-lg shadow text-lg font-semibold transition-all duration-200 border-2 border-green-300 hover:bg-green-200 hover:scale-105 ${respuestaSeleccionada === opcion ? (opcion === preguntaActual.respuesta ? 'bg-green-400 text-white' : 'bg-red-400 text-white') : 'bg-white text-green-900'}`}
              onClick={() => handleRespuesta(opcion)}
              disabled={!!respuestaSeleccionada}
            >
              {opcion}
            </button>
          ))}
        </div>
      </div>

      {/* Modal de pista */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
            <h3 className="text-xl font-bold text-green-800 mb-2">¡Pista!</h3>
            <p className="mb-4 text-green-700 text-center">{preguntaActual.pista}</p>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              onClick={handleCerrarModal}
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 