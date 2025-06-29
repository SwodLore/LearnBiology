import React, { useState } from 'react';

const preguntas = [
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

export const PreguntasSistemaCirculatorio = () => {
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
        <h2 className="text-3xl font-bold text-red-700 mb-4">¡Felicidades!</h2>
        <p className="text-lg text-red-800 mb-4">Has completado todas las preguntas del Sistema Circulatorio.</p>
        <img src="https://cdn.pixabay.com/photo/2012/04/13/00/22/heart-31226_1280.png" alt="Corazón" className="w-40 h-40 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className={`bg-white/90 rounded-xl shadow-lg p-8 flex flex-col items-center max-w-xl w-full ${animacion} transition-all duration-500`}>
        <img src={preguntaActual.imagen} alt="Pregunta" className="w-32 h-32 mb-4 rounded-full shadow-lg border-4 border-red-200 animate-fade-in" />
        <h2 className="text-2xl font-bold text-red-700 mb-6 text-center animate-fade-in">{preguntaActual.pregunta}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {preguntaActual.opciones.map((opcion) => (
            <button
              key={opcion}
              className={`px-6 py-3 rounded-lg shadow text-lg font-semibold transition-all duration-200 border-2 border-red-300 hover:bg-red-200 hover:scale-105 ${respuestaSeleccionada === opcion ? (opcion === preguntaActual.respuesta ? 'bg-red-400 text-white' : 'bg-red-700 text-white') : 'bg-white text-red-900'}`}
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
            <h3 className="text-xl font-bold text-red-700 mb-2">¡Pista!</h3>
            <p className="mb-4 text-red-700 text-center">{preguntaActual.pista}</p>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
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