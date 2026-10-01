import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { COMMAND_GROUPS } from '../data/commands'
import { CodeBlock, PlatformSwitch } from '../components/CodeBlock'
import { usePlatform } from '../platform'
import { Caption, Tile } from '../components/ui'
import { Icon, ic } from '../icons'

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
          <Caption>Reference</Caption>
          <h1>Network commands</h1>
          <p>Have the client run these and read you the result. Each one explains what a good and a bad result look like.</p>
        </div>
        <PlatformSwitch />
      </header>

      <div className="banner">
        <Icon icon={ic.info} size={18} />
        {platform === 'mac'
          ? <span><strong>Open Terminal:</strong> press Cmd + Space, type “Terminal” and press Return.</span>
          : <span><strong>Open Command Prompt:</strong> press the Windows key, type “cmd” and press Enter.</span>}
      </div>

      {COMMAND_GROUPS.map(group => (
        <section className="section" key={group.title}>
          <div className="section-head"><h2 className="section-title">{group.title}</h2></div>
          <div className="cmd-list">
            {group.items.map(c => (
              <article className="card cmd" id={c.id} key={c.id}>
                <div className="cmd-head"><Tile icon={ic.terminal} tone="slate" size="sm" /><h3>{c.title}</h3></div>
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
