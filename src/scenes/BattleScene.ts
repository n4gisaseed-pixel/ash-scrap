import Phaser from 'phaser';
import { ENEMIES, type EnemyId } from '../data/enemies';
import { GameState } from '../state/GameState';
import { addCommandButton } from '../ui/CommandButton';
import { addDialogueBox } from '../ui/DialogueBox';

export class BattleScene extends Phaser.Scene {
  private enemyId: EnemyId = 'scrap-hound';
  private enemyHp = 80;
  private heat = 0;
  private tuned = false;
  private dialogue!: ReturnType<typeof addDialogueBox>;
  private enemyHpText!: Phaser.GameObjects.Text;
  private playerHpText!: Phaser.GameObjects.Text;
  private heatText!: Phaser.GameObjects.Text;
  private ended = false;
  private busy = false;

  constructor() { super('Battle'); }

  init(data: { enemyId?: EnemyId }) {
    this.enemyId = data.enemyId ?? 'scrap-hound';
    this.enemyHp = ENEMIES[this.enemyId].hp;
    this.heat = 0;
    this.tuned = false;
    this.ended = false;
    this.busy = false;
  }

  create() {
    const enemy = ENEMIES[this.enemyId];
    this.cameras.main.setBackgroundColor('#0c0b09');
    this.add.rectangle(270, 480, 510, 930, 0x15120f).setStrokeStyle(4, 0x4f3c2f);
    this.add.text(30, 28, `BATTLE / ${enemy.name}`, {
      fontFamily: 'monospace', fontSize: enemy.name.length > 14 ? '20px' : '23px', color: '#eadfce', fontStyle: 'bold'
    });
    this.add.rectangle(270, 280, 460, 300, 0x24221e).setStrokeStyle(3, 0x5f5043);
    this.drawEnemy();
    this.enemyHpText = this.add.text(270, 445, '', { fontFamily: 'monospace', fontSize: '15px', color: '#dcb28a' }).setOrigin(.5);
    this.playerHpText = this.add.text(40, 485, '', { fontFamily: 'monospace', fontSize: '16px', color: '#d8c2a5' });
    this.heatText = this.add.text(350, 485, '', { fontFamily: 'monospace', fontSize: '16px', color: '#c8784d' });
    this.dialogue = addDialogueBox(this, 578, 128);
    this.dialogue.set(enemy.opening);

    addCommandButton(this, { x: 150, y: 720, title: 'ATTACK', subtitle: 'PILE-01で攻撃力上昇', onPress: () => this.attack(18) });
    addCommandButton(this, { x: 390, y: 720, title: 'GADGET', subtitle: this.hasPile() ? 'PILE-01 / 高威力' : '即席の衝撃を与える', onPress: () => this.attack(this.hasPile() ? 34 : 12, true) });
    addCommandButton(this, { x: 150, y: 820, title: 'TUNE', subtitle: '熱を逃がし、次のGADGETを強化', onPress: () => this.tune() });
    addCommandButton(this, { x: 390, y: 820, title: 'RETREAT', subtitle: '探索地点へ戻る', onPress: () => this.scene.start('Explore', { location: this.enemyId === 'factory-core' ? 'Factory' : 'Scrapyard' }) });
    this.refresh();
  }

  private drawEnemy() {
    if (this.enemyId === 'scrap-hound') {
      this.add.circle(270, 275, 74, 0x3a332c).setStrokeStyle(5, 0x825d43);
      this.add.rectangle(270, 290, 145, 80, 0x4a4037);
      this.add.circle(232, 250, 11, 0xd16043);
      this.add.circle(308, 250, 11, 0xd16043);
      this.add.rectangle(270, 330, 100, 14, 0x1c1917);
    } else {
      this.add.rectangle(270, 290, 166, 156, 0x514232).setStrokeStyle(5, 0xb05c36);
      this.add.circle(270, 275, 58, 0x963e25).setStrokeStyle(8, 0xd18b4d);
      this.add.circle(270, 275, 25, 0xffb35c);
      this.add.rectangle(188, 343, 18, 76, 0x675542);
      this.add.rectangle(352, 343, 18, 76, 0x675542);
    }
    this.add.text(270, 167, ENEMIES[this.enemyId].name, { fontFamily: 'monospace', fontSize: '18px', color: '#caa17b' }).setOrigin(.5);
  }

  private attack(base: number, gadget = false) {
    if (this.ended || this.busy) return;
    this.busy = true;
    const bonus = Math.floor(this.heat / 25) * 2 + (gadget && this.tuned ? 15 : 0);
    const damage = base + bonus;
    this.tuned = false;
    this.enemyHp = Math.max(0, this.enemyHp - damage);
    this.heat = Math.min(100, this.heat + (gadget ? 16 : 12));
    this.dialogue.set(`ASHの攻撃。 ${damage} DAMAGE。${this.heat >= 85 ? '\n排熱限界が近い。次のTUNEが必要だ。' : ''}`);
    if (this.enemyHp <= 0) {
      this.win();
      return;
    }
    if (this.heat >= 100) {
      GameState.data.hp = Math.max(0, GameState.data.hp - 8);
      this.dialogue.set('HEAT OVERLOAD。ASHは8 DAMAGEを受けた。\n熱を逃がすまで、機材が不安定だ。');
    }
    this.enemyTurn();
  }

  private tune() {
    if (this.ended || this.busy) return;
    this.busy = true;
    this.heat = Math.max(0, this.heat - 40);
    this.tuned = true;
    this.dialogue.set('TUNE：冷却弁を調整。HEAT -40。\n次のGADGETが強化される。');
    this.enemyTurn();
  }

  private enemyTurn() {
    const enemy = ENEMIES[this.enemyId];
    const damage = Phaser.Math.Between(enemy.attackMin, enemy.attackMax);
    GameState.data.hp = Math.max(0, GameState.data.hp - damage);
    GameState.save();
    this.refresh();
    this.time.delayedCall(380, () => {
      if (GameState.data.hp <= 0) {
        this.ended = true;
        GameState.data.hp = GameState.data.maxHp;
        GameState.save();
        this.dialogue.set('ASHは倒れた……工房へ戻された。\n装備は失ったが、拾った部品は残っている。');
        this.time.delayedCall(1100, () => this.scene.start('Hub'));
        return;
      }
      this.busy = false;
      this.dialogue.set(`敵の攻撃。 ${damage} DAMAGE。\nASH: 「まだ直せる。」`);
      this.refresh();
    });
  }

  private win() {
    this.ended = true;
    const enemy = ENEMIES[this.enemyId];
    GameState.data.scrap += enemy.rewardScrap;
    GameState.data.inventory[enemy.rewardItem] = (GameState.data.inventory[enemy.rewardItem] ?? 0) + 1;
    if (this.enemyId === 'scrap-hound') GameState.data.chapter0.houndDefeated = true;
    else GameState.data.chapter0.factoryBossDefeated = true;
    GameState.save();
    this.dialogue.set(`${enemy.name} を撃破。\n${enemy.victory}\n${enemy.rewardItem} +1 / SCRAP +${enemy.rewardScrap}`);
    this.refresh();
    const destination = this.enemyId === 'factory-core' ? 'Factory' : 'Hub';
    this.time.delayedCall(1400, () => this.scene.start(destination === 'Hub' ? 'Hub' : 'Explore', { location: destination }));
  }

  private hasPile() { return GameState.data.crafted.includes('PILE-01'); }

  private refresh() {
    this.enemyHpText.setText(`ENEMY HP  ${this.enemyHp}/${ENEMIES[this.enemyId].hp}`);
    this.playerHpText.setText(`ASH HP  ${GameState.data.hp}/${GameState.data.maxHp}`);
    this.heatText.setText(`HEAT ${this.heat}%`);
  }
}
