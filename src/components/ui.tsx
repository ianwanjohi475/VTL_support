import { useState, type ReactNode } from 'react'
import type { Icon } from '@phosphor-icons/react'
import { Check, Copy } from '@phosphor-icons/react'
import type { Tone } from '../data/tones'
import type { Severity } from '../data/incidents'
import { copyText } from '../platform'

/** A coloured, app-style icon tile with a two-tone glyph. */
export function Tile({ icon: I, tone, size = 'md' }: { icon: Icon; tone: Tone; size?: 'sm' | 'md' | 'lg' }) {
  const px = size === 'lg' ? 28 : size === 'sm' ? 18 : 22
  return (
    <span className={`tile tile-${size} tone-${tone}`} aria-hidden>
      <I size={px} weight="duotone" />
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
      {done ? <Check size={15} weight="bold" /> : <Copy size={15} weight="bold" />}
      {label && (done ? 'Copied' : label)}
    </button>
  )
}
