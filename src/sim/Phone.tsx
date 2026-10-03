import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Icon, ic } from '../icons'

/** Android-style status bar, as on the client's phone. */
function StatusBar() {
  return (
    <div className="ph-status">
      <span className="ph-status-left">
        <span className="ph-net"><small>4G</small><Icon icon={ic.signalCell} size={13} /></span>
        <span className="ph-net"><small>4G</small><Icon icon={ic.signalCell} size={13} /></span>
        <Icon icon={ic.wifi} size={14} />
      </span>
      <span className="ph-status-right">
        <Icon icon={ic.visibility} size={14} />
        <span className="ph-batt">90</span>
        <span>18:01</span>
      </span>
    </div>
  )
}

/**
 * Chrome-style address bar. When `onGo` is set, the bar is editable so the
 * trainee can type the router address themselves.
 */
function AddressBar({ url, onGo, highlight, prefill }: {
  url: string
  onGo?: (value: string) => void
  highlight?: boolean
  prefill?: string
}) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { if (prefill !== undefined) setValue(prefill) }, [prefill])

  return (
    <div className="ph-browser">
      <Icon icon={ic.homeOutline} size={24} />
      {onGo ? (
        <form
          className={highlight ? 'ph-url editing sim-hl' : 'ph-url editing'}
          onSubmit={e => { e.preventDefault(); onGo(value.trim()) }}
        >
          <input
            ref={inputRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Search or type web address"
            inputMode="url"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Address bar"
          />
          <button type="submit" className="ph-go" aria-label="Go"><Icon icon={ic.arrowForward} size={18} /></button>
        </form>
      ) : (
        <div className="ph-url">
          {url && <Icon icon={ic.warningFilled} size={16} />}
          <span className="ph-url-text">{url}</span>
        </div>
      )}
      <Icon icon={ic.add} size={24} />
      <span className="ph-tabs">15</span>
      <Icon icon={ic.moreVert} size={22} />
    </div>
  )
}

export function Phone({ url, onGo, urlHighlight, urlPrefill, browser = true, children }: {
  url?: string
  onGo?: (value: string) => void
  urlHighlight?: boolean
  urlPrefill?: string
  browser?: boolean
  children: ReactNode
}) {
  return (
    <div className="phone" role="img" aria-label="Simulated phone screen">
      <div className="phone-screen">
        <StatusBar />
        {browser && <AddressBar url={url ?? ''} onGo={onGo} highlight={urlHighlight} prefill={urlPrefill} />}
        <div className="phone-body">{children}</div>
        <div className="ph-nav" aria-hidden>
          <span className="ph-nav-back" /><span className="ph-nav-home" /><span className="ph-nav-recent" />
        </div>
      </div>
    </div>
  )
}

/** What a browser shows before an address is entered. */
export function BlankTab() {
  return (
    <div className="ph-blank">
      <span className="ph-blank-logo">
        <i style={{ background: '#4285f4' }} /><i style={{ background: '#ea4335' }} /><i style={{ background: '#fbbc05' }} /><i style={{ background: '#34a853' }} />
      </span>
      <p>Type the router address in the bar above.</p>
    </div>
  )
}

/** Android Wi-Fi settings list. */
export function WifiList({ networks, connected, onPick, highlight }: {
  networks: { ssid: string; locked: boolean; strength: 1 | 2 | 3 }[]
  connected?: string
  onPick: (ssid: string) => void
  highlight?: string
}) {
  return (
    <div className="aw">
      <div className="aw-top">
        <Icon icon={ic.arrowBack} size={22} />
        <span>Wi-Fi</span>
      </div>
      <div className="aw-toggle">
        <span>Wi-Fi</span>
        <span className="aw-switch on" aria-hidden><i /></span>
      </div>
      {connected && (
        <>
          <div className="aw-label">Connected network</div>
          <div className="aw-net connected">
            <Icon icon={ic.wifi} size={24} />
            <span className="aw-net-text"><b>{connected}</b><small>Connected</small></span>
          </div>
        </>
      )}
      <div className="aw-label">Available networks</div>
      {networks.filter(n => n.ssid !== connected).map(n => (
        <button
          key={n.ssid}
          type="button"
          className={highlight === n.ssid ? 'aw-net sim-hl' : 'aw-net'}
          onClick={() => onPick(n.ssid)}
        >
          <Icon icon={n.locked ? ic.wifiLock : n.strength === 3 ? ic.wifi : n.strength === 2 ? ic.networkWifi3 : ic.wifi2} size={24} />
          <span className="aw-net-text"><b>{n.ssid}</b><small>{n.locked ? 'Encrypted' : 'Open'}</small></span>
        </button>
      ))}
    </div>
  )
}

/** Android "enter password" dialog for a Wi-Fi network. */
export function WifiPasswordDialog({ ssid, value, onChange, onConnect, onCancel, error, highlight }: {
  ssid: string
  value: string
  onChange: (v: string) => void
  onConnect: () => void
  onCancel: () => void
  error?: string
  highlight?: boolean
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="aw-dialog-backdrop">
      <form className="aw-dialog" onSubmit={e => { e.preventDefault(); onConnect() }}>
        <h4>{ssid}</h4>
        <label className={highlight ? 'aw-field sim-hl' : 'aw-field'}>
          <span>Password</span>
          <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} autoComplete="off" />
          <button type="button" className="aw-eye" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
            <Icon icon={show ? ic.visibility : ic.visibilityOff} size={20} />
          </button>
        </label>
        {error && <p className="aw-error">{error}</p>}
        <div className="aw-actions">
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="submit" className="primary">Connect</button>
        </div>
      </form>
    </div>
  )
}
