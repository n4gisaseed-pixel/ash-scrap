import type { EnemyId } from './enemies';

export type RegionId = 'whitewood' | 'dry-lake' | 'storm-route' | 'furnace-city' | 'demon-castle';

export interface RegionData {
  id: RegionId;
  name: string;
  chapter: string;
  subtitle: string;
  core: string;
  background: string;
  guardian: EnemyId;
  material: string;
  trace: string;
  salvage: string;
}

export const REGIONS: RegionData[] = [
  {
    id: 'whitewood', name: '白い森', chapter: 'CHAPTER 1', subtitle: '砕けた枝にも、春の記憶が残っている',
    core: 'GREEN CORE', background: 'whitewood', guardian: 'green-guardian', material: 'Seed Glass',
    trace: '枝の内部で、根のような導線が脈打っている。', salvage: '結晶化した枝を削り、種の殻を回収した。'
  },
  {
    id: 'dry-lake', name: '水底街', chapter: 'CHAPTER 2', subtitle: '湖が消えても、帰りを待つ家は残る',
    core: 'WATER CORE', background: 'dry-lake', guardian: 'water-sentinel', material: 'Pump Ceramic',
    trace: '水門の裏に、住人が刻んだ水位の記録が続いている。', salvage: 'ポンプの陶器弁は割れているが、芯は再利用できそうだ。'
  },
  {
    id: 'storm-route', name: '雲上線', chapter: 'CHAPTER 3', subtitle: '帰れない空にも、線路は続いている',
    core: 'WIND CORE', background: 'storm-route', guardian: 'wind-golem', material: 'Aero Foil',
    trace: '風が吹く直前、レールが低く三度鳴る。', salvage: '飛行艇の翼布から、まだ張りのある導電糸を抜き取った。'
  },
  {
    id: 'furnace-city', name: '炉都', chapter: 'CHAPTER 4', subtitle: '熱を分けるたび、街の形が変わっていく',
    core: 'FIRE CORE', background: 'furnace-city', guardian: 'fire-warden', material: 'Heat Shunt',
    trace: '炉の脈動は一定ではない。誰かが負荷を街へ分けている。', salvage: '余熱を逃がす古い分流弁を見つけた。'
  },
  {
    id: 'demon-castle', name: '旧魔王城', chapter: 'CHAPTER 5', subtitle: '終わったはずの物語に、最後のページを足す',
    core: 'CROWN CORE', background: 'demon-core', guardian: 'crown-sentinel', material: 'Archive Key',
    trace: '城の記録は、魔王と勇者のどちらも責めていない。', salvage: '封印具の欠片を記録庫の鍵へ組み直した。'
  }
];

export function getRegion(id: RegionId | null | undefined) {
  return REGIONS.find((region) => region.id === id) ?? REGIONS[0];
}
