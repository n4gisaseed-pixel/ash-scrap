# 救われた後のセカイ

**AFTER THE CLEAR — ASH & AZAMI**

A mobile-first portrait non-field RPG set seven years after the Demon King was
defeated. Ash and Azami repair the World Cores that once kept the world alive.

## Current campaign
- TypeScript + Phaser 3 + Vite
- 540×960 portrait canvas
- fixed single-screen mobile UI
- roughly one-hour prologue, five Core chapters and finale
- automatic story progression after three and six actions in each Core region
- Workshop, route map, scouting, salvage, repairs and PILE-01 tuning
- turn-based battles against a unique guardian in each region
- HEAT / TUNE battle system and autonomous Azami support
- local browser save
- GitHub Pages deployment
- generated Ash, Mina and Azami bust-up expressions, regional environments,
  post-apocalyptic key art and guardian illustrations
- generated combat action icons
- HP / HEAT bars, gadget charges, hit feedback and mobile-sized battle commands

## Story route

The prologue currently takes Ash from his workshop to the scrapyard, where he
meets Azami. The pair build PILE-01, uncover a broken auxiliary relay in an old
facility, and learn that the local furnace is part of a much larger magical
network. Its first pulse points toward the Whitewood and the Green Core.
The route continues through Whitewood, the Dry Lake, the Wind Route, Furnace
City and the old Demon Castle before a new hero party arrives. The six field
actions in each region trigger story scenes automatically at actions three and
six. Progress is saved locally in the browser.

See `docs/STORY_BIBLE.md` for the campaign outline and
`docs/GAME_SYSTEM_REFERENCE.md` for how pacing and presentation draw from the
reference game. See
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
