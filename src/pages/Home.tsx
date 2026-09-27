import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Shell } from '../components/Shell'
import { CATEGORIES, COUNTERS, type CategoryId, type Topic } from '../data'

function matches(t: Topic, q: string) {
  const hay = `${t.title} ${t.desc} ${t.tag}`.toLowerCase()
  return q.split(/\s+/).every(word => hay.includes(word))
}

function TopicRow({ topic, category }: { topic: Topic; category?: string }) {
  const navigate = useNavigate()
  const { title, desc, tag, time, to } = topic
  return (
    <li>
      <button type="button" className="topic" onClick={() => to && navigate(to)}>
        <span className="topic-main">
          <span className="topic-title">{title}</span>
          <span className="topic-desc">{desc}</span>
        </span>
        <span className="topic-meta">
          <span className="tag">{category ?? tag}</span>
          <span className="topic-time">{time}</span>
        </span>
        <ChevronRightIcon className="topic-chevron" aria-hidden />
      </button>
    </li>
  )
}

export function Home() {
  const [query, setQuery] = useState('')
  const [params, setParams] = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)
  const q = query.trim().toLowerCase()

  const tabParam = params.get('tab')
  const active: CategoryId = CATEGORIES.some(c => c.id === tabParam) ? (tabParam as CategoryId) : 'faults'
  const current = CATEGORIES.find(c => c.id === active)!

  const results = useMemo(
    () => (q ? CATEGORIES.flatMap(c => c.items.filter(t => matches(t, q)).map(t => ({ topic: t, category: c.label }))) : []),
    [q],
  )

  // "/" focuses the search from anywhere on the page.
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

  return (
    <Shell nav={active === 'faults' && !tabParam ? 'home' : active} tab={tabParam ? 'faults' : 'home'} title="Home">
      <div className="main-scroll">
        <div className="page home">
          <header className="page-head">
            <h1>What is the client reporting?</h1>
            <p>Pick the symptom and follow the steps with the client.</p>
          </header>

          <label className="search">
            <MagnifyingGlassIcon className="search-icon" aria-hidden />
            <span className="sr-only">Search faults, equipment and procedures</span>
            <input
              ref={inputRef}
              type="search"
              autoFocus
              autoComplete="off"
              placeholder="Describe the fault, or search by equipment…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Escape') setQuery('') }}
            />
            <kbd className="kbd" aria-hidden>/</kbd>
          </label>

          <dl className="stats">
            {COUNTERS.map(c => (
              <div className="stat" key={c.label}>
                <dt><span className={`dot ${c.status}`} />{c.label}</dt>
                <dd>{c.value}</dd>
              </div>
            ))}
          </dl>

          <section className="card">
            {q ? (
              <>
                <div className="card-head">
                  <h2>Results</h2>
                  <span className="muted">{results.length} {results.length === 1 ? 'match' : 'matches'}</span>
                </div>
                {results.length ? (
                  <ul className="topics">
                    {results.map(r => <TopicRow key={r.topic.title} topic={r.topic} category={r.category} />)}
                  </ul>
                ) : (
                  <p className="empty">Nothing matches “{query.trim()}”. Try the equipment name or the light colour the client sees.</p>
                )}
              </>
            ) : (
              <>
                <div className="tabs" role="tablist" aria-label="Browse by">
                  {CATEGORIES.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      role="tab"
                      aria-selected={c.id === active}
                      className={c.id === active ? 'tab-btn active' : 'tab-btn'}
                      onClick={() => setParams(c.id === 'faults' ? {} : { tab: c.id }, { replace: true })}
                    >
                      {c.label}<span className="count">{c.items.length}</span>
                    </button>
                  ))}
                </div>
                <ul className="topics" role="tabpanel">
                  {current.items.map(t => <TopicRow key={t.title} topic={t} />)}
                </ul>
              </>
            )}
          </section>
        </div>
      </div>
    </Shell>
  )
}
