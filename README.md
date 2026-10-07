# 救われた後のセカイ

**AFTER THE CLEAR — ASH & AZAMI**

A mobile-first portrait non-field RPG set seven years after the Demon King was
defeated. Ash and Azami repair the World Cores that once kept the world alive.

## Current prototype
- TypeScript + Phaser 3 + Vite
- 540×960 portrait canvas
- fixed single-screen mobile UI
- Workshop and settlement command hub
- Scrapyard salvage
- simple crafting
- turn-based battle
- HEAT / TUNE prototype
- local browser save
- GitHub Pages deployment
- generated Ash, Mina and Azami portraits, post-apocalyptic key art, location
  art and enemy illustrations
- generated combat action icons
- HP / HEAT bars, gadget charges, hit feedback and mobile-sized battle commands

## Chapter 0 route

The prologue currently takes Ash from his workshop to the scrapyard, where he
meets Azami. The pair build PILE-01, uncover a broken auxiliary relay in an old
facility, and learn that the local furnace is part of a much larger magical
network. Its first pulse points toward the Whitewood and the Green Core.
Progress is saved locally in the browser.

See `docs/STORY_BIBLE.md` for the campaign outline and
`docs/GAME_SYSTEM_REFERENCE.md` for how pacing and presentation draw from the
reference game. The command systems are being expanded in stages; see
`docs/ROADMAP.md`.

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
