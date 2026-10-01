import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { COMMAND_GROUPS } from '../data/commands'
import { CodeBlock, PlatformSwitch } from '../components/CodeBlock'
import { usePlatform } from '../platform'

export function Commands() {
  const [platform] = usePlatform()
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hash])

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <span className="comic">Reference</span>
          <h1>Network commands</h1>
          <p>Have the client run these and read you the result.</p>
        </div>
        <PlatformSwitch />
      </header>

      <div className="banner">
        <FontAwesomeIcon icon={faCircleInfo} />
        {platform === 'mac'
          ? <span><strong>Open Terminal:</strong> press Cmd + Space, type “Terminal” and press Return.</span>
          : <span><strong>Open Command Prompt:</strong> press the Windows key, type “cmd” and press Enter.</span>}
      </div>

      {COMMAND_GROUPS.map(group => (
        <section className="section" key={group.title}>
          <div className="section-head"><h2>{group.title}</h2></div>
          <div className="cmd-list">
            {group.items.map(c => (
              <article className="panel cmd" id={c.id} key={c.id}>
                <h3>{c.title}</h3>
                <p className="muted">{c.purpose}</p>
                <CodeBlock command={{ ...c, label: undefined }} />
                <ul className="cmd-read">{c.read.map(r => <li key={r}>{r}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
