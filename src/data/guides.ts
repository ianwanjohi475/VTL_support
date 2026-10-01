import { ic, type IconData } from '../icons'
import type { Tone } from './tones'

/** A command shown with Windows and macOS variants. `mac: null` means there is
 *  no terminal equivalent and `macNote` explains what to do instead. */
export interface Command {
  label?: string
  win: string
  mac: string | null
  macNote?: string
}

export interface Option {
  label: string
  /** Next node in this guide. */
  next?: string
  /** Or jump to another guide (optionally at a specific node). */
  guide?: string
  step?: string
}

export interface StepNode {
  kind: 'step'
  title: string
  body: string[]
  commands?: Command[]
  lookFor?: string[]
  options: Option[]
}

export type Result = 'resolved' | 'escalate' | 'client'

export interface OutcomeNode {
  kind: 'outcome'
  result: Result
  title: string
  body: string[]
  /** For escalations: what to record before handing over. */
  checklist?: string[]
}

export type Node = StepNode | OutcomeNode

export interface Guide {
  slug: string
  title: string
  summary: string
  category: 'Connection' | 'Router' | 'Speed' | 'Fibre' | 'Wi-Fi' | 'Power'
  icon: IconData
  tone: Tone
  minutes: number
  keywords: string
  start: string
  nodes: Record<string, Node>
}

const PING_ROUTER: Command = { label: 'Ping the router', win: 'ping 192.168.0.1', mac: 'ping -c 4 192.168.0.1' }
const PING_IP: Command = { label: 'Ping an internet address', win: 'ping 8.8.8.8', mac: 'ping -c 4 8.8.8.8' }
const PING_NAME: Command = { label: 'Ping a website by name', win: 'ping google.com', mac: 'ping -c 4 google.com' }

const ESCALATE_BASICS = [
  'Account number and service address',
  'ONT light states (POWER, PON, LOS)',
  'When the problem started',
  'The steps already tried (use Copy notes)',
]

export const GUIDES: Guide[] = [
  {
    slug: 'no-internet',
    title: 'No internet on any device',
    summary: 'Nothing loads on phones, laptops or TVs.',
    category: 'Connection',
    icon: ic.publicOff,
    tone: 'blue',
    minutes: 8,
    keywords: 'down offline not working no connection internet ping pppoe',
    start: 'ont-lights',
    nodes: {
      'ont-lights': {
        kind: 'step',
        title: 'Check the lights on the ONT',
        body: [
          'Ask the client to find the ONT: the small white Huawei box where the fibre cable comes in.',
          'Have them read out the POWER, PON and LOS lights.',
        ],
        options: [
          { label: 'POWER and PON steady green, LOS off', next: 'restart-router' },
          { label: 'LOS is red (steady or blinking)', guide: 'red-los' },
          { label: 'PON blinking or off, LOS off', next: 'pon-restart' },
          { label: 'No lights at all', guide: 'no-power' },
        ],
      },
      'pon-restart': {
        kind: 'step',
        title: 'Restart the ONT',
        body: [
          'Unplug the ONT’s power adapter, wait 30 seconds, then plug it back in.',
          'Wait 3 minutes. PON blinks while it registers, then should turn steady green.',
        ],
        options: [
          { label: 'PON is now steady green', next: 'restart-router' },
          { label: 'PON still blinking or off', next: 'esc-pon' },
        ],
      },
      'restart-router': {
        kind: 'step',
        title: 'Restart the router',
        body: [
          'Turn the router off at the wall plug, wait 30 seconds, then turn it back on.',
          'Give it 2 minutes to fully start before testing.',
        ],
        options: [
          { label: 'Internet is working now', next: 'ok-restart' },
          { label: 'Still no internet', next: 'wan-cable' },
        ],
      },
      'wan-cable': {
        kind: 'step',
        title: 'Check the cable from the ONT to the router',
        body: [
          'A network cable should run from LAN1 on the ONT to the WAN (internet) port on the router.',
          'Ask the client to unplug both ends and push them back in until they click. The router’s WAN light should come on.',
        ],
        options: [
          { label: 'WAN light is on', next: 'ping-router' },
          { label: 'WAN light is off', next: 'wan-swap' },
        ],
      },
      'wan-swap': {
        kind: 'step',
        title: 'Try another port or cable',
        body: [
          'Move the cable to LAN2 on the ONT. If the client has a spare network cable, try that instead.',
        ],
        options: [
          { label: 'WAN light is on now', next: 'ping-router' },
          { label: 'WAN light still off', next: 'esc-equipment' },
        ],
      },
      'ping-router': {
        kind: 'step',
        title: 'Test the connection to the router',
        body: [
          'On a computer connected to the router, open Command Prompt (Windows) or Terminal (Mac) and run:',
        ],
        commands: [PING_ROUTER],
        lookFor: [
          '“Reply from 192.168.0.1 … time=1ms” means the computer can reach the router.',
          '“Request timed out” or “Destination host unreachable” means it can’t.',
        ],
        options: [
          { label: 'Replies received', next: 'ping-internet' },
          { label: 'Request timed out', next: 'renew-ip' },
        ],
      },
      'renew-ip': {
        kind: 'step',
        title: 'Get a new IP address from the router',
        body: ['Run this, then repeat the router ping from the previous step.'],
        commands: [
          { label: 'Renew the IP address', win: 'ipconfig /release\nipconfig /renew', mac: 'sudo ipconfig set en0 DHCP' },
          PING_ROUTER,
        ],
        options: [
          { label: 'Router replies now', next: 'ping-internet' },
          { label: 'Still no reply', guide: 'router-frozen' },
        ],
      },
      'ping-internet': {
        kind: 'step',
        title: 'Test the connection to the internet',
        body: ['This pings Google’s public server by its IP address, which skips name lookup.'],
        commands: [PING_IP],
        lookFor: [
          'Replies with times under about 100 ms mean the internet is reachable.',
          '“Request timed out” means the router isn’t getting internet from our network.',
        ],
        options: [
          { label: 'Replies received', next: 'ping-name' },
          { label: 'Request timed out', next: 'pppoe-check' },
        ],
      },
      'ping-name': {
        kind: 'step',
        title: 'Test name lookup (DNS)',
        body: ['Now ping a website by name.'],
        commands: [PING_NAME],
        lookFor: [
          '“Pinging google.com [142.250…]” followed by replies means DNS works.',
          '“Ping request could not find host” means name lookup is failing.',
        ],
        options: [
          { label: 'Replies received', next: 'ok-browser' },
          { label: 'Could not find host', guide: 'websites', step: 'flush-dns' },
        ],
      },
      'pppoe-check': {
        kind: 'step',
        title: 'Check the router’s internet login (PPPoE)',
        body: [
          'Open 192.168.0.1 in a browser and sign in to the router.',
          'Go to Internet Settings. The type should be PPPoE, with the username and password from the client’s account. Check the connection status.',
        ],
        options: [
          { label: 'Disconnected or authentication failed', next: 'pppoe-fix' },
          { label: 'Shows connected', next: 'esc-upstream' },
        ],
      },
      'pppoe-fix': {
        kind: 'step',
        title: 'Re-enter the PPPoE username and password',
        body: [
          'Retype both from the account record. They are case-sensitive and a stray space will break them.',
          'Save and wait 1 minute for the router to reconnect.',
        ],
        options: [
          { label: 'Connected, internet works', next: 'ok-pppoe' },
          { label: 'Still fails to connect', next: 'esc-account' },
        ],
      },
      'ok-restart': { kind: 'outcome', result: 'resolved', title: 'Resolved by restarting the router', body: ['If this keeps happening, check the router isn’t overheating: upright, in open air, not on top of the ONT.'] },
      'ok-browser': { kind: 'outcome', result: 'client', title: 'The connection is working', body: ['Pings succeed, so the line and router are fine. The problem is on the device.', 'Ask the client to try another browser, turn off any VPN or proxy, and restart the device.'] },
      'ok-pppoe': { kind: 'outcome', result: 'resolved', title: 'Resolved: PPPoE login corrected', body: ['Note on the account that the router login was re-entered.'] },
      'esc-pon': { kind: 'outcome', result: 'escalate', title: 'Escalate to NOC: ONT not registering', body: ['The ONT gets a fibre signal but won’t authenticate on the OLT. The NOC needs to check provisioning on SmartOLT.'], checklist: ['ONT serial number (label on the back)', ...ESCALATE_BASICS] },
      'esc-equipment': { kind: 'outcome', result: 'escalate', title: 'Escalate: possible faulty port or cable', body: ['The router sees no link from the ONT on two ports. Book a technician to test the ONT LAN ports, the router WAN port and the cable.'], checklist: ESCALATE_BASICS },
      'esc-upstream': { kind: 'outcome', result: 'escalate', title: 'Escalate to NOC: connected but no traffic', body: ['PPPoE is up but pings to the internet fail. Likely an upstream or routing issue for this account.'], checklist: ['Router WAN IP address (from the router status page)', ...ESCALATE_BASICS] },
      'esc-account': { kind: 'outcome', result: 'escalate', title: 'Escalate to billing/NOC: login rejected', body: ['The correct credentials are refused. Check the account isn’t suspended and the RADIUS credentials match the record.'], checklist: ['PPPoE username', ...ESCALATE_BASICS] },
    },
  },

  {
    slug: 'router-frozen',
    title: 'Router frozen or not responding',
    summary: 'Wi-Fi visible but nothing works, lights stuck, or settings page won’t open.',
    category: 'Router',
    icon: ic.router,
    tone: 'violet',
    minutes: 6,
    keywords: 'freeze freezing hang stuck reboot restart reset tenda router not responding',
    start: 'sys-light',
    nodes: {
      'sys-light': {
        kind: 'step',
        title: 'Check the router’s SYS light',
        body: [
          'On Tenda routers the SYS light blinks slowly when the router is working normally.',
          'A SYS light that is solid or off usually means the router has frozen.',
        ],
        options: [
          { label: 'SYS solid or off, or lights frozen', next: 'power-cycle' },
          { label: 'SYS blinking normally', next: 'admin-page' },
        ],
      },
      'power-cycle': {
        kind: 'step',
        title: 'Power-cycle the router properly',
        body: [
          'Unplug the router’s adapter from the wall, not just the button on the router.',
          'Wait 30 seconds so it fully powers down, plug it back in, and wait 2 minutes.',
        ],
        options: [
          { label: 'Router works again', next: 'how-often' },
          { label: 'Still frozen', next: 'adapter' },
        ],
      },
      'admin-page': {
        kind: 'step',
        title: 'Check if the router responds',
        body: ['On a connected device, open a browser and go to 192.168.0.1. On a computer, you can also ping it:'],
        commands: [PING_ROUTER],
        lookFor: ['If the page opens or pings get replies, the router is responding.'],
        options: [
          { label: 'Page opens / pings reply', next: 'reboot-page' },
          { label: 'Page won’t open / timed out', next: 'power-cycle' },
        ],
      },
      'reboot-page': {
        kind: 'step',
        title: 'Restart from the settings page',
        body: ['Sign in, open System Settings and choose Reboot. Wait 2 minutes, then test browsing.'],
        options: [
          { label: 'Works again', next: 'how-often' },
          { label: 'Still not working', guide: 'no-internet', step: 'wan-cable' },
        ],
      },
      'how-often': {
        kind: 'step',
        title: 'Ask how often it freezes',
        body: ['A one-off freeze is normal. Repeated freezes have a cause worth fixing now.'],
        options: [
          { label: 'This is the first time', next: 'ok-cycle' },
          { label: 'Several times a week or more', next: 'heat' },
        ],
      },
      adapter: {
        kind: 'step',
        title: 'Check the power adapter and socket',
        body: [
          'A failing adapter is a common cause of freezing. Make sure it is the original adapter and matches the voltage on the router’s label.',
          'Try a different wall socket and avoid crowded extension boards.',
        ],
        options: [
          { label: 'Works on another socket or adapter', next: 'ok-adapter' },
          { label: 'Still frozen', next: 'factory-reset' },
        ],
      },
      heat: {
        kind: 'step',
        title: 'Check for overheating and overload',
        body: [
          'A router that is very hot to touch will freeze. It should stand upright with space around it, not in a cabinet or stacked on the ONT.',
          'Ask how many devices are connected. More than about 20 can overload an entry-level router.',
        ],
        options: [
          { label: 'Fixed placement, stable now', next: 'ok-heat' },
          { label: 'Still freezing', next: 'factory-reset' },
        ],
      },
      'factory-reset': {
        kind: 'step',
        title: 'Factory reset and set up again',
        body: [
          'Only do this with the client’s PPPoE username and password to hand. A reset erases them.',
          'With the router on, hold the RST (or WPS/RST) button for about 8 seconds until the lights flash, then release. Wait 2 minutes.',
          'Set it up again: PPPoE login, then Wi-Fi name and password.',
        ],
        options: [
          { label: 'Set up and working', next: 'ok-reset' },
          { label: 'Still freezing after reset', next: 'esc-replace' },
        ],
      },
      'ok-cycle': { kind: 'outcome', result: 'resolved', title: 'Resolved by power-cycling the router', body: ['Tell the client to unplug at the wall for 30 seconds if it happens again.'] },
      'ok-adapter': { kind: 'outcome', result: 'resolved', title: 'Resolved: power supply issue', body: ['If the original adapter is faulty, arrange a replacement adapter.'] },
      'ok-heat': { kind: 'outcome', result: 'resolved', title: 'Resolved: overheating or overload', body: ['Note the change on the account in case freezing returns.'] },
      'ok-reset': { kind: 'outcome', result: 'resolved', title: 'Resolved by factory reset', body: ['Confirm the client has their new Wi-Fi password written down.'] },
      'esc-replace': { kind: 'outcome', result: 'escalate', title: 'Escalate: replace the router', body: ['The router freezes even after a reset on a known-good power supply. Book a router replacement.'], checklist: ['Router model and serial number', ...ESCALATE_BASICS] },
    },
  },

  {
    slug: 'slow',
    title: 'Slow or dropping connection',
    summary: 'Low speeds, buffering, or the connection keeps cutting out.',
    category: 'Speed',
    icon: ic.speed,
    tone: 'amber',
    minutes: 10,
    keywords: 'slow speed lag buffering drops dropping intermittent packet loss latency ping speedtest',
    start: 'where',
    nodes: {
      where: {
        kind: 'step',
        title: 'Find out where it’s slow',
        body: ['Ask whether it’s slow on every device, only on Wi-Fi, or whether the connection drops out completely.'],
        options: [
          { label: 'Only on Wi-Fi or far from the router', next: 'wifi-signal' },
          { label: 'Slow on every device, even near the router', next: 'speedtest' },
          { label: 'Connection keeps dropping', next: 'packet-loss' },
        ],
      },
      speedtest: {
        kind: 'step',
        title: 'Run a speed test',
        body: [
          'Pause downloads and streaming on other devices.',
          'Open speedtest.net or fast.com, ideally on a computer connected by cable, and compare the result with the client’s package.',
        ],
        options: [
          { label: 'Close to the package speed', next: 'wifi-signal' },
          { label: 'Much lower than the package', next: 'packet-loss' },
        ],
      },
      'packet-loss': {
        kind: 'step',
        title: 'Check for packet loss',
        body: ['This sends 50 pings and reports how many were lost. It takes about a minute.'],
        commands: [{ label: 'Send 50 pings', win: 'ping -n 50 8.8.8.8', mac: 'ping -c 50 8.8.8.8' }],
        lookFor: [
          'At the end, read “Lost = x (y% loss)”. 0% is healthy; above 2% means the line is dropping packets.',
          'Times jumping above 150 ms point to congestion.',
        ],
        options: [
          { label: '0–2% loss, steady times', next: 'usage' },
          { label: 'More than 2% loss or big spikes', next: 'ont-check' },
        ],
      },
      'ont-check': {
        kind: 'step',
        title: 'Check the ONT for a weak signal',
        body: ['Is the LOS light ever red or blinking? Check the yellow fibre cable for tight bends too.'],
        options: [
          { label: 'LOS red/blinking or cable bent', guide: 'red-los' },
          { label: 'Lights normal, cable fine', next: 'restart-both' },
        ],
      },
      'restart-both': {
        kind: 'step',
        title: 'Restart the ONT, then the router',
        body: ['Restart the ONT first and wait 2 minutes, then restart the router. Run the 50-ping test again.'],
        commands: [{ label: 'Send 50 pings', win: 'ping -n 50 8.8.8.8', mac: 'ping -c 50 8.8.8.8' }],
        options: [
          { label: 'Loss has gone', next: 'ok-restart' },
          { label: 'Still losing packets', next: 'esc-line' },
        ],
      },
      usage: {
        kind: 'step',
        title: 'Check what is using the connection',
        body: ['Streaming, game downloads, phone backups and CCTV uploads can use all the bandwidth. Ask the client to pause them and test again.'],
        options: [
          { label: 'Faster now', next: 'ok-usage' },
          { label: 'Still slow', next: 'esc-speed' },
        ],
      },
      'wifi-signal': {
        kind: 'step',
        title: 'Check the Wi-Fi signal strength',
        body: ['On the slow device, check the signal:'],
        commands: [{ label: 'Show Wi-Fi details', win: 'netsh wlan show interfaces', mac: null, macNote: 'Hold Option and click the Wi-Fi icon in the menu bar. Check RSSI: −67 dBm or higher (closer to 0) is good.' }],
        lookFor: ['Signal 80% or higher is good; below 50% is weak.', 'Radio type and band: 5 GHz is faster but has shorter range than 2.4 GHz.'],
        options: [
          { label: 'Signal is weak', next: 'placement' },
          { label: 'Signal is good', next: 'channel' },
        ],
      },
      placement: {
        kind: 'step',
        title: 'Improve router placement',
        body: [
          'The router works best central, raised and in the open, away from metal, microwaves and thick walls.',
          'Test again standing in the same room as the router.',
        ],
        options: [
          { label: 'Fast near the router', next: 'ok-placement' },
          { label: 'Slow even next to it', next: 'channel' },
        ],
      },
      channel: {
        kind: 'step',
        title: 'Change the Wi-Fi channel',
        body: [
          'Neighbouring networks cause interference. Sign in to 192.168.0.1, open WiFi Settings → WiFi Channel.',
          'For 2.4 GHz try channel 1, 6 or 11. If the device supports it, connect to the 5 GHz network instead.',
        ],
        options: [
          { label: 'Better now', next: 'ok-channel' },
          { label: 'No change', next: 'usage' },
        ],
      },
      'ok-restart': { kind: 'outcome', result: 'resolved', title: 'Resolved by restarting the equipment', body: ['If drops return, run the 50-ping test again and escalate with the results.'] },
      'ok-usage': { kind: 'outcome', result: 'client', title: 'Slowness caused by heavy usage', body: ['The line is healthy. Suggest scheduling large downloads overnight, or a faster package if usage is regular.'] },
      'ok-placement': { kind: 'outcome', result: 'client', title: 'Wi-Fi coverage issue', body: ['The line is fine but the signal is weak in parts of the home. Suggest moving the router or adding a mesh/extender.'] },
      'ok-channel': { kind: 'outcome', result: 'resolved', title: 'Resolved by changing the Wi-Fi channel', body: ['Note the new channel on the account.'] },
      'esc-line': { kind: 'outcome', result: 'escalate', title: 'Escalate to NOC: packet loss on the line', body: ['Loss continues after restarting both devices with normal lights. The NOC should check optical levels and the OLT port.'], checklist: ['Packet-loss result (paste the ping summary)', ...ESCALATE_BASICS] },
      'esc-speed': { kind: 'outcome', result: 'escalate', title: 'Escalate to NOC: speed below package', body: ['Wired speed is well below the package with no loss and no heavy usage. Check the speed profile on the account.'], checklist: ['Speed test results (download, upload, ping)', 'Package name', ...ESCALATE_BASICS] },
    },
  },

  {
    slug: 'red-los',
    title: 'Red LOS light on the ONT',
    summary: 'No fibre signal reaching the ONT. Usually a bend, break or loose connector.',
    category: 'Fibre',
    icon: ic.signalDisconnected,
    tone: 'rose',
    minutes: 5,
    keywords: 'los red light fibre fiber optical signal ont huawei break bend connector',
    start: 'los-state',
    nodes: {
      'los-state': {
        kind: 'step',
        title: 'Confirm the LOS light',
        body: ['Ask whether the LOS light is red, and whether it’s steady or blinking.'],
        lookFor: ['Steady red usually means no signal at all (a break or disconnection).', 'Blinking red usually means a weak signal (a bend or dirty connector).'],
        options: [
          { label: 'Steady red', next: 'cable' },
          { label: 'Blinking red', next: 'connector' },
          { label: 'LOS is off', guide: 'no-internet' },
        ],
      },
      cable: {
        kind: 'step',
        title: 'Check the fibre cable',
        body: [
          'Follow the thin yellow or white cable from the ONT to the wall box.',
          'Fibre fails if it is bent tighter than a finger, pinched under a door or furniture, or chewed by pets.',
        ],
        options: [
          { label: 'Sharply bent or pinched', next: 'straighten' },
          { label: 'Visibly cut or broken', next: 'esc-damage' },
          { label: 'Looks fine', next: 'connector' },
        ],
      },
      straighten: {
        kind: 'step',
        title: 'Free the cable',
        body: ['Gently free and straighten the cable without pulling on it. Wait one minute and check LOS again.'],
        options: [
          { label: 'LOS is off now', next: 'ok-bend' },
          { label: 'Still red', next: 'connector' },
        ],
      },
      connector: {
        kind: 'step',
        title: 'Reseat the fibre connector',
        body: [
          'Unplug the green connector from the bottom of the ONT, wait five seconds, and push it back until it clicks. Do the same at the wall box if it’s reachable.',
          'Never look into the end of the connector or the port.',
        ],
        options: [
          { label: 'LOS off, PON steady green', next: 'ok-reseat' },
          { label: 'Still red', next: 'restart-ont' },
        ],
      },
      'restart-ont': {
        kind: 'step',
        title: 'Restart the ONT',
        body: ['Unplug the ONT power for 30 seconds, plug it back in and wait 3 minutes.'],
        options: [
          { label: 'LOS is off now', next: 'ok-restart' },
          { label: 'Still red', next: 'esc-site' },
        ],
      },
      'ok-bend': { kind: 'outcome', result: 'resolved', title: 'Resolved: fibre cable was bent', body: ['Advise the client to keep the cable clear of doors and furniture. If it was creased hard, book a check in case it fails again.'] },
      'ok-reseat': { kind: 'outcome', result: 'resolved', title: 'Resolved by reseating the connector', body: ['Run the standard checks: load a website and confirm Wi-Fi on one device.'] },
      'ok-restart': { kind: 'outcome', result: 'resolved', title: 'Resolved by restarting the ONT', body: ['If LOS returns, escalate for an optical power test.'] },
      'esc-damage': { kind: 'outcome', result: 'escalate', title: 'Book a site visit: damaged fibre', body: ['The cable is physically damaged and needs re-splicing or a new drop cable.'], checklist: ['Where the damage is', ...ESCALATE_BASICS] },
      'esc-site': { kind: 'outcome', result: 'escalate', title: 'Book a site visit: no optical signal', body: ['LOS stays red after checking the cable and connector. A technician needs to test optical power at the wall and the ONT. Also check the map for other faults in the area.'], checklist: ESCALATE_BASICS },
    },
  },

  {
    slug: 'wifi',
    title: 'Wi-Fi missing or won’t connect',
    summary: 'Network name not showing, password refused, or a device won’t join.',
    category: 'Wi-Fi',
    icon: ic.wifiOff,
    tone: 'teal',
    minutes: 5,
    keywords: 'wifi wi-fi wireless ssid network name not showing cant connect password incorrect',
    start: 'what',
    nodes: {
      what: {
        kind: 'step',
        title: 'What does the client see?',
        body: ['Ask the client to check the Wi-Fi list on their phone.'],
        options: [
          { label: 'Network name isn’t in the list', next: 'wifi-light' },
          { label: 'It’s there but won’t connect', next: 'rejoin' },
          { label: 'Connected, but no internet', guide: 'no-internet' },
        ],
      },
      'wifi-light': {
        kind: 'step',
        title: 'Check the router’s WiFi light',
        body: ['The WiFi light should be on. Some routers have a WiFi button that switches it off.'],
        options: [
          { label: 'WiFi light is off', next: 'wifi-on' },
          { label: 'WiFi light is on', next: 'other-device' },
        ],
      },
      'wifi-on': {
        kind: 'step',
        title: 'Turn Wi-Fi back on',
        body: ['Press the WiFi button once. Or sign in to 192.168.0.1 → WiFi Settings and make sure Wi-Fi is on and no WiFi schedule is switching it off.'],
        options: [
          { label: 'Network visible now', next: 'ok-on' },
          { label: 'Still not visible', guide: 'router-frozen' },
        ],
      },
      'other-device': {
        kind: 'step',
        title: 'Check on another device',
        body: ['Can a different phone or laptop see the network? If only one device can’t, the problem is that device.'],
        options: [
          { label: 'Other devices see it', next: 'device-fix' },
          { label: 'No device sees it', guide: 'router-frozen' },
        ],
      },
      rejoin: {
        kind: 'step',
        title: 'Forget the network and rejoin',
        body: ['On the device, forget (remove) the network, then join again and type the password carefully. Wi-Fi passwords are case-sensitive.'],
        options: [
          { label: 'Connected', next: 'ok-rejoin' },
          { label: 'Client doesn’t know the password', guide: 'wifi-password' },
          { label: 'Password correct but still refused', next: 'device-fix' },
        ],
      },
      'device-fix': {
        kind: 'step',
        title: 'Reset the device’s Wi-Fi',
        body: [
          'Turn Wi-Fi off and on, toggle Airplane mode, then restart the device.',
          'Older devices can’t see 5 GHz networks. If there are two network names, use the one without “5G”.',
        ],
        options: [
          { label: 'Connected', next: 'ok-device' },
          { label: 'Still won’t connect', next: 'device-issue' },
        ],
      },
      'ok-on': { kind: 'outcome', result: 'resolved', title: 'Resolved: Wi-Fi was switched off', body: ['Show the client where the WiFi button is so they avoid pressing it by accident.'] },
      'ok-rejoin': { kind: 'outcome', result: 'resolved', title: 'Resolved by rejoining the network', body: [] },
      'ok-device': { kind: 'outcome', result: 'resolved', title: 'Resolved by resetting the device’s Wi-Fi', body: [] },
      'device-issue': { kind: 'outcome', result: 'client', title: 'The problem is on the client’s device', body: ['Other devices connect fine. Suggest updating the device or contacting its manufacturer.'] },
    },
  },

  {
    slug: 'websites',
    title: 'Some websites won’t load',
    summary: 'Internet partly works, or browsers say “server not found”.',
    category: 'Connection',
    icon: ic.dns,
    tone: 'green',
    minutes: 5,
    keywords: 'dns websites not loading server not found some sites browser nslookup flushdns',
    start: 'compare',
    nodes: {
      compare: {
        kind: 'step',
        title: 'Compare an IP address with a name',
        body: ['On a computer, run both of these:'],
        commands: [PING_IP, PING_NAME],
        lookFor: ['If the IP gets replies but the name says “could not find host”, DNS is the problem.'],
        options: [
          { label: 'IP replies, name fails', next: 'flush-dns' },
          { label: 'Both reply', next: 'browser' },
          { label: 'Both fail', guide: 'no-internet' },
        ],
      },
      'flush-dns': {
        kind: 'step',
        title: 'Clear the DNS cache',
        body: ['This clears old lookups stored on the computer.'],
        commands: [{ label: 'Clear DNS cache', win: 'ipconfig /flushdns', mac: 'sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder' }],
        options: [
          { label: 'Websites load now', next: 'ok-flush' },
          { label: 'Still failing', next: 'set-dns' },
        ],
      },
      'set-dns': {
        kind: 'step',
        title: 'Set public DNS servers on the router',
        body: [
          'Sign in to 192.168.0.1 and open Internet Settings. Set primary DNS to 8.8.8.8 and secondary to 1.1.1.1, then save.',
          'Reconnect the device and check a lookup:',
        ],
        commands: [{ label: 'Look up a domain', win: 'nslookup google.com', mac: 'nslookup google.com' }],
        lookFor: ['An “Addresses:” line with IP numbers means lookups work.'],
        options: [
          { label: 'Websites load now', next: 'ok-dns' },
          { label: 'Still failing', next: 'esc-dns' },
        ],
      },
      browser: {
        kind: 'step',
        title: 'Check the browser and device',
        body: [
          'Try another browser and a private window. Turn off any VPN or proxy.',
          'Check the device’s date and time are correct. A wrong clock breaks secure websites.',
        ],
        options: [
          { label: 'Loads now', next: 'ok-browser' },
          { label: 'One site fails on every device', next: 'site-down' },
        ],
      },
      'ok-flush': { kind: 'outcome', result: 'resolved', title: 'Resolved by clearing the DNS cache', body: [] },
      'ok-dns': { kind: 'outcome', result: 'resolved', title: 'Resolved by changing DNS servers', body: ['Note on the account that public DNS was set on the router.'] },
      'ok-browser': { kind: 'outcome', result: 'client', title: 'Browser or device setting', body: ['The connection is fine. The issue was the browser, VPN or device clock.'] },
      'site-down': { kind: 'outcome', result: 'client', title: 'That website may be down', body: ['If one site fails on every device while others work, the problem is likely the website itself. Check downforeveryoneorjustme.com.'] },
      'esc-dns': { kind: 'outcome', result: 'escalate', title: 'Escalate to NOC: DNS failing', body: ['Lookups fail even with public DNS. Possible filtering or routing issue on the account.'], checklist: ['nslookup output', ...ESCALATE_BASICS] },
    },
  },

  {
    slug: 'no-power',
    title: 'No lights on the ONT',
    summary: 'The fibre box is completely dark.',
    category: 'Power',
    icon: ic.powerOff,
    tone: 'gold',
    minutes: 3,
    keywords: 'no power dead ont no lights adapter socket',
    start: 'socket',
    nodes: {
      socket: {
        kind: 'step',
        title: 'Check the wall socket',
        body: ['Make sure the socket is switched on. Plug in a phone charger or lamp to confirm it works. Avoid power strips if possible.'],
        options: [
          { label: 'Socket was off, or works on another socket', next: 'ok-socket' },
          { label: 'Socket works, ONT still dark', next: 'adapter' },
        ],
      },
      adapter: {
        kind: 'step',
        title: 'Check the ONT adapter and power button',
        body: [
          'Unplug the adapter at both ends and reconnect firmly. Check the cable for damage.',
          'Some ONTs have a power button on the back. Make sure it is pressed in.',
        ],
        options: [
          { label: 'Lights came on', next: 'ok-adapter' },
          { label: 'Still no lights', next: 'esc-replace' },
        ],
      },
      'ok-socket': { kind: 'outcome', result: 'resolved', title: 'Resolved: power socket', body: [] },
      'ok-adapter': { kind: 'outcome', result: 'resolved', title: 'Resolved: loose adapter or power button', body: [] },
      'esc-replace': { kind: 'outcome', result: 'escalate', title: 'Escalate: replace the ONT adapter', body: ['The ONT gets no power on a working socket. Arrange a replacement adapter, or the ONT if the adapter tests fine.'], checklist: ['Adapter rating from its label (e.g. 12V 1A)', ...ESCALATE_BASICS] },
    },
  },

  {
    slug: 'wifi-password',
    title: 'Forgotten Wi-Fi password',
    summary: 'Find the password on a connected device, or set a new one.',
    category: 'Wi-Fi',
    icon: ic.wifiPassword,
    tone: 'slate',
    minutes: 3,
    keywords: 'wifi password forgot forgotten key change reset',
    start: 'connected-device',
    nodes: {
      'connected-device': {
        kind: 'step',
        title: 'Read it from a device that’s already connected',
        body: ['On a Windows laptop that’s connected, run this with the network name in quotes:'],
        commands: [{ label: 'Show saved password', win: 'netsh wlan show profile name="NETWORK-NAME" key=clear', mac: null, macNote: 'Open Keychain Access, search for the network name, double-click it and tick Show password.' }],
        lookFor: ['The “Key Content” line shows the password.'],
        options: [
          { label: 'Found the password', next: 'ok-found' },
          { label: 'No connected computer', next: 'router-page' },
        ],
      },
      'router-page': {
        kind: 'step',
        title: 'Read or change it on the router',
        body: [
          'Connect a computer to the router with a cable, open 192.168.0.1 and sign in.',
          'Go to WiFi Settings → WiFi Name & Password. Read the password, or set a new one of at least 8 characters. Every device will need to reconnect with it.',
        ],
        options: [
          { label: 'Done', next: 'ok-changed' },
          { label: 'Can’t sign in to the router', guide: 'router-frozen', step: 'factory-reset' },
        ],
      },
      'ok-found': { kind: 'outcome', result: 'resolved', title: 'Password recovered', body: [] },
      'ok-changed': { kind: 'outcome', result: 'resolved', title: 'Password read or changed on the router', body: ['Remind the client to write the new password down.'] },
    },
  },
]

export const GUIDE_BY_SLUG: Record<string, Guide> = Object.fromEntries(GUIDES.map(g => [g.slug, g]))
