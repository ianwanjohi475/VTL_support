import { Link } from 'react-router-dom'
import { Icon, ic, type IconData } from '../../icons'
import { Caption, CopyButton } from '../../components/ui'
import { TendaLogo } from '../../sim/Tenda'

const TASKS: { to: string; icon: IconData; title: string; text: string; tag: string }[] = [
  { to: '/tenda/setup', icon: ic.settingsEthernet, title: 'Set up a new router', text: 'PPPoE username and password, Wi-Fi name and password, reconnect, login password and remote management.', tag: '10 steps' },
  { to: '/tenda/wifi-password', icon: ic.wifiPassword, title: 'Change the Wi-Fi password', text: 'Log in with the PPPoE username, go to Wireless Settings, save the new password and reconnect devices.', tag: '6 steps' },
  { to: '/tenda/packet-loss', icon: ic.terminal, title: 'Packet loss test (ping)', text: 'Open Command Prompt, type ping and an IP address, and read the loss percentage.', tag: 'Command Prompt' },
  { to: '/tenda/migration', icon: ic.swapHoriz, title: 'Migrate to a new router', text: 'Record the old router, swap it, set up the new one with the same details, then check and close.', tag: 'Checklist' },
]

export function TendaHub() {
  return (
    <div className="page">
      <header className="page-head">
        <div>
          <Caption>Tenda Router</Caption>
          <h1>Tenda router walkthroughs</h1>
          <p>Practise on a working copy of the Tenda phone interface, then guide the client through the same screens.</p>
        </div>
      </header>

      <div className="hub-facts">
        <div className="card fact">
          <span className="fact-label">Router address</span>
          <span className="fact-value"><code>192.168.0.1</code><CopyButton text="192.168.0.1" label="" /></span>
        </div>
        <div className="card fact">
          <span className="fact-label">Login password</span>
          <span className="fact-value">The client’s PPPoE username</span>
          <span className="muted small">e.g. <code>VTL005665</code></span>
        </div>
        <div className="card fact">
          <span className="fact-label">Remote management</span>
          <span className="fact-value">Always enabled</span>
          <span className="muted small">Administration → Remote Web Management</span>
        </div>
      </div>

      <div className="hub-grid">
        {TASKS.map((t, k) => (
          <Link key={t.to} to={t.to} className={k === 0 ? 'card hub-task featured' : 'card hub-task'}>
            <span className="hub-icon"><Icon icon={t.icon} size={30} /></span>
            <span className="hub-text">
              <span className="hub-title">{t.title}</span>
              <span className="hub-sub">{t.text}</span>
            </span>
            <span className="hub-foot">
              <span className="pill">{t.tag}</span>
              <span className="hub-go">Start<Icon icon={ic.arrowForward} size={17} /></span>
            </span>
          </Link>
        ))}
      </div>

      <p className="footnote hub-brand"><TendaLogo /> interface shown as a training simulation. Menu names match the Tenda phone interface; other models may differ slightly.</p>
    </div>
  )
}
