import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Cmd, RunDialog, type Scenario } from '../../sim/Cmd'
import { Icon, ic } from '../../icons'
import { CopyButton } from '../../components/ui'

const COMMANDS = [
  { cmd: 'ping 192.168.0.1', title: 'Ping the router', why: 'Checks the link to the router.' },
  { cmd: 'ping 8.8.8.8 -n 50', title: 'Packet-loss test (50 pings)', why: 'Counts lost packets to the internet.' },
  { cmd: 'ping 8.8.8.8 -t', title: 'Continuous ping', why: 'Runs until you press Ctrl+C.' },
]

const SCENARIOS: { id: Scenario; label: string }[] = [
  { id: 'good', label: 'Good line' },
  { id: 'loss', label: 'Packet loss' },
  { id: 'down', label: 'No internet' },
]

export function TendaPacketLoss() {
  const [open, setOpen] = useState(false)
  const [runValue, setRunValue] = useState('')
  const [scenario, setScenario] = useState<Scenario>('good')
  const [queued, setQueued] = useState<{ cmd: string; id: number }>()
  const [ran, setRan] = useState<string[]>([])

  const openCmd = () => { setRunValue('cmd'); setOpen(true) }
  const type = (cmd: string) => { if (!open) setOpen(true); setQueued({ cmd, id: Date.now() }) }

  return (
    <div className="page">
      <Link to="/tenda" className="back-link"><Icon icon={ic.arrowBack} size={18} />Tenda Router</Link>
      <header className="wt-head">
        <span className="eyebrow tone-amber">Tenda Router · Packet loss</span>
        <h1>Test for packet loss with ping</h1>
        <p>Open Command Prompt, type <b>ping</b> and an IP address, read the loss.</p>
      </header>

      <div className="pl">
        <div className="pl-guide">
          <section className="card pl-step">
            <span className="pl-num">1</span>
            <div>
              <h2>Open Command Prompt</h2>
              <p>Press <kbd className="key">⊞ Win</kbd> + <kbd className="key">R</kbd>, type <b>cmd</b>, press <kbd className="key">Enter</kbd>.</p>
              {!open && <button type="button" className="btn btn-primary" onClick={openCmd}><Icon icon={ic.playArrow} size={20} />Do it for me</button>}
              {open && <p className="pl-ok"><Icon icon={ic.checkCircle} size={18} />Command Prompt is open</p>}
            </div>
          </section>

          <section className="card pl-step">
            <span className="pl-num">2</span>
            <div>
              <h2>Type ping and an IP address</h2>
              <p>Tap a command to type it in, or type it yourself.</p>
              <ul className="pl-cmds">
                {COMMANDS.map(c => (
                  <li key={c.cmd} className={ran.includes(c.cmd) ? 'ran' : undefined}>
                    <button type="button" className="pl-cmd" onClick={() => type(c.cmd)}>
                      <code>{c.cmd}</code>
                      <span>{c.title}</span>
                    </button>
                    <CopyButton text={c.cmd} label="" />
                    <p className="muted small">{c.why}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="card pl-step">
            <span className="pl-num">3</span>
            <div>
              <h2>Read the result</h2>
              <p>Look at <code>Lost = x (y% loss)</code>.</p>
              <table className="pl-read">
                <tbody>
                  <tr><td><span className="status ok"><span className="dot" />0% loss</span></td><td>Good line.</td></tr>
                  <tr><td><span className="status fault"><span className="dot" />Over 2%</span></td><td>Packet loss. Router clean but 8.8.8.8 losing? Check the PoE connection, then escalate.</td></tr>
                  <tr><td><span className="status fault"><span className="dot" />Timed out</span></td><td>No internet on the line. Check the WAN light.</td></tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="pl-device">
          <div className="pl-scenario">
            <span>Practice with:</span>
            <div className="segmented" role="radiogroup" aria-label="Line condition">
              {SCENARIOS.map(sc => (
                <button key={sc.id} type="button" role="radio" aria-checked={scenario === sc.id} className={scenario === sc.id ? 'active' : undefined} onClick={() => setScenario(sc.id)}>
                  {sc.label}
                </button>
              ))}
            </div>
          </div>
          <div className="desktop">
            {open ? (
              <Cmd scenario={scenario} queued={queued} onRan={c => setRan(r => [...r, c])} />
            ) : (
              <RunDialog value={runValue} onChange={setRunValue} onOk={() => runValue.trim().toLowerCase() === 'cmd' && setOpen(true)} hl />
            )}
            <div className="taskbar" aria-hidden>
              <span className="tb-start"><Icon icon={ic.windows} size={18} /></span>
              <span className="tb-search"><Icon icon={ic.search} size={14} />Search</span>
              {open && <span className="tb-app"><Icon icon={ic.terminal} size={16} /></span>}
              <span className="tb-time">18:01</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
