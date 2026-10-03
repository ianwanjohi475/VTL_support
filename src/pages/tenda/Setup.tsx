import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, BlankTab, WifiList, WifiPasswordDialog } from '../../sim/Phone'
import { TendaAdmin, TendaFirstSetup, TendaPasswordPrompt, TendaShell, TendaStatus, type FirstSetup } from '../../sim/Tenda'
import { Finish, Walkthrough, isRouterAddress, type WtStep } from '../../sim/Walkthrough'
import { Icon, ic } from '../../icons'

const DEFAULT_SSID = 'Tenda_1412B0'
const SAMPLE = { user: 'VTL005665', pass: 'vtl@5665', ssid: 'VTL_NET', wifiPass: 'Home@2026' }

interface S extends FirstSetup {
  joinPass: string
  dialog: boolean
  opened: boolean
  adminPass: string
  adminConfirm: string
  remote: boolean
  saved: boolean
  error: string
}

const START: S = {
  user: '', pass: '', ssid: DEFAULT_SSID, wifiPass: '', joinPass: '', dialog: false, opened: false,
  adminPass: '', adminConfirm: '', remote: false, saved: false, error: '',
}

export function TendaSetup() {
  const [i, setI] = useState(0)
  const [s, setS] = useState<S>(START)
  const [done, setDone] = useState(false)
  const set = (p: Partial<S>) => setS(x => ({ ...x, ...p }))
  const next = () => { set({ error: '' }); setI(n => n + 1) }
  const user = s.user || SAMPLE.user
  const ssid = s.ssid && s.ssid !== DEFAULT_SSID ? s.ssid : SAMPLE.ssid

  const steps: WtStep[] = [
    { title: `Connect to ${DEFAULT_SSID}`, text: <p>Open Wi-Fi on the phone and tap <b>{DEFAULT_SSID}</b>.</p> },
    { title: 'Open 192.168.0.1', text: <p>Type <b>192.168.0.1</b> in the browser and tap Go.</p>, sample: [['Address', '192.168.0.1']] },
    {
      title: 'Fill in the settings and tap OK',
      text: <p>PPPoE is already selected. Enter the user name and password, change the WiFi name, set a WiFi password, then tap <b>OK</b>.</p>,
      sample: [['User Name', SAMPLE.user], ['Password', SAMPLE.pass], ['WiFi Name', SAMPLE.ssid], ['WiFi Password', SAMPLE.wifiPass]],
    },
    { title: `Reconnect to ${ssid}`, text: <p>Tap <b>{ssid}</b> and enter the new WiFi password.</p>, sample: [['Password', s.wifiPass || SAMPLE.wifiPass]] },
    { title: 'Open 192.168.0.1 and tap Go to set', text: <p>Open <b>192.168.0.1</b> again, then tap <b>Go to set</b>.</p>, sample: [['Address', '192.168.0.1']] },
    {
      title: 'Set login password, enable remote, OK',
      text: <p>Enter the <b>PPPoE username</b> in both password boxes. Scroll down, tick <b>Enable</b>, tap <b>OK</b>.</p>,
      sample: [['New Password', user], ['Confirm Password', user]],
    },
  ]

  const submitSettings = () => {
    if (!s.user.trim() || !s.pass) return set({ error: 'Enter the PPPoE user name and password.' })
    if (!s.ssid.trim()) return set({ error: 'Enter a WiFi name.' })
    if (s.wifiPass.length < 8) return set({ error: 'The WiFi password must be at least 8 characters.' })
    next()
  }
  const join = () => {
    if (s.joinPass !== s.wifiPass) return set({ error: 'Incorrect password.' })
    set({ dialog: false, joinPass: '' }); next()
  }
  const submitAdmin = () => {
    if (s.adminPass.length < 5) return set({ error: 'Enter the new login password.' })
    if (s.adminPass !== s.adminConfirm) return set({ error: 'The two passwords do not match.' })
    if (!s.remote) return set({ error: 'Tick Enable under Remote Web Management.' })
    set({ error: '', saved: true })
    setTimeout(() => setDone(true), 1100)
  }

  const auto = () => {
    switch (i) {
      case 0: return next()
      case 1: return next()
      case 2: set({ user: SAMPLE.user, pass: SAMPLE.pass, ssid: SAMPLE.ssid, wifiPass: SAMPLE.wifiPass, error: '' }); return setI(3)
      case 3: set({ dialog: false, joinPass: '', ssid, wifiPass: s.wifiPass || SAMPLE.wifiPass }); return next()
      case 4: set({ opened: false }); return next()
      case 5: set({ adminPass: user, adminConfirm: user, remote: true, error: '', saved: true }); setTimeout(() => setDone(true), 1100)
    }
  }
  const restart = () => { setS(START); setI(0); setDone(false) }

  const urlBar = (
    <Phone onGo={v => (isRouterAddress(v) ? (i === 4 ? set({ opened: true, error: '' }) : next()) : set({ error: v ? `This site can’t be reached: ${v}` : '' }))} urlHighlight>
      {s.error ? <div className="ph-error"><Icon icon={ic.warning} size={40} /><p>{s.error}</p><small>Check the address is 192.168.0.1</small></div> : <BlankTab />}
    </Phone>
  )

  let device
  if (done) {
    device = (
      <Phone url="192.168.0.1/index.html">
        <TendaShell page="status" menuOpen={false} onToggleMenu={() => {}} onPick={() => {}}><TendaStatus duration="0d 0h 3m 12s" /></TendaShell>
      </Phone>
    )
  } else if (i === 0) {
    device = (
      <Phone browser={false}>
        <WifiList networks={[{ ssid: DEFAULT_SSID, locked: false, strength: 3 }]} onPick={x => x === DEFAULT_SSID && next()} highlight={DEFAULT_SSID} />
      </Phone>
    )
  } else if (i === 1) {
    device = urlBar
  } else if (i === 2) {
    const hl = !s.user ? 'user' : !s.pass ? 'pass' : s.ssid === DEFAULT_SSID ? 'ssid' : s.wifiPass.length < 8 ? 'wifiPass' : 'ok'
    device = (
      <Phone url="192.168.0.1/index.html">
        <TendaFirstSetup v={s} onChange={p => set({ ...p, error: '' })} onOk={submitSettings} error={s.error} hl={hl} />
      </Phone>
    )
  } else if (i === 3) {
    device = (
      <Phone browser={false}>
        <WifiList networks={[{ ssid: s.ssid, locked: true, strength: 3 }]} onPick={x => x === s.ssid && set({ dialog: true, error: '' })} highlight={s.dialog ? undefined : s.ssid} />
        {s.dialog && (
          <WifiPasswordDialog ssid={s.ssid} value={s.joinPass} onChange={v => set({ joinPass: v, error: '' })} onConnect={join} onCancel={() => set({ dialog: false })} error={s.error} highlight />
        )}
      </Phone>
    )
  } else if (i === 4 && !s.opened) {
    device = urlBar
  } else if (i === 4) {
    device = (
      <Phone url="192.168.0.1/index.html">
        <TendaShell page="status" menuOpen={false} onToggleMenu={() => {}} onPick={() => {}}>
          <TendaStatus duration="0d 0h 1m 40s"><TendaPasswordPrompt onGo={next} hl /></TendaStatus>
        </TendaShell>
      </Phone>
    )
  } else {
    const hl = s.adminPass !== user ? 'pass' : s.adminConfirm !== user ? 'confirm' : !s.remote ? 'remote' : 'ok'
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
      intro="Six steps. Do them on the phone, or tap Do it for me."
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
            <li><span>PPPoE</span><b>{user}</b></li>
            <li><span>Wi-Fi</span><b>{ssid}</b></li>
            <li><span>Login password</span><b>{user}</b></li>
            <li><span>Remote management</span><b>Enabled</b></li>
          </ul>
        </Finish>
      }
    />
  )
}
