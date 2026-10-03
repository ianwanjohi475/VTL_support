import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Icon, ic } from '../icons'
import { CopyButton } from '../components/ui'

export interface WtStep {
  title: string
  text: ReactNode
  /** Values to type, shown with copy buttons. */
  sample?: [string, string][]
}

export function Walkthrough({ eyebrow, title, intro, steps, index, done, finish, onAuto, onRestart, device }: {
  eyebrow: string
  title: string
  intro: string
  steps: WtStep[]
  index: number
  done: boolean
  finish: ReactNode
  onAuto: () => void
  onRestart: () => void
  device: ReactNode
}) {
  const step = steps[Math.min(index, steps.length - 1)]
  const pct = done ? 100 : Math.round((index / steps.length) * 100)

  return (
    <div className="page">
      <Link to="/tenda" className="back-link"><Icon icon={ic.arrowBack} size={18} />Tenda Router</Link>
      <header className="wt-head">
        <span className="eyebrow tone-amber">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{intro}</p>
      </header>

      <div className="wt">
        <section className={done ? 'card wt-card done' : 'card wt-card'} aria-live="polite">
          <div className="wt-progress"><span style={{ width: `${pct}%` }} /></div>
          {done ? (
            finish
          ) : (
            <>
              <span className="wt-count">Step {index + 1} of {steps.length}</span>
              <h2>{step.title}</h2>
              <div className="wt-text">{step.text}</div>
              {step.sample && (
                <dl className="wt-sample">
                  {step.sample.map(([k, v]) => (
                    <div key={k}><dt>{k}</dt><dd><code>{v}</code><CopyButton text={v} label="" /></dd></div>
                  ))}
                </dl>
              )}
              <div className="wt-actions">
                <button type="button" className="btn btn-primary" onClick={onAuto}>
                  <Icon icon={ic.playArrow} size={20} />Do it for me
                </button>
                <button type="button" className="btn btn-ghost" onClick={onRestart}>
                  <Icon icon={ic.restart} size={18} />Restart
                </button>
              </div>
              <p className="wt-tip"><Icon icon={ic.tips} size={18} />Try it yourself on the phone. The highlighted part is what to tap or fill in next.</p>
            </>
          )}
        </section>

        <div className="wt-device">
          {device}
          <p className="sim-note">Training simulation. Nothing typed here is sent anywhere.</p>
        </div>

        <ol className="card wt-steps">
          {steps.map((s, i) => (
            <li key={s.title} className={done || i < index ? 'done' : i === index ? 'current' : undefined}>
              <span className="wt-dot">{done || i < index ? <Icon icon={ic.check} size={14} /> : i + 1}</span>
              <span>{s.title}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

/** Shared finish card. */
export function Finish({ title, children, next }: { title: string; children: ReactNode; next?: ReactNode }) {
  return (
    <div className="wt-finish">
      <span className="wt-finish-badge"><Icon icon={ic.checkCircle} size={22} />Complete</span>
      <h2>{title}</h2>
      <div className="wt-text">{children}</div>
      {next && <div className="wt-actions">{next}</div>}
    </div>
  )
}

/** Accepts what a trainee might type for the router address. */
export function isRouterAddress(v: string) {
  const s = v.toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  return s === '192.168.0.1' || s === 'tendawifi.com'
}
