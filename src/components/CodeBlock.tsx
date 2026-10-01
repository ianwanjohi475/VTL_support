import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons'
import { faApple, faWindows } from '@fortawesome/free-brands-svg-icons'
import type { Command } from '../data/guides'
import { copyText, usePlatform, type Platform } from '../platform'

export function PlatformSwitch() {
  const [platform, setPlatform] = usePlatform()
  const opts: { id: Platform; label: string; icon: typeof faWindows }[] = [
    { id: 'windows', label: 'Windows', icon: faWindows },
    { id: 'mac', label: 'macOS', icon: faApple },
  ]
  return (
    <div className="segmented" role="radiogroup" aria-label="Client’s computer">
      {opts.map(o => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={platform === o.id}
          className={platform === o.id ? 'active' : undefined}
          onClick={() => setPlatform(o.id)}
        >
          <FontAwesomeIcon icon={o.icon} />{o.label}
        </button>
      ))}
    </div>
  )
}

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      className={done ? 'copy-btn done' : 'copy-btn'}
      onClick={async () => {
        if (await copyText(text)) {
          setDone(true)
          setTimeout(() => setDone(false), 1600)
        }
      }}
    >
      <FontAwesomeIcon icon={done ? faCheck : faCopy} />
      {done ? 'Copied' : label}
    </button>
  )
}

export function CodeBlock({ command }: { command: Command }) {
  const [platform] = usePlatform()
  const code = platform === 'mac' ? command.mac : command.win

  return (
    <div className="code">
      <div className="code-head">
        <span className="code-label">
          <FontAwesomeIcon icon={platform === 'mac' ? faApple : faWindows} />
          {command.label ?? (platform === 'mac' ? 'Terminal' : 'Command Prompt')}
        </span>
        {code && <CopyButton text={code} />}
      </div>
      {code
        ? <pre><code>{code}</code></pre>
        : <p className="code-note">{command.macNote}</p>}
    </div>
  )
}
