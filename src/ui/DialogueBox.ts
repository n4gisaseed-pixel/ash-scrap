import Phaser from 'phaser';

export function addDialogueBox(scene: Phaser.Scene, y = 500, height = 128) {
  const background = scene.add.rectangle(270, y, 470, height, 0x171411).setStrokeStyle(2, 0x514236);
  const text = scene.add.text(54, y - height / 2 + 20, '', {
    fontFamily: '"Noto Sans JP", sans-serif', fontSize: '17px', color: '#eee3d4',
    wordWrap: { width: 430 }, lineSpacing: 6
  });
  return {
    background,
    text,
    set(value: string) { text.setText(value); }
  };
}
