import { createContext, useContext, useState, type ReactNode } from 'react'

export type Platform = 'windows' | 'mac'

const KEY = 'vtl.platform'

function initial(): Platform {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'windows' || v === 'mac') return v
  } catch { /* storage unavailable */ }
  return /Mac/.test(navigator.platform) ? 'mac' : 'windows'
}

const PlatformContext = createContext<[Platform, (p: Platform) => void]>(['windows', () => {}])

/** The operating system the client is using, shared by every command block. */
export function PlatformProvider({ children }: { children: ReactNode }) {
  const [platform, setPlatform] = useState<Platform>(initial)
  const set = (p: Platform) => {
    setPlatform(p)
    try { localStorage.setItem(KEY, p) } catch { /* storage unavailable */ }
  }
  return <PlatformContext.Provider value={[platform, set]}>{children}</PlatformContext.Provider>
}

export const usePlatform = () => useContext(PlatformContext)

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    ta.remove()
    return ok
  }
}
