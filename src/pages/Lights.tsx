import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { DEVICES, type LightStatus } from '../data/lights'
import { GUIDE_BY_SLUG } from '../data/guides'

const STATUS: Record<LightStatus, string> = { ok: 'Normal', check: 'Check', fault: 'Problem' }

export function Lights() {
  return (
    <div className="page">
      <header className="page-head">
        <div>
          <span className="comic">Reference</span>
          <h1>Light guide</h1>
          <p>Ask the client to read the lights from top to bottom, then match them here.</p>
        </div>
      </header>

      {DEVICES.map(d => (
        <section className="section" key={d.title}>
          <div className="section-head">
            <h2>{d.title}</h2>
            <span className="muted">{d.subtitle}</span>
          </div>
          <div className="panel table-wrap">
            <table className="lights">
              <thead>
                <tr><th>Light</th><th>State</th><th>Meaning</th><th>Status</th><th><span className="sr-only">Action</span></th></tr>
              </thead>
              <tbody>
                {d.lights.map(l => l.states.map((s, i) => (
                  <tr key={l.name + s.state} className={i === 0 ? 'first' : undefined}>
                    {i === 0 && <th scope="rowgroup" rowSpan={l.states.length} className="light-name">{l.name}</th>}
                    <td className="state">{s.state}</td>
                    <td className="meaning">{s.meaning}</td>
                    <td className="status-cell"><span className={`status ${s.status}`}><span className="dot" />{STATUS[s.status]}</span></td>
                    <td className="action">
                      {s.guide && s.status !== 'ok' && (
                        <Link to={`/guides/${s.guide}`}>{GUIDE_BY_SLUG[s.guide].title}<FontAwesomeIcon icon={faArrowRight} /></Link>
                      )}
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  )
}
