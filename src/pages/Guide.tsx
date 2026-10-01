import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft, faArrowRight, faCheck, faChevronRight, faCircleCheck, faCircleInfo, faRotateLeft,
  faTriangleExclamation, faUser,
} from '@fortawesome/free-solid-svg-icons'
import { GUIDE_BY_SLUG, type Guide as GuideT, type OutcomeNode, type Option, type StepNode } from '../data/guides'
import { CodeBlock, CopyButton, PlatformSwitch } from '../components/CodeBlock'

interface Taken { node: string; answer: string }

const RESULT_META = {
  resolved: { label: 'Resolved', icon: faCircleCheck, cls: 'ok' },
  escalate: { label: 'Escalate', icon: faTriangleExclamation, cls: 'bad' },
  client: { label: 'Client-side', icon: faUser, cls: 'warn' },
} as const

function buildNotes(guide: GuideT, taken: Taken[], outcome: OutcomeNode | null) {
  const lines = [`Troubleshooting: ${guide.title}`, `Date: ${new Date().toLocaleString()}`, '']
  taken.forEach((t, i) => {
    const node = guide.nodes[t.node] as StepNode
    lines.push(`${i + 1}. ${node.title} → ${t.answer}`)
  })
  if (outcome) lines.push('', `Outcome (${RESULT_META[outcome.result].label}): ${outcome.title}`)
  return lines.join('\n')
}

function Runner({ guide, startAt, from }: { guide: GuideT; startAt: string; from?: GuideT }) {
  const navigate = useNavigate()
  const [taken, setTaken] = useState<Taken[]>([])
  const [current, setCurrent] = useState(startAt)
  const topRef = useRef<HTMLDivElement>(null)

  const node = guide.nodes[current]
  const stepNumber = taken.length + 1
  const outcome = node.kind === 'outcome' ? node : null
  const notes = buildNotes(guide, taken, outcome)

  useEffect(() => {
    topRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [current])

  const choose = (opt: Option) => {
    if (opt.guide) {
      navigate(`/guides/${opt.guide}?from=${guide.slug}${opt.step ? `&step=${opt.step}` : ''}`)
      return
    }
    if (!opt.next) return
    setTaken(t => [...t, { node: current, answer: opt.label }])
    setCurrent(opt.next)
  }

  const back = () => {
    const last = taken[taken.length - 1]
    if (!last) return
    setTaken(t => t.slice(0, -1))
    setCurrent(last.node)
  }

  const restart = () => { setTaken([]); setCurrent(guide.start) }

  return (
    <div className="guide-layout" ref={topRef}>
      <div className="guide-main">
        {from && (
          <div className="banner">
            <FontAwesomeIcon icon={faCircleInfo} />
            <span>Continued from <Link to={`/guides/${from.slug}`}>{from.title}</Link></span>
          </div>
        )}

        {node.kind === 'step' ? (
          <section className="panel step" aria-live="polite">
            <div className="step-top">
              <span className="step-num">Step {stepNumber}</span>
              {node.commands && <PlatformSwitch />}
            </div>
            <h2 className="step-title">{node.title}</h2>
            <div className="step-body">
              {node.body.map(p => <p key={p}>{p}</p>)}
            </div>
            {node.commands?.map(c => <CodeBlock key={c.win} command={c} />)}
            {node.lookFor && (
              <div className="callout">
                <div className="callout-title">What to look for</div>
                <ul>{node.lookFor.map(l => <li key={l}>{l}</li>)}</ul>
              </div>
            )}

            <div className="options">
              <div className="options-label">What happened?</div>
              {node.options.map(o => (
                <button key={o.label} type="button" className="option" onClick={() => choose(o)}>
                  <span>{o.label}</span>
                  {o.guide
                    ? <span className="option-jump">Opens “{GUIDE_BY_SLUG[o.guide].title}”<FontAwesomeIcon icon={faArrowRight} /></span>
                    : <FontAwesomeIcon icon={faChevronRight} className="chev" />}
                </button>
              ))}
            </div>

            {taken.length > 0 && (
              <button type="button" className="btn btn-ghost back-btn" onClick={back}>
                <FontAwesomeIcon icon={faArrowLeft} />Previous step
              </button>
            )}
          </section>
        ) : (
          <section className={`panel outcome ${RESULT_META[node.result].cls}`} aria-live="polite">
            <div className="outcome-badge">
              <FontAwesomeIcon icon={RESULT_META[node.result].icon} />{RESULT_META[node.result].label}
            </div>
            <h2 className="step-title">{node.title}</h2>
            <div className="step-body">
              {node.body.map(p => <p key={p}>{p}</p>)}
            </div>
            {node.checklist && (
              <div className="callout">
                <div className="callout-title">Record before escalating</div>
                <ul>{node.checklist.map(l => <li key={l}>{l}</li>)}</ul>
              </div>
            )}
            <div className="outcome-actions">
              <CopyButton text={notes} label="Copy notes for the ticket" />
              <button type="button" className="btn btn-ghost" onClick={back}>
                <FontAwesomeIcon icon={faArrowLeft} />Previous step
              </button>
              <button type="button" className="btn btn-ghost" onClick={restart}>
                <FontAwesomeIcon icon={faRotateLeft} />Start over
              </button>
            </div>
          </section>
        )}
      </div>

      <aside className="guide-side">
        <section className="panel side">
          <div className="side-head">
            <h2>Steps taken</h2>
            {taken.length > 0 && <CopyButton text={notes} label="Copy notes" />}
          </div>
          {taken.length === 0 ? (
            <p className="muted small">Answers appear here as you go, ready to paste into the ticket.</p>
          ) : (
            <ol className="trail">
              {taken.map((t, i) => (
                <li key={`${t.node}-${i}`}>
                  <span className="trail-dot"><FontAwesomeIcon icon={faCheck} /></span>
                  <span className="trail-text">
                    <span className="trail-step">{(guide.nodes[t.node] as StepNode).title}</span>
                    <span className="trail-answer">{t.answer}</span>
                  </span>
                </li>
              ))}
            </ol>
          )}
          {taken.length > 0 && (
            <button type="button" className="link-btn" onClick={restart}>
              <FontAwesomeIcon icon={faRotateLeft} />Start over
            </button>
          )}
        </section>
      </aside>
    </div>
  )
}

export function Guide() {
  const { slug = '' } = useParams()
  const [params] = useSearchParams()
  const location = useLocation()
  const guide = GUIDE_BY_SLUG[slug]

  if (!guide) {
    return (
      <div className="page">
        <div className="hero">
          <h1>Guide not found</h1>
          <p><Link to="/">Back to all guides</Link></p>
        </div>
      </div>
    )
  }

  const step = params.get('step')
  const startAt = step && guide.nodes[step] ? step : guide.start
  const from = GUIDE_BY_SLUG[params.get('from') ?? '']

  return (
    <div className="page">
      <Link to="/" className="back-link"><FontAwesomeIcon icon={faArrowLeft} />All guides</Link>
      <header className="guide-head">
        <span className="guide-icon lg"><FontAwesomeIcon icon={guide.icon} /></span>
        <div>
          <h1>{guide.title}</h1>
          <p>{guide.summary}</p>
        </div>
      </header>
      <Runner key={location.key} guide={guide} startAt={startAt} from={from} />
    </div>
  )
}
