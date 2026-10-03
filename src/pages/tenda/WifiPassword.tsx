import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, BlankTab, WifiList, WifiPasswordDialog } from '../../sim/Phone'
import { TendaLogin, TendaShell, TendaStatus, TendaWireless } from '../../sim/Tenda'
import { Finish, Walkthrough, isRouterAddress, type WtStep } from '../../sim/Walkthrough'
import { Icon, ic } from '../../icons'

const LOGIN = 'VTL005665'
const SSID = 'VTL-5665'
const OLD = 'Home@2026'
const NEW = 'Vtl@2026new'

interface S {
  login: string
  menu: boolean
  pass: string
  joinPass: string
  dialog: boolean
  saved: boolean
  error: string
}
const START: S = { login: '', menu: false, pass: OLD, joinPass: '', dialog: false, saved: false, error: '' }

export function TendaWifiPassword() {
  const [i, setI] = useState(0)
  const [s, setS] = useState<S>(START)
  const [done, setDone] = useState(false)
  const set = (p: Partial<S>) => setS(x => ({ ...x, ...p }))
  const next = () => { set({ error: '' }); setI(n => n + 1) }

  const steps: WtStep[] = [
    {
      title: 'Open 192.168.0.1',
      text: <p>With the phone connected to the client’s Wi-Fi, open the browser and go to <b>192.168.0.1</b>. The Tenda login page opens.</p>,
      sample: [['Address', '192.168.0.1']],
    },
    {
      title: 'Log in with the PPPoE username',
      text: <p>The router login password is the client’s <b>PPPoE username</b>. Type it in <b>Login Password</b> and tap <b>Login</b>.</p>,
      sample: [['Login Password', LOGIN]],
    },
    {
      title: 'Open the menu',
      text: <p>Tap the <b>menu button</b> (three lines) at the top right of the orange bar.</p>,
    },
    {
      title: 'Go to Wireless Settings',
      text: <p>Tap <b>Wireless Settings</b>.</p>,
    },
    {
      title: 'Change the Wi-Fi password',
      text: <p>Clear the old <b>WiFi Password</b>, type the new one (at least 8 characters) and tap <b>Save</b>. Leave the WiFi name as it is.</p>,
      sample: [['New WiFi Password', NEW]],
    },
    {
      title: 'Reconnect with the new password',
      text: <p>Every device disconnects. Tell the client to tap <b>{SSID}</b> in Wi-Fi settings and enter the <b>new password</b>. Repeat on each device.</p>,
      sample: [['Password', s.pass.length >= 8 && s.pass !== OLD ? s.pass : NEW]],
    },
  ]

  const login = () => {
    if (s.login !== LOGIN) return set({ error: 'Incorrect password. Use the client’s PPPoE username.' })
    next()
  }
  const save = () => {
    if (s.pass.length < 8) return set({ error: 'The WiFi password must be at least 8 characters.' })
    if (s.pass === OLD) return set({ error: 'Type a new password first.' })
    set({ saved: true, error: '' })
    setTimeout(() => { set({ saved: false }); setI(5) }, 1100)
  }
  const join = () => {
    if (s.joinPass !== s.pass) return set({ error: 'Incorrect password. Use the new Wi-Fi password.' })
    set({ dialog: false }); setDone(true)
  }

  const auto = () => {
    switch (i) {
      case 0: return next()
      case 1: set({ login: LOGIN }); return next()
      case 2: set({ menu: true }); return next()
      case 3: set({ menu: false }); return next()
      case 4: set({ pass: NEW, saved: true, error: '' }); setTimeout(() => { set({ saved: false }); setI(5) }, 1100); return
      case 5: if (s.pass === OLD || s.pass.length < 8) set({ pass: NEW }); set({ dialog: false }); setDone(true)
    }
  }
  const restart = () => { setS(START); setI(0); setDone(false) }

  let device
  if (done) {
    device = (
      <Phone browser={false}>
        <WifiList networks={[{ ssid: 'Safaricom-Home-21', locked: true, strength: 2 }]} connected={SSID} onPick={() => {}} />
      </Phone>
    )
  } else if (i === 0) {
    device = (
      <Phone onGo={v => (isRouterAddress(v) ? next() : set({ error: v ? `This site can’t be reached: ${v}` : '' }))} urlHighlight>
        {s.error ? <div className="ph-error"><Icon icon={ic.warning} size={40} /><p>{s.error}</p><small>Check the address is 192.168.0.1</small></div> : <BlankTab />}
      </Phone>
    )
  } else if (i === 1) {
    device = (
      <Phone url="192.168.0.1/login.html">
        <TendaLogin value={s.login} onChange={v => set({ login: v, error: '' })} onLogin={login} error={s.error} hl={s.login === LOGIN ? 'login' : 'password'} />
      </Phone>
    )
  } else if (i === 2 || i === 3) {
    device = (
      <Phone url="192.168.0.1/index.html">
        <TendaShell
          page="status"
          menuOpen={s.menu}
          onToggleMenu={() => { set({ menu: !s.menu }); if (i === 2 && !s.menu) next() }}
          onPick={id => { if (id === 'wireless') { set({ menu: false }); setI(4) } }}
          hlMenu={i === 2}
          hlItem={i === 3 ? 'wireless' : undefined}
        >
          <TendaStatus />
        </TendaShell>
      </Phone>
    )
  } else if (i === 4) {
    device = (
      <Phone url="192.168.0.1/wireless_ssid.html">
        <TendaShell page="wireless" menuOpen={false} onToggleMenu={() => {}} onPick={() => {}}>
          <TendaWireless
            ssid={SSID}
            pass={s.pass}
            onChange={p => set({ ...(p.pass !== undefined ? { pass: p.pass } : {}), error: '' })}
            onSave={save}
            saved={s.saved}
            error={s.error}
            hl={s.pass !== OLD && s.pass.length >= 8 ? 'save' : 'pass'}
          />
        </TendaShell>
      </Phone>
    )
  } else {
    device = (
      <Phone browser={false}>
        <WifiList
          networks={[{ ssid: SSID, locked: true, strength: 3 }, { ssid: 'Safaricom-Home-21', locked: true, strength: 2 }]}
          onPick={ssid => ssid === SSID && set({ dialog: true, error: '' })}
          highlight={s.dialog ? undefined : SSID}
        />
        {s.dialog && (
          <WifiPasswordDialog ssid={SSID} value={s.joinPass} onChange={v => set({ joinPass: v, error: '' })} onConnect={join} onCancel={() => set({ dialog: false })} error={s.error} highlight />
        )}
      </Phone>
    )
  }

  return (
    <Walkthrough
      eyebrow="Tenda Router · Wi-Fi"
      title="Change the Wi-Fi password"
      intro="Log in with the PPPoE username, go to Wireless Settings and set a new password. Then reconnect every device."
      steps={steps}
      index={i}
      done={done}
      onAuto={auto}
      onRestart={restart}
      device={device}
      finish={
        <Finish
          title="Wi-Fi password changed"
          next={<>
            <Link to="/tenda/packet-loss" className="btn btn-primary">Next: packet loss test<Icon icon={ic.arrowForward} size={18} /></Link>
            <button type="button" className="btn btn-ghost" onClick={restart}><Icon icon={ic.restart} size={18} />Run again</button>
          </>}
        >
          <p>The phone is connected to <b>{SSID}</b> with the new password. Ask the client to reconnect their other devices (TV, laptops) the same way.</p>
          <p className="muted">Note the new Wi-Fi password on the ticket if the client asks you to keep it.</p>
        </Finish>
      }
    />
  )
}
