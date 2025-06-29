import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './assets/views/Home'
import { Temas } from './assets/views/Temas'
import { Layout } from './assets/views/Layout'
import { PreguntasSistemaNervioso } from './assets/views/PreguntasSistemaNervioso'
import { PreguntasSistemaDigestivo } from './assets/views/PreguntasSistemaDigestivo'
import { PreguntasSistemaCirculatorio } from './assets/views/PreguntasSistemaCirculatorio'

export const Router = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/temas" element={<Temas />} />
          <Route path="/preguntas/sistema-nervioso" element={<PreguntasSistemaNervioso />} />
          <Route path="/preguntas/sistema-digestivo" element={<PreguntasSistemaDigestivo />} />
          <Route path="/preguntas/sistema-circulatorio" element={<PreguntasSistemaCirculatorio />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}