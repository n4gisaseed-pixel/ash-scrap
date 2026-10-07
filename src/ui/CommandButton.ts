import Phaser from 'phaser';

export interface CommandButtonOptions {
  x: number;
  y: number;
  title: string;
  subtitle: string;
  onPress: () => void;
  enabled?: boolean;
  width?: number;
  height?: number;
  icon?: 0 | 1 | 2 | 3;
}

export function addCommandButton(scene: Phaser.Scene, options: CommandButtonOptions) {
  const { x, y, title, subtitle, onPress, enabled = true, width = 450, height = 82, icon } = options;
  let isEnabled = enabled;
  const background = scene.add.rectangle(x, y, width, height, 0x30241c).setStrokeStyle(2, 0x8a6544);
  const contentX = x - width / 2 + (icon === undefined ? 22 : 66);
  if (icon !== undefined) scene.add.image(x - width / 2 + 42, y, 'combat-icons', icon).setDisplaySize(44, 44);
  const heading = scene.add.text(contentX, y - 22, title, {
    fontFamily: '"Noto Sans JP", sans-serif', fontSize: width < 300 ? (title.length > 14 ? '17px' : '22px') : (title.length > 23 ? '18px' : '24px'),
    color: '#f2dfc7', wordWrap: { width: width - (icon === undefined ? 44 : 88) }
  });
  const detail = scene.add.text(contentX, y + 10, subtitle, {
    fontFamily: '"Noto Sans JP", sans-serif', fontSize: width < 300 ? '13px' : '15px', color: '#a68a72',
    wordWrap: { width: width - (icon === undefined ? 44 : 88) }, lineSpacing: 1
  });

  background.on('pointerdown', () => {
    if (!isEnabled) return;
    background.setFillStyle(0x5a3925);
    scene.time.delayedCall(70, () => { if (isEnabled) onPress(); });
  });
  const setEnabled = (next: boolean) => {
    isEnabled = next;
    if (next) {
      background.setInteractive({ useHandCursor: true }).setFillStyle(0x30241c).setStrokeStyle(2, 0x8a6544);
      heading.setColor('#f2dfc7');
      detail.setColor('#a68a72');
    } else {
      background.disableInteractive().setFillStyle(0x211d19).setStrokeStyle(2, 0x51463c);
      heading.setColor('#81796f');
      detail.setColor('#6e655b');
    }
  };
  if (enabled) {
    background.setInteractive({ useHandCursor: true });
  } else {
    setEnabled(false);
  }
  return { background, heading, detail, setEnabled };
}
