import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CircleCheck, Search } from 'lucide-react'
import { Shell, Logo } from '../components/Shell'
import { COUNTERS, EQUIPMENT, FAULTS, PROCEDURES, RECENT, type Card } from '../data'

function matches(card: Card, q: string) {
  if (!q) return true
  const hay = `${card.title} ${card.desc} ${card.tag}`.toLowerCase()
  return q.split(/\s+/).every(word => hay.includes(word))
}

function CardButton({ card, stacked = false }: { card: Card; stacked?: boolean }) {
  const navigate = useNavigate()
  const { icon: Icon, title, desc, tag, time, to } = card
  const iconEl = <span className="card-icon"><Icon size={19} /></span>
  const tagEl = <span className="card-tag-row"><span className="tag">{tag}</span></span>

  return (
    <button type="button" className={stacked ? 'card stacked' : 'card'} onClick={() => to && navigate(to)}>
      {iconEl}
      {stacked ? (
        <>
          <span className="card-body">
            <span className="card-title">{title}</span>
            <span className="card-desc">{desc}</span>
          </span>
          {tagEl}
        </>
      ) : (
        <span className="card-body">
          <span className="card-title">{title}</span>
          <span className="card-desc">{desc}</span>
          {tagEl}
        </span>
      )}
      <span className="card-time">avg. {time}</span>
    </button>
  )
}

function CardSection({ id, title, cards, variant }: {
  id: string
  title: string
  cards: Card[]
  variant?: 'equipment'
}) {
  if (cards.length === 0) return null
  return (
    <section className="card-section" id={id} aria-labelledby={`${id}-h`}>
      <div className="section-head">
        <h2 id={`${id}-h`}>{title}</h2>
        <span className="count">{cards.length}</span>
      </div>
      <div className={variant ? `card-grid ${variant}` : 'card-grid'}>
        {cards.map(c => <CardButton key={c.title} card={c} stacked={variant === 'equipment'} />)}
      </div>
    </section>
  )
}

export function Home() {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const location = useLocation()
  const q = query.trim().toLowerCase()

  const [faults, equipment, procedures] = useMemo(
    () => [FAULTS, EQUIPMENT, PROCEDURES].map(list => list.filter(c => matches(c, q))),
    [q],
  )
  const empty = faults.length + equipment.length + procedures.length === 0

  // "/" focuses the search from anywhere on the page, like the hint in the field says.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) && !t.isContentEditable) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Sidebar links like /#procedures scroll to their section.
  useEffect(() => {
    const id = location.hash.slice(1)
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else if ((location.state as { focusSearch?: boolean } | null)?.focusSearch) inputRef.current?.focus()
  }, [location])

  return (
    <Shell nav="home" tab="home">
      <div className="main-scroll">
        <div className="home">
          <div className="home-work">
            <div className="home-intro">
              <h1>What is the client reporting?</h1>
              <label className="search">
                <Search size={20} />
                <span className="sr-only">Search faults, equipment and procedures</span>
                <input
                  id="fault-search"
                  ref={inputRef}
                  type="search"
                  autoFocus
                  autoComplete="off"
                  placeholder="Describe the fault, or search by equipment…"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Escape') setQuery('') }}
                />
                <span className="kbd" aria-hidden>/</span>
              </label>
            </div>

            <CardSection id="common-faults" title="COMMON FAULTS" cards={faults} />
            <CardSection id="by-equipment" title="BY EQUIPMENT" cards={equipment} variant="equipment" />
            <CardSection id="procedures" title="PROCEDURES" cards={procedures} />
            {empty && <p className="no-results">Nothing matches “{query.trim()}”. Try the equipment name or the light colour the client sees.</p>}
          </div>

          <aside className="panel home-aside" aria-label="Network overview">
            <div>
              <Logo large />
              <p className="blurb">Step-by-step fault finding for live calls. Pick the symptom and follow the prompts.</p>
            </div>
            <div className="counters">
              {COUNTERS.map(c => (
                <div className="counter" key={c.label}>
                  <span className={`status-dot ${c.status}`} />
                  <span className="counter-value">{c.value}</span>
                  <span className="counter-label">{c.label}</span>
                </div>
              ))}
            </div>
            <div className="divider" />
            <div className="recent">
              <div className="recent-head">
                <h2>Recent resolutions</h2>
                <a href="#recent">View all</a>
              </div>
              <ul className="recent-list">
                {RECENT.map(r => (
                  <li className="recent-item" key={r.ref}>
                    <CircleCheck size={18} />
                    <div className="recent-body">
                      <div className="recent-meta">
                        <span className="recent-ref mono">{r.ref}</span>
                        <span className="recent-when">{r.when}</span>
                      </div>
                      <div className="recent-fault">{r.fault}</div>
                      <div className="recent-agent">{r.agent}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </Shell>
  )
}
