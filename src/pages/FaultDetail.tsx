import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCheck, faChevronLeft, faCircleCheck, faCircleInfo, faPhone, faTruck } from '@fortawesome/free-solid-svg-icons'
import { Shell } from '../components/Shell'
import { ACTIVE_CALL, WALKTHROUGHS, type Walkthrough } from '../data'

interface Answer { answer: string; atSec: number }

/** Seconds elapsed since `startMs`, ticking once a second. */
function useElapsed(startMs: number) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  return Math.max(0, Math.floor((now - startMs) / 1000))
}

const mmss = (sec: number) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`

function WalkthroughView({ flow }: { flow: Walkthrough }) {
  const { steps } = flow
  const [mountedAt] = useState(() => Date.now())
  const [startedAt, setStartedAt] = useState(() => mountedAt - ACTIVE_CALL.walkthroughElapsedSec * 1000)
  const [answers, setAnswers] = useState<Answer[]>(ACTIVE_CALL.answered)
  const callSec = useElapsed(mountedAt - ACTIVE_CALL.callElapsedSec * 1000)
  const flowSec = useElapsed(startedAt)

  const idx = answers.length
  const resolved = idx >= steps.length
  const cur = resolved ? null : steps[idx]

  const pick = (answer: string) =>
    setAnswers(a => (a.length < steps.length ? [...a, { answer, atSec: Math.floor((Date.now() - startedAt) / 1000) }] : a))
  const back = () => setAnswers(a => a.slice(0, -1))
  const restart = () => { setAnswers([]); setStartedAt(Date.now()) }

  const answerButtons = cur?.answers.map(text => (
    <button key={text} type="button" className="answer" onClick={() => pick(text)}>{text}</button>
  ))

  return (
    <>
      <div className="main-scroll">
        <div className="page fault">
          <div className="fault-work">
            <Link to="/" className="back-link"><FontAwesomeIcon icon={faChevronLeft} className="icon-sm" />{flow.section}</Link>

            <header className="fault-head">
              <div className="fault-title-row">
                <h1>{flow.title}</h1>
                {resolved
                  ? <span className="status-pill green"><span className="dot" />Resolved</span>
                  : <span className="status-pill red"><span className="dot" />{flow.suspected}</span>}
              </div>
              <p className="fault-meta">
                <span className="mono">{ACTIVE_CALL.ticket}</span>
                <span aria-hidden>·</span>
                <span>{ACTIVE_CALL.client}</span>
                <span aria-hidden>·</span>
                <span>Elapsed <span className="mono">{mmss(flowSec)}</span></span>
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
                <p className="step-q">“{cur.q}”</p>
                <p className="step-expect"><strong>What to expect:</strong> {cur.expect}</p>
                <div className="answers">{answerButtons}</div>
              </section>
            ) : (
              <section className="card step-card resolved" aria-live="polite">
                <div className="step-label green-text"><FontAwesomeIcon icon={faCircleCheck} className="icon-sm" />Resolved</div>
                <p className="step-q">{flow.resolution.title}</p>
                <p className="step-expect">{flow.resolution.body}</p>
                <div className="resolved-actions">
                  <button type="button" className="btn btn-primary">Close ticket {ACTIVE_CALL.ticket}</button>
                  <button type="button" className="btn btn-secondary" onClick={restart}>Restart walkthrough</button>
                </div>
              </section>
            )}
          </div>

          <aside className="fault-aside">
            <section className="card side-card">
              <div className="side-head">
                <h2>On the call</h2>
                <span className="call-timer mono"><FontAwesomeIcon icon={faPhone} className="icon-xs" />{mmss(callSec)}</span>
              </div>
              <div className="call-client">
                <div className="name">{ACTIVE_CALL.client}</div>
                <div className="muted">{ACTIVE_CALL.address}</div>
              </div>
              <dl className="facts">
                <dt>Ticket</dt><dd className="mono">{ACTIVE_CALL.ticket}</dd>
                <dt>Client</dt><dd className="mono">{ACTIVE_CALL.clientRef}</dd>
                <dt>Plan</dt><dd>{ACTIVE_CALL.plan}</dd>
                <dt>ONT</dt><dd>{ACTIVE_CALL.ont}</dd>
              </dl>
            </section>

            <section className="card side-card">
              <div className="side-head"><h2>Steps taken</h2></div>
              {answers.length ? (
                <ol className="taken">
                  {answers.map((a, i) => ({ ...a, n: i + 1, short: steps[i].short })).reverse().map(t => (
                    <li key={t.n}>
                      <span className="taken-tick"><FontAwesomeIcon icon={faCheck} className="icon-xs" /></span>
                      <div className="taken-body">
                        <div className="taken-meta"><span>{t.n}. {t.short}</span><span className="mono">{mmss(t.atSec)}</span></div>
                        <div className="taken-answer">{t.answer}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="muted small">Answers will appear here as you go.</p>
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
            <span className="avg">Avg. {flow.avg} for this fault</span>
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
