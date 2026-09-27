import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesLeft, faAnglesRight, faBell, faCircleUser, faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { NAV, SETTINGS_NAV, TABS, type NavId, type NavItem, type TabId } from '../data'
import logoUrl from '../assets/vtl-logo-compact.png'
import logoDarkUrl from '../assets/vtl-logo-compact-dark.png'
import { useTheme } from '../theme'

const COLLAPSE_KEY = 'vtl.sidebarCollapsed'

function readCollapsed() {
  try { return localStorage.getItem(COLLAPSE_KEY) === '1' } catch { return false }
}

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="VTL Telecom troubleshooting, home">
      <img src={logoUrl} alt="VTL Telecom" className="logo-img logo-light" />
      <img src={logoDarkUrl} alt="" aria-hidden className="logo-img logo-dark" />
      <span className="logo-word">Troubleshooting</span>
    </Link>
  )
}

function NavButton({ item, active, collapsed }: { item: NavItem; active: boolean; collapsed: boolean }) {
  const navigate = useNavigate()
  const { label, icon, to } = item
  return (
    <button
      type="button"
      className={active ? 'nav-item active' : 'nav-item'}
      aria-current={active ? 'page' : undefined}
      title={collapsed ? label : undefined}
      onClick={() => to && navigate(to)}
    >
      <FontAwesomeIcon icon={icon} fixedWidth className="icon" />
      <span className="nav-text">{label}</span>
    </button>
  )
}

function Sidebar({ active, collapsed, onToggle }: { active: NavId; collapsed: boolean; onToggle: () => void }) {
  return (
    <aside className={collapsed ? 'sidebar collapsed' : 'sidebar'}>
      <div className="sidebar-brand"><Logo /></div>
      <nav className="sidebar-nav" aria-label="Main">
        {NAV.map((group, i) => (
          <div className="nav-group" key={group.label ?? i}>
            {group.label && <div className="nav-label">{group.label}</div>}
            {group.items.map(item => <NavButton key={item.id} item={item} active={item.id === active} collapsed={collapsed} />)}
          </div>
        ))}
      </nav>
      <div className="sidebar-foot">
        <NavButton item={SETTINGS_NAV} active={active === 'settings'} collapsed={collapsed} />
        <button
          type="button"
          className="nav-item collapse-btn"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : undefined}
        >
          <FontAwesomeIcon icon={collapsed ? faAnglesRight : faAnglesLeft} fixedWidth className="icon" />
          <span className="nav-text">Collapse</span>
        </button>
      </div>
    </aside>
  )
}

function TopBar({ title }: { title: ReactNode }) {
  const [theme, toggleTheme] = useTheme()
  return (
    <header className="topbar">
      <div className="topbar-brand"><Logo /></div>
      <div className="topbar-title">{title}</div>
      <div className="topbar-actions">
        <button
          type="button"
          className="icon-btn"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} fixedWidth className="icon" />
        </button>
        <button type="button" className="icon-btn" aria-label="Notifications, 1 unread">
          <FontAwesomeIcon icon={faBell} fixedWidth className="icon" /><span className="notif-dot" />
        </button>
        <button type="button" className="icon-btn account" aria-label="Account">
          <FontAwesomeIcon icon={faCircleUser} className="icon" />
        </button>
      </div>
    </header>
  )
}

function TabBar({ active }: { active: TabId }) {
  const navigate = useNavigate()
  return (
    <nav className="tabbar" aria-label="Main">
      {TABS.map(({ id, label, icon, to }) => (
        <button
          key={id}
          type="button"
          className={id === active ? 'tab active' : 'tab'}
          aria-current={id === active ? 'page' : undefined}
          onClick={() => to && navigate(to)}
        >
          <FontAwesomeIcon icon={icon} className="icon" />
          {label}
        </button>
      ))}
    </nav>
  )
}

export function Shell({ nav, tab, title, children }: { nav: NavId; tab: TabId; title: ReactNode; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(readCollapsed)
  const toggle = () => setCollapsed(c => {
    try { localStorage.setItem(COLLAPSE_KEY, c ? '0' : '1') } catch { /* storage unavailable */ }
    return !c
  })

  return (
    <div className="shell">
      <Sidebar active={nav} collapsed={collapsed} onToggle={toggle} />
      <div className="main">
        <TopBar title={title} />
        {children}
        <TabBar active={tab} />
      </div>
    </div>
  )
}
