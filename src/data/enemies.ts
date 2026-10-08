import type { RegionId } from './regions';

export type EnemyId = 'scrap-hound' | 'factory-core' | 'green-guardian' | 'water-sentinel' | 'wind-golem' | 'fire-warden' | 'crown-sentinel' | 'new-hero';

export interface EnemyData {
  id: EnemyId;
  name: string;
  hp: number;
  attackMin: number;
  attackMax: number;
  opening: string;
  victory: string;
  rewardScrap: number;
  rewardItem: string;
  region?: RegionId;
  portrait?: string;
}

export const ENEMIES: Record<EnemyId, EnemyData> = {
  'scrap-hound': {
    id: 'scrap-hound',
    name: 'SCRAP HOUND',
    hp: 80,
    attackMin: 8,
    attackMax: 14,
    opening: 'スクラップハウンドが、廃材の陰から飛び出した。',
    victory: 'ハウンドの脚部は、まだ動力を残している。',
    rewardScrap: 12,
    rewardItem: 'Small Motor'
  },
  'factory-core': {
    id: 'factory-core',
    name: 'FURNACE WARDEN',
    hp: 150,
    attackMin: 12,
    attackMax: 18,
    opening: '工場の炉心が再起動した。排熱を逃がす隙を探せ。',
    victory: '炉心は沈黙した。壊す以外の止め方が、ここには残っていた。',
    rewardScrap: 30,
    rewardItem: 'Ignition Unit'
  },
  'green-guardian': {
    id: 'green-guardian', name: 'ROOTWARDEN', hp: 150, attackMin: 10, attackMax: 15,
    opening: '結晶の枝が揺れる。森を守る命令が、まだ消えていない。',
    victory: '守護獣は崩れず、枝を静かに地面へ横たえた。', rewardScrap: 20, rewardItem: 'Seed Glass', region: 'whitewood', portrait: 'green-guardian'
  },
  'water-sentinel': {
    id: 'water-sentinel', name: 'CISTERN SENTINEL', hp: 175, attackMin: 11, attackMax: 17,
    opening: '水門が閉じる。街を渇きから守るため、すべての水を止める。',
    victory: '最後の弁が開き、空の街に水音が帰ってくる。', rewardScrap: 24, rewardItem: 'Pump Ceramic', region: 'dry-lake', portrait: 'water-sentinel'
  },
  'wind-golem': {
    id: 'wind-golem', name: 'GALE FRAME', hp: 190, attackMin: 12, attackMax: 18,
    opening: '嵐を束ねた古い飛行枠が、橋の上に立ちふさがる。',
    victory: '風向きが変わった。落ちた翼布が、二人の地図を押さえる。', rewardScrap: 28, rewardItem: 'Aero Foil', region: 'storm-route', portrait: 'wind-golem'
  },
  'fire-warden': {
    id: 'fire-warden', name: 'CINDER WARDEN', hp: 210, attackMin: 13, attackMax: 19,
    opening: '炉都の熱を独占する制御機が、火花を散らして立ち上がる。',
    victory: '二つの熱管へ圧力が分かれた。争っていた人々が、同じ火を見つめる。', rewardScrap: 32, rewardItem: 'Heat Shunt', region: 'furnace-city', portrait: 'fire-warden'
  },
  'crown-sentinel': {
    id: 'crown-sentinel', name: 'ARCHIVE WARDEN', hp: 235, attackMin: 14, attackMax: 20,
    opening: '王座の奥で記録庫が開く。装置はアザミを「次の魔王」と呼んだ。',
    victory: '記録は破れずに残った。アザミは自分の名前を、その隣へ書き足す。', rewardScrap: 40, rewardItem: 'Archive Key', region: 'demon-castle', portrait: 'crown-sentinel'
  },
  'new-hero': {
    id: 'new-hero', name: 'THE NEW HERO', hp: 250, attackMin: 15, attackMax: 22,
    opening: '新しい勇者一行が城門を越える。剣の先は、魔王と呼ばれた少女へ向いている。',
    victory: '勇者は剣を下ろした。地図と記録を、自分の目で読み直すために。', rewardScrap: 0, rewardItem: 'Truce', portrait: 'young-hero'
  }
};
