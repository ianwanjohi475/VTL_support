import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, ChatText, CheckSquare, Clock, Hourglass, ListChecks, MagnifyingGlass, Megaphone,
  Square, Users, Warning,
} from '@phosphor-icons/react'
import { INCIDENTS, INCIDENT_BY_SLUG, type Incident } from '../data/incidents'
import { GUIDE_BY_SLUG } from '../data/guides'
import { Caption, CopyButton, SeverityBadge, Tile } from '../components/ui'

export function Incidents() {
  return (
    <div className="page">
      <header className="page-head">
        <div>
          <Caption>Incident response</Caption>
          <h1>When something goes wrong</h1>
          <p>What to do, who to tell and what to say when a client is offline, an LOS alarm fires, a router freezes or an area goes down.</p>
        </div>
      </header>

      <div className="incident-grid">
        {INCIDENTS.map(i => (
          <Link key={i.slug} to={`/incidents/${i.slug}`} className={`card incident-card tone-${i.tone}`}>
            <div className="incident-top">
              <Tile icon={i.icon} tone={i.tone} />
              <SeverityBadge severity={i.severity} />
            </div>
            <span className="guide-title">{i.title}</span>
            <span className="guide-summary">{i.short}</span>
            <dl className="mini-stats">
              <div><dt>Respond</dt><dd>{i.respond}</dd></div>
              <div><dt>Restore</dt><dd>{i.restore}</dd></div>
              <div><dt>Steps</dt><dd>{i.phases.length} phases</dd></div>
            </dl>
            <span className="card-cta">Open playbook<ArrowRight size={15} weight="bold" /></span>
          </Link>
        ))}
      </div>
      <p className="footnote">Response and restore targets are defaults. Set them to VTL’s SLA in <code>src/data/incidents.ts</code>.</p>
    </div>
  )
}

function Checklist({ items }: { items: string[] }) {
  const [done, setDone] = useState<boolean[]>(() => items.map(() => false))
  const count = done.filter(Boolean).length
  return (
    <>
      <div className="progress-bar" aria-hidden><span style={{ width: `${(count / items.length) * 100}%` }} /></div>
      <ul className="checklist">
        {items.map((it, i) => (
          <li key={it}>
            <button
              type="button"
              role="checkbox"
              aria-checked={done[i]}
              className={done[i] ? 'check done' : 'check'}
              onClick={() => setDone(d => d.map((v, j) => (j === i ? !v : v)))}
            >
              {done[i] ? <CheckSquare size={20} weight="fill" /> : <Square size={20} weight="regular" />}
              <span>{it}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="muted small">{count} of {items.length} done</p>
    </>
  )
}

export function IncidentDetail() {
  const { slug = '' } = useParams()
  const inc: Incident | undefined = INCIDENT_BY_SLUG[slug]

  if (!inc) {
    return (
      <div className="page">
        <div className="page-head"><div><h1>Incident not found</h1><p><Link to="/incidents">All incidents</Link></p></div></div>
      </div>
    )
  }
  const guide = inc.guide ? GUIDE_BY_SLUG[inc.guide] : undefined

  return (
    <div className="page">
      <Link to="/incidents" className="back-link"><ArrowLeft size={16} weight="bold" />All incidents</Link>
      <header className="detail-head">
        <Tile icon={inc.icon} tone={inc.tone} size="lg" />
        <div>
          <span className={`eyebrow tone-${inc.tone}`}>Incident playbook</span>
          <h1>{inc.title}</h1>
          <p>{inc.short}</p>
        </div>
      </header>

      <div className="stat-row">
        <div className="card stat"><Warning size={22} weight="duotone" /><span className="stat-label">Severity</span><SeverityBadge severity={inc.severity} /></div>
        <div className="card stat"><Clock size={22} weight="duotone" /><span className="stat-label">Respond within</span><span className="stat-value">{inc.respond}</span></div>
        <div className="card stat"><Hourglass size={22} weight="duotone" /><span className="stat-label">Restore target</span><span className="stat-value">{inc.restore}</span></div>
        <div className="card stat wide"><Users size={22} weight="duotone" /><span className="stat-label">Impact</span><span className="stat-text">{inc.impact}</span></div>
      </div>

      <div className="detail-layout">
        <div className="detail-main">
          <section className="card block">
            <h2 className="block-title"><MagnifyingGlass size={20} weight="duotone" />How you’ll spot it</h2>
            <ul className="sign-list">{inc.signs.map(s => <li key={s}>{s}</li>)}</ul>
          </section>

          <section className="card block">
            <h2 className="block-title"><ListChecks size={20} weight="duotone" />Response timeline</h2>
            <ol className="timeline">
              {inc.phases.map((p, i) => (
                <li key={p.title}>
                  <span className={`tl-dot tone-${inc.tone}`}>{i + 1}</span>
                  <div className="tl-body">
                    <div className="tl-head"><span className="tl-time">{p.time}</span><h3>{p.title}</h3></div>
                    <ul>{p.items.map(it => <li key={it}>{it}</li>)}</ul>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="detail-side">
          {guide && (
            <Link to={`/guides/${guide.slug}`} className={`card guide-cta tone-${guide.tone}`}>
              <Tile icon={guide.icon} tone={guide.tone} size="sm" />
              <span className="row-text">
                <span className="row-sub">Troubleshoot with the client</span>
                <span className="row-title">{guide.title}</span>
              </span>
              <ArrowRight size={18} weight="bold" className="chev" />
            </Link>
          )}

          <section className="card block">
            <h2 className="block-title"><Megaphone size={20} weight="duotone" />Who to notify</h2>
            <ul className="notify">
              {inc.notify.map(n => (
                <li key={n.who}><span className="notify-who">{n.who}</span><span className="muted">{n.when}</span></li>
              ))}
            </ul>
          </section>

          <section className="card block">
            <div className="block-head">
              <h2 className="block-title"><ChatText size={20} weight="duotone" />Message to the client</h2>
              <CopyButton text={inc.clientMessage} />
            </div>
            <blockquote className="message">{inc.clientMessage}</blockquote>
          </section>

          <section className="card block">
            <h2 className="block-title"><CheckSquare size={20} weight="duotone" />Before closing</h2>
            <Checklist key={inc.slug} items={inc.close} />
          </section>
        </aside>
      </div>
    </div>
  )
}
