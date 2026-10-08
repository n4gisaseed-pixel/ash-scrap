# Game Design — 救われた後のセカイ

## Current playable slice

The game follows a roughly 45–60 minute campaign: a prologue and five World
Core chapters, followed by a short defense finale. After the prologue, each
chapter has six deliberate field actions and a tactical guardian fight. Story
events start automatically after actions three and six; the player chooses
how to prepare, while the route and its revelations move forward on their own.

The prologue opens in Ash's leaking workshop, follows the old rail line into a
collapsed scrapyard, and brings the pair to Iron-scrap Town. Its first question
is practical: can Ash repair the auxiliary furnace without destroying the
settlement's heat supply? The three required parts are recovered over three
expedition turns; the rescue scene then starts automatically. The five regions
continue this rhythm and reveal the consequences of the old hero's route one
piece at a time.

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
prologue shows recommended levels and danger before major encounters. Action
results use a distinct gold RESULT state for salvage, rescue, crafting, rest
and battle outcomes; battle rewards remain on screen until the player confirms
the return. Structured reward rows and item icons remain planned.

## Character growth and battle

- The player directly chooses Ash's action.
- Azami makes her own decisions and acts according to her established tendencies.
- The battle order lists upcoming actors and known companion actions. Enemy
  intent stays uncertain until Ash can analyze a pattern.
- Ash levels through expeditions and events. Force, Grit and Ingenuity support
  attacks, survival/HEAT and scrap tools/analysis respectively.
- Equipment, gadgets and skills come from crafting, discoveries and people met
  along the route.
- The campaign party is Ash and Azami. Local people join scenes and help with
  regional preparations, while Azami remains the autonomous companion in battle.

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
- The five regional chapters use an automatic 3+3 action rhythm. Scouting,
  salvage and repairs all advance the same route, but change Insight, materials,
  weapon strength and HP differently.
- A full-screen illustration hides dialogue portraits. Two-character dialogue
  places Ash on the left and Azami or Mina on the right; the active speaker is
  brighter and changes expression.

## Portrait UI rules

The screen hierarchy adapts the reference game's clear status, scene, message and
command areas to a 540×960 canvas:

- Compact header: location, week, HP/level and scrap.
- Main scene: generated environment and character art with faces unobstructed.
- Dialogue/result card with bust-up portraits, readable short text and tap-to-
  finish typewriter reveal. Important story beats can use full-screen CGs.
- Lower command area with two to four large tap targets.
- Battle adds a single horizontal action-order strip above the dialogue.

See [GAME_SYSTEM_REFERENCE.md](GAME_SYSTEM_REFERENCE.md) for research and the
full UI adaptation notes.

## Current prototype

The playable campaign connects the workshop, scrapyard salvage, Azami's rescue,
PILE-01 craft, Mina's settlement, the factory encounter, five data-driven Core
chapters and the new-hero finale. Every region has bespoke story scenes,
illustrated environment art, a material, a guardian and a visible recovery
moment. Longer optional dialogue and challenge routes remain future expansion.
