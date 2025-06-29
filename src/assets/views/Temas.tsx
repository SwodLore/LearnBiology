import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const temas = [
  {
    nombre: 'Sistema Nervioso',
    descripcion: 'Explora el funcionamiento del cerebro, nervios y sentidos.',
    color: 'from-purple-300 to-purple-500',
    ruta: '/preguntas/sistema-nervioso',
  },
  {
    nombre: 'Sistema Digestivo',
    descripcion: 'Aprende sobre el proceso de digestión y absorción de nutrientes.',
    color: 'from-yellow-200 to-yellow-400',
    ruta: '/preguntas/sistema-digestivo',
  },
  {
    nombre: 'Sistema Circulatorio',
    descripcion: 'Descubre cómo la sangre recorre todo tu cuerpo.',
    color: 'from-red-200 to-red-400',
    ruta: '/preguntas/sistema-circulatorio',
  },
  {
    nombre: 'Sistema Respiratorio',
    descripcion: 'Conoce cómo obtenemos oxígeno y eliminamos CO₂.',
    color: 'from-blue-200 to-blue-400',
    ruta: '',
  },
];

export const Temas = () => {
  const [nombre, setNombre] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const nombreGuardado = localStorage.getItem('nombreUsuario');
    if (nombreGuardado) setNombre(nombreGuardado);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex flex-col items-center py-10">
      <div className="w-full flex justify-end pr-8 mb-2">
        {nombre && (
          <span className="text-green-900 font-semibold text-lg">Hola, {nombre} 👋</span>
        )}
      </div>
      <h2 className="text-3xl font-bold mb-6 text-green-900">Elige un tema de biología</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
        {temas.map((tema) => (
          <div
            key={tema.nombre}
            className={`rounded-xl shadow-lg p-6 bg-gradient-to-br ${tema.color} hover:scale-105 transition cursor-pointer`}
            onClick={() => tema.ruta && navigate(tema.ruta)}
          >
            <h3 className="text-2xl font-semibold mb-2 text-gray-900">{tema.nombre}</h3>
            <p className="text-gray-800">{tema.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}; 