import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faChevronRight, faLightbulb, faMagnifyingGlass, faTerminal } from '@fortawesome/free-solid-svg-icons'
import { GUIDES } from '../data/guides'
import { ALL_COMMANDS } from '../data/commands'

const words = (q: string) => q.toLowerCase().split(/\s+/).filter(Boolean)
const hit = (hay: string, q: string) => words(q).every(w => hay.toLowerCase().includes(w))

export function Home() {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const q = query.trim()

  const guideHits = useMemo(
    () => (q ? GUIDES.filter(g => hit(`${g.title} ${g.summary} ${g.category} ${g.keywords}`, q)) : []),
    [q],
  )
  const commandHits = useMemo(
    () => (q ? ALL_COMMANDS.filter(c => hit(`${c.title} ${c.purpose} ${c.win} ${c.mac ?? ''}`, q)) : []),
    [q],
  )

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
        <h1>What is the client experiencing?</h1>
        <p>Pick the symptom and follow the steps with the client. Each guide adapts to their answers.</p>
        <label className="search">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
          <span className="sr-only">Search guides and commands</span>
          <input
            ref={inputRef}
            type="search"
            autoFocus
            autoComplete="off"
            placeholder="Search symptoms or commands…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Escape') setQuery('') }}
          />
          <kbd className="kbd" aria-hidden>/</kbd>
        </label>
      </section>

      {q ? (
        <section className="section" aria-live="polite">
          <div className="section-head"><h2>Results for “{q}”</h2></div>
          {guideHits.length + commandHits.length === 0 ? (
            <p className="empty">No matches. Try a simpler word like “wifi”, “slow” or “light”.</p>
          ) : (
            <ul className="result-list">
              {guideHits.map(g => (
                <li key={g.slug}>
                  <Link to={`/guides/${g.slug}`} className="result">
                    <span className="result-icon"><FontAwesomeIcon icon={g.icon} /></span>
                    <span className="result-text">
                      <span className="result-title">{g.title}</span>
                      <span className="result-sub">{g.summary}</span>
                    </span>
                    <span className="badge">Guide</span>
                    <FontAwesomeIcon icon={faChevronRight} className="chev" />
                  </Link>
                </li>
              ))}
              {commandHits.map(c => (
                <li key={c.id}>
                  <Link to={`/commands#${c.id}`} className="result">
                    <span className="result-icon"><FontAwesomeIcon icon={faTerminal} /></span>
                    <span className="result-text">
                      <span className="result-title">{c.title}</span>
                      <span className="result-sub mono">{c.win.split('\n')[0]}</span>
                    </span>
                    <span className="badge">Command</span>
                    <FontAwesomeIcon icon={faChevronRight} className="chev" />
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
              <h2>Troubleshooting guides</h2>
              <span className="muted">{GUIDES.length} guides</span>
            </div>
            <div className="guide-grid">
              {GUIDES.map(g => (
                <Link key={g.slug} to={`/guides/${g.slug}`} className="guide-card">
                  <span className="guide-icon"><FontAwesomeIcon icon={g.icon} /></span>
                  <span className="guide-title">{g.title}</span>
                  <span className="guide-summary">{g.summary}</span>
                  <span className="guide-foot">
                    <span className="badge">{g.category}</span>
                    <span className="muted">~{g.minutes} min</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="section">
            <div className="section-head"><h2>Reference</h2></div>
            <div className="tool-grid">
              <Link to="/commands" className="tool-card">
                <span className="tool-icon"><FontAwesomeIcon icon={faTerminal} /></span>
                <span className="tool-text">
                  <span className="tool-title">Network commands</span>
                  <span className="tool-sub">Ping, traceroute, IP renew, DNS flush, Wi-Fi signal. Windows and macOS, with how to read the results.</span>
                </span>
                <FontAwesomeIcon icon={faArrowRight} className="chev" />
              </Link>
              <Link to="/lights" className="tool-card">
                <span className="tool-icon"><FontAwesomeIcon icon={faLightbulb} /></span>
                <span className="tool-text">
                  <span className="tool-title">Light guide</span>
                  <span className="tool-sub">What every light on the Huawei ONT and Tenda router means, and what to do next.</span>
                </span>
                <FontAwesomeIcon icon={faArrowRight} className="chev" />
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
