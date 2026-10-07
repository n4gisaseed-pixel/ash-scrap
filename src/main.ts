import Phaser from 'phaser';
import './style.css';
import { TitleScene } from './scenes/TitleScene';
import { HubScene } from './scenes/HubScene';
import { ExploreScene } from './scenes/ExploreScene';
import { BattleScene } from './scenes/BattleScene';
import { GameState } from './state/GameState';

GameState.load();

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 540,
  height: 960,
  backgroundColor: '#11100e',
  pixelArt: false,
  antialias: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [TitleScene, HubScene, ExploreScene, BattleScene]
});
