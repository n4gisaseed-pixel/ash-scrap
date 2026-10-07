import Phaser from 'phaser';
import { GameState, PROLOGUE_WEEK_LIMIT } from '../state/GameState';
import { addCommandButton } from '../ui/CommandButton';
import { addDialogueBox } from '../ui/DialogueBox';
import { addArtPanel, addArtShade } from '../ui/ArtPanel';

type Location = 'Scrapyard' | 'Town' | 'Factory';

const SCRAP_PARTS = [
  { id: 'Rusted Gear', label: 'Rusted Gear', line: '歯の欠けた歯車。噛み合わせを直せば、まだ回る。' },
  { id: 'Copper Wire', label: 'Copper Wire', line: '銅線を回収。被覆は焼けているが、芯線は生きている。' },
  { id: 'Pressure Cylinder', label: 'Pressure Cylinder', line: '小型シリンダーを拾った。圧力漏れはパッキンで止まりそうだ。' }
];

export class ExploreScene extends Phaser.Scene {
  private location: Location = 'Scrapyard';
  private dialogue!: ReturnType<typeof addDialogueBox>;
  private salvageNotice: string | null = null;

  constructor() { super('Explore'); }

  init(data: { location?: Location }) {
    this.location = data.location ?? 'Scrapyard';
  }

  create() {
    this.drawShell();
    this.dialogue = addDialogueBox(this, 510, 132);
    if (this.location === 'Scrapyard') this.createScrapyard();
    else if (this.location === 'Town') this.createTown();
    else this.createFactory();
  }

  private drawShell() {
    const titles: Record<Location, [string, string]> = {
      Scrapyard: ['SCRAPYARD 01', 'SALVAGE SITE / OUTER RING'],
      Town: ['IRON-SCRAP TOWN', 'SETTLEMENT / REUSE DISTRICT'],
      Factory: ['ABANDONED FACTORY', 'INDUSTRIAL ZONE / SEALED FURNACE']
    };
    this.cameras.main.setBackgroundColor('#0e0c0a');
    this.add.rectangle(270, 480, 510, 930, 0x181613).setStrokeStyle(4, 0x4f4437);
    this.add.text(30, 28, titles[this.location][0], {
      fontFamily: 'monospace', fontSize: this.location === 'Town' ? '24px' : '27px', color: '#e8d7be', fontStyle: 'bold'
    });
    this.add.text(30, 65, titles[this.location][1], { fontFamily: 'monospace', fontSize: '15px', color: '#b09a82' });
    const weekLabel = GameState.data.week <= PROLOGUE_WEEK_LIMIT
      ? `WEEK ${GameState.data.week}/${PROLOGUE_WEEK_LIMIT}`
      : `LATE +${GameState.data.week - PROLOGUE_WEEK_LIMIT}`;
    this.add.text(510, 66, weekLabel, {
      fontFamily: 'monospace', fontSize: '12px', color: GameState.data.week > PROLOGUE_WEEK_LIMIT ? '#d77f66' : '#d6b692'
    }).setOrigin(1, 0);
    this.add.line(270, 102, 25, 0, 515, 0, 0x664a36).setLineWidth(2);

    const frame = this.location === 'Scrapyard' ? 1 : this.location === 'Town' ? 2 : 3;
    addArtPanel(this, frame, 270, 265, 468, 286, 0.5, this.location === 'Factory' ? 0.35 : 0.5);
    addArtShade(this, 270, 265, 468, 286, 0.18);
    this.add.rectangle(270, 265, 468, 286, 0xffffff, 0).setStrokeStyle(2, 0xa57b58);
    this.add.rectangle(270, 145, 230, 34, 0x100c09, 0.78).setStrokeStyle(1, 0xba8c61, 0.8);
    const sceneLabel = this.location === 'Scrapyard' ? 'SALVAGE / OUTER RING'
      : this.location === 'Town' ? 'REPAIR / TRADE / SHELTER' : 'FURNACE / PRESSURE DANGER';
    this.add.text(270, 145, sceneLabel, { fontFamily: 'monospace', fontSize: '13px', color: '#f0d6b4' }).setOrigin(.5);
  }

  private createScrapyard() {
    const found = GameState.data.chapter0.scrapyardSalvage;
    if (this.salvageNotice) {
      this.dialogue.set(this.salvageNotice, 'ash');
      this.salvageNotice = null;
    } else if (found.length < SCRAP_PARTS.length) {
      this.dialogue.set(found.length === 0
        ? 'ASH: 「あの歯車、まだ使える。捨てる前に確かめるか。」'
        : `回収 ${found.length} / ${SCRAP_PARTS.length}。ASH: 「使い道は、拾ってから考える。」`, 'ash');
    } else if (!GameState.data.chapter0.azamiRecruited) {
      this.dialogue.set('廃材の下から角の生えた少女が顔を出した。\n「その弁、逆に回して！ 早く！」', 'azami');
    } else {
      this.dialogue.set('廃材の山が崩れ、機械の唸り声が響いた。\nアザミ: 「来るよ。今度はあたしも手を貸す！」', 'azami');
    }

    addCommandButton(this, {
      x: 270, y: 660,
      title: found.length < SCRAP_PARTS.length ? 'SEARCH / SALVAGE' : 'SALVAGE COMPLETE',
      subtitle: found.length < SCRAP_PARTS.length ? '1 WEEK / LOW RISK / 部品とSCRAPを回収' : '必要な部品は集まった',
      enabled: found.length < SCRAP_PARTS.length,
      onPress: () => this.salvage()
    });
    addCommandButton(this, {
      x: 270, y: 760,
      title: GameState.data.chapter0.azamiRecruited ? 'BATTLE / SCRAP HOUND' : 'RESCUE / DEMON GIRL',
      subtitle: GameState.data.chapter0.azamiRecruited ? '1 WEEK / MID RISK / MOTOR + SCRAP' : '1 WEEK / 廃材に挟まれた少女を助ける',
      enabled: found.length >= SCRAP_PARTS.length,
      onPress: () => {
        if (!GameState.data.chapter0.azamiRecruited) {
          GameState.data.chapter0.azamiRecruited = true;
          GameState.data.week += 1;
          GameState.save();
          this.dialogue.set('アザミ: 「助けてくれてありがとう！ あたし魔族だけど、機械も直せるよ！」\nASH: 「じゃあ、まずはその弁から頼む。」', 'azami');
          this.time.delayedCall(1100, () => this.scene.restart({ location: 'Scrapyard' }));
          return;
        }
        this.scene.start('Battle', { enemyId: 'scrap-hound' });
      }
    });
    addCommandButton(this, { x: 270, y: 860, title: 'RETURN', subtitle: '工房へ戻る', onPress: () => this.scene.start('Hub') });
  }

  private salvage() {
    const next = SCRAP_PARTS.find((part) => !GameState.data.chapter0.scrapyardSalvage.includes(part.id));
    if (!next) return;
    GameState.add(next.id);
    GameState.data.chapter0.scrapyardSalvage.push(next.id);
    GameState.data.scrap += 3;
    GameState.data.week += 1;
    GameState.save();
    const count = GameState.data.chapter0.scrapyardSalvage.length;
    this.salvageNotice = `WEEK ${GameState.data.week} / SALVAGE +1 : ${next.label}\n${next.line}\n\nASH: 「${count === 3 ? 'これで組める。' : 'まだ使える。'}」`;
    this.scene.restart({ location: 'Scrapyard' });
  }

  private createTown() {
    if (!GameState.data.chapter0.townVisited) GameState.data.week += 1;
    GameState.data.chapter0.townVisited = true;
    GameState.save();
    this.dialogue.set('修理屋のミナ: 「工場の炉が勝手に動き始めたの。止められる人を探してる」\nASH: 「止めるだけなら、やれる。」', 'mina');
    addCommandButton(this, {
      x: 270, y: 660, title: 'TALK / MINA', subtitle: '工場の異常について聞く',
      onPress: () => this.dialogue.set('ミナ: 「古い炉心は、壊すと町の熱源も止まる。直せるなら……お願い。」\nASH: 「壊さない方法を探す。」', 'mina')
    });
    addCommandButton(this, {
      x: 270, y: 760, title: 'GO / ABANDONED FACTORY', subtitle: '廃工場へ向かう',
      onPress: () => this.scene.start('Explore', { location: 'Factory' })
    });
    addCommandButton(this, { x: 270, y: 860, title: 'RETURN', subtitle: '工房へ戻る', onPress: () => this.scene.start('Hub') });
  }

  private createFactory() {
    if (GameState.data.chapter0.factoryBossDefeated) {
      this.dialogue.set('補助炉は町の熱源として動き続ける。壊れた中継器が一度だけ応答し、干上がった貯水槽に水滴が落ちた。\nアザミ: 「地図に線が浮いてきた。次は白い森だよ！」', 'azami');
      addCommandButton(this, {
        x: 270, y: 760, title: 'RETURN TO WORKSHOP', subtitle: 'Chapter 0 を終える',
        onPress: () => {
          GameState.data.chapter0.endingSeen = true;
          GameState.save();
          this.scene.start('Hub');
        }
      });
      addCommandButton(this, { x: 270, y: 860, title: 'TOWN', subtitle: '鉄屑街へ戻る', onPress: () => this.scene.start('Explore', { location: 'Town' }) });
      return;
    }

    this.dialogue.set(GameState.data.chapter0.factoryInspected
      ? '停止レバーは固着している。炉心の圧力を逃がせば、壊さずに止められそうだ。'
      : '古い工場が、誰もいないのに稼働している。蒸気の圧が危険域まで上がっている。', 'ash');
    addCommandButton(this, {
      x: 270, y: 650, title: GameState.data.chapter0.factoryInspected ? 'INSPECTED' : 'INSPECT / PRESSURE LINE',
      subtitle: '1 WEEK / LOW RISK / 補助炉の仕組みを調べる', enabled: !GameState.data.chapter0.factoryInspected,
      onPress: () => {
        GameState.data.chapter0.factoryInspected = true;
        GameState.data.week += 1;
        GameState.save();
        this.dialogue.set('ASH: 「この排気弁、規格が古いだけだ。締めるんじゃなく、逃がす。」\n炉心の圧力を抜いた。奥の守衛機が動き出す。');
        this.scene.restart({ location: 'Factory' });
      }
    });
    addCommandButton(this, {
      x: 270, y: 760, title: 'BATTLE / FURNACE WARDEN',
      subtitle: GameState.data.week > PROLOGUE_WEEK_LIMIT
        ? '1 WEEK / HIGH RISK / 遅延で敵の火力が上昇'
        : '1 WEEK / HIGH RISK / IGNITION UNIT + SCRAP',
      enabled: GameState.data.chapter0.factoryInspected,
      onPress: () => this.scene.start('Battle', { enemyId: 'factory-core' })
    });
    addCommandButton(this, { x: 270, y: 860, title: 'RETURN', subtitle: '鉄屑街へ戻る', onPress: () => this.scene.start('Explore', { location: 'Town' }) });
  }
}
