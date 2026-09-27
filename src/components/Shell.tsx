import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BellIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { AGENT, NAV, OPEN_TICKETS, SETTINGS_NAV, TABS, type NavId, type NavItem, type TabId } from '../data'
import { useTheme } from '../theme'

const COLLAPSE_KEY = 'vtl.sidebarCollapsed'

function readCollapsed() {
  try { return localStorage.getItem(COLLAPSE_KEY) === '1' } catch { return false }
}

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="VTLsupport home">
      <span className="logo-mark" aria-hidden>V</span>
      <span className="logo-word">VTL<span>support</span></span>
    </Link>
  )
}

function NavButton({ item, active, collapsed }: { item: NavItem; active: boolean; collapsed: boolean }) {
  const navigate = useNavigate()
  const { label, icon: Icon, badge, to } = item
  return (
    <button
      type="button"
      className={active ? 'nav-item active' : 'nav-item'}
      aria-current={active ? 'page' : undefined}
      title={collapsed ? label : undefined}
      onClick={() => to && navigate(to)}
    >
      <Icon className="icon" aria-hidden />
      <span className="nav-text">{label}</span>
      {badge ? <span className="nav-badge">{badge}</span> : null}
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
          {collapsed ? <ChevronDoubleRightIcon className="icon" aria-hidden /> : <ChevronDoubleLeftIcon className="icon" aria-hidden />}
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
        <span className="tickets-pill" title="Open tickets in your queue">
          <span className="dot" /><span>{OPEN_TICKETS}<span className="pill-label"> open tickets</span></span>
        </span>
        <button
          type="button"
          className="icon-btn"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? <SunIcon className="icon" aria-hidden /> : <MoonIcon className="icon" aria-hidden />}
        </button>
        <button type="button" className="icon-btn" aria-label="Notifications, 1 unread">
          <BellIcon className="icon" aria-hidden /><span className="notif-dot" />
        </button>
        <div className="agent">
          <span className="avatar" aria-hidden>{AGENT.initials}</span>
          <span className="agent-text">
            <span className="agent-name">{AGENT.name}</span>
            <span className="agent-role">{AGENT.role}</span>
          </span>
        </div>
      </div>
    </header>
  )
}

function TabBar({ active }: { active: TabId }) {
  const navigate = useNavigate()
  return (
    <nav className="tabbar" aria-label="Main">
      {TABS.map(({ id, label, icon: Icon, badge, to }) => (
        <button
          key={id}
          type="button"
          className={id === active ? 'tab active' : 'tab'}
          aria-current={id === active ? 'page' : undefined}
          onClick={() => to && navigate(to)}
        >
          <Icon className="icon" aria-hidden />
          {label}
          {badge ? <span className="tab-badge">{badge}</span> : null}
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
