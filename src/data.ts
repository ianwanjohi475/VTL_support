import type { ComponentType, SVGProps } from 'react'
import {
  BookOpenIcon, ClipboardDocumentListIcon, Cog6ToothIcon, CpuChipIcon, ExclamationTriangleIcon,
  HomeIcon, PhoneArrowDownLeftIcon, ArrowsRightLeftIcon, TicketIcon,
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeSolid, TicketIcon as TicketSolid, ExclamationTriangleIcon as FaultsSolid,
  BookOpenIcon as BookSolid,
} from '@heroicons/react/24/solid'

type Icon = ComponentType<SVGProps<SVGSVGElement>>

export type NavId = 'home' | 'tickets' | 'recent' | 'faults' | 'equipment' | 'procedures' | 'kb' | 'escalation' | 'settings'

export interface NavItem { id: NavId; label: string; icon: Icon; badge?: number; to?: string }
export interface NavGroup { label?: string; items: NavItem[] }

export const NAV: NavGroup[] = [
  { items: [
    { id: 'home', label: 'Home', icon: HomeIcon, to: '/' },
    { id: 'tickets', label: 'My tickets', icon: TicketIcon, badge: 6 },
    { id: 'recent', label: 'Recent calls', icon: PhoneArrowDownLeftIcon },
  ] },
  { label: 'Troubleshoot', items: [
    { id: 'faults', label: 'Common faults', icon: ExclamationTriangleIcon, to: '/?tab=faults' },
    { id: 'equipment', label: 'Equipment', icon: CpuChipIcon, to: '/?tab=equipment' },
    { id: 'procedures', label: 'Procedures', icon: ClipboardDocumentListIcon, to: '/?tab=procedures' },
  ] },
  { label: 'Reference', items: [
    { id: 'kb', label: 'Knowledge base', icon: BookOpenIcon },
    { id: 'escalation', label: 'Escalation matrix', icon: ArrowsRightLeftIcon },
  ] },
]

export const SETTINGS_NAV: NavItem = { id: 'settings', label: 'Settings', icon: Cog6ToothIcon }

export type TabId = 'home' | 'tickets' | 'faults' | 'reference'
export interface Tab { id: TabId; label: string; icon: Icon; badge?: number; to?: string }

export const TABS: Tab[] = [
  { id: 'home', label: 'Home', icon: HomeSolid, to: '/' },
  { id: 'tickets', label: 'Tickets', icon: TicketSolid, badge: 6 },
  { id: 'faults', label: 'Faults', icon: FaultsSolid, to: '/?tab=faults' },
  { id: 'reference', label: 'Reference', icon: BookSolid },
]

export interface Topic {
  title: string
  desc: string
  tag: string
  time: string
  /** Route to the guided walkthrough, when one exists. */
  to?: string
}

export type CategoryId = 'faults' | 'equipment' | 'procedures'

export const CATEGORIES: { id: CategoryId; label: string; items: Topic[] }[] = [
  { id: 'faults', label: 'Common faults', items: [
    { title: 'Red LOS light on the ONT', desc: 'No optical signal reaching the ONT.', tag: 'Fibre', time: '4 min', to: '/faults/red-los' },
    { title: 'No lights on the ONT', desc: 'ONT is dead. Check adapter and wall socket.', tag: 'Power', time: '3 min' },
    { title: 'ONT is fine but no internet', desc: 'Lights normal, client devices can’t browse.', tag: 'Client side', time: '6 min' },
    { title: 'PoE injector has no power', desc: 'Injector LED off, radio or router unpowered.', tag: 'Power', time: '3 min' },
    { title: 'Router not broadcasting Wi-Fi', desc: 'Network name missing from client devices.', tag: 'Router', time: '5 min' },
    { title: 'Slow or intermittent connection', desc: 'Drops or low speeds, often at peak hours.', tag: 'Signal', time: '8 min' },
    { title: 'Client forgot Wi-Fi password', desc: 'Read or reset it from the router panel.', tag: 'Router', time: '2 min' },
    { title: 'Several clients down in one area', desc: 'Likely an OLT or feeder fault. Check the map.', tag: 'Upstream', time: '4 min' },
  ] },
  { id: 'equipment', label: 'Equipment', items: [
    { title: 'Huawei ONT', desc: 'HG8145V5 and EG8141A5 lights and ports.', tag: 'ONT', time: '4 min' },
    { title: 'Tenda Router', desc: 'AC10 and F6 settings and resets.', tag: 'Router', time: '5 min' },
    { title: 'PoE Injector', desc: '24V passive units and cabling.', tag: 'Power', time: '3 min' },
    { title: 'Patch Cord and Cabling', desc: 'SC/APC cords, bends and connectors.', tag: 'Fibre', time: '4 min' },
  ] },
  { id: 'procedures', label: 'Procedures', items: [
    { title: 'Configure a New Router', desc: 'PPPoE login, Wi-Fi name and password.', tag: 'Setup', time: '7 min' },
    { title: 'Recover a Router After Factory Reset', desc: 'Restore PPPoE and Wi-Fi from the client record.', tag: 'Router', time: '6 min' },
    { title: 'Provision an ONT on SmartOLT', desc: 'Authorise the serial and assign the service profile.', tag: 'OLT', time: '5 min' },
    { title: 'Standard Checks Before Closing a Ticket', desc: 'Speed test, Wi-Fi on one device, client confirms.', tag: 'Closing', time: '2 min' },
  ] },
]

export const COUNTERS = [
  { value: 847, label: 'Clients online', status: 'green' },
  { value: 12, label: 'Faults open', status: 'red' },
  { value: 3, label: 'Awaiting dispatch', status: 'amber' },
] as const

export const OPEN_TICKETS = 14
export const AGENT = { initials: 'LM', name: 'Lerato Mahlangu', role: 'Support agent' }

export interface Step {
  short: string
  label: string
  q: string
  expect: string
  answers: [string, string]
}

export interface Walkthrough {
  slug: string
  title: string
  section: string
  suspected: string
  meaning: string
  avg: string
  steps: Step[]
  resolution: { title: string; body: string }
}

export const RED_LOS: Walkthrough = {
  slug: 'red-los',
  title: 'Red LOS light on the ONT',
  section: 'Common faults',
  suspected: 'Fibre fault suspected',
  meaning: 'The ONT is receiving no optical signal. Usually a break, a sharp bend, or an unseated connector.',
  avg: '4 min',
  steps: [
    { short: 'Read lights', label: 'Check the ONT', q: 'Can you read me the lights on the white Huawei box, from top to bottom?', expect: 'POWER should be green. With this fault PON is off or blinking and LOS is red.', answers: ['LOS red, PON off', 'All lights normal'] },
    { short: 'Steady or blinking', label: 'Ask the client', q: 'Is the red light steady, or is it blinking?', expect: 'A steady red usually means a full break. Blinking points to a weak or dirty connector.', answers: ['Steady red', 'Blinking red'] },
    { short: 'Check cabling', label: 'Check the cabling', q: 'Follow the thin yellow cable from the box to the wall. Is it bent sharply, pinched or damaged anywhere?', expect: 'Fibre fails if bent tighter than a finger. Doors, furniture and pets are the usual causes.', answers: ['Looks undamaged', 'Bent or damaged'] },
    { short: 'Reseat connector', label: 'Ask the client', q: 'Unplug the green connector at the bottom of the box, wait five seconds, then push it back in until it clicks.', expect: 'Tell the client not to look into the connector end and to hold it by the plastic housing only.', answers: ['Done, reseated', 'Can’t remove it'] },
    { short: 'Confirm', label: 'Confirm the fix', q: 'Give it thirty seconds. Has the red LOS light gone out?', expect: 'PON blinks green, then turns steady within two minutes.', answers: ['Yes, it’s off', 'Still red'] },
  ],
  resolution: {
    title: 'Signal restored after reseating the connector.',
    body: 'Run the standard checks before closing: ask the client to load a website and confirm Wi-Fi on one device.',
  },
}

export const WALKTHROUGHS: Record<string, Walkthrough> = { [RED_LOS.slug]: RED_LOS }

/** The live call the agent is on. Seeded 6:12 into the call and 1:48 into the
 *  walkthrough, with step 1 answered at 00:38. */
export const ACTIVE_CALL = {
  client: 'Thandi Mokoena',
  address: '14 Acacia Rd, Northcliff',
  ticket: 'VTL-20931',
  clientRef: 'CL-10877',
  plan: 'Fibre 100/50',
  ont: 'Huawei HG8145V5',
  callElapsedSec: 6 * 60 + 12,
  walkthroughElapsedSec: 108,
  answered: [{ answer: 'LOS red, PON off', atSec: 38 }],
}
