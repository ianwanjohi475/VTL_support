import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ROUTER_TASKS } from '../data/router'
import { Caption, CopyButton, Tile } from '../components/ui'
import { Icon, ic } from '../icons'

export function Router() {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hash])

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <Caption>Router setup</Caption>
          <h1>Change router settings</h1>
          <p>Step-by-step changes on the client’s Tenda router. Menu names can differ slightly between models.</p>
        </div>
      </header>

      <div className="banner">
        <Icon icon={ic.info} size={18} />
        <span>All changes start by signing in at <strong>192.168.0.1</strong> from a device connected to the router.</span>
      </div>

      <div className="router-layout">
        <nav className="toc card" aria-label="Router tasks">
          <span className="toc-title">Tasks</span>
          {ROUTER_TASKS.map(t => (
            <a key={t.slug} href={`#${t.slug}`} className={hash === `#${t.slug}` ? 'toc-link active' : 'toc-link'}>
              <Tile icon={t.icon} tone={t.tone} size="sm" />{t.title}
            </a>
          ))}
        </nav>

        <div className="task-list">
          {ROUTER_TASKS.map((t, idx) => (
            <article key={t.slug} id={t.slug} className="card task">
              <header className="task-head">
                <Tile icon={t.icon} tone={t.tone} />
                <div className="task-titles">
                  <span className="task-num">Task {idx + 1}</span>
                  <h2>{t.title}</h2>
                  <p className="muted">{t.summary}</p>
                </div>
                <CopyButton
                  text={[t.title, ...(t.path ? [`Menu: ${t.path}`] : []), ...t.steps.map((s, i) => `${i + 1}. ${s}`)].join('\n')}
                  label="Copy steps"
                />
              </header>

              {t.path && <div className="menu-path"><span>Menu</span>{t.path.split(' → ').map((p, i) => <span key={p} className="crumb">{i > 0 && <i>›</i>}{p}</span>)}</div>}

              <div className={t.settings ? 'task-body two' : 'task-body'}>
                <ol className="steps">
                  {t.steps.map((s, i) => <li key={s}><span className="step-n">{i + 1}</span><span>{s}</span></li>)}
                </ol>
                {t.settings && (
                  <div className="settings">
                    <div className="settings-title">Settings</div>
                    <dl>
                      {t.settings.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
                    </dl>
                  </div>
                )}
              </div>

              {t.warning && <div className="note warn"><Icon icon={ic.warning} size={18} /><span>{t.warning}</span></div>}
              {t.tip && <div className="note tip"><Icon icon={ic.lightbulb} size={18} /><span>{t.tip}</span></div>}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
