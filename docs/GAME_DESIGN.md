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
1. Start at the Workshop hub.
2. Salvage a Rusted Gear, Copper Wire and Pressure Cylinder in the Scrapyard.
3. Fight the Scrap Hound, which yields a Small Motor.
4. Return to the Workshop and craft PILE-01 from the recovered parts.
5. Visit Iron-scrap Town and hear about the factory's pressure fault from Mina.
6. Inspect the pressure line in the Abandoned Factory and fight its Furnace Warden.
7. Stop the furnace without destroying it, then return to the Workshop.

The local save records scrapyard parts, boss victories, town and factory events,
crafted equipment, and the ending. The first route is playable now; additional
chapter events and encounters are still needed to meet the 30–45 minute target.

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
- RETREAT

### TUNE
Ash adjusts equipment mid-battle. TUNE vents up to 45 HEAT, halves the next
enemy hit and strengthens the next GADGET. ATTACK and GADGET build HEAT;
reaching 100 causes 8 damage to Ash and vents the mechanism back to 65.

GADGET has two charges per battle. It deals a heavy hit and turns a salvaged
mechanism into a weapon. The player can spend both charges quickly or use TUNE
to make an opening for a stronger shot.

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
