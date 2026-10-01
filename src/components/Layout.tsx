import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb, faListCheck, faMoon, faSun, faTerminal } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../theme'
import logoUrl from '../assets/vtl-logo-compact.png'
import logoDarkUrl from '../assets/vtl-logo-compact-dark.png'

const NAV = [
  { to: '/', label: 'Guides', icon: faListCheck, end: true },
  { to: '/commands', label: 'Network commands', short: 'Commands', icon: faTerminal },
  { to: '/lights', label: 'Light guide', short: 'Lights', icon: faLightbulb },
]

export function Layout({ children }: { children: ReactNode }) {
  const [theme, toggleTheme] = useTheme()

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="brand" aria-label="VTL Telecom support toolkit, home">
            <img src={logoUrl} alt="VTL Telecom" className="brand-logo logo-light" />
            <img src={logoDarkUrl} alt="" aria-hidden className="brand-logo logo-dark" />
            <span className="brand-name">Support Toolkit</span>
          </Link>
          <nav className="nav" aria-label="Main">
            {NAV.map(n => (
              <NavLink key={n.to} to={n.to} end={n.end} className="nav-link">
                <FontAwesomeIcon icon={n.icon} className="nav-icon" />{n.label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
          </button>
        </div>
      </header>

      <main className="content">{children}</main>

      <nav className="tabbar" aria-label="Main">
        {NAV.map(n => (
          <NavLink key={n.to} to={n.to} end={n.end} className="tab">
            <FontAwesomeIcon icon={n.icon} className="tab-icon" />
            {n.short ?? n.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
