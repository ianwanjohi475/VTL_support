import { useState, type ReactNode } from 'react'

export interface Marker {
  n: number
  /** Position on the picture, in percent. */
  x: number
  y: number
  label: string
  text: string
}

/**
 * A labelled picture of a piece of equipment. Shows the real photo when it is
 * present in /public, and falls back to a drawn illustration otherwise.
 * Numbered markers sit on top of either.
 */
export function Equipment({ title, src, alt, illustration, markers, note }: {
  title: string
  src: string
  alt: string
  illustration: ReactNode
  markers: Marker[]
  note?: ReactNode
}) {
  const [usePhoto, setUsePhoto] = useState(true)
  const [active, setActive] = useState<number | null>(null)

  return (
    <figure className="card equip">
      <div className="equip-pic">
        {usePhoto
          ? <img src={src} alt={alt} onError={() => setUsePhoto(false)} loading="lazy" />
          : illustration}
        {markers.map(m => (
          <button
            key={m.n}
            type="button"
            className={active === m.n ? 'equip-marker active' : 'equip-marker'}
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
            onMouseEnter={() => setActive(m.n)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(m.n)}
            onBlur={() => setActive(null)}
            onClick={() => setActive(a => (a === m.n ? null : m.n))}
            aria-label={`${m.n}: ${m.label}`}
          >
            {m.n}
          </button>
        ))}
      </div>
      <figcaption>
        <h3>{title}</h3>
        <ol className="equip-legend">
          {markers.map(m => (
            <li key={m.n} className={active === m.n ? 'active' : undefined} onMouseEnter={() => setActive(m.n)} onMouseLeave={() => setActive(null)}>
              <span className="equip-n">{m.n}</span>
              <span><b>{m.label}</b>{m.text}</span>
            </li>
          ))}
        </ol>
        {note && <p className="equip-note">{note}</p>}
      </figcaption>
    </figure>
  )
}

/* Illustrations drawn from the field photos (same 4:3 framing, so the markers
   line up with both the drawing and the photo). */

export function RouterBackArt() {
  return (
    <svg viewBox="0 0 1600 1200" className="equip-art" role="img" aria-label="Back of the Tenda router">
      <defs>
        <linearGradient id="rb-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a2f36" /><stop offset="1" stopColor="#14171b" /></linearGradient>
        <linearGradient id="rb-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#e4e6e9" /></linearGradient>
        <linearGradient id="rb-ant" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#e9ebee" /><stop offset=".5" stopColor="#ffffff" /><stop offset="1" stopColor="#d6d9de" /></linearGradient>
      </defs>
      <rect width="1600" height="1200" fill="url(#rb-bg)" />
      {/* router body */}
      <path d="M300 380 Q300 340 340 336 L1460 330 Q1500 330 1500 370 L1490 600 Q1490 632 1456 634 L340 640 Q306 640 304 606 Z" fill="url(#rb-body)" stroke="#c9ccd1" strokeWidth="4" />
      <rect x="560" y="345" width="320" height="34" rx="6" fill="#30343a" opacity=".85" />
      <rect x="960" y="390" width="230" height="40" rx="6" fill="#30343a" opacity=".55" />
      {/* yellow port block */}
      <rect x="410" y="440" width="425" height="140" rx="8" fill="#f4e04d" stroke="#c9b52c" strokeWidth="4" />
      {[455, 560, 665, 770].map((x, i) => (
        <g key={x}>
          <rect x={x - 40} y="470" width="80" height="78" rx="6" fill="#d7c235" stroke="#9c8a17" strokeWidth="4" />
          <rect x={x - 26} y="488" width="52" height="44" rx="3" fill="#2b2a1d" />
          <rect x={x - 16} y="528" width="32" height="12" fill="#2b2a1d" />
          {i === 0
            ? <rect x={x - 32} y="556" width="64" height="12" rx="3" fill="#2f7fd6" />
            : <text x={x} y="570" fontSize="22" fontWeight="700" textAnchor="middle" fill="#6b6420">{4 - i}</text>}
        </g>
      ))}
      {/* patch cord in WAN */}
      <rect x="415" y="476" width="80" height="64" rx="6" fill="#d9d2b8" stroke="#a49b7a" strokeWidth="4" />
      <path d="M455 540 C 455 640, 470 760, 640 800 S 900 820, 960 790" fill="none" stroke="#f3f3f1" strokeWidth="26" strokeLinecap="round" />
      <path d="M455 540 C 455 640, 470 760, 640 800 S 900 820, 960 790" fill="none" stroke="#c9c9c4" strokeWidth="4" strokeLinecap="round" opacity=".6" />
      {/* power jack and cable */}
      <rect x="975" y="505" width="62" height="56" rx="8" fill="#1d1f22" stroke="#000" strokeWidth="3" />
      <path d="M1006 560 C 1006 640, 1020 700, 1000 800" fill="none" stroke="#151617" strokeWidth="30" strokeLinecap="round" />
      <circle cx="1075" cy="540" r="16" fill="#2b2e33" stroke="#9aa0a7" strokeWidth="4" />
      {/* antennas */}
      {[[250, 120, 300, 620], [930, 40, 910, 650], [1590, 260, 1500, 690]].map(([x1, y1, x2, y2], k) => (
        <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#rb-ant)" strokeWidth="78" strokeLinecap="round" />
      ))}
    </svg>
  )
}

export function InjectorArt() {
  return (
    <svg viewBox="0 0 1600 1200" className="equip-art" role="img" aria-label="PoE injector">
      <defs>
        <linearGradient id="pi-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8e9393" /><stop offset="1" stopColor="#6a6f70" /></linearGradient>
        <linearGradient id="pi-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a2d33" /><stop offset="1" stopColor="#101114" /></linearGradient>
        <radialGradient id="pi-led"><stop offset="0" stopColor="#d9ecff" /><stop offset=".35" stopColor="#3d8bff" /><stop offset="1" stopColor="#3d8bff" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="1600" height="1200" fill="url(#pi-bg)" />
      {/* extension socket and white cord behind */}
      <path d="M640 0 C 660 200, 700 300, 700 420" fill="none" stroke="#f1f1ef" strokeWidth="34" strokeLinecap="round" />
      <rect x="590" y="380" width="300" height="760" rx="26" fill="#f4f4f2" stroke="#c9c9c4" strokeWidth="4" />
      {/* injector body */}
      <rect x="480" y="470" width="600" height="390" rx="40" fill="url(#pi-body)" stroke="#000" strokeWidth="5" />
      {Array.from({ length: 13 }, (_, k) => (
        <g key={k}>
          <line x1={540 + k * 30} y1="505" x2={530 + k * 30} y2="540" stroke="#4a4e55" strokeWidth="6" strokeLinecap="round" />
          <line x1={545 + k * 30} y1="800" x2={535 + k * 30} y2="835" stroke="#4a4e55" strokeWidth="6" strokeLinecap="round" />
        </g>
      ))}
      <rect x="820" y="575" width="110" height="200" rx="8" fill="none" stroke="#2f3238" strokeWidth="5" />
      {/* blue power LED */}
      <circle cx="930" cy="525" r="60" fill="url(#pi-led)" />
      <ellipse cx="930" cy="525" rx="20" ry="14" fill="#9ccaff" />
      {/* two RJ45 ports with white cables */}
      {[[1110, 540], [1120, 670]].map(([x, y], k) => (
        <g key={k}>
          <rect x={x - 70} y={y - 10} width="90" height="90" rx="6" fill="#0e0f11" stroke="#000" strokeWidth="4" />
          <rect x={x - 10} y={y + 2} width="80" height="66" rx="6" fill="#e9eff2" fillOpacity=".75" stroke="#b9c3c8" strokeWidth="4" />
          <path d={`M${x + 70} ${y + 35} C ${x + 220} ${y + 20 - k * 30}, ${x + 360} ${y - 80 - k * 60}, 1620 ${y - 160 - k * 40}`} fill="none" stroke="#f3f3f1" strokeWidth="30" strokeLinecap="round" />
        </g>
      ))}
      {/* power plug and cable */}
      <rect x="610" y="880" width="320" height="300" rx="40" fill="#18191c" stroke="#000" strokeWidth="5" />
      <path d="M900 1030 C 1000 1040, 1080 1060, 1180 1120" fill="none" stroke="#131416" strokeWidth="34" strokeLinecap="round" />
    </svg>
  )
}
