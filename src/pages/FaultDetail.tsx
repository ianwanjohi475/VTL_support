import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCheck, faChevronLeft, faCircleCheck, faCircleInfo, faTruck } from '@fortawesome/free-solid-svg-icons'
import { Shell } from '../components/Shell'
import { WALKTHROUGHS, type Walkthrough } from '../data'

function WalkthroughView({ flow }: { flow: Walkthrough }) {
  const { steps } = flow
  const navigate = useNavigate()
  const [answers, setAnswers] = useState<string[]>([])

  const idx = answers.length
  const resolved = idx >= steps.length
  const cur = resolved ? null : steps[idx]

  const pick = (answer: string) => setAnswers(a => (a.length < steps.length ? [...a, answer] : a))
  const back = () => setAnswers(a => a.slice(0, -1))
  const restart = () => setAnswers([])

  const answerButtons = cur?.answers.map(text => (
    <button key={text} type="button" className="answer" onClick={() => pick(text)}>{text}</button>
  ))

  return (
    <>
      <div className="main-scroll">
        <div className="page fault">
          <div className="fault-work">
            <Link to="/" className="back-link"><FontAwesomeIcon icon={faChevronLeft} className="icon-xs" />{flow.section}</Link>

            <header className="fault-head">
              <div className="fault-title-row">
                <h1>{flow.title}</h1>
                {resolved
                  ? <span className="status-pill green"><span className="dot" />Resolved</span>
                  : <span className="status-pill red"><span className="dot" />{flow.suspected}</span>}
              </div>
              <p className="fault-meta">
                <span>{steps.length} steps</span>
                <span aria-hidden>·</span>
                <span>Usually takes {flow.avg}</span>
              </p>
            </header>

            <div className="note">
              <FontAwesomeIcon icon={faCircleInfo} className="icon-sm" />
              <p>{flow.meaning}</p>
            </div>

            <div className="progress">
              <div className="progress-label">
                {resolved ? `All ${steps.length} steps complete` : `Step ${idx + 1} of ${steps.length}`}
              </div>
              <ol className="stepper" aria-label="Progress">
                {steps.map((s, i) => (
                  <li
                    key={s.short}
                    className={i < idx ? 'done' : i === idx ? 'current' : undefined}
                    aria-current={i === idx ? 'step' : undefined}
                  >
                    <span className="bar" />
                    <span className="name">{s.short}</span>
                  </li>
                ))}
              </ol>
            </div>

            {cur ? (
              <section className="card step-card" aria-live="polite">
                <div className="step-label">{cur.label}</div>
                <p className="step-q">{cur.q}</p>
                <p className="step-expect"><strong>What to expect:</strong> {cur.expect}</p>
                <div className="answers">{answerButtons}</div>
              </section>
            ) : (
              <section className="card step-card resolved" aria-live="polite">
                <div className="step-label green-text"><FontAwesomeIcon icon={faCircleCheck} className="icon-sm" />Resolved</div>
                <p className="step-q">{flow.resolution.title}</p>
                <p className="step-expect">{flow.resolution.body}</p>
                <div className="resolved-actions">
                  <button type="button" className="btn btn-primary" onClick={() => navigate('/')}>Back to home</button>
                  <button type="button" className="btn btn-secondary" onClick={restart}>Start again</button>
                </div>
              </section>
            )}
          </div>

          <aside className="fault-aside">
            <section className="card side-card">
              <div className="side-head"><h2>Your answers</h2></div>
              {answers.length ? (
                <ol className="taken">
                  {answers.map((answer, i) => ({ answer, n: i + 1, short: steps[i].short })).reverse().map(t => (
                    <li key={t.n}>
                      <span className="taken-tick"><FontAwesomeIcon icon={faCheck} className="icon-xs" /></span>
                      <div className="taken-body">
                        <div className="taken-meta"><span>Step {t.n} · {t.short}</span></div>
                        <div className="taken-answer">{t.answer}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="muted small">Your answers will appear here as you go.</p>
              )}
            </section>
          </aside>
        </div>
      </div>

      <footer className="fault-footer">
        {cur && <div className="answers-mobile">{answerButtons}</div>}
        <div className="footer-actions">
          <button type="button" className="btn btn-secondary" onClick={back} disabled={idx === 0}>
            <FontAwesomeIcon icon={faArrowLeft} className="icon-sm" />Back
          </button>
          <div className="right">
            <button type="button" className="btn btn-danger">
              <FontAwesomeIcon icon={faTruck} className="icon-sm" />
              <span className="escalate-full">Escalate: book a site visit</span>
              <span className="escalate-short">Escalate</span>
            </button>
          </div>
        </div>
      </footer>
    </>
  )
}

export function FaultDetail() {
  const { slug = '' } = useParams()
  const flow = WALKTHROUGHS[slug]
  const title = (
    <nav className="crumbs" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      <span aria-hidden>/</span>
      <Link to="/?tab=faults">Common faults</Link>
      <span aria-hidden>/</span>
      <span aria-current="page">{flow?.title ?? 'Not found'}</span>
    </nav>
  )

  return (
    <Shell nav="faults" tab="faults" title={title}>
      {flow ? <WalkthroughView key={flow.slug} flow={flow} /> : (
        <div className="main-scroll">
          <div className="page">
            <header className="page-head">
              <h1>No walkthrough for this fault yet</h1>
              <p><Link to="/">Back to Home</Link></p>
            </header>
          </div>
        </div>
      )}
    </Shell>
  )
}
