import type { Command } from './guides'

export interface CommandEntry extends Command {
  id: string
  title: string
  purpose: string
  read: string[]
}

export interface CommandGroup {
  title: string
  items: CommandEntry[]
}

export const COMMAND_GROUPS: CommandGroup[] = [
  {
    title: 'Connectivity tests',
    items: [
      {
        id: 'ping-router',
        title: 'Ping the router',
        purpose: 'Checks the device can reach the router.',
        win: 'ping 192.168.0.1',
        mac: 'ping -c 4 192.168.0.1',
        read: [
          'Replies with time=1–5ms: the device is connected to the router.',
          '“Request timed out” or “unreachable”: not connected, or the router has frozen.',
        ],
      },
      {
        id: 'ping-internet',
        title: 'Ping the internet',
        purpose: 'Checks the connection reaches the internet, skipping DNS.',
        win: 'ping 8.8.8.8',
        mac: 'ping -c 4 8.8.8.8',
        read: [
          'Replies under ~100 ms: internet is reachable.',
          'Timed out while the router ping works: the router has no internet (check PPPoE and ONT).',
        ],
      },
      {
        id: 'ping-name',
        title: 'Ping a website by name',
        purpose: 'Tests name lookup (DNS) as well as the connection.',
        win: 'ping google.com',
        mac: 'ping -c 4 google.com',
        read: [
          '“Could not find host” while 8.8.8.8 replies: a DNS problem.',
        ],
      },
      {
        id: 'ping-loss',
        title: 'Packet-loss test',
        purpose: 'Sends 50 pings and reports how many were lost.',
        win: 'ping -n 50 8.8.8.8',
        mac: 'ping -c 50 8.8.8.8',
        read: [
          'Read the summary: 0% loss is healthy, above 2% means the line is dropping packets.',
          'Times that jump above 150 ms indicate congestion.',
        ],
      },
      {
        id: 'ping-continuous',
        title: 'Continuous ping',
        purpose: 'Watches for drop-outs while the client uses the connection. Press Ctrl+C to stop.',
        win: 'ping -t 8.8.8.8',
        mac: 'ping 8.8.8.8',
        read: [
          '“Request timed out” lines between replies are drop-outs. Note how often they happen.',
        ],
      },
      {
        id: 'traceroute',
        title: 'Trace the route',
        purpose: 'Shows each hop between the device and the destination.',
        win: 'tracert 8.8.8.8',
        mac: 'traceroute 8.8.8.8',
        read: [
          'Hop 1 is the router. If it stops after hop 1, the problem is between the router and our network.',
          'A few “* * *” hops are normal; it only matters if every hop after a point fails.',
        ],
      },
    ],
  },
  {
    title: 'IP address and DNS',
    items: [
      {
        id: 'ip-info',
        title: 'Show IP details',
        purpose: 'Shows the device’s IP address, gateway (router) and DNS servers.',
        win: 'ipconfig /all',
        mac: 'networksetup -getinfo Wi-Fi',
        read: [
          'IP address should be 192.168.0.x and the gateway (Router) 192.168.0.1.',
          'An address starting 169.254 means the device didn’t get an address from the router.',
        ],
      },
      {
        id: 'renew',
        title: 'Get a new IP address',
        purpose: 'Asks the router for a fresh address. Fixes many “connected, no internet” cases.',
        win: 'ipconfig /release\nipconfig /renew',
        mac: 'sudo ipconfig set en0 DHCP',
        read: ['Run the IP details command afterwards to confirm a 192.168.0.x address.'],
      },
      {
        id: 'flushdns',
        title: 'Clear DNS cache',
        purpose: 'Removes stored lookups that may be out of date.',
        win: 'ipconfig /flushdns',
        mac: 'sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder',
        read: ['Windows confirms “Successfully flushed the DNS Resolver Cache.” macOS prints nothing.'],
      },
      {
        id: 'nslookup',
        title: 'Look up a domain',
        purpose: 'Asks the DNS server for a website’s address.',
        win: 'nslookup google.com',
        mac: 'nslookup google.com',
        read: [
          'An “Addresses:” line with numbers means DNS works.',
          '“Request timed out” or “Non-existent domain” for a real site means DNS is failing.',
        ],
      },
    ],
  },
  {
    title: 'Wi-Fi',
    items: [
      {
        id: 'wifi-signal',
        title: 'Show Wi-Fi signal strength',
        purpose: 'Shows signal %, band and connection speed for the current network.',
        win: 'netsh wlan show interfaces',
        mac: null,
        macNote: 'Hold Option and click the Wi-Fi icon in the menu bar. RSSI of −67 dBm or higher (closer to 0) is good.',
        read: ['Signal 80% or more is good; under 50% is weak.'],
      },
      {
        id: 'wifi-password',
        title: 'Show saved Wi-Fi password',
        purpose: 'Reads the password of a network this computer has joined. Replace NETWORK-NAME.',
        win: 'netsh wlan show profile name="NETWORK-NAME" key=clear',
        mac: null,
        macNote: 'Open Keychain Access, search for the network name, double-click it and tick Show password.',
        read: ['The password is on the “Key Content” line.'],
      },
    ],
  },
]

export const ALL_COMMANDS = COMMAND_GROUPS.flatMap(g => g.items)
