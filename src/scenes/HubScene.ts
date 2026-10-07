import Phaser from 'phaser';
import { GameState } from '../state/GameState';
import { addCommandButton } from '../ui/CommandButton';
import { addDialogueBox } from '../ui/DialogueBox';
import { addArtPanel, addArtShade } from '../ui/ArtPanel';

export class HubScene extends Phaser.Scene {
  private dialogue!: ReturnType<typeof addDialogueBox>;

  constructor() { super('Hub'); }

  create() {
    this.cameras.main.setBackgroundColor('#0e0c0a');
    this.add.rectangle(270, 480, 510, 930, 0x15120f).setStrokeStyle(4, 0x4d3b2e);
    this.add.text(30, 28, "ASH'S WORKSHOP", { fontFamily: 'monospace', fontSize: '24px', color: '#eadfce', fontStyle: 'bold' });
    this.add.text(30, 65, `HOME / DAY ${GameState.data.day} / CHAPTER 0`, { fontFamily: 'monospace', fontSize: '12px', color: '#8e735d' });
    this.add.line(270, 102, 25, 0, 515, 0, 0x664a36).setLineWidth(2);

    addArtPanel(this, 0, 270, 235, 468, 236, 0.5, 0.34);
    addArtShade(this, 270, 235, 468, 236, 0.3);
    this.add.rectangle(270, 235, 468, 236, 0x5c4938, 0).setStrokeStyle(2, 0x9f7956, 0.9);
    this.add.text(52, 151, 'HOME / REPAIR BAY', { fontFamily: 'monospace', fontSize: '13px', color: '#f1d2a9', backgroundColor: '#17110d', padding: { x: 10, y: 7 } });
    this.add.text(52, 201, 'ASH', { fontFamily: 'monospace', fontSize: '34px', color: '#f4e8d8', fontStyle: 'bold', stroke: '#17110d', strokeThickness: 5 });
    this.add.text(52, 249, 'JUNK MECHANIC  /  DAY 15', { fontFamily: 'monospace', fontSize: '11px', color: '#e5c69e', stroke: '#17110d', strokeThickness: 3 });

    this.add.rectangle(270, 408, 468, 90, 0x171411).setStrokeStyle(2, 0x514236);
    this.add.text(48, 370, this.inventorySummary(), {
      fontFamily: 'monospace', fontSize: '16px', color: '#e4d2bb',
      lineSpacing: 2, wordWrap: { width: 438 }
    });
    this.dialogue = addDialogueBox(this, 525, 132);
    this.dialogue.set(this.hubLine(), 'ash');

    const destination = GameState.nextDestination();
    const travelText: Record<typeof destination, [string, string]> = {
      Scrapyard: ['出発する / SCRAPYARD', '使える部品を探す'],
      Craft: ['NEXT / CRAFT PILE-01', '拾った部品を工房で組み立てる'],
      Town: ['出発する / IRON-SCRAP TOWN', '町の人から工場の話を聞く'],
      Factory: ['出発する / ABANDONED FACTORY', '炉心の異常を調べる'],
      Return: ['CHAPTER 0 / COMPLETE', '炉心を止め、町へ帰還した']
    };
    const [title, subtitle] = travelText[destination];
    this.command(654, title, subtitle, () => this.travel(destination));
    this.command(755, 'CRAFT / PILE-01', 'GEAR + WIRE + PRESSURE CYLINDER', () => this.craft());
    this.command(856, 'REST', 'HPを全回復 / 日付を進める', () => this.rest());
  }

  private command(y: number, title: string, subtitle: string, action: () => void) {
    addCommandButton(this, { x: 270, y, title, subtitle, onPress: action });
  }

  private travel(destination: ReturnType<typeof GameState.nextDestination>) {
    if (destination === 'Craft') {
      this.dialogue.set('拾った部品を組み立てよう。\nASH: 「あの3つなら、ひとつにできる。」', 'ash');
      return;
    }
    if (destination === 'Return') {
      if (GameState.data.chapter0.endingSeen) {
        this.dialogue.set('CHAPTER 0 CLEAR\nASH: 「次に直すものを探しに行くか。」', 'ash');
        return;
      }
      this.scene.start('Explore', { location: 'Factory' });
    } else {
      this.scene.start('Explore', { location: destination });
    }
  }

  private craft() {
    if (GameState.data.crafted.includes('PILE-01')) {
      this.dialogue.set('PILE-01 は完成済み。\nASH: 「寄せ集めでも、合わせ方で武器になる。」', 'ash');
      return;
    }
    if (GameState.consume({ 'Rusted Gear': 1, 'Copper Wire': 1, 'Pressure Cylinder': 1 })) {
      GameState.data.crafted.push('PILE-01');
      GameState.save();
      this.cameras.main.flash(220, 205, 155, 90);
      this.add.text(270, 621, 'CRAFT COMPLETE : PILE-01', { fontFamily: 'monospace', fontSize: '14px', color: '#e4bc87' }).setOrigin(.5);
      this.scene.restart();
    } else {
      this.dialogue.set('素材不足：Rusted Gear ×1 / Copper Wire ×1 / Pressure Cylinder ×1\nASH: 「まずは置き場を漁るか。」', 'ash');
    }
  }

  private rest() {
    GameState.data.hp = GameState.data.maxHp;
    GameState.data.day += 1;
    GameState.save();
    this.scene.restart();
  }

  private inventorySummary() {
    const items = GameState.data.inventory;
    const weapon = GameState.data.crafted.includes('PILE-01') ? 'PILE-01' : 'NONE';
    return `HP ${GameState.data.hp}/${GameState.data.maxHp}    SCRAP ${GameState.data.scrap}\n` +
      `GEAR ${items['Rusted Gear'] ?? 0}    WIRE ${items['Copper Wire'] ?? 0}    CYL ${items['Pressure Cylinder'] ?? 0}\n` +
      `MOTOR ${items['Small Motor'] ?? 0}    IGNITION ${items['Ignition Unit'] ?? 0}\nWEAPON ${weapon}`;
  }

  private hubLine() {
    if (GameState.data.chapter0.endingSeen) {
      return '工房に、鉄屑街から借りた工具が並んだ。\nASH: 「捨てるかどうかは、直してから決める。」';
    }
    if (GameState.data.chapter0.factoryBossDefeated) return '炉心の熱が町を救った。最後に工房へ戻ろう。';
    if (GameState.data.crafted.includes('PILE-01')) return 'PILE-01 は動く。次は鉄屑街の依頼を聞きに行こう。';
    if (GameState.data.chapter0.houndDefeated) return '拾った部品を組み立てよう。使い道は、作りながら見つければいい。';
    return '「今日は何を直す。」\nASH: 「まずは外のスクラップ置き場だな。」';
  }
}
