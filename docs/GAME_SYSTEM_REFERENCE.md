# Reference research and adaptation

## What the reference game does

Research sources:
- [GAME Watch review: pacing, city actions, party and combat](https://game.watch.impress.co.jp/docs/review/379672.html)
- [GAME Watch: scenario, equipment, training and events](https://game.watch.impress.co.jp/docs/news/366992.html)
- [GAME Watch: battle order and ally behavior](https://game.watch.impress.co.jp/docs/news/368339.html)
- [4Gamer screenshot gallery](https://www.4gamer.net/games/114/G011441/20100621031/screenshot.html)

The parts that best serve this project are:

1. **A chosen action resolves quickly.** The player selects a field, dungeon,
   city activity, item or piece of equipment; routine walking and repeated
   low-value fights are abstracted away.
2. **Time makes choices meaningful.** Exploration, dungeon visits and city
   activities advance the in-game calendar. Status checks, purchases and other
   management tasks are free. Scenarios have a finite period.
3. **Risk and reward are visible before leaving.** Safe field exploration is a
   way to gain modest experience and find materials. Dungeons pay more, but can
   fail or trigger a boss. Recommended level and expected gains help the player
   decide.
4. **Events are part of growth.** Short city and travel events can change stats,
   skills, items, relationships or the story. The result is presented directly
   after the choice.
5. **The player directs the protagonist, not every party member.** Companions
   make their own combat decisions. A battle detail view shows the action order
   and known ally actions; enemy order can be visible while its exact move stays
   unknown until the player learns to analyze it.
6. **Growth is tangible.** Experience, level-ups, stat allocation, skills,
   spells and equipment make the outcome of each expedition matter.
7. **The screen is legible and purpose-built.** The game uses a clear date and
   status header, a scene with visible characters, a message/result area and a
   small set of commands. The screen gallery shows character sprites integrated
   into the environment and dialogue rather than relying only on abstract
   menu panels.

The screen and pacing notes above were checked against the [GAME Watch review](https://game.watch.impress.co.jp/docs/review/379672.html),
the [battle coverage](https://game.watch.impress.co.jp/docs/news/368339.html),
and the [4Gamer screenshot gallery](https://www.4gamer.net/games/114/G011441/20100621031/screenshot.html).
The adaptation uses the reference's visible scene, speaker, message and command
hierarchy while keeping the game's own characters, story and portrait layout.

## ASH / SCRAP adaptation

This is a design reference, not an asset or story template. ASH / SCRAP keeps
its post-apocalyptic setting, repair theme, portraits and touch-first 540×960
portrait canvas.

### Campaign actions

- A chapter is a short scenario period, planned at about 12 in-game weeks.
- A meaningful outing or work action advances one week: safe salvage, risky
  scouting, a dungeon attempt, a major event, training, crafting or rest.
- Checking status, reading the map, inspecting inventory and reviewing known
  information do not advance time.
- Main-route actions should take about 8–9 weeks so a player can choose a few
  optional training or salvage actions. Missing the suggested deadline changes
  regional conditions and raises risk; it never creates an unrecoverable save.
- Ordinary travel and routine encounters resolve as short event results. A
  named guardian or major story confrontation enters a full tactical battle.
- The playable campaign targets about one hour. Each Core chapter offers six
  field actions; the third action starts a story beat and the sixth starts its
  guardian scene automatically. The player chooses preparation, not whether
  the story advances.

### Expedition choices

Before a choice, show the destination and its known:

- suggested party level / danger rating
- week cost
- likely materials and experience
- any discovered event or boss condition

The player should understand why they might choose a quiet salvage trip over a
risky ruin run. Rewards are displayed in a compact result card immediately after
the action.

### Character growth and party

- Ash receives experience and a small number of stat points at level-up. Core
  stats should affect scrap combat: **Force** for attacks, **Grit** for HP and
  pressure tolerance, and **Ingenuity** for gadgets, analysis and repair.
- Equipment and skills come from crafting, discoveries and people met in each
  region. A salvage component should have at least one practical use.
- The player chooses Ash's action. Azami and any future party members follow
  readable personal tendencies and can act without direct orders.
- The party target is Ash plus up to two companions. Azami is the first fixed
  companion; later support characters should come from the communities whose
  problems the pair solve.

### Battle presentation

- Display the enemy illustration, enemy HP, party HP and HEAT without covering
  the characters' faces.
- Reserve one compact horizontal **action order** strip above the dialogue area.
  It lists the next actors and reveals companion intentions. Enemy moves remain
  uncertain until Ash uses an analysis skill or learns their pattern.
- The player chooses only Ash's action. Companion behavior is explained in the
  order strip and visible in the result log.
- Resolve one actor at a time with a brief motion and a clear damage/heal result.
  Avoid long animations that delay the next meaningful choice.
- Named boss fights are tactical set-pieces; routine enemies resolve in the
  expedition result screen so the chapter keeps moving.

### Portrait-oriented screen layout

Adapt the reference's compact screen hierarchy, not its Wii aspect ratio or
specific art:

1. **Top 72 px:** title/location, in-game week, Ash HP/level, scrap and route
   status.
2. **Scene stage, about 330 px:** one generated background and one or two
   character standees/portraits. Keep the active speaker readable and do not
   put text over eyes or faces.
3. **Message/result card, about 150 px:** speaker name, portrait, 2–4 short
   lines; results list XP, scrap and materials with icons.
4. **Command area, about 330 px:** two to four large touch choices. Each action
   states its cost and risk. Keep the whole screen fixed and non-scrolling.

For battle, compress the scene stage and reserve space for the action-order
strip and four main commands. Portraits are a recurring storytelling device:
show the current speaker in dialogue, the whole party in camp/settlement views,
and small head icons in the battle order.

## Current implementation gap

The playable campaign now continues from the Prologue into all five Cores and
the finale. Its regional actions trade time for Insight, materials, weapon
strength or HP. Salvage and battle grant experience, Ash levels automatically
raise Force and HP, and regional material can tune PILE-01. Existing saves
receive defaults for campaign state.

Still open: stat allocation, richer event reward rows, alternate companions
and a structured battle order queue. Battle uses a concise inline order
forecast and Azami's automatic support behavior.

The current screen pass uses reference-matched bust-up expressions and puts two
speakers on opposite sides of story dialogue. Cinematic illustrations hide
portraits to keep the composition clear. Regional backdrops, guardian artwork,
crossfades, brief flashes, a speaker nameplate, Japanese-safe wrapping and
typewriter text support the campaign pacing.
