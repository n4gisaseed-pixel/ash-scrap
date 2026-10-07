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
}

export function addCommandButton(scene: Phaser.Scene, options: CommandButtonOptions) {
  const { x, y, title, subtitle, onPress, enabled = true, width = 450, height = 82 } = options;
  const color = enabled ? 0x30241c : 0x211d19;
  const border = enabled ? 0x8a6544 : 0x51463c;
  const background = scene.add.rectangle(x, y, width, height, color).setStrokeStyle(2, border);
  const heading = scene.add.text(x - width / 2 + 22, y - 19, title, {
    fontFamily: '"Noto Sans JP", sans-serif', fontSize: '21px', color: enabled ? '#f2dfc7' : '#81796f'
  });
  const detail = scene.add.text(x - width / 2 + 22, y + 11, subtitle, {
    fontFamily: '"Noto Sans JP", sans-serif', fontSize: '13px', color: enabled ? '#a68a72' : '#6e655b'
  });

  if (enabled) {
    background.setInteractive({ useHandCursor: true });
    background.on('pointerdown', () => {
      background.setFillStyle(0x5a3925);
      scene.time.delayedCall(70, onPress);
    });
  }
  return { background, heading, detail };
}
