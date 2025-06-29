import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './assets/views/Home'
import { Temas } from './assets/views/Temas'
import { Layout } from './assets/views/Layout'
import { PreguntasSistemaNervioso } from './assets/views/Preguntas/PreguntasSistemaNervioso'
import { PreguntasSistemaDigestivo } from './assets/views/Preguntas/PreguntasSistemaDigestivo'
import { PreguntasSistemaCirculatorio } from './assets/views/Preguntas/PreguntasSistemaCirculatorio'
import { PreguntasSistemaRespiratorio } from './assets/views/Preguntas/PreguntasSistemaRespiratorio'
import { PreguntasGenetica } from './assets/views/Preguntas/PreguntasGenetica'
import { PreguntasMicrobiologia } from './assets/views/Preguntas/PreguntasMicrobiologia'

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
          <Route path="/preguntas/sistema-respiratorio" element={<PreguntasSistemaRespiratorio />} />
          <Route path="/preguntas/genetica" element={<PreguntasGenetica />} />
          <Route path="/preguntas/microbiologia" element={<PreguntasMicrobiologia />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}