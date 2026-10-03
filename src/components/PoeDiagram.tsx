/* Small wiring diagram: outside switch → PoE injector (POE, LAN) → router WAN. */

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

export function PoeDiagram({ mode, led, hl }: { mode: Mode; led: Led; hl: Hl }) {
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
