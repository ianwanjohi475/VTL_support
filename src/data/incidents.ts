import type { Icon } from '@phosphor-icons/react'
import { ArrowsClockwise, CellTower, CloudSlash, WarningCircle } from '@phosphor-icons/react'
import type { Tone } from './tones'

export type Severity = 'Critical' | 'High' | 'Medium'

export interface Phase {
  time: string
  title: string
  items: string[]
}

export interface Incident {
  slug: string
  title: string
  short: string
  icon: Icon
  tone: Tone
  severity: Severity
  /** Response and restore targets. Defaults: set these to VTL’s SLA. */
  respond: string
  restore: string
  signs: string[]
  impact: string
  phases: Phase[]
  notify: { who: string; when: string }[]
  clientMessage: string
  close: string[]
  guide?: string
}

export const INCIDENTS: Incident[] = [
  {
    slug: 'client-offline',
    title: 'Client offline',
    short: 'A single client has no internet.',
    icon: CloudSlash,
    tone: 'blue',
    severity: 'Medium',
    respond: '15 min',
    restore: '4 hours',
    signs: [
      'Client reports no internet on any device',
      'ONT shows offline in SmartOLT',
      'No PPPoE session for the account',
    ],
    impact: 'One household or business without service.',
    phases: [
      { time: '0–5 min', title: 'Confirm', items: [
        'Open a ticket and confirm the account and service address.',
        'Check SmartOLT: is the ONT online, and what is its Rx optical power?',
        'Check whether other clients on the same PON port are down. If several are, switch to the Area outage playbook.',
      ] },
      { time: '5–15 min', title: 'First fix with the client', items: [
        'Ask for the ONT lights and follow the “No internet on any device” guide.',
        'Restart the ONT and router; check the ONT-to-router cable.',
        'Check the PPPoE session and account status (not suspended).',
      ] },
      { time: '15–30 min', title: 'Escalate if not restored', items: [
        'Escalate to the NOC with the copied guide notes.',
        'Book a site visit if the equipment or line is at fault.',
      ] },
    ],
    notify: [
      { who: 'NOC', when: 'If not restored after the guide' },
      { who: 'Field team', when: 'When a site visit is booked' },
    ],
    clientMessage:
      'Hi, thanks for reporting this. We have opened ticket [TICKET] for your connection and are working on it now. We will update you within 30 minutes. – VTL Telecom Support',
    close: [
      'Client confirms browsing works on two devices',
      'Ticket notes include the steps taken and the cause',
      'Follow-up booked if a site visit was needed',
    ],
    guide: 'no-internet',
  },
  {
    slug: 'los',
    title: 'LOS alarm (fibre signal lost)',
    short: 'The ONT reports loss of optical signal.',
    icon: WarningCircle,
    tone: 'rose',
    severity: 'High',
    respond: '10 min',
    restore: '8 hours',
    signs: [
      'Red LOS light on the client’s ONT',
      'LOS / “dying gasp” alarm in SmartOLT',
      'ONT Rx power missing or below −27 dBm',
    ],
    impact: 'No service for the client until the fibre path is restored.',
    phases: [
      { time: '0–5 min', title: 'Confirm scope', items: [
        'Check SmartOLT for the ONT’s last Rx power and the alarm time.',
        'Check other ONTs on the same PON port and splitter. Several in LOS means a feeder or splitter fault: use the Area outage playbook.',
      ] },
      { time: '5–15 min', title: 'Client-side checks', items: [
        'Follow the “Red LOS light on the ONT” guide: cable bends, reseat connector, restart ONT.',
        'Ask about recent work, moved furniture, pets or building works.',
      ] },
      { time: '15–30 min', title: 'Dispatch', items: [
        'Book a technician to test optical power at the wall box and the ONT.',
        'Give the field team the Rx history and the location of any visible damage.',
      ] },
    ],
    notify: [
      { who: 'NOC', when: 'Immediately, to check the PON port' },
      { who: 'Field team', when: 'When the guide doesn’t clear LOS' },
    ],
    clientMessage:
      'Hi, our system shows the fibre signal to your router has been lost. Please don’t look into the fibre connector. We are arranging a technician and will confirm a time shortly. Ticket: [TICKET]. – VTL Telecom Support',
    close: [
      'LOS off and PON steady green',
      'Rx power recorded after the fix',
      'Cause recorded (bend, break, connector, splitter)',
    ],
    guide: 'red-los',
  },
  {
    slug: 'router-freeze',
    title: 'Router freeze',
    short: 'The router hangs and stops passing traffic.',
    icon: ArrowsClockwise,
    tone: 'violet',
    severity: 'Medium',
    respond: '15 min',
    restore: '2 hours',
    signs: [
      'Wi-Fi visible but nothing loads',
      'Router SYS light solid or off',
      'Router page 192.168.0.1 doesn’t open',
    ],
    impact: 'Client offline until the router is restarted or replaced.',
    phases: [
      { time: '0–5 min', title: 'Restore service', items: [
        'Have the client unplug the router at the wall for 30 seconds.',
        'Confirm the ONT lights are normal so the fault is the router, not the line.',
      ] },
      { time: '5–15 min', title: 'Find the cause', items: [
        'Ask how often it freezes. Check the adapter, heat and number of devices.',
        'Set a nightly reboot schedule if freezes are frequent (see Router setup).',
      ] },
      { time: 'Repeat freezes', title: 'Replace', items: [
        'After a factory reset on a good power supply, if it still freezes, book a router replacement.',
      ] },
    ],
    notify: [{ who: 'Field / stores', when: 'If a replacement router is needed' }],
    clientMessage:
      'Hi, your router appears to have frozen. Please unplug it from the wall for 30 seconds, plug it back in and wait 2 minutes. Reply here if it’s not working after that. Ticket: [TICKET]. – VTL Telecom Support',
    close: [
      'Client browsing normally',
      'Freeze frequency recorded on the account',
      'Reboot schedule or replacement noted, if applied',
    ],
    guide: 'router-frozen',
  },
  {
    slug: 'area-outage',
    title: 'Area outage',
    short: 'Several clients in one area are down at once.',
    icon: CellTower,
    tone: 'amber',
    severity: 'Critical',
    respond: '5 min',
    restore: '4 hours',
    signs: [
      'Several calls from the same area within minutes',
      'Multiple ONTs on one PON port or OLT in LOS',
      'Power cut or construction reported in the area',
    ],
    impact: 'Many clients without service; high call volume.',
    phases: [
      { time: '0–5 min', title: 'Declare', items: [
        'Open one parent incident and link every client ticket to it.',
        'Notify the NOC lead with the affected OLT, PON ports and area.',
      ] },
      { time: '5–15 min', title: 'Communicate', items: [
        'Post a status update and use the outage message for every caller.',
        'Stop troubleshooting individual clients in the area: it won’t help.',
      ] },
      { time: 'Every 30 min', title: 'Update', items: [
        'Share the field team’s progress and estimated restore time.',
      ] },
      { time: 'Restored', title: 'Recover', items: [
        'Confirm ONTs are back online in SmartOLT.',
        'Ask clients still down to restart their router; handle them as single tickets.',
      ] },
    ],
    notify: [
      { who: 'NOC lead', when: 'Immediately' },
      { who: 'Field team', when: 'Immediately, with location' },
      { who: 'Management / comms', when: 'If not restored within 1 hour' },
    ],
    clientMessage:
      'Hi, we’re aware of a service outage in your area and our technicians are working on it. We’ll update you as soon as service is restored. No need to restart your equipment for now. – VTL Telecom Support',
    close: [
      'All linked tickets resolved or followed up',
      'Root cause and restore time recorded on the parent incident',
      'Clients notified that service is restored',
    ],
  },
]

export const INCIDENT_BY_SLUG: Record<string, Incident> = Object.fromEntries(INCIDENTS.map(i => [i.slug, i]))
