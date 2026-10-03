import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, ic } from '../../icons'
import { Phone } from '../../sim/Phone'
import { TendaShell, TendaStatus } from '../../sim/Tenda'

interface Item { text: string; link?: { to: string; label: string } }
interface Phase { title: string; when: string; items: Item[] }

const PHASES: Phase[] = [
  {
    title: 'Before you swap: record the old router',
    when: 'On the old router',
    items: [
      { text: 'Log in at 192.168.0.1 with the PPPoE username as the login password.' },
      { text: 'Status page: note the WAN MAC under System Info and the number of attached devices.' },
      { text: 'Wireless Settings: note the current WiFi Name and WiFi Password exactly (case matters).' },
      { text: 'Note any special settings the client relies on: Bandwidth Control, Parental Controls, port forwarding under Advanced.' },
      { text: 'Confirm the PPPoE username and password from the account record. The router hides the password.' },
    ],
  },
  {
    title: 'Swap the router',
    when: 'On site',
    items: [
      { text: 'Switch off the old router and unplug the cable from its WAN port.' },
      { text: 'Plug the same cable (from the PoE LAN port or ONT LAN port) into the WAN port of the new router.' },
      { text: 'Power on the new router and wait 2 minutes.' },
    ],
  },
  {
    title: 'Set up the new router',
    when: 'On the new router',
    items: [
      { text: 'Run the setup with the same PPPoE username and password.', link: { to: '/tenda/setup', label: 'Open the setup simulator' } },
      { text: 'Use the SAME WiFi name and password as the old router, so every device reconnects automatically.' },
      { text: 'Set the login password to the PPPoE username and enable Remote Web Management.' },
      { text: 'Re-apply any special settings you recorded.' },
    ],
  },
  {
    title: 'Check and close',
    when: 'Before you leave',
    items: [
      { text: 'Status shows “You can surf the Internet” and the WAN light blinks.' },
      { text: 'Run a packet-loss test: ping 8.8.8.8 -n 50 shows 0% loss.', link: { to: '/tenda/packet-loss', label: 'Open the ping simulator' } },
      { text: 'Attached Devices count is back to what it was before.' },
      { text: 'Update the client record with the new router’s serial number and WAN MAC.' },
      { text: 'If PPPoE won’t connect (“already online”), ask the NOC to clear the old session, then retry.' },
    ],
  },
]

export function TendaMigration() {
  const [done, setDone] = useState<Record<string, boolean>>({})
  const total = PHASES.reduce((n, p) => n + p.items.length, 0)
  const count = Object.values(done).filter(Boolean).length

  return (
    <div className="page">
      <Link to="/tenda" className="back-link"><Icon icon={ic.arrowBack} size={18} />Tenda Router</Link>
      <header className="wt-head">
        <span className="eyebrow tone-amber">Tenda Router · Migration</span>
        <h1>Migrate a client to a new router</h1>
        <p>Replacing or upgrading the client’s Tenda router without losing their settings. The same steps apply when the client moves to a new connection: only the cable into the WAN port changes.</p>
      </header>

      <div className="mig">
        <div className="mig-list">
          <div className="card mig-progress">
            <span><b>{count}</b> of {total} done</span>
            <div className="progress-bar"><span style={{ width: `${(count / total) * 100}%` }} /></div>
          </div>
          {PHASES.map((p, pi) => (
            <section key={p.title} className="card mig-phase">
              <header>
                <span className="mig-num">{pi + 1}</span>
                <div><span className="muted small">{p.when}</span><h2>{p.title}</h2></div>
              </header>
              <ul className="checklist">
                {p.items.map((it, k) => {
                  const key = `${pi}-${k}`
                  return (
                    <li key={key}>
                      <button type="button" role="checkbox" aria-checked={!!done[key]} className={done[key] ? 'check done' : 'check'} onClick={() => setDone(d => ({ ...d, [key]: !d[key] }))}>
                        <Icon icon={done[key] ? ic.checkBox : ic.checkBoxBlank} size={20} />
                        <span>{it.text}</span>
                      </button>
                      {it.link && <Link to={it.link.to} className="mig-link">{it.link.label}<Icon icon={ic.arrowForward} size={15} /></Link>}
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>

        <aside className="mig-side">
          <div className="card mig-tip">
            <h3><Icon icon={ic.tips} size={20} />Where to find what to record</h3>
            <p>The <b>Status</b> page shows the WAN MAC and attached devices. Record them before you unplug anything.</p>
          </div>
          <Phone url="192.168.0.1/index.html">
            <TendaShell page="status" menuOpen={false} onToggleMenu={() => {}} onPick={() => {}}>
              <TendaStatus />
            </TendaShell>
          </Phone>
        </aside>
      </div>
    </div>
  )
}
