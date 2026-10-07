import Phaser from 'phaser';
import { GameState } from '../state/GameState';
import { addCommandButton } from '../ui/CommandButton';
import { addDialogueBox } from '../ui/DialogueBox';

export class HubScene extends Phaser.Scene {
  private dialogue!: ReturnType<typeof addDialogueBox>;

  constructor() { super('Hub'); }

  create() {
    this.cameras.main.setBackgroundColor('#0e0c0a');
    this.add.rectangle(270, 480, 510, 930, 0x15120f).setStrokeStyle(4, 0x4d3b2e);
    this.add.text(30, 28, "ASH'S WORKSHOP", { fontFamily: 'monospace', fontSize: '24px', color: '#eadfce', fontStyle: 'bold' });
    this.add.text(30, 65, `HOME / DAY ${GameState.data.day} / CHAPTER 0`, { fontFamily: 'monospace', fontSize: '12px', color: '#8e735d' });
    this.add.line(270, 102, 25, 0, 515, 0, 0x664a36).setLineWidth(2);

    this.add.rectangle(270, 245, 468, 248, 0x211b16).setStrokeStyle(3, 0x5c4938);
    this.add.text(56, 155, 'WORKSHOP / REPAIR BAY', { fontFamily: 'monospace', fontSize: '15px', color: '#b58a61' });
    this.add.text(54, 195, 'ASH', { fontFamily: 'monospace', fontSize: '42px', color: '#e3dbcf', fontStyle: 'bold' });
    this.add.text(54, 250, '灰色の髪 / 赤錆色の目\nガラクタ整備士', {
      fontFamily: '"Noto Sans JP", sans-serif', fontSize: '17px', color: '#a99782', lineSpacing: 8
    });
    this.add.circle(415, 240, 70, 0x40352b).setStrokeStyle(5, 0xa8764a);
    this.add.circle(415, 218, 29, 0xd3cec6);
    this.add.rectangle(415, 280, 68, 72, 0x22201f);
    this.add.rectangle(415, 256, 88, 15, 0x8f4d35);

    this.add.text(42, 365, this.inventorySummary(), {
      fontFamily: 'monospace', fontSize: '14px', color: '#dac2a4',
      backgroundColor: '#15120f', padding: { x: 13, y: 10 }, wordWrap: { width: 430 }
    });
    this.dialogue = addDialogueBox(this, 515, 128);
    this.dialogue.set(this.hubLine());

    const destination = GameState.nextDestination();
    const travelText: Record<typeof destination, [string, string]> = {
      Scrapyard: ['出発する / SCRAPYARD', '使える部品を探す'],
      Craft: ['NEXT / CRAFT PILE-01', '拾った部品を工房で組み立てる'],
      Town: ['出発する / IRON-SCRAP TOWN', '町の人から工場の話を聞く'],
      Factory: ['出発する / ABANDONED FACTORY', '炉心の異常を調べる'],
      Return: ['CHAPTER 0 / COMPLETE', '炉心を止め、町へ帰還した']
    };
    const [title, subtitle] = travelText[destination];
    this.command(660, title, subtitle, () => this.travel(destination));
    this.command(760, 'CRAFT / PILE-01', 'Gear + Wire + Pressure Cylinder', () => this.craft());
    this.command(860, 'REST', 'HPを全回復 / 日付を進める', () => this.rest());
  }

  private command(y: number, title: string, subtitle: string, action: () => void) {
    addCommandButton(this, { x: 270, y, title, subtitle, onPress: action });
  }

  private travel(destination: ReturnType<typeof GameState.nextDestination>) {
    if (destination === 'Craft') {
      this.dialogue.set('拾った部品を組み立てよう。\nASH: 「あの3つなら、ひとつにできる。」');
      return;
    }
    if (destination === 'Return') {
      if (GameState.data.chapter0.endingSeen) {
        this.dialogue.set('CHAPTER 0 CLEAR\nASH: 「次に直すものを探しに行くか。」');
        return;
      }
      this.scene.start('Explore', { location: 'Factory' });
    } else {
      this.scene.start('Explore', { location: destination });
    }
  }

  private craft() {
    if (GameState.data.crafted.includes('PILE-01')) {
      this.dialogue.set('PILE-01 は完成済み。\nASH: 「寄せ集めでも、合わせ方で武器になる。」');
      return;
    }
    if (GameState.consume({ 'Rusted Gear': 1, 'Copper Wire': 1, 'Pressure Cylinder': 1 })) {
      GameState.data.crafted.push('PILE-01');
      GameState.save();
      this.cameras.main.flash(220, 205, 155, 90);
      this.add.text(270, 621, 'CRAFT COMPLETE : PILE-01', { fontFamily: 'monospace', fontSize: '14px', color: '#e4bc87' }).setOrigin(.5);
      this.scene.restart();
    } else {
      this.dialogue.set('素材不足：Rusted Gear ×1 / Copper Wire ×1 / Pressure Cylinder ×1\nASH: 「まずは置き場を漁るか。」');
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
    return `HP ${GameState.data.hp}/${GameState.data.maxHp}   SCRAP ${GameState.data.scrap}\n` +
      `GEAR ${items['Rusted Gear'] ?? 0} / WIRE ${items['Copper Wire'] ?? 0} / CYL ${items['Pressure Cylinder'] ?? 0}\n` +
      `MOTOR ${items['Small Motor'] ?? 0} / IGNITION ${items['Ignition Unit'] ?? 0} / WEAPON ${weapon}`;
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
