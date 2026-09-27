import { useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell, LifeBuoy, Maximize, Minimize, Moon, PanelLeftClose, PanelLeftOpen, Search,
} from 'lucide-react'
import { AGENT_INITIALS, NAV, OPEN_TICKETS, TABS, type NavId, type TabId } from '../data'

const COLLAPSE_KEY = 'vtl.sidebarCollapsed'

function readCollapsed() {
  try { return localStorage.getItem(COLLAPSE_KEY) === '1' } catch { return false }
}

export function Logo({ large = false }: { large?: boolean }) {
  return (
    <span className={large ? 'logo lg' : 'logo'}>
      <span className="logo-mark"><LifeBuoy size={large ? 21 : 16} /></span>
      <span className="logo-word">VTL<span>support</span></span>
    </span>
  )
}

function useFullscreen() {
  const [on, setOn] = useState(() => !!document.fullscreenElement)
  useEffect(() => {
    const sync = () => setOn(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])
  const toggle = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen?.()
  }
  return [on, toggle] as const
}

function TopBar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const navigate = useNavigate()
  const [fullscreen, toggleFullscreen] = useFullscreen()
  const openSearch = () => {
    const input = document.getElementById('fault-search')
    if (input) input.focus()
    else navigate('/', { state: { focusSearch: true } })
  }

  return (
    <header className="topbar">
      <div className="topbar-side topbar-left">
        <button
          type="button"
          className="icon-btn collapse"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          {collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
        </button>
        <Link to="/" aria-label="VTLsupport home"><Logo /></Link>
      </div>
      <div className="topbar-center">
        <div className="tickets-pill">
          <span className="dot" />
          <span className="full">{OPEN_TICKETS} open tickets</span>
          <span className="short">{OPEN_TICKETS} open</span>
        </div>
      </div>
      <div className="topbar-side topbar-right">
        <button type="button" className="icon-btn" aria-label="Search" onClick={openSearch}><Search size={19} /></button>
        <button type="button" className="icon-btn" aria-label="Notifications, 1 unread">
          <Bell size={19} /><span className="notif-dot" />
        </button>
        <button type="button" className="icon-btn" aria-label={fullscreen ? 'Exit full screen' : 'Full screen'} onClick={toggleFullscreen}>
          {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>
        <button type="button" className="icon-btn" aria-label="Switch theme"><Moon size={18} /></button>
        <div className="avatar" title="Signed in agent">{AGENT_INITIALS}</div>
      </div>
    </header>
  )
}

function Sidebar({ active, collapsed }: { active: NavId; collapsed: boolean }) {
  const navigate = useNavigate()
  return (
    <nav className={collapsed ? 'sidebar collapsed' : 'sidebar'} aria-label="Main">
      {NAV.map(group => (
        <div className="nav-group" key={group.label}>
          <div className="nav-label">{group.label}</div>
          {group.items.map(({ id, label, icon: Icon, badge, to }) => (
            <button
              key={id}
              type="button"
              className={id === active ? 'nav-item active' : 'nav-item'}
              aria-current={id === active ? 'page' : undefined}
              title={collapsed ? label : undefined}
              onClick={() => to && navigate(to)}
            >
              <Icon size={18} />
              <span className="nav-text">{label}</span>
              {badge ? <span className="nav-badge">{badge}</span> : null}
            </button>
          ))}
        </div>
      ))}
    </nav>
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
          <Icon size={21} />
          {label}
          {badge ? <span className="tab-badge">{badge}</span> : null}
        </button>
      ))}
    </nav>
  )
}

export function Shell({ nav, tab, children }: { nav: NavId; tab: TabId; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(readCollapsed)
  const toggle = () => setCollapsed(c => {
    try { localStorage.setItem(COLLAPSE_KEY, c ? '0' : '1') } catch { /* storage unavailable */ }
    return !c
  })

  return (
    <div className="shell">
      <TopBar collapsed={collapsed} onToggle={toggle} />
      <div className="shell-body">
        <Sidebar active={nav} collapsed={collapsed} />
        <main className="main">{children}</main>
      </div>
      <TabBar active={tab} />
    </div>
  )
}
