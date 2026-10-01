import type { Command } from '../data/guides'
import { usePlatform, type Platform } from '../platform'
import { CopyButton } from './ui'
import { Icon, ic, type IconData } from '../icons'

export function PlatformSwitch() {
  const [platform, setPlatform] = usePlatform()
  const opts: { id: Platform; label: string; icon: IconData }[] = [
    { id: 'windows', label: 'Windows', icon: ic.windows },
    { id: 'mac', label: 'macOS', icon: ic.apple },
  ]
  return (
    <div className="segmented" role="radiogroup" aria-label="Client’s computer">
      {opts.map(({ id, label, icon }) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={platform === id}
          className={platform === id ? 'active' : undefined}
          onClick={() => setPlatform(id)}
        >
          <Icon icon={icon} size={16} />{label}
        </button>
      ))}
    </div>
  )
}

export function CodeBlock({ command }: { command: Command }) {
  const [platform] = usePlatform()
  const code = platform === 'mac' ? command.mac : command.win
  const osIcon = platform === 'mac' ? ic.apple : ic.windows

  return (
    <div className="code">
      <div className="code-head">
        <span className="code-dots" aria-hidden><i /><i /><i /></span>
        <span className="code-label">
          <Icon icon={osIcon} size={15} />
          {command.label ?? (platform === 'mac' ? 'Terminal' : 'Command Prompt')}
        </span>
        {code && <CopyButton text={code} />}
      </div>
      {code
        ? <pre><code><span className="prompt" aria-hidden>{platform === 'mac' ? '$' : '>'}</span>{code}</code></pre>
        : <p className="code-note">{command.macNote}</p>}
    </div>
  )
}
