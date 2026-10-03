import { useCallback, useEffect, useRef, useState } from 'react'
import { Icon, ic } from '../icons'

export type Scenario = 'good' | 'loss' | 'down'

const PROMPT = 'C:\\Users\\VTL>'
const BANNER = ['Microsoft Windows [Version 10.0.22631.4317]', '(c) Microsoft Corporation. All rights reserved.', '']

const HOSTS: Record<string, string> = { 'google.com': '142.250.185.78', 'www.google.com': '142.250.185.78', 'facebook.com': '157.240.196.35' }

const rand = (a: number, b: number) => Math.round(a + Math.random() * (b - a))

interface PingJob {
  target: string
  ip: string
  total: number // Infinity for -t
  sent: number
  times: number[]
  lost: number
}

/** A Windows Command Prompt that understands ping, ipconfig, cls and help. */
export function Cmd({ scenario, queued, onRan }: {
  scenario: Scenario
  /** A command to type in automatically (changes when `id` changes). */
  queued?: { cmd: string; id: number }
  onRan?: (cmd: string) => void
}) {
  const [lines, setLines] = useState<string[]>(BANNER)
  const [input, setInput] = useState('')
  const [job, setJob] = useState<PingJob | null>(null)
  const [typing, setTyping] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const scenarioRef = useRef(scenario)
  scenarioRef.current = scenario

  const print = useCallback((...l: string[]) => setLines(x => [...x, ...l]), [])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight })
  }, [lines, input])

  const finish = useCallback((j: PingJob, interrupted = false) => {
    const recv = j.sent - j.lost
    const pct = j.sent ? Math.round((j.lost / j.sent) * 100) : 0
    const out = [
      ...(interrupted ? ['Control-C', '^C'] : []),
      '',
      `Ping statistics for ${j.ip}:`,
      `    Packets: Sent = ${j.sent}, Received = ${recv}, Lost = ${j.lost} (${pct}% loss),`,
    ]
    if (j.times.length) {
      const min = Math.min(...j.times), max = Math.max(...j.times)
      const avg = Math.round(j.times.reduce((a, b) => a + b, 0) / j.times.length)
      out.push('Approximate round trip times in milli-seconds:', `    Minimum = ${min}ms, Maximum = ${max}ms, Average = ${avg}ms`)
    }
    out.push('')
    print(...out)
    setJob(null)
  }, [print])

  // Send one ping every ~450 ms while a job runs.
  useEffect(() => {
    if (!job) return
    if (job.sent >= job.total) { finish(job); return }
    const t = setTimeout(() => {
      const sc = scenarioRef.current
      const isRouter = job.ip.startsWith('192.168.')
      let reply: number | null
      if (isRouter) reply = rand(1, 3)
      else if (sc === 'down') reply = null
      else if (sc === 'loss') reply = Math.random() < 0.28 ? null : rand(35, 320)
      else reply = rand(18, 34)
      const ttl = isRouter ? 64 : 117
      print(reply === null
        ? (isRouter ? 'Request timed out.' : sc === 'down' ? 'Request timed out.' : 'Request timed out.')
        : `Reply from ${job.ip}: bytes=32 time${reply < 1 ? '<1' : '='}${reply}ms TTL=${ttl}`)
      setJob(j => j && ({ ...j, sent: j.sent + 1, lost: j.lost + (reply === null ? 1 : 0), times: reply === null ? j.times : [...j.times, reply] }))
    }, 450)
    return () => clearTimeout(t)
  }, [job, finish, print])

  const run = useCallback((raw: string) => {
    const cmd = raw.trim()
    print(PROMPT + raw)
    onRan?.(cmd.toLowerCase())
    if (!cmd) return
    const [name, ...args] = cmd.split(/\s+/)
    const lower = name.toLowerCase()

    if (lower === 'cls') { setLines([]); return }
    if (lower === 'help') {
      print('Try:', '  ping 192.168.0.1          test the connection to the router', '  ping 8.8.8.8 -n 50        send 50 pings and count losses', '  ping 8.8.8.8 -t           ping until you press Ctrl+C', '  ipconfig                  show the IP address and gateway', '  cls                       clear the screen', '')
      return
    }
    if (lower === 'ipconfig') {
      print('', 'Windows IP Configuration', '', '', 'Wireless LAN adapter Wi-Fi:', '',
        '   Connection-specific DNS Suffix  . : ',
        '   IPv4 Address. . . . . . . . . . . : 192.168.0.105',
        '   Subnet Mask . . . . . . . . . . . : 255.255.255.0',
        '   Default Gateway . . . . . . . . . : 192.168.0.1', '')
      return
    }
    if (lower === 'ping') {
      const target = args.find(a => !a.startsWith('-') && !/^\d+$/.test(a)) ?? args.find(a => /^\d+\.\d+\.\d+\.\d+$/.test(a))
      if (!target) { print('', 'Usage: ping [-t] [-n count] target_name', ''); return }
      const nIdx = args.findIndex(a => a.toLowerCase() === '-n')
      const count = nIdx >= 0 ? Math.min(Math.max(parseInt(args[nIdx + 1] ?? '4', 10) || 4, 1), 200) : 4
      const forever = args.some(a => a.toLowerCase() === '-t')
      const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(target)
      let ip = target
      if (!isIp) {
        const known = HOSTS[target.toLowerCase()]
        if (!known || scenarioRef.current === 'down') {
          print(`Ping request could not find host ${target}. Please check the name and try again.`, '')
          return
        }
        ip = known
      }
      print('', isIp ? `Pinging ${ip} with 32 bytes of data:` : `Pinging ${target} [${ip}] with 32 bytes of data:`)
      setJob({ target, ip, total: forever ? Infinity : count, sent: 0, times: [], lost: 0 })
      return
    }
    print(`'${name}' is not recognized as an internal or external command,`, 'operable program or batch file.', '')
  }, [print, onRan])

  // Type a queued command character by character, then run it.
  useEffect(() => {
    if (!queued) return
    if (job) { setJob(null) }
    setTyping(true)
    let k = 0
    setInput('')
    const t = setInterval(() => {
      k++
      setInput(queued.cmd.slice(0, k))
      if (k >= queued.cmd.length) {
        clearInterval(t)
        setTimeout(() => { setInput(''); setTyping(false); run(queued.cmd) }, 250)
      }
    }, 55)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queued?.id])

  const stop = () => { if (job) finish(job, true) }

  return (
    <div className="cmd" onClick={() => inputRef.current?.focus()}>
      <div className="cmd-title">
        <span className="cmd-title-icon" aria-hidden>C:\</span>
        <span className="cmd-title-text">C:\WINDOWS\system32\cmd.exe</span>
        <span className="cmd-winbtns" aria-hidden>
          <Icon icon={ic.minimize} size={16} /><Icon icon={ic.cropSquare} size={14} /><Icon icon={ic.close} size={16} />
        </span>
      </div>
      <div className="cmd-body" ref={bodyRef} role="log" aria-live="polite">
        {lines.map((l, k) => <div key={k} className="cmd-line">{l || '\u00a0'}</div>)}
        {!job && (
          <form className="cmd-line cmd-input" onSubmit={e => { e.preventDefault(); if (!typing) { const v = input; setInput(''); run(v) } }}>
            <span>{PROMPT}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={e => !typing && setInput(e.target.value)}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              aria-label="Command"
            />
          </form>
        )}
      </div>
      {job && (
        <div className="cmd-running">
          <span>Pinging {job.target}… {job.total === Infinity ? 'until stopped' : `${job.sent}/${job.total}`}</span>
          <button type="button" onClick={stop} onKeyDown={e => e.key === 'c' && e.ctrlKey && stop()}>
            <Icon icon={ic.stop} size={16} />Stop (Ctrl+C)
          </button>
        </div>
      )}
      <CtrlC active={!!job} onStop={stop} />
    </div>
  )
}

/** Ctrl+C stops a running ping, like the real prompt. */
function CtrlC({ active, onStop }: { active: boolean; onStop: () => void }) {
  useEffect(() => {
    if (!active) return
    const h = (e: KeyboardEvent) => { if (e.ctrlKey && e.key.toLowerCase() === 'c') { e.preventDefault(); onStop() } }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [active, onStop])
  return null
}

/** Windows "Run" box (Windows key + R). */
export function RunDialog({ value, onChange, onOk, hl }: { value: string; onChange: (v: string) => void; onOk: () => void; hl?: boolean }) {
  return (
    <form className="run" onSubmit={e => { e.preventDefault(); onOk() }}>
      <div className="run-title"><span>Run</span><Icon icon={ic.close} size={16} /></div>
      <div className="run-body">
        <span className="run-icon" aria-hidden><Icon icon={ic.terminal} size={30} /></span>
        <p>Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.</p>
      </div>
      <label className={hl ? 'run-field sim-hl' : 'run-field'}>
        <span>Open:</span>
        <input value={value} onChange={e => onChange(e.target.value)} spellCheck={false} autoCapitalize="off" aria-label="Open" />
      </label>
      <div className="run-actions">
        <button type="submit" className="run-ok">OK</button>
        <button type="button">Cancel</button>
        <button type="button">Browse…</button>
      </div>
    </form>
  )
}
