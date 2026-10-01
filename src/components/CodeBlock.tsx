import { AppleLogo, WindowsLogo } from '@phosphor-icons/react'
import type { Command } from '../data/guides'
import { usePlatform, type Platform } from '../platform'
import { CopyButton } from './ui'

export function PlatformSwitch() {
  const [platform, setPlatform] = usePlatform()
  const opts: { id: Platform; label: string; Icon: typeof WindowsLogo }[] = [
    { id: 'windows', label: 'Windows', Icon: WindowsLogo },
    { id: 'mac', label: 'macOS', Icon: AppleLogo },
  ]
  return (
    <div className="segmented" role="radiogroup" aria-label="Client’s computer">
      {opts.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={platform === id}
          className={platform === id ? 'active' : undefined}
          onClick={() => setPlatform(id)}
        >
          <Icon size={16} weight="fill" />{label}
        </button>
      ))}
    </div>
  )
}

export function CodeBlock({ command }: { command: Command }) {
  const [platform] = usePlatform()
  const code = platform === 'mac' ? command.mac : command.win
  const OsIcon = platform === 'mac' ? AppleLogo : WindowsLogo

  return (
    <div className="code">
      <div className="code-head">
        <span className="code-dots" aria-hidden><i /><i /><i /></span>
        <span className="code-label">
          <OsIcon size={14} weight="fill" />
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
