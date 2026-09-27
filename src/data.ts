import type { LucideIcon } from 'lucide-react'
import {
  Activity, BookOpen, Cable, CircleAlert, ClipboardCheck, GitFork, Globe, HardDrive, House,
  KeyRound, Lightbulb, ListChecks, MapPin, Menu, PhoneIncoming, Plug, PlugZap, PowerOff,
  RotateCcw, Router, Server, Settings, Settings2, Ticket, TriangleAlert, Users, WifiOff,
} from 'lucide-react'

export type NavId =
  | 'home' | 'tickets' | 'recent' | 'faults' | 'equip' | 'proc'
  | 'lights' | 'esc' | 'kb' | 'team' | 'settings'

export interface NavItem { id: NavId; label: string; icon: LucideIcon; badge?: number; to?: string }
export interface NavGroup { label: string; items: NavItem[] }

export const NAV: NavGroup[] = [
  { label: 'START HERE', items: [
    { id: 'home', label: 'Home', icon: House, to: '/' },
    { id: 'tickets', label: 'My Tickets', icon: Ticket, badge: 6 },
    { id: 'recent', label: 'Recent Calls', icon: PhoneIncoming },
  ] },
  { label: 'TROUBLESHOOT', items: [
    { id: 'faults', label: 'Common Faults', icon: TriangleAlert, to: '/#common-faults' },
    { id: 'equip', label: 'By Equipment', icon: Router, to: '/#by-equipment' },
    { id: 'proc', label: 'Procedures', icon: ListChecks, to: '/#procedures' },
  ] },
  { label: 'REFERENCE', items: [
    { id: 'lights', label: 'Light Indicators', icon: Lightbulb },
    { id: 'esc', label: 'Escalation Matrix', icon: GitFork },
    { id: 'kb', label: 'Knowledge Base', icon: BookOpen },
  ] },
  { label: 'SUPPORT', items: [
    { id: 'team', label: 'Team Status', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] },
]

export type TabId = 'home' | 'tickets' | 'troubleshoot' | 'reference' | 'more'
export interface Tab { id: TabId; label: string; icon: LucideIcon; badge?: number; to?: string }

export const TABS: Tab[] = [
  { id: 'home', label: 'Home', icon: House, to: '/' },
  { id: 'tickets', label: 'Tickets', icon: Ticket, badge: 6 },
  { id: 'troubleshoot', label: 'Troubleshoot', icon: TriangleAlert, to: '/#common-faults' },
  { id: 'reference', label: 'Reference', icon: BookOpen },
  { id: 'more', label: 'More', icon: Menu },
]

export interface Card {
  icon: LucideIcon
  title: string
  desc: string
  tag: string
  time: string
  /** Route to the guided walkthrough, when one exists. */
  to?: string
}

export const FAULTS: Card[] = [
  { icon: CircleAlert, title: 'Red LOS light on the ONT', desc: 'No optical signal reaching the ONT.', tag: 'Fibre', time: '4 min', to: '/faults/red-los' },
  { icon: PowerOff, title: 'No lights on the ONT', desc: 'ONT is dead. Check adapter and wall socket.', tag: 'Power', time: '3 min' },
  { icon: Globe, title: 'ONT is fine but no internet', desc: 'Lights normal, client devices can’t browse.', tag: 'Client side', time: '6 min' },
  { icon: PlugZap, title: 'PoE injector has no power', desc: 'Injector LED off, radio or router unpowered.', tag: 'Power', time: '3 min' },
  { icon: WifiOff, title: 'Router not broadcasting Wi-Fi', desc: 'Network name missing from client devices.', tag: 'Router', time: '5 min' },
  { icon: Activity, title: 'Slow or intermittent connection', desc: 'Drops or low speeds, often at peak hours.', tag: 'Signal', time: '8 min' },
  { icon: KeyRound, title: 'Client forgot Wi-Fi password', desc: 'Read or reset it from the router panel.', tag: 'Router', time: '2 min' },
  { icon: MapPin, title: 'Several clients down in one area', desc: 'Likely an OLT or feeder fault. Check the map.', tag: 'Upstream', time: '4 min' },
]

export const EQUIPMENT: Card[] = [
  { icon: HardDrive, title: 'Huawei ONT', desc: 'HG8145V5 and EG8141A5 lights and ports.', tag: 'ONT', time: '4 min' },
  { icon: Router, title: 'Tenda Router', desc: 'AC10 and F6 settings and resets.', tag: 'Router', time: '5 min' },
  { icon: Plug, title: 'PoE Injector', desc: '24V passive units and cabling.', tag: 'Power', time: '3 min' },
  { icon: Cable, title: 'Patch Cord and Cabling', desc: 'SC/APC cords, bends and connectors.', tag: 'Fibre', time: '4 min' },
]

export const PROCEDURES: Card[] = [
  { icon: Settings2, title: 'Configure a New Router', desc: 'PPPoE login, Wi-Fi name and password.', tag: 'Setup', time: '7 min' },
  { icon: RotateCcw, title: 'Recover a Router After Factory Reset', desc: 'Restore PPPoE and Wi-Fi from the client record.', tag: 'Router', time: '6 min' },
  { icon: Server, title: 'Provision an ONT on SmartOLT', desc: 'Authorise the serial and assign the service profile.', tag: 'OLT', time: '5 min' },
  { icon: ClipboardCheck, title: 'Standard Checks Before Closing a Ticket', desc: 'Speed test, Wi-Fi on one device, client confirms.', tag: 'Closing', time: '2 min' },
]

export const COUNTERS = [
  { value: 847, label: 'clients online', status: 'green' },
  { value: 12, label: 'faults open', status: 'red' },
  { value: 3, label: 'awaiting dispatch', status: 'amber' },
] as const

export const RECENT = [
  { ref: 'CL-10482', fault: 'ONT is fine but no internet', when: '8 min ago', agent: 'Sipho Dlamini' },
  { ref: 'CL-09917', fault: 'Client forgot Wi-Fi password', when: '23 min ago', agent: 'Lerato Mahlangu' },
  { ref: 'CL-11206', fault: 'PoE injector has no power', when: '41 min ago', agent: 'Anika Pillay' },
]

export const OPEN_TICKETS = 14
export const AGENT_INITIALS = 'LM'

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
  section: 'Common Faults',
  suspected: 'Fibre fault suspected',
  meaning: 'the ONT is receiving no optical signal. Usually a break, a sharp bend, or an unseated connector.',
  avg: '4 min',
  steps: [
    { short: 'Read lights', label: 'CHECK THE ONT', q: 'Can you read me the lights on the white Huawei box, from top to bottom?', expect: 'POWER should be green. With this fault PON is off or blinking and LOS is red.', answers: ['LOS red, PON off', 'All lights normal'] },
    { short: 'Steady or blinking', label: 'ASK THE CLIENT', q: 'Is the red light steady, or is it blinking?', expect: 'a steady red usually means a full break. Blinking points to a weak or dirty connector.', answers: ['Steady red', 'Blinking red'] },
    { short: 'Check cabling', label: 'CHECK THE CABLING', q: 'Follow the thin yellow cable from the box to the wall. Is it bent sharply, pinched or damaged anywhere?', expect: 'fibre fails if bent tighter than a finger. Doors, furniture and pets are the usual causes.', answers: ['Looks undamaged', 'Bent or damaged'] },
    { short: 'Reseat connector', label: 'ASK THE CLIENT', q: 'Unplug the green connector at the bottom of the box, wait five seconds, then push it back in until it clicks.', expect: 'tell the client not to look into the connector end and to hold it by the plastic housing only.', answers: ['Done, reseated', 'Can’t remove it'] },
    { short: 'Confirm', label: 'CONFIRM THE FIX', q: 'Give it thirty seconds. Has the red LOS light gone out?', expect: 'PON blinks green, then turns steady within two minutes.', answers: ['Yes, it’s off', 'Still red'] },
  ],
  resolution: {
    title: 'Signal restored after reseating the connector.',
    body: 'Run the standard checks before closing: ask the client to load a website and confirm Wi-Fi on one device.',
  },
}

export const WALKTHROUGHS: Record<string, Walkthrough> = { [RED_LOS.slug]: RED_LOS }

/** The live call the agent is on. Seeded to match the design: 6:12 into the call,
 *  1:48 into the walkthrough, with step 1 answered at 00:38. */
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
