import Phaser from 'phaser';
import { GameState } from '../state/GameState';
import { addCommandButton } from '../ui/CommandButton';

export class TitleScene extends Phaser.Scene {
  constructor() { super('Title'); }

  create() {
    const width = 540;
    const height = 960;
    this.cameras.main.setBackgroundColor('#0d0b09');
    this.add.rectangle(width / 2, height / 2, width, height, 0x0d0b09);
    for (let i = 0; i < 42; i++) {
      this.add.circle(Phaser.Math.Between(0, width), Phaser.Math.Between(0, height), Phaser.Math.Between(1, 3), 0x8d6241, Phaser.Math.FloatBetween(.06, .24));
    }

    this.add.text(width / 2, 220, 'ASH / SCRAP', {
      fontFamily: 'monospace', fontSize: '48px', color: '#eadfce', fontStyle: 'bold', stroke: '#241a14', strokeThickness: 8
    }).setOrigin(.5);
    this.add.text(width / 2, 280, 'NON-FIELD JUNKPUNK RPG', { fontFamily: 'monospace', fontSize: '14px', color: '#9f8064' }).setOrigin(.5);

    this.add.rectangle(width / 2, 430, 380, 220, 0x1d1814).setStrokeStyle(3, 0x5d4734);
    this.add.text(width / 2, 385, 'ASH', { fontFamily: 'monospace', fontSize: '40px', color: '#d8d1c6' }).setOrigin(.5);
    this.add.text(width / 2, 450, '「捨てられたものに、\nもう一度、生きる理由を。」', {
      fontFamily: '"Noto Sans JP", sans-serif', fontSize: '19px', color: '#c99a66', align: 'center', lineSpacing: 10
    }).setOrigin(.5);
    this.add.text(width / 2, 585, 'CHAPTER 0 / THE FIRST REPAIR', {
      fontFamily: 'monospace', fontSize: '13px', color: '#8c735c'
    }).setOrigin(.5);

    addCommandButton(this, {
      x: width / 2, y: 690, title: 'CONTINUE', subtitle: '工房から再開する',
      onPress: () => this.scene.start('Hub')
    });
    addCommandButton(this, {
      x: width / 2, y: 800, title: 'NEW GAME', subtitle: 'セーブデータを初期化して始める',
      onPress: () => {
        GameState.reset();
        this.scene.start('Hub');
      }
    });
    this.add.text(width / 2, 900, 'TAP TO SELECT', { fontFamily: 'monospace', fontSize: '12px', color: '#746252' }).setOrigin(.5);
  }
}
