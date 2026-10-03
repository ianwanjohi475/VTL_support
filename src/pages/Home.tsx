import { Link } from 'react-router-dom'
import { Caption } from '../components/ui'
import { Icon, ic, type IconData } from '../icons'
import { TendaLogo } from '../sim/Tenda'

const MORE: { to: string; icon: IconData; title: string; text: string }[] = [
  { to: '/guides', icon: ic.checklist, title: 'Troubleshooting guides', text: 'No internet, slow, LOS, Wi-Fi and more' },
  { to: '/incidents', icon: ic.crisisAlert, title: 'Incidents', text: 'Offline, LOS alarm, router freeze, outage' },
  { to: '/commands', icon: ic.terminal, title: 'Network commands', text: 'Ping, traceroute, IP renew, DNS' },
  { to: '/lights', icon: ic.lightbulb, title: 'Light guide', text: 'ONT and router lights explained' },
]

export function Home() {
  return (
    <div className="page">
      <section className="hero">
        <Caption>VTL Support Toolkit</Caption>
        <h1>What are you working on?</h1>
        <p>Practise on the real screens, then guide the client step by step.</p>
      </section>

      <div className="feature-grid">
        <Link to="/tenda" className="card feature tenda">
          <span className="feature-top">
            <span className="feature-icon"><Icon icon={ic.router} size={40} /></span>
            <span className="feature-brand"><TendaLogo /></span>
          </span>
          <span className="feature-title">Tenda Router</span>
          <span className="feature-text">Setup, Wi-Fi password, packet loss and migration on the real Tenda screens.</span>
          <span className="feature-list">
            <span>PPPoE setup</span><span>Wi-Fi password</span><span>Packet loss</span><span>Migration</span>
          </span>
          <span className="feature-go">Open Tenda Router<Icon icon={ic.arrowForward} size={20} /></span>
        </Link>

        <Link to="/poe" className="card feature poe">
          <span className="feature-top">
            <span className="feature-icon"><Icon icon={ic.electrical} size={40} /></span>
          </span>
          <span className="feature-title">PoE Connection</span>
          <span className="feature-text">Setup and step-by-step fixes when the WAN light is off.</span>
          <span className="feature-list">
            <span>WAN light check</span><span>Bypass test</span>
          </span>
          <span className="feature-go">Open PoE guide<Icon icon={ic.arrowForward} size={20} /></span>
        </Link>
      </div>

      <section className="section">
        <div className="section-head"><Caption>More tools</Caption></div>
        <div className="more-grid">
          {MORE.map(m => (
            <Link key={m.to} to={m.to} className="card more">
              <span className="more-icon"><Icon icon={m.icon} size={24} /></span>
              <span className="row-text">
                <span className="row-title">{m.title}</span>
                <span className="row-sub">{m.text}</span>
              </span>
              <Icon icon={ic.chevronRight} size={20} className="chev" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
