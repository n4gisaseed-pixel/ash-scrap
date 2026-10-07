import Phaser from 'phaser';
import { ENEMIES, type EnemyId } from '../data/enemies';
import { GameState, PROLOGUE_WEEK_LIMIT } from '../state/GameState';
import { addCommandButton } from '../ui/CommandButton';
import { addDialogueBox } from '../ui/DialogueBox';
import { addArtPanel, addArtShade } from '../ui/ArtPanel';

export class BattleScene extends Phaser.Scene {
  private enemyId: EnemyId = 'scrap-hound';
  private enemyHp = 80;
  private enemyAttackMin = 0;
  private enemyAttackMax = 0;
  private latePressure = 0;
  private heat = 0;
  private gadgetCharges = 2;
  private tuned = false;
  private gadgetBoosted = false;
  private enemyArt!: Phaser.GameObjects.Image;
  private dialogue!: ReturnType<typeof addDialogueBox>;
  private enemyHpText!: Phaser.GameObjects.Text;
  private playerHpText!: Phaser.GameObjects.Text;
  private heatText!: Phaser.GameObjects.Text;
  private enemyHpBar!: Phaser.GameObjects.Rectangle;
  private playerHpBar!: Phaser.GameObjects.Rectangle;
  private heatBar!: Phaser.GameObjects.Rectangle;
  private forecastText!: Phaser.GameObjects.Text;
  private gadgetButton!: ReturnType<typeof addCommandButton>;
  private actionButtons: Array<ReturnType<typeof addCommandButton>> = [];
  private ended = false;
  private busy = false;

  constructor() { super('Battle'); }

  init(data: { enemyId?: EnemyId }) {
    this.enemyId = data.enemyId ?? 'scrap-hound';
    this.enemyHp = ENEMIES[this.enemyId].hp;
    const enemy = ENEMIES[this.enemyId];
    const overdueWeeks = Math.max(0, GameState.data.week - PROLOGUE_WEEK_LIMIT);
    this.latePressure = this.enemyId === 'factory-core' ? Math.min(8, overdueWeeks * 2) : 0;
    this.enemyAttackMin = enemy.attackMin + this.latePressure;
    this.enemyAttackMax = enemy.attackMax + this.latePressure;
    GameState.data.week += 1;
    GameState.save();
    this.heat = 0;
    this.gadgetCharges = 2;
    this.tuned = false;
    this.gadgetBoosted = false;
    this.ended = false;
    this.busy = false;
    this.actionButtons = [];
  }

  create() {
    const enemy = ENEMIES[this.enemyId];
    const boss = this.enemyId === 'factory-core';
    this.cameras.main.setBackgroundColor('#0c0b09');
    this.add.rectangle(270, 480, 516, 948, 0x151719).setStrokeStyle(2, 0x71808a);
    this.add.text(30, 22, boss ? 'BOSS / 旧工場' : 'ENCOUNTER / 廃材置き場', {
      fontFamily: '"Noto Sans JP", sans-serif', fontSize: '13px', color: '#9eb5bf'
    });
    this.add.text(30, 47, enemy.name, {
      fontFamily: 'monospace', fontSize: '23px', color: '#f0e8dc', fontStyle: 'bold'
    });

    const backdropFrame = boss ? 3 : 1;
    addArtPanel(this, backdropFrame, 270, 260, 468, 300, 0.5, 0.45);
    addArtShade(this, 270, 260, 468, 300, 0.5);
    this.add.rectangle(270, 260, 468, 300, 0xb78a62, 0).setStrokeStyle(2, 0xa57b58, 0.9);
    this.add.rectangle(270, 260, 260, 260, 0x171a1c).setStrokeStyle(2, 0xb7c9cc);
    this.enemyArt = addArtPanel(this, boss ? 5 : 4, 270, 260, 252, 252, 0.5, 0.5);
    this.add.rectangle(270, 260, 252, 252, 0xffffff, 0).setStrokeStyle(2, 0xb7c9cc);

    this.enemyHpText = this.add.text(270, 414, '', {
      fontFamily: 'monospace', fontSize: '13px', color: '#f0d4b1'
    }).setOrigin(.5);
    this.add.rectangle(270, 435, 430, 16, 0x25292b).setStrokeStyle(1, 0x66757a);
    this.enemyHpBar = this.add.rectangle(56, 435, 426, 10, 0xc66542).setOrigin(0, .5);

    this.playerHpText = this.add.text(48, 458, '', { fontFamily: 'monospace', fontSize: '12px', color: '#e9dbc9' });
    this.heatText = this.add.text(492, 458, '', { fontFamily: 'monospace', fontSize: '12px', color: '#f0a16a' }).setOrigin(1, 0);
    this.add.rectangle(270, 482, 430, 12, 0x25292b).setStrokeStyle(1, 0x66757a);
    this.playerHpBar = this.add.rectangle(56, 482, 426, 8, 0x83a269).setOrigin(0, .5);
    this.add.rectangle(270, 510, 430, 12, 0x25292b).setStrokeStyle(1, 0x66757a);
    this.heatBar = this.add.rectangle(56, 510, 4, 8, 0xd47a48).setOrigin(0, .5);
    this.add.rectangle(270, 535, 468, 28, 0x1d2427).setStrokeStyle(1, 0x596b72);
    this.forecastText = this.add.text(270, 535, '', {
      fontFamily: '"Noto Sans JP", sans-serif', fontSize: '12px', color: '#bbd1d1'
    }).setOrigin(.5);

    this.dialogue = addDialogueBox(this, 625, 138);
    this.dialogue.set(this.latePressure > 0
      ? `${enemy.opening}\n遅延圧力 +${this.latePressure} DAMAGE`
      : enemy.opening);

    this.actionButtons.push(addCommandButton(this, {
      x: 150, y: 746, title: '工具で攻撃', subtitle: this.hasPile() ? 'PILE-01 / 安定した一撃' : '標準攻撃 / HEAT +18',
      width: 218, height: 84, icon: 0, onPress: () => this.attack()
    }));
    this.gadgetButton = addCommandButton(this, {
      x: 390, y: 746, title: `GADGET ×${this.gadgetCharges}`, subtitle: this.hasPile() ? '油圧パイル / 2回使用' : '即席ピストン / 2回使用',
      width: 218, height: 84, icon: 1, onPress: () => this.gadget()
    });
    this.actionButtons.push(this.gadgetButton);
    this.actionButtons.push(addCommandButton(this, {
      x: 150, y: 846, title: 'TUNE / 排熱', subtitle: 'HEATを冷却\n次のパイルを強化',
      width: 218, height: 84, icon: 2, onPress: () => this.tune()
    }));
    this.actionButtons.push(addCommandButton(this, {
      x: 390, y: 846, title: '撤退する', subtitle: '探索地点へ戻る',
      width: 218, height: 84, icon: 3, onPress: () => this.retreat()
    }));
    this.refresh();
    this.tweens.add({ targets: this.enemyArt, y: 254, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }

  private attack() {
    if (this.ended || this.busy) return;
    this.setActionsEnabled(false);
    const base = (this.hasPile() ? 20 : 14) + GameState.data.force * 2;
    const bonus = Math.floor(this.heat / 25) * 3;
    const damage = base + bonus;
    this.heat = Math.min(100, this.heat + 18);
    this.enemyHp = Math.max(0, this.enemyHp - damage);
    this.dialogue.set(`ASHの攻撃。${damage} DAMAGE。\n排熱が上がる。次の一手を選べ。`);
    this.hitEffect(damage);
    this.refresh();
    if (this.enemyHp <= 0) this.win();
    else this.enemyTurn();
  }

  private gadget() {
    if (this.ended || this.busy || this.gadgetCharges <= 0) return;
    this.setActionsEnabled(false);
    this.gadgetCharges -= 1;
    const damage = (this.hasPile() ? 34 : 23) + GameState.data.ingenuity * 2 + (this.gadgetBoosted ? 12 : 0) + Math.floor(this.heat / 40) * 3;
    this.gadgetBoosted = false;
    this.tuned = false;
    this.heat = Math.min(100, this.heat + 28);
    this.enemyHp = Math.max(0, this.enemyHp - damage);
    this.dialogue.set(`GADGET / 油圧パイルを射出。${damage} DAMAGE。\n残りチャージ ${this.gadgetCharges}。`);
    this.hitEffect(damage);
    this.refresh();
    if (this.enemyHp <= 0) this.win();
    else this.enemyTurn();
  }

  private tune() {
    if (this.ended || this.busy) return;
    this.setActionsEnabled(false);
    const cooled = Math.min(45, this.heat);
    this.heat -= cooled;
    this.tuned = true;
    this.gadgetBoosted = true;
    this.dialogue.set(`TUNE / 冷却弁を開放。HEAT -${cooled}。\n次のGADGETを強化。敵の次の攻撃も半減する。`, 'ash');
    this.refresh();
    this.enemyTurn();
  }

  private enemyTurn() {
    const enemy = ENEMIES[this.enemyId];
    if (GameState.data.chapter0.azamiRecruited) {
      if (GameState.data.hp <= Math.ceil(GameState.data.maxHp * 0.4)) {
        const healed = Math.min(12, GameState.data.maxHp - GameState.data.hp);
        GameState.data.hp += healed;
        this.dialogue.set(`アザミの援護 / 応急修理。ASHのHPを ${healed} 回復。`, 'azami');
        this.refresh();
      } else {
        const supportDamage = this.enemyId === 'factory-core' ? 12 : 9;
        this.enemyHp = Math.max(0, this.enemyHp - supportDamage);
        this.dialogue.set(`アザミの援護 / 敵の継ぎ目を撃つ。${supportDamage} DAMAGE。`, 'azami');
        this.hitEffect(supportDamage);
        this.refresh();
        if (this.enemyHp <= 0) {
          this.win();
          return;
        }
      }
    }
    const rolledDamage = Phaser.Math.Between(this.enemyAttackMin, this.enemyAttackMax);
    const damage = this.tuned ? Math.ceil(rolledDamage / 2) : rolledDamage;
    this.tuned = false;
    this.time.delayedCall(260, () => {
      this.dialogue.set(`${enemy.name} の反撃。${damage} DAMAGE。`);
      this.cameras.main.shake(150, 0.003);
      this.tweens.add({ targets: this.enemyArt, x: 285, duration: 90, yoyo: true, repeat: 1, ease: 'Sine.inOut' });
      this.time.delayedCall(260, () => {
        GameState.data.hp = Math.max(0, GameState.data.hp - damage);
        if (this.heat >= 100) {
          GameState.data.hp = Math.max(0, GameState.data.hp - 8);
          this.heat = 65;
          this.dialogue.set(`HEAT OVERLOAD。追加で8 DAMAGE。\n排熱が破損する前にTUNEしよう。`);
        }
        GameState.save();
        this.refresh();
        if (GameState.data.hp <= 0) this.defeat();
        else this.setActionsEnabled(true);
      });
    });
  }

  private hitEffect(damage: number) {
    this.cameras.main.shake(110, 0.0025);
    this.tweens.add({ targets: this.enemyArt, scale: 0.94, duration: 65, yoyo: true, repeat: 1, onStart: () => this.enemyArt.setTint(0xffd2ad), onComplete: () => this.enemyArt.clearTint() });
    const pop = this.add.text(270, 200, `-${damage}`, {
      fontFamily: 'monospace', fontSize: '28px', color: '#fff0d9', stroke: '#5b1f16', strokeThickness: 5
    }).setOrigin(.5).setDepth(20);
    this.tweens.add({ targets: pop, y: 160, alpha: 0, duration: 650, onComplete: () => pop.destroy() });
  }

  private win() {
    this.ended = true;
    this.setActionsEnabled(false);
    const enemy = ENEMIES[this.enemyId];
    GameState.data.scrap += enemy.rewardScrap;
    GameState.data.inventory[enemy.rewardItem] = (GameState.data.inventory[enemy.rewardItem] ?? 0) + 1;
    if (this.enemyId === 'scrap-hound') GameState.data.chapter0.houndDefeated = true;
    else GameState.data.chapter0.factoryBossDefeated = true;
    const exp = this.enemyId === 'factory-core' ? 42 : 26;
    const levels = GameState.gainExp(exp);
    GameState.save();
    this.dialogue.set(`${enemy.name} を停止。\n${enemy.victory}\n${enemy.rewardItem} +1 / SCRAP +${enemy.rewardScrap} / EXP +${exp}${levels.length ? `\nASH Lv.${levels[levels.length - 1]} / FORCE +1 / HP上限 +8` : ''}`);
    this.cameras.main.flash(260, 221, 163, 96);
    this.refresh();
    const destination = this.enemyId === 'factory-core' ? 'Explore' : 'Hub';
    this.time.delayedCall(1600, () => this.scene.start(destination, { location: 'Factory' }));
  }

  private defeat() {
    this.ended = true;
    this.setActionsEnabled(false);
    GameState.data.hp = GameState.data.maxHp;
    GameState.save();
    this.dialogue.set('ASHは工房へ運び戻された。\n拾った部品は失わずに済んだ。装備を整えて再挑戦しよう。');
    this.time.delayedCall(1400, () => this.scene.start('Hub'));
  }

  private retreat() {
    if (this.busy || this.ended) return;
    this.setActionsEnabled(false);
    const location = this.enemyId === 'factory-core' ? 'Factory' : 'Scrapyard';
    this.scene.start('Explore', { location });
  }

  private refresh() {
    const azamiIntent = GameState.data.hp <= Math.ceil(GameState.data.maxHp * 0.4) ? 'REPAIR' : 'STRIKE';
    this.forecastText?.setText(GameState.data.chapter0.azamiRecruited
      ? `行動順   ASH → AZAMI / ${azamiIntent} → 敵   ·   敵威力 ${this.enemyAttackMin}–${this.enemyAttackMax}`
      : `ENEMY DAMAGE ${this.enemyAttackMin}–${this.enemyAttackMax}`);
    this.enemyHpText.setText(`${ENEMIES[this.enemyId].name}   ${this.enemyHp} / ${ENEMIES[this.enemyId].hp} HP`);
    this.playerHpText.setText(`ASH HP   ${GameState.data.hp} / ${GameState.data.maxHp}`);
    this.heatText.setText(`HEAT   ${this.heat} / 100`);
    this.enemyHpBar.width = 426 * (this.enemyHp / ENEMIES[this.enemyId].hp);
    this.playerHpBar.width = 426 * (GameState.data.hp / GameState.data.maxHp);
    this.heatBar.width = Math.max(4, 426 * (this.heat / 100));
    this.gadgetButton?.heading.setText(`GADGET ×${this.gadgetCharges}`);
    this.gadgetButton?.setEnabled(this.gadgetCharges > 0 && !this.busy && !this.ended);
  }

  private setActionsEnabled(enabled: boolean) {
    this.busy = !enabled;
    for (const button of this.actionButtons) {
      const isGadget = button === this.gadgetButton;
      button.setEnabled(enabled && !this.ended && (!isGadget || this.gadgetCharges > 0));
    }
  }

  private hasPile() { return GameState.data.crafted.includes('PILE-01'); }
}
