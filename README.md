# VTL Telecom Support Toolkit

A troubleshooting assistant for VTL Telecom support agents. Pick the client's
symptom and the guide walks you through the fix one step at a time, branching
on what the client reports.

## What's in it

- **8 troubleshooting guides:** no internet, router frozen, slow or dropping
  connection, red LOS light, Wi-Fi problems, websites not loading, no lights
  on the ONT, forgotten Wi-Fi password. Each step offers answers that lead to the
  next step, to another guide, or to an outcome: resolved, client-side, or
  escalate (with a checklist of what to record).
- **Copy notes:** every guide keeps a list of steps taken and answers, ready to
  paste into the ticket.
- **Network commands:** ping, packet-loss test, traceroute, IP renew, DNS
  flush, nslookup and Wi-Fi signal, for Windows and macOS, with how to read the
  results.
- **Light guide:** what each light on the Huawei ONT and Tenda router means,
  linked to the matching guide.
- Light and dark mode, and a layout for desktop, tablet and phone.

## Running it

```sh
npm install
npm run dev      # local development server
npm run build    # production build in dist/
```

## Editing the content

All the content lives in `src/data/`:

- `guides.ts`: the guides. Each guide is a set of `step` and `outcome` nodes;
  a step's options point to the next node (`next`) or to another guide
  (`guide`, optionally with `step`).
- `commands.ts`: the network commands page.
- `lights.ts`: the light guide tables.

The original design handoff is kept in `project/` and `chats/`.
