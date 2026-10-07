# Game Design — 救われた後のセカイ

## Current playable slice

The Chapter 0 hub is Azami's field map: a fixed-screen route board for the
scrapyard, Iron-scrap Town and the old factory. Route access follows story
progress, while workshop assembly and recovery remain available at the hub.
Expedition choices show their week cost, danger and likely gains before the
player commits. Salvage and battle award experience; Ash's Force and maximum HP
grow when he levels. Rest restores HP and spends one week.

The prologue opens seven years after the Demon King was defeated. Its first
question is practical: can Ash repair the auxiliary furnace without destroying
the settlement's heat supply? Azami's map changes as they discover what the old
routes and machines still do.

## High concept

A mobile-first, portrait command adventure set seven years after the Demon
King's defeat. Ash, a teenage junk mechanic, and Azami, a demon girl who maps
the changed world, repair the five World Cores that once maintained the
planet's magical circulation.

**Theme:** The world was saved once. Its people still have to live in it.

## Format

- TypeScript, Phaser 3 and Vite.
- Fixed 540×960 portrait canvas, designed for touch.
- No browser scrolling, virtual D-pad, free-roaming map or required landscape
  play.
- Progress through destinations, expeditions, events, crafting and boss fights.
- Every screen has one purpose and fits in the fixed canvas.

## Core loop

Settlement / workshop → review the map and party → choose a week-costing action
→ see the event and results → improve Ash's gear and skills → unlock a route or
World Core → return to the settlement.

Routine travel and common encounters resolve quickly by command selection. Named
guardians and story bosses use full tactical battles.

## Story sequence

See [STORY_BIBLE.md](STORY_BIBLE.md) for the full campaign outline.

- Prologue: meet Azami, build PILE-01, repair an auxiliary relay and discover
  that the World Cores served the world, not the Demon King.
- Chapter 1: Green Core / Whitewood.
- Chapter 2: Water Core / The Dry Lake.
- Chapter 3: Wind Core / The Broken Route.
- Chapter 4: Fire Core / The Furnace City.
- Chapter 5: Crown Core / The Old Demon Castle.
- Finale: defend Azami from a new hero party acting on incomplete records.

## Time and expedition choices

Each chapter is designed as a limited 12-week scenario. Safe salvage, risky
scouting, dungeon attempts, major events, training, crafting and rest advance
the week. Checking the map, reading known information and reviewing inventory
are free. A main route should take 8–9 weeks, leaving room for optional
preparation. A missed target changes regional conditions but never blocks the
story or corrupts the save.

Before leaving, the player sees the known week cost, suggested party level,
danger, likely rewards and boss conditions. Safe routes offer modest XP or
materials; dangerous ruins offer better rewards and a chance of a boss. The
result appears immediately in a compact card.

## Character growth and battle

- The player directly chooses Ash's action.
- Azami makes her own decisions and acts according to her established tendencies.
- The battle order lists upcoming actors and known companion actions. Enemy
  intent stays uncertain until Ash can analyze a pattern.
- Ash levels through expeditions and events. Force, Grit and Ingenuity support
  attacks, survival/HEAT and scrap tools/analysis respectively.
- Equipment, gadgets and skills come from crafting, discoveries and people met
  along the route.
- The long-term party target is Ash plus at most two companions. Azami is the
  first fixed companion; later support characters are introduced through
  regional story events.

### Existing command verbs

- **ATTACK:** dependable scrap-weapon strike.
- **GADGET:** spend a built or recovered mechanism for a strong effect.
- **TUNE:** vent HEAT and configure the next repair/gadget action.
- **ANALYZE:** learn an enemy pattern and expose a weakness.
- **RETREAT:** leave a dangerous encounter if the route allows it.

The command set will be introduced in stages; keep the active battle screen to
four large primary choices at once.

## Event and presentation rules

- One clear background, one or two visible character portraits/standees, a
  speaker label and 2–4 short lines per event step.
- A result card reports XP, scrap, recovered parts and changed story flags.
- Choices should express a practical trade-off, not hide a required action.
- Give recurring scenes warm everyday details so the post-apocalyptic world
  still feels inhabited.
- World Core repairs produce small visible changes before large environmental
  recovery.

## Portrait UI rules

The screen hierarchy adapts the reference game's clear status, scene, message and
command areas to a 540×960 canvas:

- Compact header: location, week, HP/level and scrap.
- Main scene: generated environment and character art with faces unobstructed.
- Dialogue/result card with a distinct speaker portrait and readable short text.
- Lower command area with two to four large tap targets.
- Battle adds a single horizontal action-order strip above the dialogue.

See [GAME_SYSTEM_REFERENCE.md](GAME_SYSTEM_REFERENCE.md) for research and the
full UI adaptation notes.

## Current prototype

The previous Chapter 0 route is being recast as the prologue. It already
contains the Workshop, scrapyard, salvage, PILE-01 craft, Mina's settlement,
factory encounter and companion support. The prologue narrative and screens
must now connect those pieces to Azami's map and the auxiliary relay. Chapter 1
and later Core regions remain planned content.
