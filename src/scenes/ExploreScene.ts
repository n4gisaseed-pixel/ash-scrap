import Phaser from 'phaser';
import { GameState } from '../state/GameState';
import { addCommandButton } from '../ui/CommandButton';
import { addDialogueBox } from '../ui/DialogueBox';
import { addArtPanel, addArtShade } from '../ui/ArtPanel';

type Location = 'Scrapyard' | 'Town' | 'Factory';

const PARTS = [
  { id: 'Rusted Gear', name: '歯の欠けた歯車', line: '泥を拭うと、山の刻印が見えた。まだ噛み合わせを直せる。' },
  { id: 'Copper Wire', name: '焼けた銅線', line: '焦げた被覆の下で、芯線だけが鈍く光っている。' },
  { id: 'Pressure Cylinder', name: '圧力筒', line: '旧式の筒。パッキンを替えれば圧力を保てそうだ。' }
];

export class ExploreScene extends Phaser.Scene {
  private location: Location = 'Scrapyard';
  private dialogue!: ReturnType<typeof addDialogueBox>;
  private result: string | null = null;
  private resultSpeaker: 'ash' | 'mina' | 'azami' = 'ash';

  constructor() { super('Explore'); }

  init(data: { location?: Location; result?: string; resultSpeaker?: 'ash' | 'mina' | 'azami' }) {
    this.location = data.location ?? 'Scrapyard';
    this.result = data.result ?? null;
    this.resultSpeaker = data.resultSpeaker ?? 'ash';
  }

  create() {
    if (this.location === 'Town' && !GameState.data.chapter0.townVisited) {
      GameState.data.chapter0.townVisited = true;
      GameState.data.week += 1;
      GameState.save();
    }
    this.drawFrame();
    this.dialogue = addDialogueBox(this, 558, 140, { x: 395, bottom: 420, height: 306, width: 274 });
    if (this.location === 'Scrapyard') this.createScrapyard();
    else if (this.location === 'Town') this.createTown();
    else this.createFactory();
    // Result text replaces the narration, never the choices. Keeping these
    // separate prevents the old result branch from leaving an empty screen.
    if (this.result) this.dialogue.set(this.result, this.resultSpeaker, 'result', true);
  }

  private drawFrame() {
    const meta: Record<Location, { title: string; sub: string; frame: number; label: string }> = {
      Scrapyard: { title: '廃材置き場', sub: 'SALVAGE SITE / 旧軍施設の外縁', frame: 1, label: 'まだ使えるものを探す' },
      Town: { title: '鉄屑街', sub: 'SETTLEMENT / 熱と修理で暮らす町', frame: 2, label: '壊れた設備も、暮らしの一部' },
      Factory: { title: '旧工場', sub: 'INDUSTRIAL RUIN / 補助炉の区画', frame: 3, label: '止める前に、仕組みを読む' }
    };
    const m = meta[this.location];
    this.cameras.main.setBackgroundColor('#111315');
    this.add.rectangle(270, 480, 516, 948, 0x17191b).setStrokeStyle(2, 0x59636a);
    this.add.text(28, 22, m.title, { fontFamily: '"Noto Sans JP", sans-serif', fontSize: '26px', color: '#f3e9dc', fontStyle: 'bold' });
    this.add.text(30, 58, m.sub, { fontFamily: 'monospace', fontSize: '12px', color: '#b5c2c5' });
    const week = GameState.data.week <= 12 ? `WEEK ${GameState.data.week}/12` : `+${GameState.data.week - 12} WEEK`;
    this.add.text(510, 60, week, { fontFamily: 'monospace', fontSize: '13px', color: '#edc990' }).setOrigin(1, 0);
    this.add.text(30, 81, `ASH Lv.${GameState.data.level}     HP ${GameState.data.hp}/${GameState.data.maxHp}     SCRAP ${GameState.data.scrap}`, { fontFamily: 'monospace', fontSize: '12px', color: '#d4dddd' });
    this.add.rectangle(270, 104, 480, 1, 0x5f6a71);
    addArtPanel(this, m.frame as 1 | 2 | 3, 270, 267, 480, 310, .5, this.location === 'Factory' ? .36 : .5);
    addArtShade(this, 270, 267, 480, 310, .28);
    this.add.rectangle(270, 267, 480, 310, 0xffffff, 0).setStrokeStyle(1, 0x82919a);
    this.add.rectangle(270, 396, 456, 42, 0x111416, .82);
    this.add.text(46, 385, m.label, { fontFamily: '"Noto Sans JP", sans-serif', fontSize: '16px', color: '#f4eee5' });
  }

  private createScrapyard() {
    const progress = GameState.data.chapter0;
    const salvaged = progress.scrapyardSalvage;
    const nextPart = PARTS.find((part) => !salvaged.includes(part.id));
    if (nextPart) {
      this.dialogue.set(this.result ?? (salvaged.length === 0
        ? '地面に、まだ油の匂いが残っている。\n「捨て場じゃない。部品置き場だ。」'
        : `回収記録 ${salvaged.length}/3。アザミの地図には、道のない線が続く。`), salvaged.length ? 'azami' : 'ash', 'dialogue', true);
      this.choice(693, '周辺をサルベージ', '1週 / 推奨Lv.1 / 低危険 / 部品・EXP', () => this.salvage());
      this.choice(788, salvaged.length === 3 ? '瓦礫の奥を調べる' : '崩落区画を調べる', salvaged.length === 3 ? '1週 / アザミの救出と巡回機戦' : '部品を3種集めると道が開く', () => this.rescue(), salvaged.length === 3);
      this.choice(883, '工房へ戻る', '無料 / 装備と地図を確認', () => this.scene.start('Hub'));
      return;
    }
    if (!progress.azamiRecruited) {
      this.dialogue.set(this.result ?? '崩れた機械の下から、青い角の少女が声を上げる。\n「弁を回して！ 右じゃなくて左！」', 'azami', 'dialogue', true);
      this.choice(693, '救出して一緒に進む', '1週 / アザミが同行する', () => this.rescue());
      this.choice(788, '周辺をサルベージ', '1週 / SCRAP + EXP', () => this.salvageExtras());
      this.choice(883, '工房へ戻る', '無料 / 装備を整える', () => this.scene.start('Hub'));
      return;
    }
    if (!progress.houndDefeated) {
      this.dialogue.set(this.result ?? '救出した少女は、壊れた地図を丁寧にたたむ。\n「あたしはアザミ。機械の音が、下から聞こえる。」', 'azami', 'dialogue', true);
      this.choice(693, '旧巡回機を止める', '1週 / 推奨Lv.2 / 中危険 / モーター', () => this.scene.start('Battle', { enemyId: 'scrap-hound' }));
      this.choice(788, '部品を探す', '1週 / 安全 / SCRAP + EXP', () => this.salvageExtras());
      this.choice(883, '工房へ戻る', '無料 / PILE-01を組み立てる', () => this.scene.start('Hub'));
      return;
    }
    this.dialogue.set(this.result ?? '巡回機の命令は「侵入者を排除」。\n「命令だけ残って、使い道が消えたのか。」', 'ash', 'dialogue', true);
    this.choice(693, '深部をサルベージ', '1週 / 安全 / SCRAP + EXP', () => this.salvageExtras());
    this.choice(788, '鉄屑街へ向かう', '初回1週 / 炉の相談と地図の更新', () => this.goTown());
    this.choice(883, '工房へ戻る', '無料 / 装備と地図を確認', () => this.scene.start('Hub'));
  }

  private salvage() {
    const part = PARTS.find((entry) => !GameState.data.chapter0.scrapyardSalvage.includes(entry.id));
    if (!part) return;
    GameState.add(part.id);
    GameState.data.chapter0.scrapyardSalvage.push(part.id);
    GameState.data.scrap += 3;
    GameState.data.week += 1;
    const levels = GameState.gainExp(12);
    const clue = GameState.data.chapter0.scrapyardSalvage.length === 1
      ? '瓦礫の向こうで、金属を三度叩く音がした。風の音とは間が違う。'
      : GameState.data.chapter0.scrapyardSalvage.length === 2
        ? '錆びた梁に青い布が結ばれていた。布の先には、崩落区画へ続く足跡がある。'
        : '圧力筒の刻印は、崩落区画の古い保守機と同じ規格だ。弁を動かせるかもしれない。';
    this.result = `${part.name} +1   /   SCRAP +3   /   EXP +12${levels.length ? `\nASH Lv.${levels[levels.length - 1]} に上がった。HP上限 +8` : ''}\n${part.line}\n${clue}`;
    if (GameState.data.chapter0.scrapyardSalvage.length === 3 && !GameState.data.chapter0.azamiRecruited) {
      this.scene.start('Story', { sequence: 'azami-rescue' });
      return;
    }
    this.scene.restart({ location: 'Scrapyard', result: this.result, resultSpeaker: 'ash' });
  }

  private rescue() {
    if (!GameState.data.chapter0.azamiRecruited) {
      this.scene.start('Story', { sequence: 'azami-rescue' });
    } else {
      this.scene.start('Battle', { enemyId: 'scrap-hound' });
    }
  }

  private salvageExtras() {
    GameState.data.scrap += 5;
    GameState.data.week += 1;
    const levels = GameState.gainExp(8);
    this.result = `使えるボルトと銅片を回収。SCRAP +5 / EXP +8${levels.length ? `\nASH Lv.${levels[levels.length - 1]}。HP上限 +8` : ''}\nアザミは地図に、崩れていた通路を描き足した。`;
    this.scene.restart({ location: 'Scrapyard', result: this.result, resultSpeaker: 'azami' });
  }

  private createTown() {
    this.dialogue.set(this.result ?? (GameState.data.chapter0.factoryBossDefeated
      ? '補助炉の熱が、共同炊事場まで戻ってきた。\n「直したのは炉だけじゃない。みんなの明日だよ。」'
      : '鉄屑街の住人は、古い熱管の周りで暮らしている。\n「工場の炉を壊さずに止められる？」'), 'mina', 'dialogue', true);
    this.choice(693, 'ミナと炉の記録を読む', '無料 / 工場の調査手順がわかる', () => this.dialogue.set('「昔の炉は町の熱源でもあった。壊したら、冬を越せない。」', 'mina', 'dialogue', true));
    this.choice(788, '旧工場へ向かう', GameState.data.crafted.includes('PILE-01') ? '調査1週 / PILE-01を推奨' : '先に工房でPILE-01を組み立てる', () => this.scene.start('Explore', { location: 'Factory' }), GameState.data.crafted.includes('PILE-01'));
    this.choice(883, '工房へ戻る', '無料 / 装備を整える', () => this.scene.start('Hub'));
  }

  private createFactory() {
    const progress = GameState.data.chapter0;
    if (progress.factoryBossDefeated) {
      this.dialogue.set(this.result ?? '補助炉の脈動が、乾いた貯水槽まで届いた。水が一滴、石に落ちる。\n「地図にも知らない線が出た。白い森へ行こう。」', 'azami', 'dialogue', true);
      this.choice(693, '町へ戻り、記録を確かめる', '炉の熱と地図に起きた変化を見る', () => this.scene.start('Story', { sequence: 'relay-return' }));
      this.choice(788, '鉄屑街に戻る', '無料 / 町の変化を見る', () => this.scene.start('Explore', { location: 'Town' }));
      this.choice(883, '工房へ戻る', '無料 / 旅の支度を整える', () => this.scene.start('Hub'));
      return;
    }
    this.dialogue.set(this.result ?? (progress.factoryInspected
      ? '圧力を逃がす道は作った。奥の守衛機が、炉心を守るために動き出す。'
      : '工場の炉は、誰もいないのに動いている。\n蒸気圧は危険域。正面から止めれば町の熱源も失われる。'), 'ash', 'dialogue', true);
    this.choice(693, progress.factoryInspected ? '調査記録を確認' : '排気弁と熱管を調べる', progress.factoryInspected ? '調査済 / 守衛機へ進める' : '1週 / 推奨Lv.2 / 低危険 / 停止方法を探す', () => {
      if (!progress.factoryInspected) {
        progress.factoryInspected = true; GameState.data.week += 1; GameState.save();
        this.result = '排気弁は閉じるためのものじゃない。圧力を逃がすためのものだ。\n「仕組みが分かれば、壊さずに済む。」';
        this.scene.restart({ location: 'Factory', result: this.result, resultSpeaker: 'ash' });
      }
    }, !progress.factoryInspected);
    this.choice(788, progress.factoryBossDefeated ? '補助炉の記録を見る' : '炉の守衛機と対決', '1週 / 推奨Lv.3 / 高危険 / 勝利で炉を修理', () => this.scene.start('Battle', { enemyId: 'factory-core' }), progress.factoryInspected && !progress.factoryBossDefeated);
    this.choice(883, '鉄屑街に戻る', '無料 / 回復と装備を整える', () => this.scene.start('Explore', { location: 'Town' }));
  }

  private choice(y: number, title: string, subtitle: string, action: () => void, enabled = true) {
    addCommandButton(this, { x: 270, y, title, subtitle, onPress: action, enabled, height: 76, width: 468 });
  }

  private goTown() {
    if (!GameState.data.chapter0.townVisited) {
      this.scene.start('Story', { sequence: 'town-arrival' });
      return;
    }
    this.scene.start('Explore', { location: 'Town' });
  }
}
