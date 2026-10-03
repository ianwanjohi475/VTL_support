import { Link } from 'react-router-dom'
import { Caption } from '../components/ui'
import { Icon, ic } from '../icons'

const SETUP = [
  { from: 'Cable from outside switch', to: 'POE port', icon: ic.cable },
  { from: 'Injector LAN port', to: 'Router WAN port', icon: ic.lan },
  { from: 'WAN light blinking', to: 'Internet is coming in', icon: ic.checkCircle },
]

type Result = 'ok' | 'fix' | 'esc'
const STEPS: { title: string; text: string; outcomes: { when: string; then: string; result?: Result }[] }[] = [
  {
    title: 'Check the WAN light on the router',
    text: 'Ask the client to look at the WAN light.',
    outcomes: [
      { when: 'Blinking', then: 'Internet is reaching the router. Check the router instead.', result: 'ok' },
      { when: 'Off', then: 'Go to step 2.' },
    ],
  },
  {
    title: 'Push all plugs in firmly',
    text: 'Outside cable in the POE port, patch cord in the LAN port, patch cord in the router’s WAN port. Check the PoE power light is on.',
    outcomes: [
      { when: 'WAN blinks now', then: 'It was a loose connection.', result: 'ok' },
      { when: 'Still off', then: 'Go to step 3.' },
    ],
  },
  {
    title: 'Bypass the PoE',
    text: 'Unplug the outside cable from the POE port and plug it straight into the router’s WAN port.',
    outcomes: [
      { when: 'WAN blinks and internet works', then: 'The fault is the patch cord, the PoE, or a loose connection. Go to step 4.' },
      { when: 'WAN still off', then: 'Fault is outside (cable or switch). Put the cable back and escalate to the field team.', result: 'esc' },
    ],
  },
  {
    title: 'Replace the faulty part',
    text: 'Put the outside cable back in the POE port and change the patch cord.',
    outcomes: [
      { when: 'WAN blinks', then: 'The patch cord was faulty.', result: 'fix' },
      { when: 'Still off', then: 'The PoE injector is faulty. Replace it.', result: 'fix' },
    ],
  },
]

const BADGE: Record<Result, { label: string; cls: string }> = {
  ok: { label: 'Resolved', cls: 'ok' },
  fix: { label: 'Fix', cls: 'check' },
  esc: { label: 'Escalate', cls: 'fault' },
}

export function Poe() {
  return (
    <div className="page">
      <header className="page-head">
        <div>
          <Caption>PoE Connection</Caption>
          <h1>PoE connection</h1>
        </div>
      </header>

      <section className="card poe-setup">
        <h2 className="section-title">Setup</h2>
        <ol className="poe-chain">
          {SETUP.map(s => (
            <li key={s.from}>
              <span className="poe-chain-icon"><Icon icon={s.icon} size={24} /></span>
              <span className="poe-chain-text"><b>{s.from}</b> <Icon icon={ic.arrowForward} size={18} className="poe-chain-arrow" /> <b>{s.to}</b></span>
            </li>
          ))}
        </ol>
      </section>

      <section className="section">
        <div className="section-head"><h2 className="section-title">No internet: troubleshooting</h2></div>
        <ol className="poe-list">
          {STEPS.map((s, k) => (
            <li key={s.title} className="card poe-item">
              <span className="pl-num">{k + 1}</span>
              <div className="poe-item-body">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <ul className="poe-outcomes">
                  {s.outcomes.map(o => (
                    <li key={o.when}>
                      <span className="poe-when">{o.when}</span>
                      <span className="poe-then">{o.then}</span>
                      {o.result && <span className={`status ${BADGE[o.result].cls}`}><span className="dot" />{BADGE[o.result].label}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
        <p className="footnote"><Link to="/tenda">Router is fine but still no internet? Open the Tenda guides.</Link></p>
      </section>
    </div>
  )
}
