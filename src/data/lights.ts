export type LightStatus = 'ok' | 'check' | 'fault'

export interface LightState {
  state: string
  meaning: string
  status: LightStatus
  /** Guide to open when this state is a problem. */
  guide?: string
}

export interface Light {
  name: string
  states: LightState[]
}

export interface Device {
  title: string
  subtitle: string
  lights: Light[]
}

export const DEVICES: Device[] = [
  {
    title: 'Huawei ONT',
    subtitle: 'HG8145V5 and EG8141A5, the white fibre box',
    lights: [
      { name: 'POWER', states: [
        { state: 'Steady green', meaning: 'Powered on', status: 'ok' },
        { state: 'Off', meaning: 'No power', status: 'fault', guide: 'no-power' },
      ] },
      { name: 'PON', states: [
        { state: 'Steady green', meaning: 'Registered on the network', status: 'ok' },
        { state: 'Blinking', meaning: 'Registering. Normal for up to 3 minutes after a restart', status: 'check', guide: 'no-internet' },
        { state: 'Off', meaning: 'Not registered', status: 'fault', guide: 'no-internet' },
      ] },
      { name: 'LOS', states: [
        { state: 'Off', meaning: 'Fibre signal is fine', status: 'ok' },
        { state: 'Blinking red', meaning: 'Fibre signal too weak', status: 'fault', guide: 'red-los' },
        { state: 'Steady red', meaning: 'No fibre signal', status: 'fault', guide: 'red-los' },
      ] },
      { name: 'LAN 1–4', states: [
        { state: 'On or blinking', meaning: 'Cable connected; blinking shows traffic', status: 'ok' },
        { state: 'Off', meaning: 'No cable or device on that port', status: 'check', guide: 'no-internet' },
      ] },
      { name: 'WLAN', states: [
        { state: 'On', meaning: 'ONT Wi-Fi enabled (usually unused when a router is fitted)', status: 'ok' },
        { state: 'Off', meaning: 'ONT Wi-Fi disabled', status: 'ok' },
      ] },
    ],
  },
  {
    title: 'Tenda router',
    subtitle: 'AC10 and similar models. Labels can differ slightly by model',
    lights: [
      { name: 'SYS', states: [
        { state: 'Blinking', meaning: 'Working normally', status: 'ok' },
        { state: 'Solid or off', meaning: 'System fault or frozen', status: 'fault', guide: 'router-frozen' },
      ] },
      { name: 'WAN / Internet', states: [
        { state: 'On or blinking', meaning: 'Cable from the ONT connected; blinking shows traffic', status: 'ok' },
        { state: 'Off', meaning: 'No link from the ONT', status: 'fault', guide: 'no-internet' },
      ] },
      { name: 'WiFi', states: [
        { state: 'On or blinking', meaning: 'Wi-Fi on', status: 'ok' },
        { state: 'Off', meaning: 'Wi-Fi switched off', status: 'fault', guide: 'wifi' },
      ] },
      { name: 'LAN', states: [
        { state: 'On or blinking', meaning: 'Wired device connected', status: 'ok' },
        { state: 'Off', meaning: 'No wired device on that port', status: 'ok' },
      ] },
    ],
  },
]
