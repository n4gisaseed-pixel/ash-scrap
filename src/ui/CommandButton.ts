import Phaser from 'phaser';
import { wrapForJapanese } from './DialogueBox';

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
  const compact = width < 280;
  const inset = icon === undefined ? 20 : 66;
  const textWidth = Math.max(80, width - (icon === undefined ? 40 : 88));
  const background = scene.add.rectangle(x, y, width, height, 0x263136)
    .setStrokeStyle(2, 0x728992);
  if (icon !== undefined) scene.add.image(x - width / 2 + 42, y, 'combat-icons', icon).setDisplaySize(42, 42);

  const heading = scene.add.text(x - width / 2 + inset, y - height / 2 + 7, '', {
    fontFamily: '"Noto Sans JP", sans-serif', fontSize: compact ? '18px' : (title.length > 23 ? '19px' : '23px'),
    color: '#f4f2e9', lineSpacing: 0
  });
  let headingSize = compact ? 18 : (title.length > 23 ? 19 : 23);
  heading.setText(wrapForJapanese(title, textWidth, headingSize));
  while (heading.height > Math.min(32, height * .44) && headingSize > 15) {
    headingSize -= 1;
    heading.setFontSize(headingSize);
    heading.setText(wrapForJapanese(title, textWidth, headingSize));
  }

  const detailY = heading.y + heading.height + 1;
  const detail = scene.add.text(x - width / 2 + inset, detailY, '', {
    fontFamily: '"Noto Sans JP", sans-serif', fontSize: compact ? '12px' : '14px', color: '#c4d0d1',
    lineSpacing: 0
  });
  const detailBottom = y + height / 2 - 5;
  let detailSize = compact ? 12 : 14;
  detail.setText(wrapForJapanese(subtitle, textWidth, detailSize));
  while (detail.y + detail.height > detailBottom && detailSize > 11) {
    detailSize -= 1;
    detail.setFontSize(detailSize);
    detail.setText(wrapForJapanese(subtitle, textWidth, detailSize));
  }

  let isEnabled = false;
  let isPressing = false;
  background.on('pointerdown', () => {
    if (!isEnabled || isPressing) return;
    isPressing = true;
    background.setFillStyle(0x3a5962);
    scene.time.delayedCall(90, () => {
      background.setFillStyle(isEnabled ? 0x263136 : 0x202426);
      if (isEnabled) onPress();
    });
    scene.time.delayedCall(360, () => { isPressing = false; });
  });

  const setEnabled = (next: boolean) => {
    isEnabled = next;
    if (next) {
      background.setInteractive({ useHandCursor: true }).setFillStyle(0x263136).setStrokeStyle(2, 0x728992);
      heading.setColor('#f4f2e9');
      detail.setColor('#c4d0d1');
    } else {
      background.disableInteractive().setFillStyle(0x202426).setStrokeStyle(2, 0x4d5a5e);
      heading.setColor('#a7b0af');
      detail.setColor('#8d999a');
    }
  };
  setEnabled(enabled);
  return { background, heading, detail, setEnabled };
}
