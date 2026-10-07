import Phaser from 'phaser';
import { GameState, PROLOGUE_WEEK_LIMIT } from '../state/GameState';
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
    const weekLabel = GameState.data.week <= PROLOGUE_WEEK_LIMIT
      ? `WEEK ${GameState.data.week} / ${PROLOGUE_WEEK_LIMIT}`
      : `LATE +${GameState.data.week - PROLOGUE_WEEK_LIMIT} WEEKS`;
    this.add.text(30, 65, `AFTER THE CLEAR / ${weekLabel} / PROLOGUE`, {
      fontFamily: 'monospace', fontSize: '11px', color: GameState.data.week > PROLOGUE_WEEK_LIMIT ? '#d77f66' : '#8e735d'
    });
    this.add.line(270, 102, 25, 0, 515, 0, 0x664a36).setLineWidth(2);

    addArtPanel(this, 0, 270, 235, 468, 236, 0.5, 0.34);
    addArtShade(this, 270, 235, 468, 236, 0.3);
    this.add.rectangle(270, 235, 468, 236, 0x5c4938, 0).setStrokeStyle(2, 0x9f7956, 0.9);
    this.add.text(52, 151, 'HOME / REPAIR BAY', { fontFamily: 'monospace', fontSize: '13px', color: '#f1d2a9', backgroundColor: '#17110d', padding: { x: 10, y: 7 } });
    this.add.text(52, 201, 'ASH', { fontFamily: 'monospace', fontSize: '34px', color: '#f4e8d8', fontStyle: 'bold', stroke: '#17110d', strokeThickness: 5 });
    this.add.text(52, 249, 'JUNK MECHANIC  /  AGE 15', { fontFamily: 'monospace', fontSize: '11px', color: '#e5c69e', stroke: '#17110d', strokeThickness: 3 });

    this.add.rectangle(270, 408, 468, 90, 0x171411).setStrokeStyle(2, 0x514236);
    this.add.text(48, 370, this.inventorySummary(), {
      fontFamily: 'monospace', fontSize: '14px', color: '#e4d2bb',
      lineSpacing: 1, wordWrap: { width: 438 }
    });
    this.dialogue = addDialogueBox(this, 525, 132);
    this.dialogue.set(this.hubLine(), 'ash');

    const destination = GameState.nextDestination();
    const travelText: Record<typeof destination, [string, string]> = {
      Scrapyard: ['出発する / SCRAPYARD', '使える部品を探す'],
      Craft: ['NEXT / CRAFT PILE-01', '拾った部品を工房で組み立てる'],
      Town: ['出発する / IRON-SCRAP TOWN', '+1 WEEK / 町の設備と工場の噂を調べる'],
      Factory: ['出発する / ABANDONED FACTORY', '炉心の異常を調べる'],
      Return: ['PROLOGUE / COMPLETE', '次の目的地 : WHITEWOOD / GREEN CORE']
    };
    const [title, subtitle] = travelText[destination];
    this.command(654, title, subtitle, () => this.travel(destination));
    this.command(755, 'CRAFT / PILE-01', '1 WEEK / GEAR + WIRE + PRESSURE CYLINDER', () => this.craft());
    this.command(856, 'REST / PREPARE', 'HPを全回復 / 1週間経過', () => this.rest());
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
        this.dialogue.set('PROLOGUE COMPLETE / WHITEWOOD IS NEXT\nASH: 「世界を直す、ね。まずは見に行くか。」', 'ash');
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
      GameState.data.week += 1;
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
    GameState.data.week += 1;
    GameState.save();
    this.scene.restart();
  }

  private inventorySummary() {
    const items = GameState.data.inventory;
    const weapon = GameState.data.crafted.includes('PILE-01') ? 'PILE-01' : 'NONE';
    return `HP ${GameState.data.hp}/${GameState.data.maxHp}  SCRAP ${GameState.data.scrap}\n` +
      `GEAR ${items['Rusted Gear'] ?? 0}    WIRE ${items['Copper Wire'] ?? 0}    CYL ${items['Pressure Cylinder'] ?? 0}\n` +
      `MOTOR ${items['Small Motor'] ?? 0}    IGNITION ${items['Ignition Unit'] ?? 0}\n` +
      `WEAPON ${weapon}    PARTNER ${GameState.data.chapter0.azamiRecruited ? 'AZAMI / AUTO' : 'NONE'}`;
  }

  private hubLine() {
    if (GameState.data.chapter0.endingSeen) {
      return 'アザミの地図に、白い森への道が浮かんだ。\nASH: 「世界を直す、ね。まずは見に行くか。」';
    }
    if (GameState.data.chapter0.factoryBossDefeated) return '炉心の熱が町を救った。最後に工房へ戻ろう。';
    if (GameState.data.chapter0.azamiRecruited) return 'アザミが工房の歯車を眺めている。\n「これ、まだ回せるよ。」';
    if (GameState.data.crafted.includes('PILE-01')) return 'PILE-01 は動く。次は鉄屑街の依頼を聞きに行こう。';
    if (GameState.data.chapter0.houndDefeated) return '拾った部品を組み立てよう。使い道は、作りながら見つければいい。';
    return '「今日は何を直す。」\nASH: 「まずは外のスクラップ置き場だな。」';
  }
}
