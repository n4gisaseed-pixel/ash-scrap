import Phaser from 'phaser';

export type DialogueSpeaker = 'ash' | 'mina' | 'azami' | 'narrator';
export type DialogueKind = 'dialogue' | 'result';
export type DialogueExpression = 'neutral' | 'amused' | 'determined' | 'surprised' | 'joyful' | 'worried';
export interface StandeePlacement {
  x: number;
  bottom: number;
  height: number;
  width?: number;
}

const SPEAKER_LABELS: Record<DialogueSpeaker, string> = {
  ash: 'アッシュ',
  mina: 'ミナ',
  azami: 'アザミ',
  narrator: '旅の記録'
};
const STANDEE_TEXTURES: Record<DialogueSpeaker, Record<DialogueExpression, string> | string> = {
  ash: {
    neutral: 'ash-neutral', amused: 'ash-amused', determined: 'ash-determined',
    surprised: 'ash-surprised', joyful: 'ash-amused', worried: 'ash-neutral'
  },
  mina: {
    neutral: 'mina-neutral', amused: 'mina-smile', determined: 'mina-determined',
    surprised: 'mina-neutral', joyful: 'mina-smile', worried: 'mina-worried'
  },
  azami: {
    neutral: 'azami-neutral', amused: 'azami-joyful', determined: 'azami-determined',
    surprised: 'azami-joyful', joyful: 'azami-joyful', worried: 'azami-worried'
  },
  narrator: {
    neutral: 'ash-neutral', amused: 'ash-amused', determined: 'ash-determined',
    surprised: 'ash-surprised', joyful: 'ash-amused', worried: 'ash-neutral'
  }
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

/** A full-width scenario window paired with a bust-up character portrait. */
export function addDialogueBox(
  scene: Phaser.Scene,
  y = 500,
  height = 128,
  placement?: StandeePlacement
) {
  const width = 480;
  const top = y - height / 2;
  const actor = placement
    ? scene.add.image(placement.x, placement.bottom, 'ash-neutral')
      .setOrigin(.5, 1)
      .setDisplaySize(placement.width ?? placement.height, placement.height)
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
  const resultPlate = scene.add.rectangle(454, top + 23, 72, 25, 0x453622)
    .setStrokeStyle(1, 0xd5aa68).setDepth(6).setVisible(false);
  const resultLabel = scene.add.text(454, top + 23, 'RESULT', {
    fontFamily: 'monospace', fontSize: '12px', color: '#f0d49a', fontStyle: 'bold'
  }).setOrigin(.5).setDepth(7).setVisible(false);
  const text = scene.add.text(48, top + 42, '', {
    fontFamily: '"Noto Sans JP", sans-serif', fontSize: '19px', color: '#f7f3e9',
    lineSpacing: 4
  }).setDepth(7);
  let typingEvent: Phaser.Time.TimerEvent | null = null;
  let isTyping = false;
  let fullText = '';

  const finishTyping = () => {
    typingEvent?.remove(false);
    typingEvent = null;
    isTyping = false;
    text.setText(fullText);
  };

  const dialogueBox = {
    background,
    text,
    set(value: string, speaker?: DialogueSpeaker, kind: DialogueKind = 'dialogue', animate = false, expression: DialogueExpression = 'neutral') {
      typingEvent?.remove(false);
      typingEvent = null;
      isTyping = false;
      const activeSpeaker = speaker ?? 'ash';
      const isResult = kind === 'result';
      speakerName.setText(SPEAKER_LABELS[activeSpeaker]);
      resultPlate.setVisible(isResult);
      resultLabel.setVisible(isResult);
      if (actor) {
        const textures = STANDEE_TEXTURES[activeSpeaker];
        const targetTexture = typeof textures === 'string' ? textures : textures[expression];
        if (actor.texture.key !== targetTexture) {
          actor.setAlpha(0);
          actor.setTexture(targetTexture);
          scene.tweens.add({ targets: actor, alpha: 1, duration: 180, ease: 'Sine.out' });
        }
        if (placement) {
          const widthForPortrait = placement.width ?? placement.height;
          actor.setDisplaySize(widthForPortrait, placement.height);
        }
        actor.setVisible(true);
      }
      const maxHeight = height - 58;
      let fontSize = 18;
      fullText = wrapForJapanese(value, 444, fontSize);
      text.setFontSize(fontSize);
      text.setText(fullText);
      while (text.height > maxHeight && fontSize > 14) {
        fontSize -= 1;
        text.setFontSize(fontSize);
        fullText = wrapForJapanese(value, 444, fontSize);
        text.setText(fullText);
      }
      if (animate) {
        const characters = Array.from(fullText);
        text.setText('');
        isTyping = true;
        let visible = 0;
        typingEvent = scene.time.addEvent({
          delay: 24,
          loop: true,
          callback: () => {
            visible += 1;
            text.setText(characters.slice(0, visible).join(''));
            if (visible >= characters.length) finishTyping();
          }
        });
      }
      background.setStrokeStyle(2, isResult ? 0xd5aa68 : 0x78939b);
      topRule.setFillStyle(isResult ? 0xd5aa68 : activeSpeaker === 'azami' ? 0x64a8c0 : activeSpeaker === 'mina' ? 0xc98e5f : 0x9d7660);
      speakerPlate.setFillStyle(activeSpeaker === 'azami' ? 0x203a46 : activeSpeaker === 'mina' ? 0x493425 : 0x382b27);
    },
    isTyping: () => isTyping,
    finish: finishTyping
  };
  scene.data.set('activeDialogueBox', dialogueBox);
  return dialogueBox;
}
