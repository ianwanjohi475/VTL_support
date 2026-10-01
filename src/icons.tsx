/**
 * All icons come from Google's Material Symbols (the set used across Android,
 * Gmail and Google Cloud), via Iconify. Windows and Apple brand marks come
 * from Material Design Icons. Each icon is imported individually, so only the
 * ones used here end up in the build.
 */
import { Icon as Iconify, type IconifyIcon } from '@iconify/react'

import arrowBack from '@iconify-icons/material-symbols/arrow-back'
import arrowForward from '@iconify-icons/material-symbols/arrow-forward'
import build from '@iconify-icons/material-symbols/build-outline'
import campaign from '@iconify-icons/material-symbols/campaign-outline'
import chat from '@iconify-icons/material-symbols/chat-outline'
import check from '@iconify-icons/material-symbols/check'
import checkBox from '@iconify-icons/material-symbols/check-box'
import checkBoxBlank from '@iconify-icons/material-symbols/check-box-outline-blank'
import checkCircle from '@iconify-icons/material-symbols/check-circle'
import checklist from '@iconify-icons/material-symbols/checklist'
import chevronRight from '@iconify-icons/material-symbols/chevron-right'
import cellTower from '@iconify-icons/material-symbols/cell-tower'
import cloudOff from '@iconify-icons/material-symbols/cloud-off'
import contentCopy from '@iconify-icons/material-symbols/content-copy-outline'
import crisisAlert from '@iconify-icons/material-symbols/crisis-alert'
import darkMode from '@iconify-icons/material-symbols/dark-mode'
import dns from '@iconify-icons/material-symbols/dns'
import groups from '@iconify-icons/material-symbols/groups-outline'
import hourglass from '@iconify-icons/material-symbols/hourglass-top'
import info from '@iconify-icons/material-symbols/info-outline'
import lightMode from '@iconify-icons/material-symbols/light-mode'
import lightbulb from '@iconify-icons/material-symbols/lightbulb-outline'
import lock from '@iconify-icons/material-symbols/lock-outline'
import login from '@iconify-icons/material-symbols/login'
import person from '@iconify-icons/material-symbols/person-outline'
import powerOff from '@iconify-icons/material-symbols/power-off'
import publicOff from '@iconify-icons/material-symbols/public-off'
import restart from '@iconify-icons/material-symbols/restart-alt'
import router from '@iconify-icons/material-symbols/router'
import schedule from '@iconify-icons/material-symbols/schedule-outline'
import search from '@iconify-icons/material-symbols/search'
import settingsEthernet from '@iconify-icons/material-symbols/settings-ethernet'
import signalDisconnected from '@iconify-icons/material-symbols/signal-disconnected'
import speed from '@iconify-icons/material-symbols/speed'
import systemUpdate from '@iconify-icons/material-symbols/system-update-alt'
import terminal from '@iconify-icons/material-symbols/terminal'
import tune from '@iconify-icons/material-symbols/tune'
import warning from '@iconify-icons/material-symbols/warning-outline'
import wifi from '@iconify-icons/material-symbols/wifi'
import wifiOff from '@iconify-icons/material-symbols/wifi-off'
import wifiPassword from '@iconify-icons/material-symbols/wifi-password'
import apple from '@iconify-icons/mdi/apple'
import windows from '@iconify-icons/mdi/microsoft-windows'

export type IconData = IconifyIcon

export const ic = {
  arrowBack, arrowForward, build, campaign, chat, check, checkBox, checkBoxBlank, checkCircle, checklist,
  chevronRight, cellTower, cloudOff, contentCopy, crisisAlert, darkMode, dns, groups, hourglass, info,
  lightMode, lightbulb, lock, login, person, powerOff, publicOff, restart, router, schedule, search,
  settingsEthernet, signalDisconnected, speed, systemUpdate, terminal, tune, warning, wifi, wifiOff,
  wifiPassword, apple, windows,
} satisfies Record<string, IconData>

export function Icon({ icon, size = 20, className }: { icon: IconData; size?: number; className?: string }) {
  return <Iconify icon={icon} width={size} height={size} className={className} aria-hidden="true" />
}
