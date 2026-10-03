import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { GUIDES } from '../data/guides'
import { ALL_COMMANDS } from '../data/commands'
import { INCIDENTS } from '../data/incidents'
import { Caption, Tile } from '../components/ui'
import { Icon, ic } from '../icons'

const words = (q: string) => q.toLowerCase().split(/\s+/).filter(Boolean)
const hit = (hay: string, q: string) => words(q).every(w => hay.toLowerCase().includes(w))

export function Guides() {
  const [query, setQuery] = useState('')
  const q = query.trim()

  const results = useMemo(() => {
    if (!q) return []
    return [
      ...GUIDES.filter(g => hit(`${g.title} ${g.summary} ${g.category} ${g.keywords}`, q))
        .map(g => ({ key: g.slug, to: `/guides/${g.slug}`, title: g.title, sub: g.summary, kind: 'Guide', icon: g.icon, tone: g.tone })),
      ...INCIDENTS.filter(i => hit(`${i.title} ${i.short} incident outage`, q))
        .map(i => ({ key: i.slug, to: `/incidents/${i.slug}`, title: i.title, sub: i.short, kind: 'Incident', icon: i.icon, tone: i.tone })),
      ...ALL_COMMANDS.filter(c => hit(`${c.title} ${c.purpose} ${c.win} ${c.mac ?? ''}`, q))
        .map(c => ({ key: c.id, to: `/commands#${c.id}`, title: c.title, sub: c.win.split('\n')[0], kind: 'Command', icon: ic.terminal, tone: 'slate' as const })),
    ]
  }, [q])

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <Caption>Troubleshooting</Caption>
          <h1>Troubleshooting guides</h1>
          <p>Pick the client’s symptom. Each guide adapts to their answers and ends with a fix or an escalation.</p>
        </div>
      </header>

      <label className="search">
        <Icon icon={ic.search} size={22} className="search-icon" />
        <span className="sr-only">Search guides, incidents and commands</span>
        <input
          type="search"
          autoComplete="off"
          placeholder="Search symptoms, incidents or commands…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => { if (e.key === 'Escape') setQuery('') }}
        />
      </label>

      {q ? (
        <section className="section" aria-live="polite">
          <div className="section-head"><span className="muted">{results.length} results for “{q}”</span></div>
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
                    <Icon icon={ic.chevronRight} size={18} className="chev" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <section className="section">
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
      )}
    </div>
  )
}
