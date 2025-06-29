import React, { useState } from 'react';

const preguntas = [
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

export const PreguntasSistemaDigestivo = () => {
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
        <h2 className="text-3xl font-bold text-yellow-700 mb-4">¡Felicidades!</h2>
        <p className="text-lg text-yellow-800 mb-4">Has completado todas las preguntas del Sistema Digestivo.</p>
        <img src="https://cdn.pixabay.com/photo/2016/03/31/19/14/anatomy-1299820_1280.png" alt="Digestivo" className="w-40 h-40 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className={`bg-white/90 rounded-xl shadow-lg p-8 flex flex-col items-center max-w-xl w-full ${animacion} transition-all duration-500`}>
        <img src={preguntaActual.imagen} alt="Pregunta" className="w-32 h-32 mb-4 rounded-full shadow-lg border-4 border-yellow-200 animate-fade-in" />
        <h2 className="text-2xl font-bold text-yellow-700 mb-6 text-center animate-fade-in">{preguntaActual.pregunta}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {preguntaActual.opciones.map((opcion) => (
            <button
              key={opcion}
              className={`px-6 py-3 rounded-lg shadow text-lg font-semibold transition-all duration-200 border-2 border-yellow-300 hover:bg-yellow-200 hover:scale-105 ${respuestaSeleccionada === opcion ? (opcion === preguntaActual.respuesta ? 'bg-yellow-400 text-white' : 'bg-red-400 text-white') : 'bg-white text-yellow-900'}`}
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
            <h3 className="text-xl font-bold text-yellow-700 mb-2">¡Pista!</h3>
            <p className="mb-4 text-yellow-700 text-center">{preguntaActual.pista}</p>
            <button
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
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