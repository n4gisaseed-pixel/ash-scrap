# ASH / SCRAP

Mobile-first portrait non-field junkpunk RPG.

## Current prototype
- TypeScript + Phaser 3 + Vite
- 540×960 portrait canvas
- fixed single-screen mobile UI
- Workshop hub
- Scrapyard salvage
- simple crafting
- turn-based battle
- HEAT / TUNE prototype
- local browser save
- GitHub Pages deployment
- generated Ash and Mina portraits, location art and enemy illustrations
- generated combat action icons
- HP / HEAT bars, gadget charges, hit feedback and mobile-sized battle commands

## Chapter 0 route

The current playable route goes from the workshop to the scrapyard, Iron-scrap
Town, and the abandoned factory, then returns to the workshop. Salvage the three
parts needed for PILE-01, fight the Scrap Hound, learn about the factory's
pressure fault in town, and stop its Furnace Warden without destroying the
town's heat source. Progress is saved locally in the browser.

This is the first end-to-end story slice. More events and encounters are still
needed to reach the planned 30–45 minute chapter length; see `docs/ROADMAP.md`.

## Play
https://n4gisaseed-pixel.github.io/ash-scrap/

## Development
```bash
npm install
npm run dev
npm run build
```

## Codex
Read `AGENTS.md` first. Design source-of-truth documents are under `docs/`.

Do not reintroduce free-roaming field movement unless the design documentation is intentionally changed.
