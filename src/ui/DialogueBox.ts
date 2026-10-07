import Phaser from 'phaser';

export function addDialogueBox(scene: Phaser.Scene, y = 500, height = 128) {
  const background = scene.add.rectangle(270, y, 470, height, 0x12100e, 0.96).setStrokeStyle(2, 0x8b694b);
  const portraitCard = scene.add.rectangle(96, y, 96, height - 22, 0x1c1712).setStrokeStyle(2, 0x886548).setVisible(false);
  const portrait = scene.add.image(96, y, 'character-portraits', 'ash').setDisplaySize(92, height - 26).setVisible(false);
  const text = scene.add.text(51, y - height / 2 + 17, '', {
    fontFamily: '"Noto Sans JP", sans-serif', fontSize: '19px', color: '#f1e6d7',
    wordWrap: { width: 438 }, lineSpacing: 4
  });
  return {
    background,
    text,
    set(value: string, speaker?: 'ash' | 'mina') {
      text.setFontSize(speaker
        ? (value.length > 84 ? '15px' : value.length > 60 ? '16px' : '18px')
        : (value.length > 92 ? '16px' : value.length > 68 ? '17px' : '19px'));
      if (speaker) {
        portrait.setFrame(speaker).setVisible(true);
        portraitCard.setVisible(true);
        text.setX(158);
        text.setWordWrapWidth(322);
      } else {
        portrait.setVisible(false);
        portraitCard.setVisible(false);
        text.setX(51);
        text.setWordWrapWidth(438);
      }
      text.setText(value);
    }
  };
}
