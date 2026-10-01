import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTheme } from '../theme'
import logoUrl from '../assets/vtl-logo-compact.png'
import logoDarkUrl from '../assets/vtl-logo-compact-dark.png'
import { Icon, ic } from '../icons'

const NAV = [
  { to: '/', label: 'Guides', icon: ic.checklist, end: true },
  { to: '/incidents', label: 'Incidents', icon: ic.crisisAlert },
  { to: '/router', label: 'Router setup', short: 'Router', icon: ic.router },
  { to: '/commands', label: 'Commands', icon: ic.terminal },
  { to: '/lights', label: 'Light guide', short: 'Lights', icon: ic.lightbulb },
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
            {NAV.map(({ to, label, icon, end }) => (
              <NavLink key={to} to={to} end={end} className="nav-link">
                <Icon icon={icon} size={19} className="nav-icon" />{label}
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
            {theme === 'dark' ? <Icon icon={ic.lightMode} size={19} /> : <Icon icon={ic.darkMode} size={19} />}
          </button>
        </div>
      </header>

      <main className="content">{children}</main>

      <footer className="footer">
        <span>VTL Telecom · Support Toolkit</span>
        <span className="muted">Advancing Technology, Driving Change</span>
      </footer>

      <nav className="tabbar" aria-label="Main">
        {NAV.map(({ to, label, short, icon, end }) => (
          <NavLink key={to} to={to} end={end} className="tab">
            <Icon icon={icon} size={24} />
            {short ?? label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
