import Phaser from 'phaser';
import './style.css';
import { TitleScene } from './scenes/TitleScene';
import { WorkshopScene } from './scenes/WorkshopScene';

new Phaser.Game({
 type: Phaser.AUTO,
 parent: 'game',
 width: 960,
 height: 540,
 backgroundColor: '#11100e',
 pixelArt: true,
 physics: { default: 'arcade', arcade: { debug: false } },
 scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
 scene: [TitleScene, WorkshopScene]
});