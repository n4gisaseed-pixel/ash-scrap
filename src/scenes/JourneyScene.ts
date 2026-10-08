import Phaser from 'phaser';
import { getRegion, REGIONS, type RegionId } from '../data/regions';
import { GameState } from '../state/GameState';
import { addCommandButton } from '../ui/CommandButton';
import { addDialogueBox, type DialogueSpeaker } from '../ui/DialogueBox';

type JourneyAction = 'scout' | 'salvage' | 'repair';

export class JourneyScene extends Phaser.Scene {
  private regionId: RegionId = 'whitewood';
  private result: string | null = null;
  private dialogue!: ReturnType<typeof addDialogueBox>;
  private ash!: Phaser.GameObjects.Image;
  private azami!: Phaser.GameObjects.Image;

  constructor() { super('Journey'); }

  init(data: { regionId?: RegionId; result?: string; resultSpeaker?: DialogueSpeaker }) {
    const campaign = GameState.data.campaign;
    this.regionId = data.regionId ?? campaign.activeRegion ?? REGIONS[campaign.unlockedRegion]?.id ?? 'whitewood';
    this.result = data.result ?? null;
    if (campaign.activeRegion !== this.regionId) {
      campaign.activeRegion = this.regionId;
      campaign.regionActions = 0;
      campaign.regionInsight = 0;
      GameState.data.week = 1;
      GameState.save();
    }
  }

  create(data: { resultSpeaker?: DialogueSpeaker }) {
    const region = getRegion(this.regionId);
    const campaign = GameState.data.campaign;
    this.cameras.main.setBackgroundColor('#111519');
    this.add.image(270, 480, region.background).setDisplaySize(540, 960).setDepth(0);
    this.add.rectangle(270, 480, 540, 960, 0x080d12, .52).setDepth(1);
    this.add.rectangle(270, 480, 516, 948, 0xffffff, 0).setStrokeStyle(2, 0x8aa0a3).setDepth(11);
    this.add.text(28, 20, `${region.chapter}  /  THE MAP AFTER THE END`, {
      fontFamily: 'monospace', fontSize: '12px', color: '#e0bd8d'
    }).setDepth(12);
    this.add.text(28, 48, region.name, {
      fontFamily: '"Noto Sans JP", sans-serif', fontSize: '27px', color: '#fff5e7', fontStyle: 'bold'
    }).setDepth(12);
    this.add.text(30, 84, `${region.core}     第 ${GameState.data.week} 週 / 12`, {
      fontFamily: 'monospace', fontSize: '12px', color: '#c2d5d4'
    }).setDepth(12);
    this.add.text(510, 84, `HP ${GameState.data.hp}/${GameState.data.maxHp} · TRACE ${campaign.regionInsight} · PILE +${GameState.data.weaponLevel}`, {
      fontFamily: 'monospace', fontSize: '11px', color: '#f4d6b4'
    }).setOrigin(1, 0).setDepth(12);
    this.drawProgress(campaign.regionActions);

    this.ash = this.add.image(152, 585, 'ash-neutral').setOrigin(.5, 1).setDisplaySize(250, 316).setDepth(3);
    this.azami = this.add.image(403, 585, 'azami-neutral').setOrigin(.5, 1).setDisplaySize(250, 316).setDepth(3);
    this.add.rectangle(270, 562, 500, 120, 0x101518, .68).setDepth(4);
    this.dialogue = addDialogueBox(this, 641, 136);
    const speaker = data.resultSpeaker ?? 'azami';
    this.dialogue.set(this.result ?? `${region.subtitle}\n\n進行 ${campaign.regionActions}/6   ·   3行動ごとに物語が動く。`, speaker, this.result ? 'result' : 'dialogue', true);
    this.setSpeaker(speaker, speaker === 'azami' ? 'curious' : 'neutral');

    if (campaign.regionActions >= 6) {
      addCommandButton(this, {
        x: 270, y: 780, width: 468, height: 76,
        title: '守護機と向き合う', subtitle: '行動記録は完了 / 再挑戦',
        onPress: () => this.scene.start('Battle', { enemyId: region.guardian })
      });
      addCommandButton(this, {
        x: 270, y: 878, width: 468, height: 76,
        title: '地図へ戻る', subtitle: '工房で装備と回復を整える',
        onPress: () => this.scene.start('Hub')
      });
      return;
    }

    addCommandButton(this, {
      x: 270, y: 744, width: 468, height: 66,
      title: '地形と残された記録を読む', subtitle: '1行動 / 手がかり +1 / EXP +8',
      onPress: () => this.act('scout')
    });
    addCommandButton(this, {
      x: 270, y: 820, width: 468, height: 66,
      title: 'まだ使える部品を拾う', subtitle: `1行動 / ${region.material} +1 / SCRAP +4 / EXP +6`,
      onPress: () => this.act('salvage')
    });
    const materialCount = GameState.data.inventory[region.material] ?? 0;
    addCommandButton(this, {
      x: 270, y: 896, width: 468, height: 66,
      title: materialCount > 0 ? '拾った部品でPILE-01を調律' : '装備を点検して休む',
      subtitle: materialCount > 0 ? `${region.material} -1 / 武器強度 +1 / HP +10` : '1行動 / HP +14 / 足場と仕組みを理解する',
      onPress: () => this.act('repair')
    });
    addCommandButton(this, {
      x: 461, y: 48, width: 118, height: 46, title: '地図へ戻る', subtitle: '',
      onPress: () => this.scene.start('Hub')
    });
    this.tweens.add({ targets: [this.ash, this.azami], y: 579, duration: 1700, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }

  private drawProgress(actions: number) {
    this.add.rectangle(270, 112, 480, 8, 0x162126).setStrokeStyle(1, 0x8a9e9a).setDepth(12);
    this.add.rectangle(30, 112, 480 * Math.min(1, actions / 6), 4, 0x9eb99c).setOrigin(0, .5).setDepth(13);
    for (let i = 1; i <= 6; i++) {
      const x = 30 + 480 * i / 6;
      this.add.circle(x, 112, 6, i <= actions ? 0xe2c286 : 0x28373a).setStrokeStyle(1, 0x101719).setDepth(14);
    }
  }

  private setSpeaker(speaker: DialogueSpeaker, expression: 'neutral' | 'curious') {
    const isAzami = speaker === 'azami';
    const isAsh = speaker === 'ash';
    const isMina = speaker === 'mina';
    this.ash.setTexture(isAsh || (!isAzami && !isMina) ? (isAsh ? 'ash-determined' : 'ash-neutral') : 'ash-neutral');
    this.azami.setTexture(isMina ? 'mina-neutral' : expression === 'curious' ? 'azami-joyful' : 'azami-neutral');
    this.ash.setAlpha(isAsh ? 1 : .66);
    this.azami.setAlpha(isAzami || isMina ? 1 : .66);
  }

  private act(action: JourneyAction) {
    const campaign = GameState.data.campaign;
    const region = getRegion(this.regionId);
    if (action === 'scout') {
      campaign.regionInsight += 1;
      GameState.gainExp(8);
      this.result = `${region.trace}\n手がかり ${campaign.regionInsight} / EXP +8`;
    } else if (action === 'salvage') {
      GameState.data.inventory[region.material] = (GameState.data.inventory[region.material] ?? 0) + 1;
      GameState.data.scrap += 4;
      GameState.gainExp(6);
      this.result = `${region.salvage}\n${region.material} +1 / SCRAP +4 / EXP +6`;
    } else {
      const materialCount = GameState.data.inventory[region.material] ?? 0;
      if (materialCount > 0) {
        GameState.data.inventory[region.material] -= 1;
        GameState.data.weaponLevel += 1;
        const healed = Math.min(10, GameState.data.maxHp - GameState.data.hp);
        GameState.data.hp += healed;
        this.result = `${region.material}をPILE-01の軸に組み直した。\n武器強度 +1 / HP +${healed}`;
      } else {
        const healed = Math.min(14, GameState.data.maxHp - GameState.data.hp);
        GameState.data.hp += healed;
        campaign.regionInsight += 1;
        GameState.gainExp(8);
        this.result = `壊れた設備の仕組みを調べ、休息をとった。\nHP +${healed} / 手がかり +1 / EXP +8`;
      }
    }
    campaign.regionActions += 1;
    GameState.data.week += 1;
    GameState.save();

    if (campaign.regionActions === 3) {
      this.scene.start('Story', { sequence: 'region-mid', regionId: this.regionId });
      return;
    }
    if (campaign.regionActions >= 6) {
      this.scene.start('Story', { sequence: 'region-boss', regionId: this.regionId });
      return;
    }
    this.scene.restart({ regionId: this.regionId, result: this.result, resultSpeaker: action === 'scout' ? 'azami' : 'ash' });
  }
}
