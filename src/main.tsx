import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Layout } from './components/Layout'
import { PlatformProvider } from './platform'
import { Home } from './pages/Home'
import { Guide } from './pages/Guide'
import { Incidents, IncidentDetail } from './pages/Incidents'
import { Router } from './pages/Router'
import { Commands } from './pages/Commands'
import { Lights } from './pages/Lights'
import './styles.css'

/** Start each page at the top, unless the URL targets a section. */
function ScrollReset() {
  const { pathname, search, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, search, hash])
  return null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <PlatformProvider>
        <ScrollReset />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guides/:slug" element={<Guide />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/incidents/:slug" element={<IncidentDetail />} />
            <Route path="/router" element={<Router />} />
            <Route path="/commands" element={<Commands />} />
            <Route path="/lights" element={<Lights />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </PlatformProvider>
    </BrowserRouter>
  </StrictMode>,
)
