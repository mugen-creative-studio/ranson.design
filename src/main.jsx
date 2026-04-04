import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import '@fontsource-variable/dm-sans'
import './styles/tokens.css'
import './styles/global.css'
import Home from './pages/Home.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<div>Project detail</div>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
