# ASH / SCRAP — Codex Instructions

## Goal
Build a browser-playable 2D junkpunk RPG called **ASH / SCRAP**.

The repository is the single source of truth. Read `docs/GAME_DESIGN.md`, `docs/CHARACTERS.md`, and `docs/WORLD.md` before making major gameplay or narrative changes.

## Technical direction
- TypeScript
- Phaser 3
- Vite
- Desktop browser first; keep responsive design possible.
- Keep gameplay data separate from systems where practical.
- Prefer small, testable modules over large scene files.
- Do not introduce a backend unless a feature genuinely requires one.
- Initial saves should be local browser saves.

## Development priorities
1. A complete playable vertical slice is more important than feature count.
2. Never leave the main progression knowingly blocked.
3. Placeholder art/audio is acceptable until the gameplay loop works.
4. Preserve save compatibility when practical.
5. Run build/tests after meaningful changes and fix errors before considering work complete.
6. Update documentation when implementation changes an agreed design.

## Core loop
Explore -> Salvage -> Fight -> Return to workshop -> Dismantle/Craft/Tune -> Explore farther.

## Chapter 0 target
Workshop -> Iron-scrap town -> Scrapyard -> Abandoned factory -> Boss -> Workshop return.

Target playtime: approximately 30–45 minutes.

## Core identity
The game is not a generic fantasy RPG with a steampunk skin. Mechanics should reinforce Ash as a mechanic who gives discarded things new purposes.

Key systems:
- SALVAGE
- dismantling/material recovery
- CRAFT
- weapon modification
- turn-based combat
- in-battle TUNE mechanics

Avoid unnecessary scope expansion until Chapter 0 is playable from beginning to end.
