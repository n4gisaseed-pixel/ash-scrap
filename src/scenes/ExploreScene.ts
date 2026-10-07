import Phaser from 'phaser';
import { GameState } from '../state/GameState';
import { addCommandButton } from '../ui/CommandButton';
import { addDialogueBox } from '../ui/DialogueBox';

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
    this.dialogue = addDialogueBox(this, 500, 138);
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
      fontFamily: 'monospace', fontSize: this.location === 'Town' ? '22px' : '24px', color: '#e8d7be', fontStyle: 'bold'
    });
    this.add.text(30, 65, titles[this.location][1], { fontFamily: 'monospace', fontSize: '12px', color: '#8f7760' });
    this.add.line(270, 102, 25, 0, 515, 0, 0x664a36).setLineWidth(2);

    const panel = this.add.rectangle(270, 278, 468, 310, 0x292721).setStrokeStyle(3, 0x625243);
    if (this.location === 'Scrapyard') {
      for (let i = 0; i < 24; i++) {
        this.add.rectangle(Phaser.Math.Between(62, 478), Phaser.Math.Between(145, 400),
          Phaser.Math.Between(20, 68), Phaser.Math.Between(10, 34),
          Phaser.Math.RND.pick([0x4d443b, 0x5d4939, 0x38332e]), 1).setAngle(Phaser.Math.Between(-25, 25));
      }
      this.add.text(270, 278, 'SALVAGE\n\n「捨てた物」を\n見分ける。', {
        fontFamily: '"Noto Sans JP", sans-serif', fontSize: '22px', color: '#d0aa78', align: 'center',
        backgroundColor: '#171411', padding: { x: 20, y: 14 }
      }).setOrigin(.5);
    } else if (this.location === 'Town') {
      panel.setFillStyle(0x30271f);
      this.add.rectangle(270, 298, 380, 120, 0x4a3626).setStrokeStyle(2, 0x856344);
      this.add.rectangle(270, 390, 420, 48, 0x221c17);
      this.add.text(270, 235, 'REPAIR / TRADE / SHELTER', {
        fontFamily: 'monospace', fontSize: '17px', color: '#d5b188'
      }).setOrigin(.5);
      this.add.text(270, 295, 'IRON-SCRAP TOWN', { fontFamily: 'monospace', fontSize: '22px', color: '#f0dfca' }).setOrigin(.5);
    } else {
      panel.setFillStyle(0x252321);
      for (let y = 178; y <= 380; y += 54) {
        this.add.rectangle(270, y, 330, 12, 0x51463a).setStrokeStyle(1, 0x776148);
        this.add.rectangle(120, y, 10, 46, 0x5c4b3a);
        this.add.rectangle(420, y, 10, 46, 0x5c4b3a);
      }
      this.add.circle(270, 285, 54, 0x6b3020).setStrokeStyle(7, 0xb7683d);
      this.add.circle(270, 285, 28, 0xd27b42);
      this.add.text(270, 210, 'FURNACE / STANDBY', { fontFamily: 'monospace', fontSize: '16px', color: '#e0a477' }).setOrigin(.5);
    }
  }

  private createScrapyard() {
    const found = GameState.data.chapter0.scrapyardSalvage;
    if (this.salvageNotice) {
      this.dialogue.set(this.salvageNotice);
      this.salvageNotice = null;
    } else if (found.length < SCRAP_PARTS.length) {
      this.dialogue.set(found.length === 0
        ? 'ASH: 「あの歯車、まだ使える。捨てる前に確かめるか。」'
        : `回収 ${found.length} / ${SCRAP_PARTS.length}。ASH: 「使い道は、拾ってから考える。」`);
    } else {
      this.dialogue.set('廃材の山が崩れ、機械の唸り声が響いた。\nASH: 「部品を狙ってるのか。趣味が悪いな。」');
    }

    addCommandButton(this, {
      x: 270, y: 660,
      title: found.length < SCRAP_PARTS.length ? 'SEARCH / SALVAGE' : 'SALVAGE COMPLETE',
      subtitle: found.length < SCRAP_PARTS.length ? '使える部品を見分けて回収する' : '必要な部品は集まった',
      enabled: found.length < SCRAP_PARTS.length,
      onPress: () => this.salvage()
    });
    addCommandButton(this, {
      x: 270, y: 760,
      title: 'BATTLE / SCRAP HOUND', subtitle: '鉄屑の奥から、何かが近づく',
      enabled: found.length >= SCRAP_PARTS.length,
      onPress: () => this.scene.start('Battle', { enemyId: 'scrap-hound' })
    });
    addCommandButton(this, { x: 270, y: 860, title: 'RETURN', subtitle: '工房へ戻る', onPress: () => this.scene.start('Hub') });
  }

  private salvage() {
    const next = SCRAP_PARTS.find((part) => !GameState.data.chapter0.scrapyardSalvage.includes(part.id));
    if (!next) return;
    GameState.add(next.id);
    GameState.data.chapter0.scrapyardSalvage.push(next.id);
    GameState.data.scrap += 3;
    GameState.save();
    const count = GameState.data.chapter0.scrapyardSalvage.length;
    this.salvageNotice = `SALVAGE +1 : ${next.label}\n${next.line}\n\nASH: 「${count === 3 ? 'これで組める。' : 'まだ使える。'}」`;
    this.scene.restart({ location: 'Scrapyard' });
  }

  private createTown() {
    GameState.data.chapter0.townVisited = true;
    GameState.save();
    this.dialogue.set('修理屋のミナ: 「工場の炉が勝手に動き始めたの。止められる人を探してる」\nASH: 「止めるだけなら、やれる。」');
    addCommandButton(this, {
      x: 270, y: 660, title: 'TALK / MINA', subtitle: '工場の異常について聞く',
      onPress: () => this.dialogue.set('ミナ: 「古い炉心は、壊すと町の熱源も止まる。直せるなら……お願い。」\nASH: 「壊さない方法を探す。」')
    });
    addCommandButton(this, {
      x: 270, y: 760, title: 'GO / ABANDONED FACTORY', subtitle: '廃工場へ向かう',
      onPress: () => this.scene.start('Explore', { location: 'Factory' })
    });
    addCommandButton(this, { x: 270, y: 860, title: 'RETURN', subtitle: '工房へ戻る', onPress: () => this.scene.start('Hub') });
  }

  private createFactory() {
    if (GameState.data.chapter0.factoryBossDefeated) {
      this.dialogue.set('炉心は静かに回り続けている。拾った部品と、町の技術を組み合わせた結果だ。\nASH: 「直すってのは、元に戻すことだけじゃない。」');
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
      : '古い工場が、誰もいないのに稼働している。蒸気の圧が危険域まで上がっている。');
    addCommandButton(this, {
      x: 270, y: 650, title: GameState.data.chapter0.factoryInspected ? 'INSPECTED' : 'INSPECT / PRESSURE LINE',
      subtitle: '配管を調べ、炉心を止める方法を探す', enabled: !GameState.data.chapter0.factoryInspected,
      onPress: () => {
        GameState.data.chapter0.factoryInspected = true;
        GameState.save();
        this.dialogue.set('ASH: 「この排気弁、規格が古いだけだ。締めるんじゃなく、逃がす。」\n炉心の圧力を抜いた。奥の守衛機が動き出す。');
        this.scene.restart({ location: 'Factory' });
      }
    });
    addCommandButton(this, {
      x: 270, y: 760, title: 'BATTLE / FURNACE WARDEN', subtitle: '圧力を逃がした炉心の守衛機',
      enabled: GameState.data.chapter0.factoryInspected,
      onPress: () => this.scene.start('Battle', { enemyId: 'factory-core' })
    });
    addCommandButton(this, { x: 270, y: 860, title: 'RETURN', subtitle: '鉄屑街へ戻る', onPress: () => this.scene.start('Explore', { location: 'Town' }) });
  }
}
