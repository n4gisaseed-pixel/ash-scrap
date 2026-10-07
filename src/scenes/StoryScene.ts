import Phaser from 'phaser';
import { GameState } from '../state/GameState';
import { addDialogueBox, type DialogueExpression, type DialogueSpeaker } from '../ui/DialogueBox';
import { addArtPanel } from '../ui/ArtPanel';

type StorySequence = 'opening' | 'scrapyard-road' | 'azami-rescue' | 'town-arrival' | 'relay-return';
type Backdrop = 'workshop' | 'road' | 'scrapyard' | 'town' | 'rescue-cg';

interface StoryBeat {
  place: string;
  backdrop: Backdrop;
  speaker: DialogueSpeaker;
  line: string;
  expression?: DialogueExpression;
}

const STORY: Record<StorySequence, StoryBeat[]> = {
  opening: [
    { place: '工房・夜明け', backdrop: 'workshop', speaker: 'narrator', line: '魔王討伐から七年。雨漏りの音が、アッシュの工房の朝を告げる。バケツに溜まった水は、底に五滴。' },
    { place: '工房・夜明け', backdrop: 'workshop', speaker: 'ash', line: '五滴か。昨日より一滴多い。……上出来。', expression: 'amused' },
    { place: '工房・無線', backdrop: 'workshop', speaker: 'mina', line: 'アッシュ、聞こえる？ 鉄屑街のミナよ。熱管が止まって、共同釜の火が消えかけてる。' },
    { place: '工房・無線', backdrop: 'workshop', speaker: 'ash', line: 'また工場か。止めるだけでいいのか？', expression: 'worried' },
    { place: '工房・無線', backdrop: 'workshop', speaker: 'mina', line: '壊したら町の暖房まで止まる。圧力筒と歯車、それに焼けた銅線も要るの。' },
    { place: '工房・支度', backdrop: 'workshop', speaker: 'narrator', line: '無線はそこで途切れた。アッシュは工具を選び、空の水筒を腰に下げる。直す物があるなら、行く理由はそれで足りた。' },
    { place: '工房・支度', backdrop: 'workshop', speaker: 'ash', line: '日が暮れる前に廃材置き場へ着く。使える部品を拾って、戻る。それだけだ。', expression: 'determined' },
    { place: '旧線路へ', backdrop: 'road', speaker: 'narrator', line: '街を出ると、道はすぐに途切れた。地図に残る線路をたどり、アッシュは灰の降る橋へ向かう。' }
  ],
  'scrapyard-road': [
    { place: '旧線路・昼', backdrop: 'road', speaker: 'narrator', line: '鉄屑街から半日。旧線路は霧の裂け目で切れていた。橋の向こうに、旧軍施設の煙突が見える。' },
    { place: '旧線路・昼', backdrop: 'road', speaker: 'ash', line: '地図は橋の先まで続いてる。道だけが、先にあきらめたらしい。', expression: 'amused' },
    { place: '旧線路・夕', backdrop: 'road', speaker: 'narrator', line: '崩れた車輪のそばに、新しい足跡。枯れ枝には、青い布が結ばれていた。' },
    { place: '廃材置き場・入口', backdrop: 'scrapyard', speaker: 'ash', line: '誰かが先に入ったのか。……部品を拾ったら、足跡の先も確かめる。' }
  ],
  'azami-rescue': [
    { place: '廃材置き場・夕暮れ', backdrop: 'scrapyard', speaker: 'narrator', line: '崩れた機械の下で、金属を叩く音がした。三回。間を置いて、もう一度。' },
    { place: '崩落区画', backdrop: 'scrapyard', speaker: 'ash', line: '助けを呼ぶ音だ。重機の脚が、出口をふさいでる。' },
    { place: '崩落区画', backdrop: 'scrapyard', speaker: 'azami', line: '聞こえる？ 左の弁を回して！ 右じゃないよ、左！', expression: 'worried' },
    { place: '崩落区画', backdrop: 'scrapyard', speaker: 'ash', line: '指図できるなら自分で出てこい……って、腕が挟まってるのか。' },
    { place: '崩落区画', backdrop: 'scrapyard', speaker: 'azami', line: '角に機械の音が響くの。弁を開けば、脚の圧力が抜けるはず。たぶん！', expression: 'determined' },
    { place: '崩落区画', backdrop: 'scrapyard', speaker: 'narrator', line: 'アッシュは押すのをやめた。錆びた弁を掃除し、折れたハンドルに歯車を噛ませる。音が一段ずつ低くなる。' },
    { place: '崩落区画・救出', backdrop: 'rescue-cg', speaker: 'ash', line: '今だ。引っ張るぞ。……せーの！', expression: 'determined' },
    { place: '崩落区画・救出', backdrop: 'rescue-cg', speaker: 'azami', line: '助かった！ あたしはアザミ。地図を描きながら旅してるの。', expression: 'joyful' },
    { place: '崩落区画', backdrop: 'scrapyard', speaker: 'ash', line: '旅人が、なんで機械の下に？' },
    { place: '崩落区画', backdrop: 'scrapyard', speaker: 'azami', line: '地下から音がしたんだよ。世界のどこかで、まだ動いてるものの音。', expression: 'determined' },
    { place: '廃材置き場・帰路', backdrop: 'road', speaker: 'narrator', line: 'アザミの地図には、崩れた橋も干上がった湖も、書き直した跡が重なっていた。次の行き先は、熱の消えかけた鉄屑街。' },
    { place: '廃材置き場・帰路', backdrop: 'road', speaker: 'ash', line: '世界を直す約束はしない。まず町の火を戻す。それなら手伝える。' },
    { place: '廃材置き場・帰路', backdrop: 'road', speaker: 'azami', line: 'うん。それでいいよ。誰かの一日が続くなら、十分すごいことだもん。' }
  ],
  'town-arrival': [
    { place: '鉄屑街への道', backdrop: 'road', speaker: 'narrator', line: '二人は崩れた高架の下を抜けた。夕闇の向こうに、小さな灯りがいくつも揺れている。' },
    { place: '鉄屑街への道', backdrop: 'road', speaker: 'azami', line: '古い地図だと、ここは湖。でも今は道があるね。あとでちゃんと書き直そう。' },
    { place: '鉄屑街への道', backdrop: 'road', speaker: 'ash', line: '道は残ってる。橋は半分だけどな。帰りは別の線を探すか。' },
    { place: '鉄屑街・入口', backdrop: 'town', speaker: 'narrator', line: '町では、炉の熱を分け合うために、人々が配管のそばで暮らしていた。煮込み鍋の匂いが、灰の中に残っている。' },
    { place: '鉄屑街・入口', backdrop: 'town', speaker: 'mina', line: '無線のアッシュね。本当に来てくれたんだ。こっちはミナ。町の修理屋よ。' },
    { place: '鉄屑街・入口', backdrop: 'town', speaker: 'ash', line: '橋は半分しかなかった。部品は持ってきた。炉を見せてくれ。' },
    { place: '鉄屑街・入口', backdrop: 'town', speaker: 'azami', line: 'あったかいね。ここに住む人たち、ずっと炉の音を聞いてるんだ。' },
    { place: '鉄屑街・修理台', backdrop: 'town', speaker: 'mina', line: '止めるだけじゃだめ。町の熱を残して。工場に何があるか、一緒に記録を見ましょう。' }
  ],
  'relay-return': [
    { place: '旧工場・夜', backdrop: 'scrapyard', speaker: 'narrator', line: '守衛機が止まると、工場の唸りは少し低くなった。アッシュは炉を止めず、余った圧力を町へ送る弁を開く。' },
    { place: '鉄屑街・夜', backdrop: 'town', speaker: 'narrator', line: '熱管をたどって戻る。窓の向こうで、鍋を囲む人たちの声がした。何日も消えかけていた共同釜に、火が戻っている。' },
    { place: '鉄屑街・貯水槽', backdrop: 'town', speaker: 'azami', line: '聞いて。地面の下で、さっきの機械と同じ音がする。……水の音も。', expression: 'surprised' },
    { place: '鉄屑街・貯水槽', backdrop: 'town', speaker: 'narrator', line: '乾いた槽の底に、水が一滴落ちた。次の一滴が来るまで、二人は黙って待った。' },
    { place: '鉄屑街・貯水槽', backdrop: 'town', speaker: 'ash', line: '炉を直しただけで、遠くの水まで動いたのか？' },
    { place: '鉄屑街・地図', backdrop: 'road', speaker: 'azami', line: 'ううん。炉の奥に、もっと大きな脈がつながってた。ほら、地図に線が出てる。', expression: 'determined' },
    { place: '鉄屑街・地図', backdrop: 'road', speaker: 'narrator', line: '古い地図に浮かんだのは、白い森の方角。道の終わりではなく、次の行き先だった。' },
    { place: '鉄屑街・地図', backdrop: 'road', speaker: 'ash', line: '町の炉は直った。次は、その森で何が動いてるのか確かめよう。', expression: 'determined' },
    { place: '鉄屑街・地図', backdrop: 'road', speaker: 'azami', line: 'じゃあ、地図を書き直しながら行こう。道は歩いた分だけ、ほんとの形になるから。', expression: 'joyful' }
  ]
};

export class StoryScene extends Phaser.Scene {
  private sequence: StorySequence = 'opening';
  private step = 0;
  private backdrop!: Phaser.GameObjects.Image;
  private placeLabel!: Phaser.GameObjects.Text;
  private progressBar!: Phaser.GameObjects.Rectangle;
  private dialogue!: ReturnType<typeof addDialogueBox>;
  private changingBackdrop = false;

  constructor() { super('Story'); }

  init(data: { sequence?: StorySequence }) {
    this.sequence = data.sequence ?? 'opening';
    this.step = 0;
    this.changingBackdrop = false;
  }

  create() {
    this.cameras.main.setBackgroundColor('#0c0f12');
    this.add.rectangle(270, 480, 516, 948, 0xffffff, 0).setStrokeStyle(2, 0x63727a).setDepth(8);
    this.add.text(28, 22, 'PROLOGUE   /   THE MAP AFTER THE END', {
      fontFamily: 'monospace', fontSize: '12px', color: '#d9b889'
    }).setDepth(9);
    this.placeLabel = this.add.text(28, 52, '', {
      fontFamily: '"Noto Sans JP", sans-serif', fontSize: '23px', color: '#f4ede1', fontStyle: 'bold'
    }).setDepth(9);
    this.add.rectangle(270, 98, 480, 4, 0x293136).setDepth(9);
    this.progressBar = this.add.rectangle(30, 98, 4, 4, 0xd5aa68).setOrigin(0, .5).setDepth(10);
    this.add.rectangle(270, 480, 540, 960, 0x081016, .34).setDepth(1);
    this.dialogue = addDialogueBox(this, 770, 220, { x: 390, bottom: 685, height: 360, width: 320 });
    this.add.rectangle(270, 920, 468, 62, 0x263136).setStrokeStyle(2, 0x728992).setDepth(9);
    this.add.text(54, 898, 'つづきを読む', {
      fontFamily: '"Noto Sans JP", sans-serif', fontSize: '21px', color: '#f4f2e9'
    }).setDepth(10);
    this.add.text(54, 928, 'タップで文字送り / 次の場面へ', {
      fontFamily: '"Noto Sans JP", sans-serif', fontSize: '13px', color: '#c4d0d1'
    }).setDepth(10);
    this.input.on('pointerdown', () => this.advance());
    this.showBeat(false);
    this.cameras.main.fadeIn(420, 0, 0, 0);
  }

  private beats() { return STORY[this.sequence]; }

  private showBeat(backgroundChanges: boolean) {
    const beat = this.beats()[this.step];
    this.placeLabel.setText(beat.place);
    this.progressBar.width = Math.max(4, 480 * ((this.step + 1) / this.beats().length));
    const displayBackdrop = () => {
      if (this.backdrop) {
        this.tweens.killTweensOf(this.backdrop);
        this.backdrop.destroy();
      }
      if (beat.backdrop === 'workshop') {
        this.backdrop = this.add.image(270, 480, 'workshop-bg').setDisplaySize(540, 960).setDepth(0);
      } else if (beat.backdrop === 'road') {
        this.backdrop = this.add.image(270, 480, 'journey-road').setDisplaySize(540, 960).setDepth(0);
      } else if (beat.backdrop === 'rescue-cg') {
        this.backdrop = this.add.image(270, 480, 'azami-rescue-cg').setDisplaySize(540, 960).setDepth(0);
      } else {
        const frame = beat.backdrop === 'scrapyard' ? 1 : 2;
        this.backdrop = addArtPanel(this, frame, 270, 480, 540, 960, .5, .5);
        this.backdrop.setDepth(0);
      }
      this.backdrop.setAlpha(0);
      this.tweens.add({ targets: this.backdrop, alpha: 1, duration: 300, ease: 'Sine.out' });
      this.tweens.add({ targets: this.backdrop, scaleX: 1.018, scaleY: 1.018, duration: 10000, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    };

    const displayDialogue = () => {
      this.dialogue.set(beat.line, beat.speaker, 'dialogue', true, beat.expression);
      this.changingBackdrop = false;
    };

    if (!this.backdrop) {
      displayBackdrop();
      displayDialogue();
    } else if (backgroundChanges) {
      this.changingBackdrop = true;
      this.tweens.add({
        targets: this.backdrop, alpha: 0, duration: 220, onComplete: () => {
          displayBackdrop();
          displayDialogue();
        }
      });
      if (beat.backdrop === 'rescue-cg') {
        this.cameras.main.flash(260, 233, 213, 174);
      }
    } else {
      displayDialogue();
    }
  }

  private advance() {
    if (this.changingBackdrop) return;
    if (this.dialogue.isTyping()) {
      this.dialogue.finish();
      return;
    }
    if (this.step + 1 < this.beats().length) {
      const currentBackdrop = this.beats()[this.step].backdrop;
      this.step += 1;
      const changesBackground = currentBackdrop !== this.beats()[this.step].backdrop;
      this.showBeat(changesBackground);
      return;
    }
    this.finishSequence();
  }

  private finishSequence() {
    const p = GameState.data.chapter0;
    if (this.sequence === 'opening') {
      p.openingSeen = true;
      GameState.save();
      this.scene.start('Hub');
    } else if (this.sequence === 'scrapyard-road') {
      p.scrapyardRouteSeen = true;
      GameState.save();
      this.scene.start('Explore', { location: 'Scrapyard' });
    } else if (this.sequence === 'azami-rescue') {
      p.azamiRecruited = true;
      GameState.data.week += 1;
      GameState.save();
      this.scene.start('Explore', {
        location: 'Scrapyard',
        result: 'アザミが仲間になった。\n二人は鉄屑街まで一緒に歩くことにした。',
        resultSpeaker: 'azami'
      });
    } else if (this.sequence === 'town-arrival') {
      p.townVisited = true;
      GameState.data.week += 1;
      GameState.save();
      this.scene.start('Explore', { location: 'Town' });
    } else if (this.sequence === 'relay-return') {
      p.endingSeen = true;
      GameState.data.week += 1;
      GameState.save();
      this.scene.start('Hub', { result: '鉄屑街の熱が戻り、地図に白い森への道が浮かんだ。次の旅先が見つかった。' });
    }
  }
}
