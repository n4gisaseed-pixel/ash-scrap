# ASH / SCRAP — Game Design

## High concept
A portrait-oriented browser/mobile junkpunk RPG about Ash, a teenage mechanic who gives discarded machines new purposes.

**Theme:** “Discarded things can still have a purpose.”

## Format
- Mobile-first.
- Portrait orientation.
- Fixed screen: no page scrolling and no field-map camera scrolling.
- Non-field RPG.
- Progression is driven by tapping commands, choosing destinations, reading events, fighting, salvaging and crafting.
- Every screen must fit within a single 540×960 game canvas.

## Core loop
Workshop -> choose destination -> event/exploration -> battle or salvage -> return -> craft/tune -> unlock next destination.

## Chapter 0 flow
1. Workshop hub.
2. Scrapyard exploration.
3. Salvage tutorial.
4. Scrap Hound battle.
5. Craft PILE-01.
6. New route unlocks toward Iron-scrap Town / Abandoned Factory.

## Exploration
There is no free walking field map.

A location consists of:
- fixed background/illustration
- location title
- short narrative/event text
- 2–4 context commands
- occasional random or scripted event
- battle transition

## Combat
Turn-based, portrait layout.

Initial commands:
- ATTACK
- GADGET
- TUNE
- RETURN

### TUNE
Ash adjusts equipment mid-battle. Tuning creates risk/reward choices and manages HEAT.

## Salvage
Locations and enemies yield components:
- Rusted Gear
- Copper Wire
- Small Motor
- Pressure Cylinder
- Ignition Unit

## Craft
Workshop-based.
Example:
Rusted Gear + Copper Wire + Pressure Cylinder -> PILE-01

## Mobile UX rules
- Large tap targets.
- No virtual D-pad.
- No swipe-dependent core controls.
- No browser scrolling.
- No UI element may require reaching beyond the fixed viewport.
- Important actions remain in the lower half of the screen.
- Text must remain readable on a normal smartphone in portrait orientation.

## Current prototype targets
- vertical title screen
- workshop hub
- non-field scrapyard
- salvage
- simple battle
- PILE-01 crafting
- local save
