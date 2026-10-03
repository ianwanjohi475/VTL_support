import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Caption } from '../components/ui'
import { Icon, ic } from '../icons'
import { Equipment, InjectorArt, RouterBackArt, type Marker } from '../components/Equipment'

type Mode = 'normal' | 'bypass'
type Led = 'blink' | 'off' | 'check'
type Hl = 'wan' | 'ports' | 'patch' | 'outdoor' | 'none'

/* ───────────── Wiring diagram ───────────── */

function Port({ x, y, label, active, hl }: { x: number; y: number; label: string; active?: boolean; hl?: boolean }) {
  return (
    <g className={hl ? 'svg-hl' : undefined}>
      <rect x={x - 14} y={y - 12} width={28} height={20} rx={3} className={active ? 'pd-port on' : 'pd-port'} />
      <rect x={x - 8} y={y - 6} width={16} height={8} rx={1} className="pd-port-hole" />
      {label && <text x={x} y={y - 18} className="pd-port-label" textAnchor="middle">{label}</text>}
    </g>
  )
}

function Led({ x, y, state, label }: { x: number; y: number; state: Led; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={7} className={`pd-led ${state}`} />
      {state === 'check' && <circle cx={x} cy={y} r={13} className="pd-led-ring" />}
      <text x={x + 14} y={y + 4} className="pd-small">{label}</text>
    </g>
  )
}

function Router({ x, y, w, led, hlWan, wanX, lanXs }: { x: number; y: number; w: number; led: Led; hlWan: boolean; wanX: number; lanXs: number[] }) {
  return (
    <g>
      <line x1={x + 22} y1={y} x2={x + 10} y2={y - 46} className="pd-antenna" />
      <line x1={x + w - 22} y1={y} x2={x + w - 10} y2={y - 46} className="pd-antenna" />
      <rect x={x} y={y} width={w} height={64} rx={12} className="pd-box router" />
      <text x={x + 18} y={y + 28} className="pd-brand">Tenda</text>
      <text x={x + 84} y={y + 28} className="pd-small">Router</text>
      <Led x={x + w - 64} y={y + 22} state={led} label="WAN" />
      <Port x={wanX} y={y + 64} label="WAN" active={led === 'blink'} hl={hlWan} />
      {lanXs.map((lx, i) => <Port key={lx} x={lx} y={y + 64} label={`LAN${i + 1}`} />)}
    </g>
  )
}

function Diagram({ mode, led, hl }: { mode: Mode; led: Led; hl: Hl }) {
  const flow = led === 'blink' ? ' flowing' : ''
  return (
    <>
      {/* Wide layout */}
      <svg className="pd pd-wide" viewBox="0 0 1000 360" role="img" aria-label="PoE wiring diagram">
        <line x1={255} y1={20} x2={255} y2={340} className="pd-wall" />
        <text x={240} y={36} className="pd-zone" textAnchor="end">OUTSIDE</text>
        <text x={272} y={36} className="pd-zone">INSIDE THE HOUSE</text>

        <g className={hl === 'outdoor' ? 'svg-hl' : undefined}>
          <rect x={40} y={110} width={160} height={64} rx={10} className="pd-box switch" />
          <text x={58} y={138} className="pd-title">Switch</text>
          <text x={58} y={158} className="pd-small">Outdoor</text>
          {[140, 160, 180].map(px => <rect key={px} x={px - 7} y={150} width={14} height={10} rx={1} className="pd-port-hole dim" />)}
        </g>
        <Port x={170} y={174} label="" active />

        {/* PoE injector */}
        <rect x={320} y={110} width={190} height={64} rx={10} className="pd-box poe" />
        <text x={338} y={138} className="pd-title">PoE injector</text>
        <circle cx={488} cy={128} r={6} className="pd-led power" />
        <text x={474} y={132} className="pd-small" textAnchor="end">PWR</text>
        <line x1={415} y1={110} x2={415} y2={70} className="pd-power" />
        <text x={415} y={60} className="pd-small" textAnchor="middle">Power adapter</text>
        <Port x={365} y={174} label="POE" active={mode === 'normal'} hl={hl === 'ports'} />
        <Port x={465} y={174} label="LAN" active={mode === 'normal'} hl={hl === 'ports' || hl === 'patch'} />

        <Router x={640} y={110} w={300} led={led} hlWan={hl === 'wan' || hl === 'ports'} wanX={690} lanXs={[750, 800, 850]} />

        {mode === 'normal' ? (
          <>
            <path d="M170 186 V262 H365 V186" className={'pd-cable outdoor' + flow} />
            <text x={264} y={286} className="pd-cable-label">Cable from outside switch</text>
            <path d="M465 186 V236 H690 V186" className={'pd-cable patch' + flow + (hl === 'patch' ? ' svg-hl' : '')} />
            <text x={578} y={226} className="pd-cable-label" textAnchor="middle">Ethernet patch cord</text>
          </>
        ) : (
          <>
            <path d="M170 186 V300 H690 V186" className={'pd-cable outdoor' + flow} />
            <text x={430} y={324} className="pd-cable-label" textAnchor="middle">Outside cable plugged straight into WAN</text>
            <path d="M465 186 V222 H540" className="pd-cable patch unplugged" />
            <text x={548} y={226} className="pd-small">patch cord unplugged</text>
          </>
        )}
      </svg>

      {/* Phone layout */}
      <svg className="pd pd-tall" viewBox="0 0 360 640" role="img" aria-label="PoE wiring diagram">
        <line x1={20} y1={150} x2={340} y2={150} className="pd-wall" />
        <text x={24} y={140} className="pd-zone">OUTSIDE</text>
        <text x={24} y={172} className="pd-zone">INSIDE THE HOUSE</text>

        <g className={hl === 'outdoor' ? 'svg-hl' : undefined}>
          <rect x={100} y={30} width={160} height={60} rx={10} className="pd-box switch" />
          <text x={118} y={56} className="pd-title">Switch</text>
          <text x={118} y={76} className="pd-small">Outdoor</text>
        </g>
        <Port x={230} y={90} label="" active />

        <rect x={80} y={230} width={200} height={64} rx={10} className="pd-box poe" />
        <text x={96} y={256} className="pd-title">PoE injector</text>
        <circle cx={258} cy={250} r={6} className="pd-led power" />
        <Port x={130} y={294} label="POE" active={mode === 'normal'} hl={hl === 'ports'} />
        <Port x={230} y={294} label="LAN" active={mode === 'normal'} hl={hl === 'ports' || hl === 'patch'} />

        <Router x={40} y={470} w={280} led={led} hlWan={hl === 'wan' || hl === 'ports'} wanX={90} lanXs={[150, 200, 250]} />

        {mode === 'normal' ? (
          <>
            <path d="M230 102 V200 H50 V340 H130 V306" className={'pd-cable outdoor' + flow} />
            <path d="M230 306 V380 H340 V586 H90 V546" className={'pd-cable patch' + flow + (hl === 'patch' ? ' svg-hl' : '')} />
            <text x={190} y={404} className="pd-cable-label" textAnchor="middle">Patch cord: LAN → WAN</text>
          </>
        ) : (
          <>
            <path d="M230 102 V200 H22 V606 H90 V546" className={'pd-cable outdoor' + flow} />
            <path d="M230 306 V350 H290" className="pd-cable patch unplugged" />
            <text x={200} y={628} className="pd-cable-label" textAnchor="middle">Outside cable → WAN</text>
          </>
        )}
      </svg>
    </>
  )
}


const ROUTER_MARKERS: Marker[] = [
  { n: 1, x: 28, y: 42, label: 'WAN port (blue mark)', text: ' The patch cord from the PoE injector’s LAN port plugs in here. The WAN light on the front blinks when internet arrives.' },
  { n: 2, x: 44, y: 42, label: 'LAN ports 3, 2, 1', text: ' For wired devices like a TV or computer. The cable from the PoE never goes here.' },
  { n: 3, x: 63, y: 37, label: 'Power', text: ' The router’s own adapter. No lights at all on the router? Check this plug and the socket.' },
  { n: 4, x: 69, y: 53, label: 'Reset button', text: ' Holding it for about 8 seconds factory-resets the router. Don’t press it unless you mean to.' },
]

const INJECTOR_MARKERS: Marker[] = [
  { n: 1, x: 58, y: 43, label: 'Power light (blue)', text: ' On means the injector has power. Off: check the plug and the socket.' },
  { n: 2, x: 70, y: 47, label: 'POE port', text: ' The cable from the switch outside the house.' },
  { n: 3, x: 70.5, y: 58, label: 'LAN port', text: ' The ethernet patch cord that goes to the router’s WAN port.' },
  { n: 4, x: 48, y: 86, label: 'Power adapter', text: ' Must be plugged in and switched on at the socket.' },
]

/* ───────────── Troubleshooting flow ───────────── */

type NodeId = 'wan' | 'reseat' | 'bypass' | 'isolate' | 'ok-line' | 'ok-loose' | 'fix-patch' | 'fix-poe' | 'esc-outside'

interface FlowNode {
  title: string
  text: string[]
  ask?: string
  yes?: { label: string; to: NodeId }
  no?: { label: string; to: NodeId }
  result?: 'ok' | 'fix' | 'esc'
  diagram: { mode: Mode; led: Led; hl: Hl }
}

const FLOW: Record<NodeId, FlowNode> = {
  wan: {
    title: 'Check the WAN light on the router',
    text: ['Ask the client to look at the light marked WAN (or the globe icon) on the Tenda router.', 'A blinking WAN light means internet is reaching the router.'],
    ask: 'Is the WAN light blinking?',
    yes: { label: 'Yes, it’s blinking', to: 'ok-line' },
    no: { label: 'No, it’s off', to: 'reseat' },
    diagram: { mode: 'normal', led: 'check', hl: 'wan' },
  },
  reseat: {
    title: 'Check for a loose connection',
    text: [
      'Push each plug in firmly until it clicks: the outside cable in the POE port, the patch cord in the LAN port, and the patch cord in the router’s WAN port.',
      'Check the PoE injector’s power adapter is plugged in and switched on.',
    ],
    ask: 'Is the WAN light blinking now?',
    yes: { label: 'Yes, it’s blinking now', to: 'ok-loose' },
    no: { label: 'No, still off', to: 'bypass' },
    diagram: { mode: 'normal', led: 'off', hl: 'ports' },
  },
  bypass: {
    title: 'Bypass the PoE injector',
    text: [
      'Unplug the ethernet cable that comes from outside directly from the POE port.',
      'Plug it straight into the WAN port on the router.',
      'Wait about 30 seconds and check the WAN light, then try a website.',
    ],
    ask: 'Does the WAN light blink and is there internet?',
    yes: { label: 'Yes, WAN blinks and internet works', to: 'isolate' },
    no: { label: 'No, WAN still off', to: 'esc-outside' },
    diagram: { mode: 'bypass', led: 'check', hl: 'wan' },
  },
  isolate: {
    title: 'The fault is between the POE port and the router',
    text: [
      'Internet works without the injector, so the problem is the ethernet patch cord, the PoE injector, or a loose connection.',
      'Put the outside cable back into the POE port. Then swap the patch cord (LAN → WAN) for a known-good one.',
    ],
    ask: 'With the new patch cord, does the WAN light blink?',
    yes: { label: 'Yes, it works now', to: 'fix-patch' },
    no: { label: 'No, still off', to: 'fix-poe' },
    diagram: { mode: 'normal', led: 'check', hl: 'patch' },
  },
  'ok-line': {
    title: 'Internet is reaching the router',
    text: ['The PoE connection is working. If the client still has no internet, check the router: open 192.168.0.1 and look at the Status page.'],
    result: 'ok',
    diagram: { mode: 'normal', led: 'blink', hl: 'none' },
  },
  'ok-loose': {
    title: 'Resolved: loose connection',
    text: ['A plug was loose. Ask the client to keep the cables where they won’t be knocked or pulled.'],
    result: 'ok',
    diagram: { mode: 'normal', led: 'blink', hl: 'none' },
  },
  'fix-patch': {
    title: 'Resolved: faulty patch cord',
    text: ['The old ethernet patch cord was faulty. Leave the new one in place and note it on the ticket.'],
    result: 'fix',
    diagram: { mode: 'normal', led: 'blink', hl: 'none' },
  },
  'fix-poe': {
    title: 'Faulty PoE injector',
    text: [
      'The line works direct to the router and the patch cord has been swapped, so the PoE injector (or its power adapter) is faulty.',
      'Replace the injector. Until then, the outside cable can stay in the router’s WAN port if the client has internet that way.',
    ],
    result: 'fix',
    diagram: { mode: 'bypass', led: 'blink', hl: 'none' },
  },
  'esc-outside': {
    title: 'Escalate: fault outside the house',
    text: [
      'There is no signal even with the cable straight into the router, so the problem is the cable from outside or the outdoor switch.',
      'Put the cable back in the POE port and book the field team. Note the light states on the ticket.',
    ],
    result: 'esc',
    diagram: { mode: 'bypass', led: 'off', hl: 'outdoor' },
  },
}

const RESULT = {
  ok: { label: 'Resolved', cls: 'ok', icon: ic.checkCircle },
  fix: { label: 'Fix on site', cls: 'warn', icon: ic.handyman },
  esc: { label: 'Escalate', cls: 'bad', icon: ic.warning },
} as const

export function Poe() {
  const [path, setPath] = useState<NodeId[]>(['wan'])
  const cur = FLOW[path[path.length - 1]]
  const go = (to: NodeId) => setPath(p => [...p, to])
  const back = () => setPath(p => (p.length > 1 ? p.slice(0, -1) : p))
  const restart = () => setPath(['wan'])

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <Caption>PoE Connection</Caption>
          <h1>PoE connection guide</h1>
          <p>How the PoE injector connects the outside line to the router, and how to find the fault when there’s no internet.</p>
        </div>
      </header>

      <section className="card poe-how">
        <div className="poe-diagram">
          <Diagram {...cur.diagram} />
          <div className="poe-legend">
            <span><i className="lg outdoor" />Cable from outside</span>
            <span><i className="lg patch" />Ethernet patch cord</span>
            <span><i className="lg led" />WAN light blinking = internet</span>
          </div>
        </div>
        <ol className="poe-steps">
          <li><b>Outside cable → POE port.</b> The cable traced from the switch outside the house enters the <b>POE</b> port on the injector.</li>
          <li><b>Power.</b> The injector’s adapter is plugged in; its power light is on.</li>
          <li><b>LAN → WAN.</b> An ethernet patch cord runs from the injector’s <b>LAN</b> port to the router’s <b>WAN</b> port.</li>
          <li><b>WAN blinks.</b> A blinking WAN light on the router shows internet is coming in.</li>
        </ol>
      </section>

      <section className="section">
        <div className="section-head"><h2 className="section-title">Know the equipment</h2><span className="muted">Tap a number to see what it is</span></div>
        <div className="equip-grid">
          <Equipment
            title="PoE injector"
            src="/poe/poe-injector.jpg"
            alt="PoE injector with its blue power light on and two network cables plugged in"
            illustration={<InjectorArt />}
            markers={INJECTOR_MARKERS}
            note="Each port has a small label printed beside it. The cable from outside always goes in POE; the patch cord to the router always comes from LAN."
          />
          <Equipment
            title="Router (back)"
            src="/poe/router-back.jpg"
            alt="Back of the white Tenda router with the patch cord in the WAN port"
            illustration={<RouterBackArt />}
            markers={ROUTER_MARKERS}
          />
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="section-title">No internet? Find the fault</h2>
          {path.length > 1 && <button type="button" className="link-btn" onClick={restart}><Icon icon={ic.restart} size={16} />Start over</button>}
        </div>

        <div className="poe-flow">
          <ol className="poe-trail">
            {path.map((id, k) => (
              <li key={id + k} className={k === path.length - 1 ? 'current' : 'done'}>
                <span className="wt-dot">{k === path.length - 1 ? k + 1 : <Icon icon={ic.check} size={14} />}</span>
                {FLOW[id].title}
              </li>
            ))}
          </ol>

          <article className={cur.result ? `card poe-card outcome ${RESULT[cur.result].cls}` : 'card poe-card'} aria-live="polite">
            {cur.result
              ? <span className="outcome-badge"><Icon icon={RESULT[cur.result].icon} size={19} />{RESULT[cur.result].label}</span>
              : <span className="wt-count">Step {path.length}</span>}
            <h3>{cur.title}</h3>
            {cur.text.map(t => <p key={t}>{t}</p>)}
            {cur.ask && (
              <div className="options">
                <div className="options-label">{cur.ask}</div>
                {cur.yes && <button type="button" className="option yes" onClick={() => go(cur.yes!.to)}><span>{cur.yes.label}</span><Icon icon={ic.chevronRight} size={20} className="chev" /></button>}
                {cur.no && <button type="button" className="option no" onClick={() => go(cur.no!.to)}><span>{cur.no.label}</span><Icon icon={ic.chevronRight} size={20} className="chev" /></button>}
              </div>
            )}
            <div className="outcome-actions">
              {path.length > 1 && <button type="button" className="btn btn-ghost" onClick={back}><Icon icon={ic.arrowBack} size={18} />Previous step</button>}
              {cur.result && <button type="button" className="btn btn-ghost" onClick={restart}><Icon icon={ic.restart} size={18} />Start over</button>}
              {cur.result === 'ok' && path[path.length - 1] === 'ok-line' && (
                <Link to="/tenda" className="btn btn-soft"><Icon icon={ic.router} size={18} />Check the Tenda router</Link>
              )}
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}
