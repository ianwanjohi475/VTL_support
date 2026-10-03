import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Layout } from './components/Layout'
import { PlatformProvider } from './platform'
import { Home } from './pages/Home'
import { Guide } from './pages/Guide'
import { Incidents, IncidentDetail } from './pages/Incidents'
import { Guides } from './pages/Guides'
import { Poe } from './pages/Poe'
import { TendaHub } from './pages/tenda/Hub'
import { TendaSetup } from './pages/tenda/Setup'
import { TendaWifiPassword } from './pages/tenda/WifiPassword'
import { TendaPacketLoss } from './pages/tenda/PacketLoss'
import { TendaMigration } from './pages/tenda/Migration'
import './sim/sim.css'
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
            <Route path="/tenda" element={<TendaHub />} />
            <Route path="/tenda/setup" element={<TendaSetup />} />
            <Route path="/tenda/wifi-password" element={<TendaWifiPassword />} />
            <Route path="/tenda/packet-loss" element={<TendaPacketLoss />} />
            <Route path="/tenda/migration" element={<TendaMigration />} />
            <Route path="/poe" element={<Poe />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/router" element={<Navigate to="/tenda" replace />} />
            <Route path="/commands" element={<Commands />} />
            <Route path="/lights" element={<Lights />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </PlatformProvider>
    </BrowserRouter>
  </StrictMode>,
)
