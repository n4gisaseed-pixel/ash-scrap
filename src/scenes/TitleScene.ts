import Phaser from 'phaser';
import { GameState } from '../state/GameState';
import { addCommandButton } from '../ui/CommandButton';
import { addArtPanel } from '../ui/ArtPanel';

export class TitleScene extends Phaser.Scene {
  constructor() { super('Title'); }

  preload() {
    this.load.spritesheet('chapter0-art', 'assets/chapter0-atlas.webp', { frameWidth: 512, frameHeight: 512 });
    this.load.image('character-portraits', 'assets/character-portraits.webp');
    this.load.image('luka-portrait', 'assets/luka-portrait.webp');
    this.load.spritesheet('combat-icons', 'assets/combat-icons.webp', { frameWidth: 627, frameHeight: 627 });
  }

  create() {
    const portraits = this.textures.get('character-portraits');
    portraits.add('ash', 0, 0, 0, 887, 887);
    portraits.add('mina', 0, 887, 0, 887, 887);
    const width = 540;
    const height = 960;
    this.cameras.main.setBackgroundColor('#0d0b09');
    addArtPanel(this, 0, width / 2, height / 2, width, height, 0.5, 0.5);
    this.add.rectangle(width / 2, height / 2, width, height, 0x090705, 0.48);
    for (let i = 0; i < 32; i++) {
      this.add.circle(Phaser.Math.Between(0, width), Phaser.Math.Between(0, height), Phaser.Math.Between(1, 2), 0xd99a5f, Phaser.Math.FloatBetween(.08, .28));
    }

    this.add.text(width / 2, 220, 'ASH / SCRAP', {
      fontFamily: 'monospace', fontSize: '54px', color: '#fff1df', fontStyle: 'bold', stroke: '#241a14', strokeThickness: 8
    }).setOrigin(.5);
    this.add.text(width / 2, 280, 'NON-FIELD JUNKPUNK RPG', { fontFamily: 'monospace', fontSize: '17px', color: '#d7b18b' }).setOrigin(.5);

    this.add.rectangle(width / 2, 455, 448, 180, 0x120e0b, 0.8).setStrokeStyle(2, 0x9d704c, 0.85);
    this.add.text(width / 2, 427, '「捨てられたものに、\nもう一度、生きる理由を。」', {
      fontFamily: '"Noto Sans JP", sans-serif', fontSize: '18px', color: '#f0dfca', align: 'center', lineSpacing: 8
    }).setOrigin(.5);
    this.add.text(width / 2, 508, 'CHAPTER 0  ·  THE FIRST REPAIR', {
      fontFamily: 'monospace', fontSize: '11px', color: '#d0a578'
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
