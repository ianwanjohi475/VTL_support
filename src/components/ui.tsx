import { useState, type ReactNode } from 'react'
import type { Tone } from '../data/tones'
import type { Severity } from '../data/incidents'
import { copyText } from '../platform'
import { Icon, ic, type IconData } from '../icons'

/** An icon on a soft tinted square in its colour family. */
export function Tile({ icon, tone, size = 'md' }: { icon: IconData; tone: Tone; size?: 'sm' | 'md' | 'lg' }) {
  const px = size === 'lg' ? 36 : size === 'sm' ? 22 : 29
  return (
    <span className={`tile tile-${size} tone-${tone}`} aria-hidden>
      <Icon icon={icon} size={px} />
    </span>
  )
}

/** Cream halftone caption with an ink outline, like a comic panel. */
export function Caption({ children }: { children: ReactNode }) {
  return <span className="comic">{children}</span>
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <span className={`sev sev-${severity.toLowerCase()}`}><span className="dot" />{severity}</span>
}

export function CopyButton({ text, label = 'Copy', variant }: { text: string; label?: string; variant?: 'primary' }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      className={['copy-btn', variant, done && 'done', !label && 'icon-only'].filter(Boolean).join(' ')}
      aria-label={label ? undefined : 'Copy'}
      title={label ? undefined : 'Copy'}
      onClick={async () => {
        if (await copyText(text)) {
          setDone(true)
          setTimeout(() => setDone(false), 1600)
        }
      }}
    >
      {done ? <Icon icon={ic.check} size={15} /> : <Icon icon={ic.contentCopy} size={15} />}
      {label && (done ? 'Copied' : label)}
    </button>
  )
}
