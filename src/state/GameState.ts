export type Inventory = Record<string, number>;

const SAVE_KEY = 'ash-scrap-save-v2';

export interface SaveData {
  inventory: Inventory;
  crafted: string[];
  hp: number;
  maxHp: number;
  scrap: number;
  day: number;
}

const initial: SaveData = {
  inventory: {},
  crafted: [],
  hp: 100,
  maxHp: 100,
  scrap: 0,
  day: 1
};

export class GameState {
  static data: SaveData = structuredClone(initial);

  static load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      this.data = raw ? { ...structuredClone(initial), ...JSON.parse(raw) } : structuredClone(initial);
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
}
