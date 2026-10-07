import Phaser from 'phaser';
import { GameState, PROLOGUE_WEEK_LIMIT } from '../state/GameState';
import { addCommandButton } from '../ui/CommandButton';
import { addDialogueBox } from '../ui/DialogueBox';

export class HubScene extends Phaser.Scene {
  private dialogue!: ReturnType<typeof addDialogueBox>;
  private result: string | null = null;

  constructor() { super('Hub'); }

  init(data: { result?: string }) {
    this.result = data.result ?? null;
  }

  create() {
    this.cameras.main.setBackgroundColor('#101113');
    this.add.rectangle(270, 480, 516, 948, 0x151619).setStrokeStyle(2, 0x58606a);
    this.add.text(28, 24, 'アザミの地図', { fontFamily: '"Noto Sans JP", sans-serif', fontSize: '25px', color: '#f0e8dd', fontStyle: 'bold' });
    this.add.text(30, 60, 'ROUTE NOTES   /   AFTER THE CLEAR', { fontFamily: 'monospace', fontSize: '11px', color: '#91a5b3' });
    const week = GameState.data.week <= PROLOGUE_WEEK_LIMIT ? `第 ${GameState.data.week} 週 / 12` : `期限後 +${GameState.data.week - PROLOGUE_WEEK_LIMIT} 週`;
    this.add.text(510, 35, week, { fontFamily: '"Noto Sans JP", sans-serif', fontSize: '16px', color: GameState.data.week > PROLOGUE_WEEK_LIMIT ? '#e18a71' : '#b7d2dd' }).setOrigin(1, 0);
    this.add.text(30, 82, `Lv.${GameState.data.level}    HP ${GameState.data.hp}/${GameState.data.maxHp}    FORCE ${GameState.data.force}    SCRAP ${GameState.data.scrap}`, { fontFamily: 'monospace', fontSize: '12px', color: '#dce5e4' });
    this.add.rectangle(270, 101, 480, 1, 0x67727b);

    this.add.image(270, 270, 'azami-map').setDisplaySize(480, 330);
    this.add.rectangle(270, 270, 480, 330, 0xffffff, 0).setStrokeStyle(1, 0x8797a1, 0.85);
    this.mapMarker(228, 339, '鉄屑街', 0x3e91a2, true);
    if (GameState.data.chapter0.factoryInspected || GameState.data.chapter0.factoryBossDefeated) {
      this.mapMarker(425, 344, '旧工場', 0xc26d47, GameState.data.chapter0.factoryBossDefeated);
    }
    if (GameState.data.chapter0.endingSeen) this.mapMarker(420, 158, '白い森', 0x619c85, false);
    const routeName = GameState.data.chapter0.endingSeen ? '白い森 / GREEN CORE' : '鉄屑街 / 旧工場';
    this.add.text(30, 447, '次の目的地', { fontFamily: '"Noto Sans JP", sans-serif', fontSize: '14px', color: '#b5cad0' });
    this.add.text(30, 471, routeName, { fontFamily: '"Noto Sans JP", sans-serif', fontSize: '21px', color: '#f0e7da', fontStyle: 'bold' });
    this.add.text(510, 480, GameState.data.chapter0.endingSeen ? 'MAP UPDATED' : `${this.progressCount()} / 3 部品`, { fontFamily: 'monospace', fontSize: '13px', color: '#edc990' }).setOrigin(1, 0);

    this.dialogue = addDialogueBox(this, 552, 112, { x: 407, bottom: 435, height: 325 });
    const line = this.hubLine();
    this.dialogue.set(this.result ?? line.text, this.result ? 'ash' : line.speaker, this.result ? 'result' : 'dialogue');

    const crafted = GameState.data.crafted.includes('PILE-01');
    addCommandButton(this, { x: 152, y: 660, width: 224, height: 56, title: crafted ? 'PILE-01 点検' : '工房で作る', subtitle: crafted ? '武器の状態を確認' : '1週 / 3種の部品', onPress: () => this.craft() });
    const needsRest = GameState.data.hp < GameState.data.maxHp;
    addCommandButton(this, { x: 388, y: 660, width: 224, height: 56, title: '休息・回復', subtitle: needsRest ? '1週 / HP全快' : 'HPは最大 / 回復不要', onPress: () => this.rest(), enabled: needsRest });
    this.command(740, '廃材置き場へ', `1週 / 安全 / 素材とEXP / ${this.progressCount()}/3`, () => this.scene.start('Explore', { location: 'Scrapyard' }));
    this.command(820, '鉄屑街へ', GameState.data.chapter0.houndDefeated ? (GameState.data.chapter0.townVisited ? '無料 / 町の人と古い記録' : '初回1週 / 町の人と古い記録') : '巡回機を止めるとルートが開く', () => this.scene.start('Explore', { location: 'Town' }), GameState.data.chapter0.houndDefeated);
    this.command(900, GameState.data.chapter0.factoryBossDefeated ? '補助炉の記録を見る' : '旧工場へ', !GameState.data.chapter0.townVisited ? '鉄屑街で炉の記録を聞く' : !crafted ? 'PILE-01推奨 / 工房で組み立て' : '調査1週 / 守衛機戦1週・高危険', () => this.scene.start('Explore', { location: 'Factory' }), GameState.data.chapter0.townVisited && crafted);
    this.add.text(510, 939, GameState.data.chapter0.azamiRecruited ? 'ASH + AZAMI' : 'ASH SOLO', { fontFamily: 'monospace', fontSize: '10px', color: '#91b6c4' }).setOrigin(1, 0);
  }

  private command(y: number, title: string, subtitle: string, action: () => void, enabled = true) {
    addCommandButton(this, { x: 270, y, title, subtitle, onPress: action, enabled, height: 68, width: 468 });
  }

  private mapMarker(x: number, y: number, label: string, color: number, reached: boolean) {
    this.add.circle(x, y, 13, 0x182027, .88).setStrokeStyle(3, color, .95);
    this.add.circle(x, y, reached ? 5 : 3, color, .95);
    const tag = this.add.text(x + 16, y - 10, label, {
      fontFamily: '"Noto Sans JP", sans-serif', fontSize: '12px', color: reached ? '#edf3ef' : '#49616a',
      backgroundColor: reached ? '#202a2c' : '#e3e4d9', padding: { x: 5, y: 3 }
    });
    tag.setDepth(3);
  }

  private craft() {
    if (GameState.data.crafted.includes('PILE-01')) {
      this.dialogue.set(`PILE-01 / 点検済み\nASH: 「拾ったものを組み合わせりゃ、次の誰かを守れる。」`, 'ash');
      return;
    }
    if (GameState.consume({ 'Rusted Gear': 1, 'Copper Wire': 1, 'Pressure Cylinder': 1 })) {
      GameState.data.crafted.push('PILE-01');
      GameState.data.week += 1;
      GameState.save();
      this.cameras.main.flash(220, 115, 173, 194);
      this.scene.restart({ result: 'PILE-01を組み立てた。\n拾った三つの部品が、工場へ向かう道具になった。\n次は熱源を壊さない止め方を探そう。' });
    } else {
      this.dialogue.set('必要なもの：歯車、銅線、圧力筒。\nASH: 「足りない分は置き場で探そう。」', 'ash');
    }
  }

  private rest() {
    const healed = GameState.data.maxHp - GameState.data.hp;
    GameState.data.week += 1;
    GameState.data.hp = GameState.data.maxHp;
    GameState.save();
    this.scene.restart({ result: `工房で休息した。HP +${healed} / 全回復。\nアザミは地図を見直し、新しく見つけた道を確かめている。` });
  }

  private progressCount() { return GameState.data.chapter0.scrapyardSalvage.length; }

  private hubLine(): { text: string; speaker: 'ash' | 'azami' | 'mina' } {
    const p = GameState.data.chapter0;
    if (p.endingSeen) return { text: 'アザミは古地図に、新しい道筋を青い糸で描き足した。\n「白い森の奥から、まだ返事があるよ。」', speaker: 'azami' };
    if (p.factoryBossDefeated) return { text: '補助炉の脈動が、乾いた貯水槽まで届いた。\n「水が一滴。地図にも、知らない線が出た！」', speaker: 'azami' };
    if (p.factoryInspected) return { text: '炉を壊さずに止める方法は見つかった。\n圧力を抜いた今なら、守衛機に向き合える。', speaker: 'ash' };
    if (p.townVisited) return { text: 'ミナが工場の古い記録を渡してくれた。\n「止めるだけじゃだめ。町の熱を残してね。」', speaker: 'mina' };
    if (p.azamiRecruited) return { text: 'アザミの地図は、崩れた道を何度も書き直している。\n「ここから先、機械の音が地面に響いてる。」', speaker: 'azami' };
    if (p.houndDefeated) return { text: '古い巡回機の命令は、今も「侵入者を排除」。\n「命令だけ残って、使い道が消えたのか。」', speaker: 'ash' };
    return { text: '魔王が倒されて七年。灰の町では、直すことが暮らしだ。\nミナの依頼は、廃材置き場の部品集め。', speaker: 'ash' };
  }
}
