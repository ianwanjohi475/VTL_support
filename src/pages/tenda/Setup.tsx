import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, BlankTab, WifiList, WifiPasswordDialog } from '../../sim/Phone'
import {
  TendaAdmin, TendaPasswordPrompt, TendaQuickDone, TendaQuickInternet, TendaQuickWireless, TendaShell, TendaStatus,
} from '../../sim/Tenda'
import { Finish, Walkthrough, isRouterAddress, type WtStep } from '../../sim/Walkthrough'
import { Icon, ic } from '../../icons'

const DEFAULT_SSID = 'Tenda_8C50'
const NEIGHBOURS = [
  { ssid: 'Safaricom-Home-21', locked: true, strength: 2 as const },
  { ssid: 'ZUKU_8821', locked: true, strength: 1 as const },
]
const SAMPLE = { user: 'VTL005665', pass: 'vtl@5665', ssid: 'VTL-5665', wifiPass: 'Home@2026' }

interface S {
  type: string
  user: string
  pass: string
  ssid: string
  wifiPass: string
  joinPass: string
  dialog: boolean
  adminPass: string
  adminConfirm: string
  remote: boolean
  saved: boolean
  error: string
}

const START: S = {
  type: 'Dynamic IP', user: '', pass: '', ssid: '', wifiPass: '', joinPass: '', dialog: false,
  adminPass: '', adminConfirm: '', remote: false, saved: false, error: '',
}

export function TendaSetup() {
  const [i, setI] = useState(0)
  const [s, setS] = useState<S>(START)
  const [done, setDone] = useState(false)
  const set = (p: Partial<S>) => setS(x => ({ ...x, ...p }))
  const next = () => { set({ error: '' }); setI(n => n + 1) }
  const user = s.user || SAMPLE.user

  const steps: WtStep[] = [
    {
      title: 'Connect to the router’s Wi-Fi',
      text: <p>On the phone, open Wi-Fi settings and tap the router’s default network. Its name (<b>{DEFAULT_SSID}</b>) is printed on the label under the router.</p>,
    },
    {
      title: 'Open 192.168.0.1',
      text: <p>Open the browser, type <b>192.168.0.1</b> in the address bar and tap Go. A new router opens the Quick Setup page.</p>,
      sample: [['Address', '192.168.0.1']],
    },
    {
      title: 'Set up PPPoE',
      text: <p>Set <b>Internet Connection Type</b> to <b>PPPoE</b>, then enter the client’s PPPoE username and password from the account, and tap <b>Next</b>.</p>,
      sample: [['PPPoE Username', SAMPLE.user], ['PPPoE Password (sample)', SAMPLE.pass]],
    },
    {
      title: 'Set the Wi-Fi name and password',
      text: <p>Enter the new <b>WiFi Name</b> and a <b>WiFi Password</b> of at least 8 characters, then tap <b>Next</b>.</p>,
      sample: [['WiFi Name', SAMPLE.ssid], ['WiFi Password', SAMPLE.wifiPass]],
    },
    {
      title: 'Settings saved',
      text: <p>The router saves the settings and restarts its Wi-Fi with the new name. The phone disconnects. Tap <b>OK</b>.</p>,
    },
    {
      title: 'Reconnect with the new password',
      text: <p>Tell the client: open Wi-Fi settings again, tap the <b>new network name</b> and type the <b>new Wi-Fi password</b>.</p>,
      sample: [['Network', s.ssid || SAMPLE.ssid], ['Password', s.wifiPass || SAMPLE.wifiPass]],
    },
    {
      title: 'Open 192.168.0.1 again',
      text: <p>Use the same address, <b>192.168.0.1</b>. The Status page opens and the router asks for a login password.</p>,
      sample: [['Address', '192.168.0.1']],
    },
    {
      title: 'Tap “Go to set”',
      text: <p>Tap <b>Go to set</b> on the login-password reminder at the top of the Status page.</p>,
    },
    {
      title: 'Set the login password',
      text: <p>Use the client’s <b>PPPoE username</b> as the router login password. Enter it in <b>New Password</b> and again in <b>Confirm Password</b>.</p>,
      sample: [['New Password', user], ['Confirm Password', user]],
    },
    {
      title: 'Enable remote management and tap OK',
      text: <p>Scroll down to <b>Remote Web Management</b>, tick <b>Enable</b>, then tap <b>OK</b>.</p>,
    },
  ]

  // Step 9 begins as soon as both password fields match the PPPoE username.
  useEffect(() => {
    if (i === 8 && s.adminPass === user && s.adminConfirm === user) setI(9)
  }, [i, s.adminPass, s.adminConfirm, user])

  const submitInternet = () => {
    if (s.type !== 'PPPoE') return set({ error: 'Choose PPPoE as the connection type.' })
    if (!s.user.trim() || !s.pass) return set({ error: 'Enter the PPPoE username and password.' })
    next()
  }
  const submitWireless = () => {
    if (!s.ssid.trim()) return set({ error: 'Enter a WiFi name.' })
    if (s.wifiPass.length < 8) return set({ error: 'The WiFi password must be at least 8 characters.' })
    next()
  }
  const join = () => {
    if (s.joinPass !== s.wifiPass) return set({ error: 'Incorrect password. Use the new Wi-Fi password.' })
    set({ dialog: false, joinPass: '' }); next()
  }
  const submitAdmin = () => {
    if (s.adminPass.length < 5) return set({ error: 'Enter the new login password.' })
    if (s.adminPass !== s.adminConfirm) return set({ error: 'The two passwords do not match.' })
    if (!s.remote) return set({ error: 'Tick Enable under Remote Web Management.' })
    set({ error: '', saved: true })
    setTimeout(() => setDone(true), 1200)
  }

  const auto = () => {
    switch (i) {
      case 0: return next()
      case 1: return next()
      case 2: set({ type: 'PPPoE', user: SAMPLE.user, pass: SAMPLE.pass, error: '' }); return setI(3)
      case 3: set({ ssid: SAMPLE.ssid, wifiPass: SAMPLE.wifiPass, error: '' }); return setI(4)
      case 4: return next()
      case 5: set({ dialog: false, joinPass: '', ssid: s.ssid || SAMPLE.ssid, wifiPass: s.wifiPass || SAMPLE.wifiPass }); return next()
      case 6: return next()
      case 7: return next()
      case 8: set({ adminPass: user, adminConfirm: user }); return
      case 9: set({ adminPass: user, adminConfirm: user, remote: true, error: '', saved: true }); setTimeout(() => setDone(true), 1200); return
    }
  }

  const restart = () => { setS(START); setI(0); setDone(false) }

  // ── What the phone shows at each step ──
  let device
  if (done) {
    device = (
      <Phone url="192.168.0.1/index.html">
        <TendaShell page="status" menuOpen={false} onToggleMenu={() => {}} onPick={() => {}}>
          <TendaStatus duration="0d 0h 3m 12s" />
        </TendaShell>
      </Phone>
    )
  } else if (i === 0) {
    device = (
      <Phone browser={false}>
        <WifiList
          networks={[{ ssid: DEFAULT_SSID, locked: false, strength: 3 }, ...NEIGHBOURS]}
          onPick={ssid => ssid === DEFAULT_SSID && next()}
          highlight={DEFAULT_SSID}
        />
      </Phone>
    )
  } else if (i === 1 || i === 6) {
    device = (
      <Phone onGo={v => (isRouterAddress(v) ? next() : set({ error: v ? `This site can’t be reached: ${v}` : '' }))} urlHighlight>
        {s.error ? <div className="ph-error"><Icon icon={ic.warning} size={40} /><p>{s.error}</p><small>Check the address is 192.168.0.1</small></div> : <BlankTab />}
      </Phone>
    )
  } else if (i === 2) {
    const hl = s.type !== 'PPPoE' ? 'type' : !s.user ? 'user' : !s.pass ? 'pass' : 'next'
    device = (
      <Phone url="192.168.0.1/quickset.html">
        <TendaShell page="status" menuOpen={false} onToggleMenu={() => {}} onPick={() => {}}>
          <TendaQuickInternet type={s.type} user={s.user} pass={s.pass} onChange={p => set({ ...p, error: '' })} onNext={submitInternet} error={s.error} hl={hl} />
        </TendaShell>
      </Phone>
    )
  } else if (i === 3) {
    const hl = !s.ssid ? 'ssid' : s.wifiPass.length < 8 ? 'pass' : 'next'
    device = (
      <Phone url="192.168.0.1/quickset.html">
        <TendaShell page="status" menuOpen={false} onToggleMenu={() => {}} onPick={() => {}}>
          <TendaQuickWireless ssid={s.ssid} pass={s.wifiPass} onChange={p => set({ ...(p.ssid !== undefined && { ssid: p.ssid }), ...(p.pass !== undefined && { wifiPass: p.pass }), error: '' })} onNext={submitWireless} error={s.error} hl={hl} />
        </TendaShell>
      </Phone>
    )
  } else if (i === 4) {
    device = (
      <Phone url="192.168.0.1/quickset.html">
        <TendaShell page="status" menuOpen={false} onToggleMenu={() => {}} onPick={() => {}}>
          <TendaQuickDone ssid={s.ssid} onOk={next} hl />
        </TendaShell>
      </Phone>
    )
  } else if (i === 5) {
    device = (
      <Phone browser={false}>
        <WifiList
          networks={[{ ssid: s.ssid, locked: true, strength: 3 }, ...NEIGHBOURS]}
          onPick={ssid => ssid === s.ssid && set({ dialog: true, error: '' })}
          highlight={s.dialog ? undefined : s.ssid}
        />
        {s.dialog && (
          <WifiPasswordDialog
            ssid={s.ssid}
            value={s.joinPass}
            onChange={v => set({ joinPass: v, error: '' })}
            onConnect={join}
            onCancel={() => set({ dialog: false })}
            error={s.error}
            highlight
          />
        )}
      </Phone>
    )
  } else if (i === 7) {
    device = (
      <Phone url="192.168.0.1/index.html">
        <TendaShell page="status" menuOpen={false} onToggleMenu={() => {}} onPick={() => {}}>
          <TendaStatus duration="0d 0h 1m 40s"><TendaPasswordPrompt onGo={next} hl /></TendaStatus>
        </TendaShell>
      </Phone>
    )
  } else {
    const hl = i === 8 ? (s.adminPass !== user ? 'pass' : 'confirm') : !s.remote ? 'remote' : 'ok'
    device = (
      <Phone url="192.168.0.1/system.html">
        <TendaShell page="admin" menuOpen={false} onToggleMenu={() => {}} onPick={() => {}}>
          <TendaAdmin
            pass={s.adminPass}
            confirm={s.adminConfirm}
            remote={s.remote}
            onChange={p => set({ ...(p.pass !== undefined && { adminPass: p.pass }), ...(p.confirm !== undefined && { adminConfirm: p.confirm }), ...(p.remote !== undefined && { remote: p.remote }), error: '' })}
            onOk={submitAdmin}
            saved={s.saved}
            error={s.error}
            hl={hl}
          />
        </TendaShell>
      </Phone>
    )
  }

  return (
    <Walkthrough
      eyebrow="Tenda Router · Setup"
      title="Set up a new Tenda router"
      intro="PPPoE, Wi-Fi name and password, reconnecting, then the login password and remote management. Follow along on the phone."
      steps={steps}
      index={i}
      done={done}
      onAuto={auto}
      onRestart={restart}
      device={device}
      finish={
        <Finish
          title="The router is now set"
          next={<>
            <Link to="/tenda/wifi-password" className="btn btn-primary">Next: change Wi-Fi password<Icon icon={ic.arrowForward} size={18} /></Link>
            <button type="button" className="btn btn-ghost" onClick={restart}><Icon icon={ic.restart} size={18} />Run again</button>
          </>}
        >
          <ul className="wt-summary">
            <li><span>Internet</span><b>PPPoE · {s.user || SAMPLE.user}</b></li>
            <li><span>Wi-Fi name</span><b>{s.ssid || SAMPLE.ssid}</b></li>
            <li><span>Login password</span><b>{user} (PPPoE username)</b></li>
            <li><span>Remote management</span><b>Enabled, port 8080</b></li>
          </ul>
          <p>Status shows <b>“You can surf the Internet”</b>. Ask the client to open a website to confirm.</p>
        </Finish>
      }
    />
  )
}
