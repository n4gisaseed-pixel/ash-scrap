# 救われた後のセカイ — Codex Instructions

## Goal
Build a mobile-first portrait non-field RPG called **救われた後のセカイ**
(*After the Clear*), starring Ash and Azami in a post-apocalyptic fantasy
world.

The repository is the single source of truth. Before meaningful gameplay or narrative changes, read:
- `docs/GAME_DESIGN.md`
- `docs/CHARACTERS.md`
- `docs/WORLD.md`
- `docs/ROADMAP.md`
- `docs/STORY_BIBLE.md`
- `docs/GAME_SYSTEM_REFERENCE.md`

## Current product direction
- Mobile-first.
- Portrait orientation.
- Fixed 540×960 game canvas.
- No browser scrolling.
- No field-map camera scrolling.
- No virtual D-pad.
- Non-field RPG progression through commands, destinations, events, salvage, battle and crafting.
- Large tap targets and readable text on smartphones.

Do not reintroduce free-roaming map movement unless the design docs are explicitly changed first.

## Technical direction
- TypeScript
- Phaser 3
- Vite
- GitHub Pages deployment from `main`
- Local browser saves first
- Prefer small modules and data-driven systems over large monolithic scene files
- No backend unless a feature genuinely needs one

## Required validation
Before considering a task complete:
1. Run `npm install` when dependencies changed.
2. Run `npm run build`.
3. Fix all TypeScript/build errors.
4. Check the mobile portrait layout for overflow and unreachable buttons.
5. Keep the page itself non-scrollable.
6. Update docs when implementation changes an agreed design.

## Core loop
Settlement/workshop -> review map and party -> choose a week-costing expedition
or work action -> resolve event/result -> improve Ash's gear and skills ->
unlock a route or World Core -> return.

## Prologue target
Workshop -> Scrapyard / meet Azami -> build PILE-01 -> repair the local furnace
relay -> discover the World Core network -> unlock Whitewood / Green Core.

The full campaign plan is in `docs/STORY_BIBLE.md`; the reference-system
adaptation is in `docs/GAME_SYSTEM_REFERENCE.md`.

## Core identity
The game is not a generic fantasy RPG with steampunk decoration.

Mechanics should reinforce Ash as a mechanic who gives discarded things new purposes.

Key systems:
- SALVAGE
- dismantling/material recovery
- CRAFT
- weapon modification
- turn-based combat
- HEAT management
- in-battle TUNE mechanics
- event-based non-field exploration

## UX rules
- Every core action must be usable by touch.
- Avoid hover-only interactions.
- Avoid tiny text or tiny buttons.
- Important controls should remain in the lower half of the portrait screen.
- Do not require landscape orientation.
- Do not use long scrolling menus for core Chapter 0 flows.
- Prefer 2–4 meaningful choices per screen.

## Development priority
1. Recast the playable prototype as the post-apocalyptic prologue.
2. Reliable mobile UX and command-result pacing.
3. Time, expedition risk/reward and character growth systems.
4. Tactical party combat and event-driven regional chapters.
5. Art/audio polish.

Do not add free-roaming movement. Keep the command loop quick and make each
costing action present a clear trade-off.
