import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, ChevronLeft, CircleCheck, Info, Phone, Truck } from 'lucide-react'
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

function startedAgo(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return m ? `Started ${m} min ${s} s ago` : `Started ${s} s ago`
}

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
  const last = answers[answers.length - 1]

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
        <div className="fault">
          <div className="fault-work">
            <nav className="crumbs crumbs-desktop" aria-label="Breadcrumb">
              <Link to="/"><ArrowLeft size={15} />Home</Link>
              <span>/</span>
              <Link to="/#common-faults">{flow.section}</Link>
              <span>/</span>
              <span className="current" aria-current="page">{flow.title}</span>
            </nav>

            <div className="fault-titles">
              <Link to="/" className="crumbs-mobile"><ChevronLeft size={16} />Home · {flow.section}</Link>
              <div className="fault-head">
                <h1>{flow.title}</h1>
                {resolved
                  ? <span className="status-pill green"><span className="dot" />Resolved</span>
                  : <span className="status-pill red"><span className="dot" />{flow.suspected}</span>}
                <span className="fault-ticket mono">{ACTIVE_CALL.ticket}</span>
              </div>
            </div>

            <div className="meaning">
              <Info size={18} />
              <div><strong>What this usually means</strong> — {flow.meaning}</div>
            </div>

            <div className="progress">
              <div className="progress-meta">
                <span className="label">{resolved ? `All ${steps.length} steps complete` : `Step ${idx + 1} of ${steps.length}`}</span>
                <span className="aside">{startedAgo(flowSec)}</span>
                <span className="last">{last ? `Last: ${last.answer}` : 'No answers yet'}</span>
              </div>
              <ol className="stepper" aria-label="Progress">
                {steps.map((s, i) => (
                  <li
                    key={s.short}
                    className={i < idx ? 'done' : i === idx ? 'current' : undefined}
                    aria-current={i === idx ? 'step' : undefined}
                  >
                    <span className="bar" />
                    <span className="name">{i < idx && <Check size={14} />}{s.short}</span>
                  </li>
                ))}
              </ol>
            </div>

            {cur ? (
              <section className="step-card" aria-live="polite">
                <div className="step-label">{cur.label}</div>
                <p className="step-q">“{cur.q}”</p>
                <p className="step-expect"><strong>What to expect</strong> — {cur.expect}</p>
                <div className="answers">{answerButtons}</div>
              </section>
            ) : (
              <section className="resolved-card" aria-live="polite">
                <div className="resolved-label"><CircleCheck size={18} />RESOLVED</div>
                <p className="resolved-title">{flow.resolution.title}</p>
                <p className="resolved-body">{flow.resolution.body}</p>
                <div className="resolved-actions">
                  <button type="button" className="btn btn-primary">Close ticket {ACTIVE_CALL.ticket}</button>
                  <button type="button" className="btn btn-ghost" onClick={restart}>Restart walkthrough</button>
                </div>
              </section>
            )}
          </div>

          <aside className="fault-aside">
            <div className="panel call-card">
              <div className="call-head">
                <span className="eyebrow">ON THE CALL</span>
                <span className="call-timer mono"><Phone size={13} />{mmss(callSec)}</span>
              </div>
              <div className="call-client">
                <div className="name">{ACTIVE_CALL.client}</div>
                <div className="addr">{ACTIVE_CALL.address}</div>
              </div>
              <dl className="call-facts">
                <dt>Ticket</dt><dd className="mono">{ACTIVE_CALL.ticket}</dd>
                <dt>Client</dt><dd className="mono">{ACTIVE_CALL.clientRef}</dd>
                <dt>Plan</dt><dd>{ACTIVE_CALL.plan}</dd>
                <dt>ONT</dt><dd>{ACTIVE_CALL.ont}</dd>
              </dl>
            </div>

            <div className="panel taken">
              <div className="eyebrow">STEPS TAKEN</div>
              {answers.length ? (
                <ol>
                  {answers.map((a, i) => ({ ...a, n: i + 1, short: steps[i].short })).reverse().map(t => (
                    <li className="taken-item" key={t.n}>
                      <span className="taken-tick"><Check size={13} /></span>
                      <div className="taken-body">
                        <div className="taken-meta"><span>Step {t.n} · {t.short}</span><span className="mono">{mmss(t.atSec)}</span></div>
                        <div className="taken-answer">{t.answer}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="taken-empty">Answers will appear here as you go.</div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <footer className="fault-footer">
        {cur && <div className="answers-mobile">{answerButtons}</div>}
        <div className="footer-actions">
          <button type="button" className="btn btn-secondary" onClick={back} disabled={idx === 0}>
            <ArrowLeft size={16} />Back
          </button>
          <div className="right">
            <span className="avg">Avg. {flow.avg} for this fault</span>
            <button type="button" className="btn btn-danger">
              <Truck size={16} />
              <span className="escalate-full">Escalate — book a site visit</span>
              <span className="escalate-short">Escalate — site visit</span>
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

  return (
    <Shell nav="faults" tab="troubleshoot">
      {flow ? <WalkthroughView key={flow.slug} flow={flow} /> : (
        <div className="main-scroll">
          <div className="not-found">
            <h1>No walkthrough for this fault yet</h1>
            <p>Pick another symptom from the home screen.</p>
            <p><Link to="/">Back to Home</Link></p>
          </div>
        </div>
      )}
    </Shell>
  )
}
