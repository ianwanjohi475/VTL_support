import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Lightbulb, ListChecks, Moon, Siren, Sun, Terminal, Wrench } from '@phosphor-icons/react'
import { useTheme } from '../theme'
import logoUrl from '../assets/vtl-logo-compact.png'
import logoDarkUrl from '../assets/vtl-logo-compact-dark.png'

const NAV = [
  { to: '/', label: 'Guides', Icon: ListChecks, end: true },
  { to: '/incidents', label: 'Incidents', Icon: Siren },
  { to: '/router', label: 'Router setup', short: 'Router', Icon: Wrench },
  { to: '/commands', label: 'Commands', Icon: Terminal },
  { to: '/lights', label: 'Light guide', short: 'Lights', Icon: Lightbulb },
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
            {NAV.map(({ to, label, Icon, end }) => (
              <NavLink key={to} to={to} end={end} className="nav-link">
                <Icon size={18} weight="duotone" className="nav-icon" />{label}
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
            {theme === 'dark' ? <Sun size={19} weight="duotone" /> : <Moon size={19} weight="duotone" />}
          </button>
        </div>
      </header>

      <main className="content">{children}</main>

      <footer className="footer">
        <span>VTL Telecom · Support Toolkit</span>
        <span className="muted">Advancing Technology, Driving Change</span>
      </footer>

      <nav className="tabbar" aria-label="Main">
        {NAV.map(({ to, label, short, Icon, end }) => (
          <NavLink key={to} to={to} end={end} className="tab">
            <Icon size={22} weight="duotone" />
            {short ?? label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
