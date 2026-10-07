export type EnemyId = 'scrap-hound' | 'factory-core';

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
  }
};
