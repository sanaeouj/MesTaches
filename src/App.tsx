import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Accueil from './pages/Accueil'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Budget from './pages/Budget'
import VisionBoard from './pages/VisionBoard'
import Notes from './pages/Notes'
import Habitudes from './pages/Habitudes'
import Objectifs from './pages/Objectifs'
import Citations from './pages/Citations'
import Parametres from './pages/Parametres'
import './App.css'

const THEME_KEY = 'myworld-theme'

function App() {
  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) as 'dark' | 'light' | null
    const theme = saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
    document.documentElement.setAttribute('data-theme', theme)
  }, [])

  return (
    <div className="app">
      <Navbar />
      <div className="app__content">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/focus" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/vision-board" element={<VisionBoard />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/habitudes" element={<Habitudes />} />
          <Route path="/objectifs" element={<Objectifs />} />
          <Route path="/citations" element={<Citations />} />
          <Route path="/parametres" element={<Parametres />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
