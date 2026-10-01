import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { GUIDE_BY_SLUG, type Guide as GuideT, type OutcomeNode, type Option, type StepNode } from '../data/guides'
import { CodeBlock, PlatformSwitch } from '../components/CodeBlock'
import { Caption, CopyButton, Tile } from '../components/ui'
import { Icon, ic } from '../icons'

interface Taken { node: string; answer: string }

const RESULT_META = {
  resolved: { label: 'Resolved', icon: ic.checkCircle, cls: 'ok' },
  escalate: { label: 'Escalate', icon: ic.warning, cls: 'bad' },
  client: { label: 'Client-side', icon: ic.person, cls: 'warn' },
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
  const first = useRef(true)

  const node = guide.nodes[current]
  const outcome = node.kind === 'outcome' ? node : null
  const notes = buildNotes(guide, taken, outcome)

  useEffect(() => {
    if (first.current) { first.current = false; return }
    topRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
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
            <Icon icon={ic.info} size={18} />
            <span>Continued from <Link to={`/guides/${from.slug}`}>{from.title}</Link></span>
          </div>
        )}

        {node.kind === 'step' ? (
          <section className="card step" aria-live="polite">
            <div className="step-top">
              <Caption>Step {taken.length + 1}</Caption>
              {node.commands && <PlatformSwitch />}
            </div>
            <h2 className="step-title">{node.title}</h2>
            <div className="step-body">
              {node.body.map(p => <p key={p}>{p}</p>)}
            </div>
            {node.commands?.map(c => <CodeBlock key={c.win} command={c} />)}
            {node.lookFor && (
              <div className="callout">
                <div className="callout-title"><Icon icon={ic.info} size={16} />What to look for</div>
                <ul>{node.lookFor.map(l => <li key={l}>{l}</li>)}</ul>
              </div>
            )}

            <div className="options">
              <div className="options-label">What happened?</div>
              {node.options.map(o => (
                <button key={o.label} type="button" className="option" onClick={() => choose(o)}>
                  <span>{o.label}</span>
                  {o.guide
                    ? <span className="option-jump">Opens “{GUIDE_BY_SLUG[o.guide].title}”<Icon icon={ic.arrowForward} size={14} /></span>
                    : <Icon icon={ic.chevronRight} size={16} className="chev" />}
                </button>
              ))}
            </div>

            {taken.length > 0 && (
              <button type="button" className="btn btn-ghost back-btn" onClick={back}>
                <Icon icon={ic.arrowBack} size={16} />Previous step
              </button>
            )}
          </section>
        ) : (
          <OutcomeCard node={node} notes={notes} onBack={back} onRestart={restart} />
        )}
      </div>

      <aside className="guide-side">
        <section className="card side">
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
                  <span className="trail-dot"><Icon icon={ic.check} size={12} /></span>
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
              <Icon icon={ic.restart} size={15} />Start over
            </button>
          )}
        </section>
      </aside>
    </div>
  )
}

function OutcomeCard({ node, notes, onBack, onRestart }: { node: OutcomeNode; notes: string; onBack: () => void; onRestart: () => void }) {
  const meta = RESULT_META[node.result]
  return (
    <section className={`card outcome ${meta.cls}`} aria-live="polite">
      <div className="outcome-badge"><Icon icon={meta.icon} size={19} />{meta.label}</div>
      <h2 className="step-title">{node.title}</h2>
      <div className="step-body">
        {node.body.map(p => <p key={p}>{p}</p>)}
      </div>
      {node.checklist && (
        <div className="callout">
          <div className="callout-title"><Icon icon={ic.warning} size={16} />Record before escalating</div>
          <ul>{node.checklist.map(l => <li key={l}>{l}</li>)}</ul>
        </div>
      )}
      <div className="outcome-actions">
        <CopyButton text={notes} label="Copy notes for the ticket" variant="primary" />
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          <Icon icon={ic.arrowBack} size={16} />Previous step
        </button>
        <button type="button" className="btn btn-ghost" onClick={onRestart}>
          <Icon icon={ic.restart} size={16} />Start over
        </button>
      </div>
    </section>
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
        <div className="page-head">
          <div>
            <h1>Guide not found</h1>
            <p><Link to="/">Back to all guides</Link></p>
          </div>
        </div>
      </div>
    )
  }

  const step = params.get('step')
  const startAt = step && guide.nodes[step] ? step : guide.start
  const from = GUIDE_BY_SLUG[params.get('from') ?? '']

  return (
    <div className="page">
      <Link to="/" className="back-link"><Icon icon={ic.arrowBack} size={16} />All guides</Link>
      <header className="detail-head">
        <Tile icon={guide.icon} tone={guide.tone} size="lg" />
        <div>
          <span className={`eyebrow tone-${guide.tone}`}>{guide.category} · ~{guide.minutes} min</span>
          <h1>{guide.title}</h1>
          <p>{guide.summary}</p>
        </div>
      </header>
      <Runner key={location.key} guide={guide} startAt={startAt} from={from} />
    </div>
  )
}
