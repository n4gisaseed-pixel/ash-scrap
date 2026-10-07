import Phaser from 'phaser';
import { GameState } from '../state/GameState';
import { addCommandButton } from '../ui/CommandButton';

export class TitleScene extends Phaser.Scene {
  constructor() { super('Title'); }

  preload() {
    this.load.image('world-key-art', 'assets/world-key-art.webp');
    this.load.spritesheet('chapter0-art', 'assets/chapter0-atlas.webp', { frameWidth: 512, frameHeight: 512 });
    this.load.image('character-portraits', 'assets/character-portraits.webp');
    this.load.image('azami-portrait', 'assets/azami-portrait.webp');
    this.load.image('azami-map', 'assets/azami-map.webp');
    this.load.spritesheet('combat-icons', 'assets/combat-icons.webp', { frameWidth: 627, frameHeight: 627 });
  }

  create() {
    const portraits = this.textures.get('character-portraits');
    portraits.add('ash', 0, 0, 0, 887, 887);
    portraits.add('mina', 0, 887, 0, 887, 887);
    const width = 540;
    const height = 960;
    this.cameras.main.setBackgroundColor('#0d0b09');
    this.add.image(width / 2, height / 2, 'world-key-art').setDisplaySize(width, height);
    this.add.rectangle(width / 2, height / 2, width, height, 0x090705, 0.28);
    for (let i = 0; i < 32; i++) {
      this.add.circle(Phaser.Math.Between(0, width), Phaser.Math.Between(0, height), Phaser.Math.Between(1, 2), 0xd99a5f, Phaser.Math.FloatBetween(.08, .28));
    }

    this.add.text(width / 2, 198, '救われた後のセカイ', {
      fontFamily: '"Noto Sans JP", sans-serif', fontSize: '34px', color: '#fff1df', fontStyle: 'bold', stroke: '#241a14', strokeThickness: 8
    }).setOrigin(.5);
    this.add.text(width / 2, 249, 'AFTER THE CLEAR  /  ASH & AZAMI', { fontFamily: 'monospace', fontSize: '13px', color: '#d7b18b' }).setOrigin(.5);

    this.add.rectangle(width / 2, 352, 448, 114, 0x120e0b, 0.76).setStrokeStyle(2, 0x9d704c, 0.85);
    this.add.text(width / 2, 341, '魔王が倒されて、七年。\nそれでも世界は、まだ直りきっていない。', {
      fontFamily: '"Noto Sans JP", sans-serif', fontSize: '17px', color: '#f0dfca', align: 'center', lineSpacing: 5
    }).setOrigin(.5);
    this.add.text(width / 2, 400, 'PROLOGUE  ·  THE MAP AFTER THE END', {
      fontFamily: 'monospace', fontSize: '10px', color: '#d0a578'
    }).setOrigin(.5);

    addCommandButton(this, {
      x: width / 2, y: 744, title: 'CONTINUE', subtitle: '旅を続ける',
      onPress: () => this.scene.start('Hub')
    });
    addCommandButton(this, {
      x: width / 2, y: 846, title: 'NEW GAME', subtitle: '新たな旅を始める',
      onPress: () => {
        GameState.reset();
        this.scene.start('Hub');
      }
    });
    this.add.text(width / 2, 926, 'TAP TO SELECT', { fontFamily: 'monospace', fontSize: '11px', color: '#d2c2b1' }).setOrigin(.5);
  }
}
