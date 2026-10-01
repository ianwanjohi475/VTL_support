import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { GUIDES } from '../data/guides'
import { ALL_COMMANDS } from '../data/commands'
import { INCIDENTS } from '../data/incidents'
import { ROUTER_TASKS } from '../data/router'
import { Caption, CopyButton, SeverityBadge, Tile } from '../components/ui'
import { Icon, ic } from '../icons'

const words = (q: string) => q.toLowerCase().split(/\s+/).filter(Boolean)
const hit = (hay: string, q: string) => words(q).every(w => hay.toLowerCase().includes(w))

const POPULAR = ['no-internet', 'slow', 'router-frozen', 'red-los']
const ADDRESSES: [string, string][] = [
  ['Router (Tenda)', '192.168.0.1'],
  ['ONT (Huawei)', '192.168.100.1'],
  ['Primary DNS', '8.8.8.8'],
  ['Secondary DNS', '1.1.1.1'],
]

export function Home() {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const q = query.trim()

  const results = useMemo(() => {
    if (!q) return []
    return [
      ...GUIDES.filter(g => hit(`${g.title} ${g.summary} ${g.category} ${g.keywords}`, q))
        .map(g => ({ key: g.slug, to: `/guides/${g.slug}`, title: g.title, sub: g.summary, kind: 'Guide', icon: g.icon, tone: g.tone })),
      ...INCIDENTS.filter(i => hit(`${i.title} ${i.short} incident outage`, q))
        .map(i => ({ key: i.slug, to: `/incidents/${i.slug}`, title: i.title, sub: i.short, kind: 'Incident', icon: i.icon, tone: i.tone })),
      ...ROUTER_TASKS.filter(t => hit(`${t.title} ${t.summary} router settings`, q))
        .map(t => ({ key: t.slug, to: `/router#${t.slug}`, title: t.title, sub: t.summary, kind: 'Router', icon: t.icon, tone: t.tone })),
      ...ALL_COMMANDS.filter(c => hit(`${c.title} ${c.purpose} ${c.win} ${c.mac ?? ''}`, q))
        .map(c => ({ key: c.id, to: `/commands#${c.id}`, title: c.title, sub: c.win.split('\n')[0], kind: 'Command', icon: ic.terminal, tone: 'slate' as const })),
    ]
  }, [q])

  // "/" jumps to the search box.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="page">
      <section className="hero">
        <Caption>VTL Support Toolkit</Caption>
        <h1>What is the client experiencing?</h1>
        <p>Pick the symptom and follow the steps with the client. Every guide adapts to their answers.</p>
        <label className="search">
          <Icon icon={ic.search} size={20} className="search-icon" />
          <span className="sr-only">Search guides, incidents, router tasks and commands</span>
          <input
            ref={inputRef}
            type="search"
            autoComplete="off"
            placeholder="Search symptoms, incidents or commands…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Escape') setQuery('') }}
          />
          <kbd className="kbd" aria-hidden>/</kbd>
        </label>
        <div className="chips">
          <span className="chips-label">Popular:</span>
          {POPULAR.map(slug => {
            const g = GUIDES.find(x => x.slug === slug)!
            return <Link key={slug} to={`/guides/${slug}`} className="chip">{g.title}</Link>
          })}
        </div>
      </section>

      {q ? (
        <section className="section" aria-live="polite">
          <div className="section-head"><Caption>Results</Caption><span className="muted">{results.length} for “{q}”</span></div>
          {results.length === 0 ? (
            <div className="card empty">No matches. Try a simpler word like “wifi”, “slow”, “LOS” or “ping”.</div>
          ) : (
            <ul className="card list">
              {results.map(r => (
                <li key={r.kind + r.key}>
                  <Link to={r.to} className="row">
                    <Tile icon={r.icon} tone={r.tone} size="sm" />
                    <span className="row-text">
                      <span className="row-title">{r.title}</span>
                      <span className="row-sub">{r.sub}</span>
                    </span>
                    <span className="pill">{r.kind}</span>
                    <Icon icon={ic.chevronRight} size={16} className="chev" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <>
          <section className="section">
            <div className="section-head">
              <Caption>Troubleshooting guides</Caption>
              <span className="muted">{GUIDES.length} step-by-step guides</span>
            </div>
            <div className="guide-grid">
              {GUIDES.map(g => (
                <Link key={g.slug} to={`/guides/${g.slug}`} className={`card guide-card tone-${g.tone}`}>
                  <Tile icon={g.icon} tone={g.tone} />
                  <span className="guide-title">{g.title}</span>
                  <span className="guide-summary">{g.summary}</span>
                  <span className="guide-foot">
                    <span className="pill tone-pill">{g.category}</span>
                    <span className="muted">~{g.minutes} min</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="section widgets">
            <article className="card widget">
              <header className="widget-head">
                <span className="widget-title"><Icon icon={ic.crisisAlert} size={20} />Incident response</span>
                <Link to="/incidents" className="widget-link">All<Icon icon={ic.arrowForward} size={14} /></Link>
              </header>
              <ul className="widget-list">
                {INCIDENTS.map(i => (
                  <li key={i.slug}>
                    <Link to={`/incidents/${i.slug}`} className="row compact">
                      <Tile icon={i.icon} tone={i.tone} size="sm" />
                      <span className="row-text">
                        <span className="row-title">{i.title}</span>
                        <span className="row-sub">Respond in {i.respond}</span>
                      </span>
                      <SeverityBadge severity={i.severity} />
                    </Link>
                  </li>
                ))}
              </ul>
            </article>

            <article className="card widget">
              <header className="widget-head">
                <span className="widget-title"><Icon icon={ic.build} size={20} />Router setup</span>
                <Link to="/router" className="widget-link">All<Icon icon={ic.arrowForward} size={14} /></Link>
              </header>
              <ul className="widget-list">
                {ROUTER_TASKS.filter(t => ['pppoe', 'wifi-name', 'channel', 'reset'].includes(t.slug)).map(t => (
                  <li key={t.slug}>
                    <Link to={`/router#${t.slug}`} className="row compact">
                      <Tile icon={t.icon} tone={t.tone} size="sm" />
                      <span className="row-text">
                        <span className="row-title">{t.title}</span>
                        <span className="row-sub">{t.summary}</span>
                      </span>
                      <Icon icon={ic.chevronRight} size={16} className="chev" />
                    </Link>
                  </li>
                ))}
              </ul>
            </article>

            <article className="card widget">
              <header className="widget-head">
                <span className="widget-title"><Icon icon={ic.terminal} size={20} />Quick reference</span>
              </header>
              <dl className="addr-list">
                {ADDRESSES.map(([label, value]) => (
                  <div key={label} className="addr">
                    <dt>{label}</dt>
                    <dd><code>{value}</code><CopyButton text={value} label="" /></dd>
                  </div>
                ))}
              </dl>
              <div className="widget-actions">
                <Link to="/commands" className="btn btn-soft"><Icon icon={ic.terminal} size={17} />Commands</Link>
                <Link to="/lights" className="btn btn-soft"><Icon icon={ic.lightbulb} size={17} />Light guide</Link>
              </div>
            </article>
          </section>
        </>
      )}
    </div>
  )
}
