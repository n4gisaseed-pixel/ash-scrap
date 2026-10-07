# ASH / SCRAP — Game Design

## High concept
A browser-playable 2D junkpunk RPG about Ash, a teenage mechanic living among scrap, steam machinery and abandoned industrial structures.

**Theme:** “Discarded things can still have a purpose.”

## Genre
Exploration + salvage/crafting + turn-based JRPG.

## Initial scope
Create Chapter 0 as a 30–45 minute vertical slice before expanding the world.

### Chapter 0 flow
1. Ash's Workshop — tutorial and first repair.
2. Iron-scrap Town — NPCs, shop, first request.
3. Scrapyard — exploration and salvage.
4. Abandoned Factory — first dungeon.
5. Boss battle.
6. Return to Workshop — craft/repair payoff and chapter ending.

## Core loop
Explore -> collect scrap -> fight -> return -> dismantle -> craft/tune equipment -> unlock farther exploration.

## Exploration
- 2D top-down movement.
- Interact with NPCs, machinery, containers and environmental objects.
- Maps should reward looking into corners with useful junk, small stories or shortcuts.

## Combat
Turn-based.

Initial commands:
- ATTACK
- GADGET
- ITEM
- TUNE

### TUNE
Ash can adjust equipment during battle. Tuning should create meaningful risk/reward decisions rather than functioning as ordinary magic.

Examples:
- OVERDRIVE: more power, increased malfunction/heat risk.
- PRESSURE: prepare an armor-piercing strike.
- COOLING: reduce accumulated HEAT.

## Salvage
Enemies and exploration points provide components rather than only money.

Examples:
- Rusted Gear
- Copper Wire
- Small Motor
- Pressure Cylinder
- Ignition Unit

## Craft
At the Workshop, components can be dismantled, recombined and installed.

Example:
Iron Pipe + Ignition Unit + Pressure Cylinder -> PILE-01

Equipment should evolve through modification rather than being replaced every few minutes.

## Progression philosophy
Player power should come from:
- Ash's level/skills
- finding better components
- discovering recipes
- modifying existing equipment
- learning how systems interact

## Initial required systems
- title/new game/continue
- map movement and collision
- interaction
- dialogue/events
- map transitions
- inventory
- equipment
- turn-based combat
- EXP/levels
- salvage drops
- dismantling
- crafting
- weapon modification
- quests
- shop
- local save/load
- Chapter 0 boss and ending

## Not yet
Do not prioritize multiplayer, accounts, cloud saves, procedural open worlds or a huge crafting catalog during the vertical slice.
