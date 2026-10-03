import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Icon, ic, type IconData } from '../icons'

/* A training replica of the Tenda router's mobile web interface
   (192.168.0.1). Nothing typed here leaves the page. */

export function TendaLogo({ light = false }: { light?: boolean }) {
  return <span className={light ? 'td-logo light' : 'td-logo'}>Tenda</span>
}

export function TdField({ label, value, onChange, password = false, hl = false, placeholder, readOnly = false }: {
  label: string
  value: string
  onChange?: (v: string) => void
  password?: boolean
  hl?: boolean
  placeholder?: string
  readOnly?: boolean
}) {
  const [show, setShow] = useState(false)
  return (
    <label className={hl ? 'td-field sim-hl' : 'td-field'}>
      <span className="td-field-label">{label}</span>
      <span className="td-input-wrap">
        <input
          className="td-input"
          type={password && !show ? 'password' : 'text'}
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          onChange={e => onChange?.(e.target.value)}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        {password && (
          <button type="button" className="td-eye" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
            <Icon icon={show ? ic.visibility : ic.visibilityOff} size={20} />
          </button>
        )}
      </span>
    </label>
  )
}

/* ───────────── Login page (192.168.0.1/login.html) ───────────── */

export function TendaLogin({ value, onChange, onLogin, error, hl }: {
  value: string
  onChange: (v: string) => void
  onLogin: () => void
  error?: string
  hl?: 'password' | 'login'
}) {
  const [show, setShow] = useState(false)
  return (
    <form className="td-login" onSubmit={e => { e.preventDefault(); onLogin() }}>
      <TendaLogo />
      <div className="td-login-field">
        <Icon icon={ic.language} size={26} />
        <span className="td-login-lang">English</span>
        <Icon icon={ic.arrowDropDown} size={24} />
      </div>
      <label className={hl === 'password' ? 'td-login-field sim-hl' : 'td-login-field'}>
        <Icon icon={ic.lockFilled} size={24} />
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Login Password"
          autoComplete="off"
          aria-label="Login Password"
        />
        <button type="button" className="td-eye" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
          <Icon icon={show ? ic.visibility : ic.visibilityOff} size={22} />
        </button>
      </label>
      {error && <p className="td-error">{error}</p>}
      <button type="submit" className={hl === 'login' ? 'td-btn td-btn-block sim-hl' : 'td-btn td-btn-block'}>Login</button>
      <span className="td-forgot">Forgot your password? ▸</span>
    </form>
  )
}

/* ───────────── Main interface: header, menu, pages ───────────── */

export type TendaPage = 'status' | 'internet' | 'wireless' | 'admin'

const MENU: { id: TendaPage | string; label: string; icon?: IconData; text?: string }[] = [
  { id: 'status', label: 'Status', icon: ic.router },
  { id: 'internet', label: 'Internet Settings', icon: ic.publicIcon },
  { id: 'wireless', label: 'Wireless Settings', icon: ic.wifi },
  { id: 'bandwidth', label: 'Bandwidth Control', icon: ic.showChart },
  { id: 'repeating', label: 'Wireless Repeating', icon: ic.antenna },
  { id: 'parental', label: 'Parental Controls', icon: ic.parental },
  { id: 'advanced', label: 'Advanced', icon: ic.handyman },
  { id: 'ipv6', label: 'IPv6', text: 'IPv6' },
  { id: 'admin', label: 'Administration', icon: ic.settings },
]

export function TendaShell({ page, menuOpen, onToggleMenu, onPick, hlMenu, hlItem, children }: {
  page: TendaPage
  menuOpen: boolean
  onToggleMenu: () => void
  onPick: (id: string) => void
  hlMenu?: boolean
  hlItem?: string
  children: ReactNode
}) {
  return (
    <div className="td-shell">
      <header className="td-header">
        <TendaLogo light />
        <button type="button" className={hlMenu ? 'td-burger sim-hl' : 'td-burger'} onClick={onToggleMenu} aria-label="Menu" aria-expanded={menuOpen}>
          <i /><i /><i />
        </button>
      </header>
      <div className="td-content">{children}</div>
      {menuOpen && (
        <nav className="td-drawer" aria-label="Router menu">
          {MENU.map(m => (
            <button
              key={m.id}
              type="button"
              className={[m.id === page ? 'active' : '', hlItem === m.id ? 'sim-hl' : ''].join(' ')}
              onClick={() => onPick(m.id)}
            >
              {m.icon ? <Icon icon={m.icon} size={30} /> : <span className="td-ipv6">IP<small>v</small>6</span>}
              {m.label}
            </button>
          ))}
        </nav>
      )}
    </div>
  )
}

export function TendaStatus({ duration = '5d 10h 8m 51s', mac = 'B8:3A:08:0A:8C:50', devices = 4, children }: {
  duration?: string
  mac?: string
  devices?: number
  children?: ReactNode
}) {
  return (
    <div className="td-page">
      {children}
      <h3 className="td-section">Internet Connection Status</h3>
      <div className="td-card td-conn">
        <div className="td-conn-row">
          <span className="td-conn-node"><Icon icon={ic.routerOutline} size={56} /><small>Router</small></span>
          <span className="td-conn-line" />
          <span className="td-conn-node"><Icon icon={ic.publicIcon} size={56} /><small>Internet</small></span>
        </div>
        <p>Connection Status:<b className="td-ok">You can surf the Internet</b></p>
      </div>
      <h3 className="td-section">Attached Devices and Real-time Statistics</h3>
      <div className="td-card td-stats">
        <span><b className="c-blue">{devices}</b><small><Icon icon={ic.group} size={22} />Attached Devices</small></span>
        <span><b className="c-green">228.0 <i>KB/s</i></b><small><Icon icon={ic.download} size={22} />Download Speed</small></span>
        <span><b className="c-orange">16.0 <i>KB/s</i></b><small><Icon icon={ic.upload} size={22} />Upload Speed</small></span>
      </div>
      <h3 className="td-section">System Info</h3>
      <div className="td-card td-info">
        <div><span>Connection Type</span><span>PPPoE</span></div>
        <div><span>Connection Duration</span><span>{duration}</span></div>
        <div><span>WAN MAC</span><span>{mac}</span></div>
      </div>
    </div>
  )
}

/** Small "saved" toast like the router shows after OK/Save. */
export function TdToast({ children }: { children: ReactNode }) {
  return <div className="td-toast"><Icon icon={ic.checkCircle} size={20} />{children}</div>
}

/* ───────────── Quick setup (new or reset router) ───────────── */

export function TendaQuickInternet({ type, user, pass, onChange, onNext, error, hl }: {
  type: string
  user: string
  pass: string
  onChange: (patch: { type?: string; user?: string; pass?: string }) => void
  onNext: () => void
  error?: string
  hl?: 'type' | 'user' | 'pass' | 'next'
}) {
  return (
    <div className="td-page td-quick">
      <div className="td-steps"><span className="on">1 Internet Settings</span><span>2 Wireless Settings</span></div>
      <div className="td-card td-form">
        <label className={hl === 'type' ? 'td-field sim-hl' : 'td-field'}>
          <span className="td-field-label">Internet Connection Type</span>
          <select className="td-input" value={type} onChange={e => onChange({ type: e.target.value })}>
            <option>Dynamic IP</option>
            <option>PPPoE</option>
            <option>Static IP</option>
          </select>
        </label>
        {type === 'PPPoE' && (
          <>
            <TdField label="PPPoE Username" value={user} onChange={v => onChange({ user: v })} hl={hl === 'user'} placeholder="ISP username" />
            <TdField label="PPPoE Password" value={pass} onChange={v => onChange({ pass: v })} password hl={hl === 'pass'} placeholder="ISP password" />
          </>
        )}
        {error && <p className="td-error">{error}</p>}
        <button type="button" className={hl === 'next' ? 'td-btn td-btn-block sim-hl' : 'td-btn td-btn-block'} onClick={onNext}>Next</button>
      </div>
    </div>
  )
}

export function TendaQuickWireless({ ssid, pass, onChange, onNext, error, hl }: {
  ssid: string
  pass: string
  onChange: (patch: { ssid?: string; pass?: string }) => void
  onNext: () => void
  error?: string
  hl?: 'ssid' | 'pass' | 'next'
}) {
  return (
    <div className="td-page td-quick">
      <div className="td-steps"><span className="done">1 Internet Settings</span><span className="on">2 Wireless Settings</span></div>
      <div className="td-card td-form">
        <TdField label="WiFi Name" value={ssid} onChange={v => onChange({ ssid: v })} hl={hl === 'ssid'} placeholder="Name of the new network" />
        <TdField label="WiFi Password" value={pass} onChange={v => onChange({ pass: v })} password hl={hl === 'pass'} placeholder="8–63 characters" />
        <p className="td-hint">The WiFi password must be 8–63 characters.</p>
        {error && <p className="td-error">{error}</p>}
        <button type="button" className={hl === 'next' ? 'td-btn td-btn-block sim-hl' : 'td-btn td-btn-block'} onClick={onNext}>Next</button>
      </div>
    </div>
  )
}

export function TendaQuickDone({ ssid, onOk, hl }: { ssid: string; onOk: () => void; hl?: boolean }) {
  return (
    <div className="td-page td-quick">
      <div className="td-card td-done">
        <Icon icon={ic.checkCircleOutline} size={64} />
        <h4>Settings completed</h4>
        <p>The WiFi network has changed. Please connect your phone to <b>{ssid}</b> using the new WiFi password, then visit <b>192.168.0.1</b> again.</p>
        <button type="button" className={hl ? 'td-btn td-btn-block sim-hl' : 'td-btn td-btn-block'} onClick={onOk}>OK</button>
      </div>
    </div>
  )
}

/* ───────────── Wireless Settings → WiFi Name & Password ───────────── */

export function TendaWireless({ ssid, pass, onChange, onSave, saved, error, hl }: {
  ssid: string
  pass: string
  onChange: (patch: { ssid?: string; pass?: string }) => void
  onSave: () => void
  saved?: boolean
  error?: string
  hl?: 'pass' | 'save'
}) {
  return (
    <div className="td-page">
      <h3 className="td-section">WiFi Name &amp; Password</h3>
      <div className="td-card td-form">
        <TdField label="WiFi Name" value={ssid} onChange={v => onChange({ ssid: v })} />
        <label className="td-field">
          <span className="td-field-label">Security Mode</span>
          <select className="td-input" defaultValue="WPA2-PSK"><option>WPA2-PSK</option><option>WPA/WPA2-PSK</option><option>None</option></select>
        </label>
        <TdField label="WiFi Password" value={pass} onChange={v => onChange({ pass: v })} password hl={hl === 'pass'} />
        {error && <p className="td-error">{error}</p>}
        <button type="button" className={hl === 'save' ? 'td-btn td-btn-block sim-hl' : 'td-btn td-btn-block'} onClick={onSave}>Save</button>
      </div>
      <h3 className="td-section">Other wireless settings</h3>
      <div className="td-card td-list">
        {['WiFi Schedule', 'WPS', 'Channel & Bandwidth', 'Transmit Power'].map(t => (
          <div key={t}><span>{t}</span><Icon icon={ic.keyboardArrowRight} size={22} /></div>
        ))}
      </div>
      {saved && <TdToast>Saved successfully</TdToast>}
    </div>
  )
}

/* ───────────── Administration: login password + remote management ───────────── */

export function TendaAdmin({ pass, confirm, remote, onChange, onOk, saved, error, hl, firstTime = true }: {
  pass: string
  confirm: string
  remote: boolean
  onChange: (patch: { pass?: string; confirm?: string; remote?: boolean }) => void
  onOk: () => void
  saved?: boolean
  error?: string
  hl?: 'pass' | 'confirm' | 'remote' | 'ok'
  firstTime?: boolean
}) {
  const scroller = useRef<HTMLDivElement>(null)
  const remoteRef = useRef<HTMLDivElement>(null)

  // When the guide moves on to remote management, scroll down to it.
  useEffect(() => {
    if (hl === 'remote' || hl === 'ok') remoteRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [hl])

  return (
    <div className="td-page" ref={scroller}>
      <h3 className="td-section">Login Password</h3>
      <div className="td-card td-form">
        {!firstTime && <TdField label="Old Password" value="" password placeholder="Current login password" />}
        <TdField label="New Password" value={pass} onChange={v => onChange({ pass: v })} password hl={hl === 'pass'} placeholder="5–32 characters" />
        <TdField label="Confirm Password" value={confirm} onChange={v => onChange({ confirm: v })} password hl={hl === 'confirm'} placeholder="Enter the password again" />
      </div>
      <h3 className="td-section">System Time</h3>
      <div className="td-card td-info">
        <div><span>Time Zone</span><span>(GMT+03:00) Nairobi</span></div>
        <div><span>Sync with Internet time</span><span>Enabled</span></div>
      </div>
      <h3 className="td-section">Remote Web Management</h3>
      <div className="td-card td-form" ref={remoteRef}>
        <label className={hl === 'remote' ? 'td-check sim-hl' : 'td-check'}>
          <input type="checkbox" checked={remote} onChange={e => onChange({ remote: e.target.checked })} />
          <span className="td-checkbox" aria-hidden>{remote && <Icon icon={ic.check} size={16} />}</span>
          Enable
        </label>
        {remote && (
          <>
            <TdField label="Remote IP Address" value="0.0.0.0" readOnly />
            <TdField label="Port" value="8080" readOnly />
          </>
        )}
      </div>
      {error && <p className="td-error td-error-page">{error}</p>}
      <div className="td-actions">
        <button type="button" className={hl === 'ok' ? 'td-btn sim-hl' : 'td-btn'} onClick={onOk}>OK</button>
        <button type="button" className="td-btn td-btn-ghost">Cancel</button>
      </div>
      {saved && <TdToast>Saved successfully</TdToast>}
    </div>
  )
}

/** Banner the router shows when no login password has been set yet. */
export function TendaPasswordPrompt({ onGo, hl }: { onGo: () => void; hl?: boolean }) {
  return (
    <div className="td-prompt">
      <Icon icon={ic.warningFilled} size={22} />
      <span>For your network security, set a login password.</span>
      <button type="button" className={hl ? 'td-link sim-hl' : 'td-link'} onClick={onGo}>Go to set</button>
    </div>
  )
}
