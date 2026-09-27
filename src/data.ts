import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faBook, faClockRotateLeft, faGear, faHouse, faListCheck, faMicrochip, faSitemap,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'

type Icon = IconDefinition

export type NavId = 'home' | 'history' | 'faults' | 'equipment' | 'procedures' | 'kb' | 'escalation' | 'settings'

export interface NavItem { id: NavId; label: string; icon: Icon; to?: string }
export interface NavGroup { label?: string; items: NavItem[] }

export const NAV: NavGroup[] = [
  { items: [
    { id: 'home', label: 'Home', icon: faHouse, to: '/' },
    { id: 'history', label: 'History', icon: faClockRotateLeft },
  ] },
  { label: 'Troubleshoot', items: [
    { id: 'faults', label: 'Common faults', icon: faTriangleExclamation, to: '/?tab=faults' },
    { id: 'equipment', label: 'Equipment', icon: faMicrochip, to: '/?tab=equipment' },
    { id: 'procedures', label: 'Procedures', icon: faListCheck, to: '/?tab=procedures' },
  ] },
  { label: 'Reference', items: [
    { id: 'kb', label: 'Knowledge base', icon: faBook },
    { id: 'escalation', label: 'Escalation matrix', icon: faSitemap },
  ] },
]

export const SETTINGS_NAV: NavItem = { id: 'settings', label: 'Settings', icon: faGear }

export type TabId = 'home' | 'faults' | 'procedures' | 'reference'
export interface Tab { id: TabId; label: string; icon: Icon; to?: string }

export const TABS: Tab[] = [
  { id: 'home', label: 'Home', icon: faHouse, to: '/' },
  { id: 'faults', label: 'Faults', icon: faTriangleExclamation, to: '/?tab=faults' },
  { id: 'procedures', label: 'Procedures', icon: faListCheck, to: '/?tab=procedures' },
  { id: 'reference', label: 'Reference', icon: faBook },
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
    { title: 'ONT is fine but no internet', desc: 'Lights normal, but devices can’t browse.', tag: 'Devices', time: '6 min' },
    { title: 'PoE injector has no power', desc: 'Injector LED off, radio or router unpowered.', tag: 'Power', time: '3 min' },
    { title: 'Router not broadcasting Wi-Fi', desc: 'Network name missing from devices.', tag: 'Router', time: '5 min' },
    { title: 'Slow or intermittent connection', desc: 'Drops or low speeds, often at peak hours.', tag: 'Signal', time: '8 min' },
    { title: 'Forgotten Wi-Fi password', desc: 'Read or reset it from the router panel.', tag: 'Router', time: '2 min' },
    { title: 'Several connections down in one area', desc: 'Likely an OLT or feeder fault. Check the map.', tag: 'Upstream', time: '4 min' },
  ] },
  { id: 'equipment', label: 'Equipment', items: [
    { title: 'Huawei ONT', desc: 'HG8145V5 and EG8141A5 lights and ports.', tag: 'ONT', time: '4 min' },
    { title: 'Tenda Router', desc: 'AC10 and F6 settings and resets.', tag: 'Router', time: '5 min' },
    { title: 'PoE Injector', desc: '24V passive units and cabling.', tag: 'Power', time: '3 min' },
    { title: 'Patch Cord and Cabling', desc: 'SC/APC cords, bends and connectors.', tag: 'Fibre', time: '4 min' },
  ] },
  { id: 'procedures', label: 'Procedures', items: [
    { title: 'Configure a New Router', desc: 'PPPoE login, Wi-Fi name and password.', tag: 'Setup', time: '7 min' },
    { title: 'Recover a Router After Factory Reset', desc: 'Restore PPPoE and Wi-Fi settings.', tag: 'Router', time: '6 min' },
    { title: 'Provision an ONT on SmartOLT', desc: 'Authorise the serial and assign the service profile.', tag: 'OLT', time: '5 min' },
    { title: 'Standard Checks After a Fix', desc: 'Speed test, Wi-Fi on one device, confirm browsing.', tag: 'Checks', time: '2 min' },
  ] },
]

export const COUNTERS = [
  { value: 847, label: 'Connections online', status: 'green' },
  { value: 12, label: 'Faults open', status: 'red' },
  { value: 3, label: 'Awaiting site visit', status: 'amber' },
] as const

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
    { short: 'Read lights', label: 'Check the ONT', q: 'Look at the lights on the ONT from top to bottom. What do you see?', expect: 'POWER should be green. With this fault PON is off or blinking and LOS is red.', answers: ['LOS red, PON off', 'All lights normal'] },
    { short: 'Steady or blinking', label: 'Check the LOS light', q: 'Is the red LOS light steady, or is it blinking?', expect: 'A steady red usually means a full break. Blinking points to a weak or dirty connector.', answers: ['Steady red', 'Blinking red'] },
    { short: 'Check cabling', label: 'Check the cabling', q: 'Follow the thin yellow fibre cable from the ONT to the wall. Is it bent sharply, pinched or damaged anywhere?', expect: 'Fibre fails if bent tighter than a finger. Doors, furniture and pets are the usual causes.', answers: ['Looks undamaged', 'Bent or damaged'] },
    { short: 'Reseat connector', label: 'Reseat the connector', q: 'Unplug the green fibre connector at the bottom of the ONT, wait five seconds, then push it back in until it clicks.', expect: 'Never look into the connector end. Hold it by the plastic housing only.', answers: ['Done, reseated', 'Can’t remove it'] },
    { short: 'Confirm', label: 'Confirm the fix', q: 'Wait thirty seconds. Has the red LOS light gone out?', expect: 'PON blinks green, then turns steady within two minutes.', answers: ['Yes, it’s off', 'Still red'] },
  ],
  resolution: {
    title: 'Signal restored after reseating the connector.',
    body: 'Finish with the standard checks: load a website and confirm Wi-Fi works on one device.',
  },
}

export const WALKTHROUGHS: Record<string, Walkthrough> = { [RED_LOS.slug]: RED_LOS }
