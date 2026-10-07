export type Inventory = Record<string, number>;

const SAVE_KEY = 'ash-scrap-save-v2';

export interface ChapterProgress {
  scrapyardSalvage: string[];
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
  day: number;
  chapter0: ChapterProgress;
}

const initial: SaveData = {
  inventory: {},
  crafted: [],
  hp: 100,
  maxHp: 100,
  scrap: 0,
  day: 1,
  chapter0: {
    scrapyardSalvage: [],
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
      const saved = JSON.parse(raw) as Partial<SaveData>;
      this.data = {
        ...structuredClone(initial),
        ...saved,
        chapter0: { ...initial.chapter0, ...(saved.chapter0 ?? {}) }
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

  static nextDestination(): 'Scrapyard' | 'Craft' | 'Town' | 'Factory' | 'Return' {
    const progress = this.data.chapter0;
    if (!progress.houndDefeated) return 'Scrapyard';
    if (!this.data.crafted.includes('PILE-01')) return 'Craft';
    if (!progress.townVisited) return 'Town';
    if (!progress.factoryBossDefeated) return 'Factory';
    return 'Return';
  }
}
