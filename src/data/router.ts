import { ic, type IconData } from '../icons'
import type { Tone } from './tones'

export interface RouterTask {
  slug: string
  title: string
  summary: string
  icon: IconData
  tone: Tone
  /** Menu path in the router’s web page. */
  path?: string
  steps: string[]
  settings?: [string, string][]
  warning?: string
  tip?: string
}

/** Written for Tenda routers (192.168.0.1). Menu names can differ slightly by model. */
export const ROUTER_TASKS: RouterTask[] = [
  {
    slug: 'sign-in',
    title: 'Sign in to the router',
    summary: 'Every change starts here.',
    icon: ic.login,
    tone: 'slate',
    steps: [
      'Connect a computer or phone to the router by cable or Wi-Fi.',
      'Open a browser and go to 192.168.0.1 (or tendawifi.com).',
      'Enter the router’s login password. If nobody knows it, the router must be factory reset.',
    ],
    settings: [['Address', '192.168.0.1'], ['Alternative', 'tendawifi.com']],
    tip: 'If the page doesn’t open, ping 192.168.0.1 to check the device is connected to the router.',
  },
  {
    slug: 'pppoe',
    title: 'Set up the internet connection (PPPoE)',
    summary: 'For a new or reset router.',
    icon: ic.settingsEthernet,
    tone: 'blue',
    path: 'Internet Settings',
    steps: [
      'Sign in and open Internet Settings.',
      'Set the connection type to PPPoE.',
      'Enter the PPPoE username and password exactly as on the client’s account. They are case-sensitive.',
      'Save and wait up to a minute. The status should change to Connected.',
    ],
    settings: [['Connection type', 'PPPoE'], ['Username', 'From the account'], ['Password', 'From the account'], ['DNS', 'Automatic']],
    warning: 'A wrong username or password shows “authentication failed”. Re-type them; don’t copy-paste spaces.',
  },
  {
    slug: 'wifi-name',
    title: 'Change the Wi-Fi name and password',
    summary: 'Rename the network or set a new password.',
    icon: ic.wifi,
    tone: 'teal',
    path: 'WiFi Settings → WiFi Name & Password',
    steps: [
      'Sign in and open WiFi Settings → WiFi Name & Password.',
      'Enter the new network name (and the 5 GHz name if it’s separate).',
      'Set security to WPA2-PSK (or WPA2/WPA3) and enter a password of at least 8 characters.',
      'Save. Every device disconnects and must rejoin with the new details.',
    ],
    settings: [['Security', 'WPA2-PSK or WPA2/WPA3'], ['Password', '8+ characters, mixed']],
    tip: 'Avoid the client’s name or address in the network name. If you’re connected over Wi-Fi, you’ll be disconnected when you save.',
  },
  {
    slug: 'channel',
    title: 'Change the Wi-Fi channel or band',
    summary: 'Fix interference and slow Wi-Fi.',
    icon: ic.tune,
    tone: 'violet',
    path: 'WiFi Settings → WiFi Channel & Bandwidth',
    steps: [
      'Sign in and open WiFi Settings → WiFi Channel & Bandwidth.',
      'For 2.4 GHz choose channel 1, 6 or 11 (the ones that don’t overlap) and 20 MHz bandwidth in busy areas.',
      'For 5 GHz, Auto is usually fine; try 36–48 if devices disconnect.',
      'Save, then test speed again near the router.',
    ],
    settings: [['2.4 GHz channel', '1, 6 or 11'], ['2.4 GHz bandwidth', '20 MHz (busy areas)'], ['5 GHz channel', 'Auto or 36–48']],
  },
  {
    slug: 'dns',
    title: 'Set DNS servers',
    summary: 'When websites fail to load by name.',
    icon: ic.dns,
    tone: 'green',
    path: 'Internet Settings → DNS',
    steps: [
      'Sign in and open Internet Settings.',
      'Change DNS from Automatic to Manual.',
      'Enter the primary and secondary DNS below and save.',
      'On the client’s computer, clear the DNS cache (ipconfig /flushdns) and test.',
    ],
    settings: [['Primary DNS', '8.8.8.8'], ['Secondary DNS', '1.1.1.1']],
  },
  {
    slug: 'admin-password',
    title: 'Change the router login password',
    summary: 'Secure the settings page.',
    icon: ic.lock,
    tone: 'gold',
    path: 'System Settings → Login Password',
    steps: [
      'Sign in and open System Settings → Login Password.',
      'Enter the old password, then the new one twice.',
      'Save and sign in again to check it works.',
    ],
    tip: 'This is different from the Wi-Fi password. Ask the client to write it down somewhere safe.',
  },
  {
    slug: 'reboot-schedule',
    title: 'Reboot now or on a schedule',
    summary: 'Helps routers that freeze often.',
    icon: ic.schedule,
    tone: 'blue',
    path: 'System Settings → Reboot / Reboot Schedule',
    steps: [
      'Sign in and open System Settings.',
      'To reboot now, choose Reboot and wait 2 minutes.',
      'To schedule, open Reboot Schedule, turn it on and pick a quiet time.',
      'Save.',
    ],
    settings: [['Schedule', 'Daily'], ['Time', '03:00']],
  },
  {
    slug: 'reset',
    title: 'Factory reset and restore',
    summary: 'Last resort for a frozen or locked router.',
    icon: ic.restart,
    tone: 'rose',
    steps: [
      'Have the PPPoE username and password ready first.',
      'With the router on, hold the RST (or WPS/RST) button for about 8 seconds until the lights flash, then release.',
      'Wait 2 minutes, then connect to the default Wi-Fi printed on the router’s label.',
      'Open 192.168.0.1 and run the setup: PPPoE login, Wi-Fi name and password, login password.',
    ],
    warning: 'A reset erases every setting, including the internet login. The client is offline until it’s set up again.',
  },
  {
    slug: 'firmware',
    title: 'Update the firmware',
    summary: 'Fixes bugs that cause freezes and drops.',
    icon: ic.systemUpdate,
    tone: 'teal',
    path: 'System Settings → Firmware Upgrade',
    steps: [
      'Check the exact model and hardware version on the router’s label.',
      'Download the matching firmware only from Tenda’s official website.',
      'Sign in, open System Settings → Firmware Upgrade, select the file and upgrade.',
      'Wait until the router restarts on its own (about 3 minutes).',
    ],
    warning: 'Don’t switch the router off during an upgrade. Wrong firmware or a power cut can make it unusable.',
  },
]
