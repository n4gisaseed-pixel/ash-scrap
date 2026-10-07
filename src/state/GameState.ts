export type Inventory = Record<string, number>;

const SAVE_KEY = 'ash-scrap-save-v2';
export const PROLOGUE_WEEK_LIMIT = 12;

export interface ChapterProgress {
  openingSeen: boolean;
  scrapyardRouteSeen: boolean;
  scrapyardSalvage: string[];
  azamiRecruited: boolean;
  houndDefeated: boolean;
  townVisited: boolean;
  factoryInspected: boolean;
  factoryBossDefeated: boolean;
  endingSeen: boolean;
}

export interface SaveData {
  inventory: Inventory;
  crafted: string[];
  hp: number;
  maxHp: number;
  scrap: number;
  week: number;
  level: number;
  exp: number;
  nextExp: number;
  force: number;
  grit: number;
  ingenuity: number;
  chapter0: ChapterProgress;
}

const initial: SaveData = {
  inventory: {},
  crafted: [],
  hp: 100,
  maxHp: 100,
  scrap: 0,
  week: 1,
  level: 1,
  exp: 0,
  nextExp: 30,
  force: 0,
  grit: 0,
  ingenuity: 0,
  chapter0: {
    openingSeen: false,
    scrapyardRouteSeen: false,
    scrapyardSalvage: [],
    azamiRecruited: false,
    houndDefeated: false,
    townVisited: false,
    factoryInspected: false,
    factoryBossDefeated: false,
    endingSeen: false
  }
};

export class GameState {
  static data: SaveData = structuredClone(initial);

  static load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) {
        this.data = structuredClone(initial);
        return;
      }
      const saved = JSON.parse(raw) as Partial<SaveData> & {
        day?: number;
        chapter0?: Partial<ChapterProgress> & { lukaRecruited?: boolean };
      };
      const oldChapter: Partial<ChapterProgress> & { lukaRecruited?: boolean } = saved.chapter0 ?? {};
      const { lukaRecruited, ...chapterFlags } = oldChapter;
      const { day: oldDay, chapter0: _oldChapter, ...savedFields } = saved;
      this.data = {
        ...structuredClone(initial),
        ...savedFields,
        week: saved.week ?? oldDay ?? initial.week,
        level: saved.level ?? initial.level,
        exp: saved.exp ?? initial.exp,
        nextExp: saved.nextExp ?? initial.nextExp,
        force: saved.force ?? initial.force,
        grit: saved.grit ?? initial.grit,
        ingenuity: saved.ingenuity ?? initial.ingenuity,
        chapter0: {
          ...initial.chapter0,
          ...chapterFlags,
          azamiRecruited: chapterFlags.azamiRecruited ?? lukaRecruited ?? false
        }
      };
    } catch {
      this.data = structuredClone(initial);
    }
  }

  static save() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
  }

  static reset() {
    this.data = structuredClone(initial);
    this.save();
  }

  static add(item: string, amount = 1) {
    this.data.inventory[item] = (this.data.inventory[item] ?? 0) + amount;
    this.save();
  }

  static has(item: string, amount = 1) {
    return (this.data.inventory[item] ?? 0) >= amount;
  }

  static gainExp(amount: number) {
    this.data.exp += amount;
    const levels: number[] = [];
    while (this.data.exp >= this.data.nextExp) {
      this.data.exp -= this.data.nextExp;
      this.data.level += 1;
      this.data.nextExp = Math.floor(this.data.nextExp * 1.35);
      this.data.maxHp += 8;
      this.data.hp = Math.min(this.data.maxHp, this.data.hp + 18);
      this.data.force += 1;
      levels.push(this.data.level);
    }
    this.save();
    return levels;
  }

  static consume(cost: Inventory) {
    for (const [item, amount] of Object.entries(cost)) {
      if (!this.has(item, amount)) return false;
    }
    for (const [item, amount] of Object.entries(cost)) {
      this.data.inventory[item] -= amount;
    }
    this.save();
    return true;
  }

}
