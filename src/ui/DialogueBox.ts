import Phaser from 'phaser';

export type DialogueSpeaker = 'ash' | 'mina' | 'azami';
export interface StandeePlacement {
  x: number;
  bottom: number;
  height: number;
}

const SPEAKER_LABELS: Record<DialogueSpeaker, string> = {
  ash: 'アッシュ',
  mina: 'ミナ',
  azami: 'アザミ'
};
const STANDEE_TEXTURES: Record<DialogueSpeaker, string> = {
  ash: 'ash-standee',
  mina: 'mina-standee',
  azami: 'azami-standee'
};

export function wrapForJapanese(text: string, maxWidth: number, fontSize: number) {
  return text.split('\n').map((paragraph) => {
    let line = '';
    let width = 0;
    const lines: string[] = [];
    for (const character of paragraph) {
      const code = character.codePointAt(0) ?? 0;
      const factor = character === ' ' ? .34 : code <= 0x7f ? .58 : 1;
      const advance = fontSize * factor;
      if (line && width + advance > maxWidth) {
        lines.push(line);
        line = '';
        width = 0;
      }
      line += character;
      width += advance;
    }
    lines.push(line);
    return lines.join('\n');
  }).join('\n');
}

/** A full-width scenario window paired with a reusable full-body stage character. */
export function addDialogueBox(
  scene: Phaser.Scene,
  y = 500,
  height = 128,
  placement?: StandeePlacement
) {
  const width = 480;
  const top = y - height / 2;
  const actor = placement
    ? scene.add.image(placement.x, placement.bottom, STANDEE_TEXTURES.ash)
      .setOrigin(.5, 1)
      .setDisplaySize(placement.height * .68, placement.height)
      .setDepth(2)
    : null;
  const background = scene.add.rectangle(270, y, width, height, 0x10171a, 0.97)
    .setStrokeStyle(2, 0x78939b);
  background.setDepth(5);
  const topRule = scene.add.rectangle(270, top + 3, width - 8, 3, 0x6da1ac).setDepth(6);
  const speakerPlate = scene.add.rectangle(86, top + 23, 96, 25, 0x293b40).setStrokeStyle(1, 0x7397a0).setDepth(6);
  const speakerName = scene.add.text(86, top + 23, '', {
    fontFamily: '"Noto Sans JP", sans-serif', fontSize: '14px', color: '#d8f0ee', fontStyle: 'bold'
  }).setOrigin(.5).setDepth(7);
  const text = scene.add.text(48, top + 42, '', {
    fontFamily: '"Noto Sans JP", sans-serif', fontSize: '19px', color: '#f7f3e9',
    lineSpacing: 4
  }).setDepth(7);

  return {
    background,
    text,
    set(value: string, speaker?: DialogueSpeaker) {
      const activeSpeaker = speaker ?? 'ash';
      speakerName.setText(SPEAKER_LABELS[activeSpeaker]);
      if (actor) {
        actor.setTexture(STANDEE_TEXTURES[activeSpeaker]);
        actor.setVisible(true);
      }
      const maxHeight = height - 58;
      let fontSize = 18;
      text.setFontSize(fontSize);
      text.setText(wrapForJapanese(value, 444, fontSize));
      while (text.height > maxHeight && fontSize > 14) {
        fontSize -= 1;
        text.setFontSize(fontSize);
        text.setText(wrapForJapanese(value, 444, fontSize));
      }
      topRule.setFillStyle(activeSpeaker === 'azami' ? 0x64a8c0 : activeSpeaker === 'mina' ? 0xc98e5f : 0x9d7660);
      speakerPlate.setFillStyle(activeSpeaker === 'azami' ? 0x203a46 : activeSpeaker === 'mina' ? 0x493425 : 0x382b27);
    }
  };
}
