import Phaser from 'phaser';
import { GameState } from '../state/GameState';
import { addDialogueBox, type DialogueExpression, type DialogueSpeaker } from '../ui/DialogueBox';
import { addArtPanel } from '../ui/ArtPanel';
import { getRegion, REGIONS, type RegionId } from '../data/regions';

type StorySequence = 'opening' | 'scrapyard-road' | 'azami-rescue' | 'town-arrival' | 'relay-return' | 'region-mid' | 'region-boss' | 'region-epilogue' | 'campaign-finale' | 'finale-epilogue';
type StaticStorySequence = 'opening' | 'scrapyard-road' | 'azami-rescue' | 'town-arrival' | 'relay-return';
type Backdrop = 'workshop' | 'road' | 'scrapyard' | 'town' | 'rescue-cg' | 'region';

interface StoryBeat {
  place: string;
  backdrop: Backdrop;
  speaker: DialogueSpeaker;
  line: string;
  expression?: DialogueExpression;
  illustration?: boolean;
}

const STORY: Record<StaticStorySequence, StoryBeat[]> = {
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
    { place: '廃材置き場・夕暮れ', backdrop: 'scrapyard', speaker: 'narrator', line: '三つの部品がそろった。圧力筒の古い刻印が、瓦礫の下に続く保守線を示していた。奥から、金属を叩く音がする。三回。間を置いて、もう一度。' },
    { place: '崩落区画', backdrop: 'scrapyard', speaker: 'ash', line: '助けを呼ぶ音だ。重機の脚が、出口をふさいでる。' },
    { place: '崩落区画', backdrop: 'scrapyard', speaker: 'azami', line: '聞こえる？ 左の弁を回して！ 右じゃないよ、左！', expression: 'worried' },
    { place: '崩落区画', backdrop: 'scrapyard', speaker: 'ash', line: '指図できるなら自分で出てこい……って、腕が挟まってるのか。' },
    { place: '崩落区画', backdrop: 'scrapyard', speaker: 'azami', line: '角に機械の音が響くの。弁を開けば、脚の圧力が抜けるはず。たぶん！', expression: 'determined' },
    { place: '崩落区画', backdrop: 'scrapyard', speaker: 'narrator', line: 'アッシュは押すのをやめた。錆びた弁を掃除し、折れたハンドルに歯車を噛ませる。音が一段ずつ低くなる。' },
    { place: '崩落区画・救出', backdrop: 'rescue-cg', speaker: 'ash', line: '今だ。引っ張るぞ。……せーの！', expression: 'determined', illustration: true },
    { place: '崩落区画・救出', backdrop: 'rescue-cg', speaker: 'azami', line: '助かった！ あたしはアザミ。地図を描きながら旅してるの。', expression: 'joyful', illustration: true },
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
    { place: '鉄屑街・貯水槽', backdrop: 'town', speaker: 'narrator', line: '乾いた槽の底に、水が一滴落ちた。次の一滴が来るまで、二人は黙って待った。', illustration: true },
    { place: '鉄屑街・貯水槽', backdrop: 'town', speaker: 'ash', line: '炉を直しただけで、遠くの水まで動いたのか？' },
    { place: '鉄屑街・地図', backdrop: 'road', speaker: 'azami', line: 'ううん。炉の奥に、もっと大きな脈がつながってた。ほら、地図に線が出てる。', expression: 'determined' },
    { place: '鉄屑街・地図', backdrop: 'road', speaker: 'narrator', line: '古い地図に浮かんだのは、白い森の方角。道の終わりではなく、次の行き先だった。' },
    { place: '鉄屑街・地図', backdrop: 'road', speaker: 'ash', line: '町の炉は直った。次は、その森で何が動いてるのか確かめよう。', expression: 'determined' },
    { place: '鉄屑街・地図', backdrop: 'road', speaker: 'azami', line: 'じゃあ、地図を書き直しながら行こう。道は歩いた分だけ、ほんとの形になるから。', expression: 'joyful' }
  ]
};

const REGIONAL_MID: Record<RegionId, StoryBeat[]> = {
  whitewood: [
    { place: '白い森・樹冠の下', backdrop: 'region', speaker: 'narrator', line: '森の木々は、幹から枝先まで白い結晶に変わっていた。足元には、割れた種の殻がいくつも落ちている。' },
    { place: '白い森・樹冠の下', backdrop: 'region', speaker: 'azami', line: '森は死んでないよ。根っこの音が、まだ土の中を回ってる。', expression: 'determined' },
    { place: '白い森・種子庫', backdrop: 'region', speaker: 'ash', line: '種子庫の扉が枝で固められてる。折れば早いが……守ろうとして絡んだのか。', expression: 'worried' },
    { place: '白い森・種子庫', backdrop: 'region', speaker: 'narrator', line: '結晶枝の根元に、古い勇者一行の道標が残る。「守護獣を排除せよ」。その矢印は、森の中心へ続いていた。' }
  ],
  'dry-lake': [
    { place: '水底街・大通り', backdrop: 'region', speaker: 'narrator', line: '湖が消え、沈んでいた街が地上に現れた。水路の底には舟が横倒しになり、壁には過去の水位が刻まれている。' },
    { place: '水底街・集水塔', backdrop: 'region', speaker: 'azami', line: 'この線まで水があったんだ。地図の「湖」は消して、「水底街」に直すね。', expression: 'worried' },
    { place: '水底街・集水塔', backdrop: 'region', speaker: 'ash', line: '給水機は動く。でも弁が閉じたまま、空の貯水槽に水を回してる。', expression: 'determined' },
    { place: '水底街・集水塔', backdrop: 'region', speaker: 'narrator', line: '古い壁画に描かれていたのは魔王ではない。川と湖をつなぐ、五つの輪だった。' }
  ],
  'storm-route': [
    { place: '雲上線・高架', backdrop: 'region', speaker: 'narrator', line: '線路は雲の上で途切れ、向こう岸が嵐に隠れている。墜落した飛行艇の窓に、小さな灯りがともった。' },
    { place: '雲上線・飛行艇', backdrop: 'region', speaker: 'azami', line: '風が来る前に、レールが三回鳴る。……ここにいた人も、それを聞いていたのかな。', expression: 'worried' },
    { place: '雲上線・飛行艇', backdrop: 'region', speaker: 'ash', line: '翼布を張り直す。飛べるかは分からないが、橋の代わりにはなる。', expression: 'amused' },
    { place: '雲上線・飛行艇', backdrop: 'region', speaker: 'narrator', line: '航路記録には、七年前の勇者たちが嵐の反対側から来た印があった。彼らも出口を探していた。' }
  ],
  'furnace-city': [
    { place: '炉都・居住区', backdrop: 'region', speaker: 'narrator', line: '炉都では一つの炉が、二つの地区を温めていた。熱は足りない。どちらへ分けるか、住人たちは毎晩話し合っている。' },
    { place: '炉都・配管橋', backdrop: 'region', speaker: 'azami', line: '炉の音が苦しそう。強く燃やすほど、街の外側が冷えていく。', expression: 'worried' },
    { place: '炉都・配管橋', backdrop: 'region', speaker: 'ash', line: '流量を増やすんじゃない。捨てている熱を拾って、二本の管に分ける。', expression: 'determined' },
    { place: '炉都・配管橋', backdrop: 'region', speaker: 'narrator', line: '古い軍用記録の余白に、誰かの手書きがあった。「この熱は、街へ返す」。' }
  ],
  'demon-castle': [
    { place: '旧魔王城・記録回廊', backdrop: 'region', speaker: 'narrator', line: '最後の道標は、かつて魔王がいた城へ続いていた。壁の記録は戦争の勝者ではなく、壊れた循環網を記している。' },
    { place: '旧魔王城・記録回廊', backdrop: 'region', speaker: 'azami', line: 'あたしが近づくと、扉が開く。うれしいのに……少し怖いね。', expression: 'worried' },
    { place: '旧魔王城・記録庫', backdrop: 'region', speaker: 'ash', line: '機械の判定と、お前が何者かは別の話だ。記録は読む。答えはその後だ。', expression: 'determined' },
    { place: '旧魔王城・記録庫', backdrop: 'region', speaker: 'narrator', line: '綴じられていたのは、魔王が循環網を兵器に変えた記録。そして勇者が、世界を救うために核を壊した記録だった。' }
  ]
};

const REGIONAL_BOSS: Record<RegionId, StoryBeat[]> = {
  whitewood: [
    { place: '白い森・中心核', backdrop: 'region', speaker: 'azami', line: '守護獣は森を傷つけたいんじゃない。誰も近づけないよう、命令を守ってるだけ。', expression: 'determined' },
    { place: '白い森・中心核', backdrop: 'region', speaker: 'ash', line: 'じゃあ命令の続きを教える。森を守る方法は、閉じ込めることだけじゃない。', expression: 'determined' },
    { place: '白い森・中心核', backdrop: 'region', speaker: 'narrator', line: '結晶の枝が一斉にほどけ、獣の形をとった。白い森の心臓が、初めて二人を認識する。', illustration: true }
  ],
  'dry-lake': [
    { place: '水底街・水門室', backdrop: 'region', speaker: 'azami', line: '水を止めたのは、壊れた弁から街を守るためだった。守り方が、長すぎたんだ。', expression: 'worried' },
    { place: '水底街・水門室', backdrop: 'region', speaker: 'ash', line: '圧力を一度に戻せば街が割れる。少しずつ開く手順に切り替える。', expression: 'determined' },
    { place: '水底街・水門室', backdrop: 'region', speaker: 'narrator', line: '水輪が回り始める。巨大な番人が、閉じた水門を守るため立ち上がった。', illustration: true }
  ],
  'storm-route': [
    { place: '雲上線・風核', backdrop: 'region', speaker: 'azami', line: '三つ鳴った。次は横風が来る！', expression: 'determined' },
    { place: '雲上線・風核', backdrop: 'region', speaker: 'ash', line: '分かった。飛ぶんじゃなく、風を逃がす板を組む。', expression: 'amused' },
    { place: '雲上線・風核', backdrop: 'region', speaker: 'narrator', line: '飛行艇の骨組みがうなり、嵐そのものをまとった守護機が姿を現す。', illustration: true }
  ],
  'furnace-city': [
    { place: '炉都・火核', backdrop: 'region', speaker: 'azami', line: '二つの地区の音がそろった。今なら、熱を分けても炉は止まらない。', expression: 'determined' },
    { place: '炉都・火核', backdrop: 'region', speaker: 'ash', line: '古い燃焼器を外して分流弁に替える。街の熱を一か所に閉じ込めない。', expression: 'determined' },
    { place: '炉都・火核', backdrop: 'region', speaker: 'narrator', line: '炎の制御機が二人を遮る。戦争のための出力を、暮らしの温度へ戻す時だ。', illustration: true }
  ],
  'demon-castle': [
    { place: '旧魔王城・王座の間', backdrop: 'region', speaker: 'narrator', line: '最後の守護機が目を覚ます。記録庫の奥で、アザミの角に青い光がともった。', illustration: true },
    { place: '旧魔王城・王座の間', backdrop: 'region', speaker: 'azami', line: '「次の魔王」って、機械が言ってる。でもあたしは、あたしの名前でここにいる。', expression: 'determined' },
    { place: '旧魔王城・王座の間', backdrop: 'region', speaker: 'ash', line: 'その答えは、お前が決める。まずはこの扉を開ける。二人でな。', expression: 'determined' }
  ]
};

const REGIONAL_EPILOGUE: Record<RegionId, StoryBeat[]> = {
  whitewood: [
    { place: '白い森・朝', backdrop: 'region', speaker: 'narrator', line: '核を直しても森は一晩で戻らない。けれど、一本の枝に小さな緑が宿った。', illustration: true },
    { place: '白い森・朝', backdrop: 'region', speaker: 'ash', line: 'これだけか。……いや、最初の一つなら十分か。', expression: 'amused' },
    { place: '白い森・朝', backdrop: 'region', speaker: 'azami', line: '地図に書こう。「森は、まだ眠ってる」。', expression: 'joyful' }
  ],
  'dry-lake': [
    { place: '水底街・夕暮れ', backdrop: 'region', speaker: 'narrator', line: '水は湖を満たさず、石畳の溝を一本だけ流れた。住人は小さな水路に、花の種を置いた。', illustration: true },
    { place: '水底街・夕暮れ', backdrop: 'region', speaker: 'azami', line: '湖じゃなくても、水は帰ってきたね。', expression: 'joyful' },
    { place: '水底街・夕暮れ', backdrop: 'region', speaker: 'ash', line: '次は風だ。あの雲の向こうに線路が続いてる。', expression: 'determined' }
  ],
  'storm-route': [
    { place: '雲上線・朝', backdrop: 'region', speaker: 'narrator', line: '嵐は去らない。ただ、列車一両ぶんの静かな道が開いた。翼布が風を受け、地図の端を押さえる。', illustration: true },
    { place: '雲上線・朝', backdrop: 'region', speaker: 'ash', line: '工具箱は飛んだが、俺たちは飛ばなかった。上出来だ。', expression: 'amused' },
    { place: '雲上線・朝', backdrop: 'region', speaker: 'azami', line: '次は炉都。地図の先から、熱い音がするよ。', expression: 'joyful' }
  ],
  'furnace-city': [
    { place: '炉都・夜', backdrop: 'region', speaker: 'narrator', line: '二つの地区に、同じ温度の湯気が立った。炉都の人々は、どちらの家にも同じ火が届くのを見届けた。', illustration: true },
    { place: '炉都・夜', backdrop: 'region', speaker: 'ash', line: '止めたんじゃない。余ってた熱の行き先を変えただけだ。', expression: 'determined' },
    { place: '炉都・夜', backdrop: 'region', speaker: 'azami', line: '最後の地図は、最初に壊れた場所へ続いてる。旧魔王城。', expression: 'worried' }
  ],
  'demon-castle': [
    { place: '旧魔王城・夜明け', backdrop: 'region', speaker: 'narrator', line: '五つの輪がつながった。空の灰が薄れ、城の屋根に雨が落ちる。世界は、ゆっくり息を始めた。', illustration: true },
    { place: '旧魔王城・夜明け', backdrop: 'region', speaker: 'azami', line: '記録庫はあたしを魔王と呼んだ。でも、地図には旅人って書いてある。', expression: 'determined' },
    { place: '旧魔王城・夜明け', backdrop: 'region', speaker: 'ash', line: 'その地図を信じる。……外で、誰かが来る音がする。', expression: 'worried' }
  ]
};

const FINALE: StoryBeat[] = [
  { place: '旧魔王城・門前', backdrop: 'region', speaker: 'narrator', line: '遠くの王国で、五つの核の再接続が観測された。古い警報は「魔王反応」を示し、新しい勇者一行が城へ向かう。' },
  { place: '旧魔王城・門前', backdrop: 'region', speaker: 'azami', line: 'この世界を直したのに、また魔王だと思われちゃうんだね。', expression: 'worried' },
  { place: '旧魔王城・門前', backdrop: 'region', speaker: 'ash', line: 'なら、剣を振る前に話をする。俺たちがしてきたことを見せよう。', expression: 'determined' },
  { place: '旧魔王城・門前', backdrop: 'region', speaker: 'narrator', line: '門が開く。勇者の剣はまっすぐアザミへ向けられた。', illustration: true }
];

const FINALE_EPILOGUE: StoryBeat[] = [
  { place: '旧魔王城・記録庫', backdrop: 'region', speaker: 'narrator', line: '戦いのあと、勇者は古い記録を読み直した。正しさは一つの剣では決まらない。' },
  { place: '旧魔王城・記録庫', backdrop: 'region', speaker: 'azami', line: 'あたしの地図、これからも書き続けていい？', expression: 'joyful' },
  { place: '旧魔王城・記録庫', backdrop: 'region', speaker: 'ash', line: '道が残ってる限りな。次は、壊れる前に直しに行こう。', expression: 'amused' },
  { place: '道標の丘', backdrop: 'road', speaker: 'narrator', line: '彼らは旅を続ける。世界を救うためではなく、世界の中で暮らす誰かと出会うために。', illustration: true }
];

export class StoryScene extends Phaser.Scene {
  private sequence: StorySequence = 'opening';
  private regionId: RegionId = 'whitewood';
  private step = 0;
  private backdrop!: Phaser.GameObjects.Image;
  private shade!: Phaser.GameObjects.Rectangle;
  private ashPortrait!: Phaser.GameObjects.Image;
  private companionPortrait!: Phaser.GameObjects.Image;
  private placeLabel!: Phaser.GameObjects.Text;
  private progressBar!: Phaser.GameObjects.Rectangle;
  private dialogue!: ReturnType<typeof addDialogueBox>;
  private changingBackdrop = false;

  constructor() { super('Story'); }

  init(data: { sequence?: StorySequence; regionId?: RegionId }) {
    this.sequence = data.sequence ?? 'opening';
    this.regionId = data.regionId ?? GameState.data.campaign.activeRegion ?? 'whitewood';
    this.step = 0;
    this.changingBackdrop = false;
  }

  create() {
    this.cameras.main.setBackgroundColor('#0c0f12');
    this.add.rectangle(270, 480, 516, 948, 0xffffff, 0).setStrokeStyle(2, 0x63727a).setDepth(8);
    const chapterName = this.sequence.startsWith('region-')
      ? getRegion(this.regionId).chapter
      : this.sequence.includes('finale') ? 'FINALE' : 'PROLOGUE';
    this.add.text(28, 22, `${chapterName}   /   THE MAP AFTER THE END`, {
      fontFamily: 'monospace', fontSize: '12px', color: '#d9b889'
    }).setDepth(9);
    this.placeLabel = this.add.text(28, 52, '', {
      fontFamily: '"Noto Sans JP", sans-serif', fontSize: '23px', color: '#f4ede1', fontStyle: 'bold'
    }).setDepth(9);
    this.add.rectangle(270, 98, 480, 4, 0x293136).setDepth(9);
    this.progressBar = this.add.rectangle(30, 98, 4, 4, 0xd5aa68).setOrigin(0, .5).setDepth(10);
    this.shade = this.add.rectangle(270, 480, 540, 960, 0x081016, .34).setDepth(1);
    this.ashPortrait = this.add.image(145, 666, 'ash-neutral').setOrigin(.5, 1).setDisplaySize(260, 350).setDepth(2);
    this.companionPortrait = this.add.image(397, 666, 'azami-neutral').setOrigin(.5, 1).setDisplaySize(260, 350).setDepth(2);
    this.dialogue = addDialogueBox(this, 770, 220);
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

  private beats() {
    if (this.sequence === 'region-mid') return REGIONAL_MID[this.regionId];
    if (this.sequence === 'region-boss') return REGIONAL_BOSS[this.regionId];
    if (this.sequence === 'region-epilogue') return REGIONAL_EPILOGUE[this.regionId];
    if (this.sequence === 'campaign-finale') return FINALE;
    if (this.sequence === 'finale-epilogue') return FINALE_EPILOGUE;
    return STORY[this.sequence];
  }

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
      } else if (beat.backdrop === 'region') {
        this.backdrop = this.add.image(270, 480, getRegion(this.regionId).background).setDisplaySize(540, 960).setDepth(0);
      } else {
        const frame = beat.backdrop === 'scrapyard' ? 1 : 2;
        this.backdrop = addArtPanel(this, frame, 270, 480, 540, 960, .5, .5);
        this.backdrop.setDepth(0);
      }
      this.backdrop.setAlpha(0);
      this.shade.setAlpha(beat.illustration ? .08 : .3);
      this.tweens.add({ targets: this.backdrop, alpha: 1, duration: 300, ease: 'Sine.out' });
      this.tweens.add({ targets: this.backdrop, scaleX: 1.018, scaleY: 1.018, duration: 10000, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    };

    const displayDialogue = () => {
      this.shade.setAlpha(beat.illustration || beat.backdrop === 'rescue-cg' ? .08 : .3);
      this.dialogue.set(beat.line, beat.speaker, 'dialogue', true, beat.expression);
      this.setStageActors(beat);
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
      if (beat.backdrop === 'rescue-cg' || beat.illustration) {
        this.cameras.main.flash(260, 233, 213, 174);
      }
    } else {
      const previousBeat = this.beats()[this.step - 1];
      if (beat.illustration && !previousBeat?.illustration) {
        this.cameras.main.flash(240, 241, 226, 193);
        this.tweens.add({ targets: this.backdrop, scaleX: 1.045, scaleY: 1.045, duration: 420, ease: 'Sine.inOut' });
      }
      displayDialogue();
    }
  }

  private setStageActors(beat: StoryBeat) {
    const cinematic = beat.illustration || beat.backdrop === 'rescue-cg';
    this.ashPortrait.setVisible(!cinematic);
    this.companionPortrait.setVisible(!cinematic);
    if (cinematic) return;
    const ashExpression = beat.speaker === 'ash' ? beat.expression ?? 'neutral' : 'neutral';
    const otherExpression = beat.speaker === 'azami' ? beat.expression ?? 'neutral' : 'neutral';
    const ashTexture: Record<DialogueExpression, string> = {
      neutral: 'ash-neutral', amused: 'ash-amused', determined: 'ash-determined',
      surprised: 'ash-surprised', joyful: 'ash-amused', worried: 'ash-neutral'
    };
    const azamiTexture: Record<DialogueExpression, string> = {
      neutral: 'azami-neutral', amused: 'azami-joyful', determined: 'azami-determined',
      surprised: 'azami-joyful', joyful: 'azami-joyful', worried: 'azami-worried'
    };
    const minaTexture: Record<DialogueExpression, string> = {
      neutral: 'mina-neutral', amused: 'mina-smile', determined: 'mina-determined',
      surprised: 'mina-neutral', joyful: 'mina-smile', worried: 'mina-worried'
    };
    const nextAsh = ashTexture[ashExpression];
    const nextCompanion = beat.speaker === 'mina' ? minaTexture[beat.expression ?? 'neutral'] : azamiTexture[otherExpression];
    for (const [image, texture] of [[this.ashPortrait, nextAsh], [this.companionPortrait, nextCompanion]] as const) {
      if (image.texture.key !== texture) {
        image.setAlpha(0).setTexture(texture);
        this.tweens.add({ targets: image, alpha: 1, duration: 180, ease: 'Sine.out' });
      }
    }
    this.ashPortrait.setAlpha(beat.speaker === 'ash' ? 1 : beat.speaker === 'narrator' ? .72 : .62);
    this.companionPortrait.setAlpha(beat.speaker === 'azami' || beat.speaker === 'mina' ? 1 : beat.speaker === 'narrator' ? .72 : .62);
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
    const campaign = GameState.data.campaign;
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
    } else if (this.sequence === 'region-mid') {
      campaign.regionInsight += 1;
      GameState.save();
      this.scene.start('Journey', { regionId: this.regionId, result: '地形の記録がつながった。残り3行動で、核の守護機が反応する。', resultSpeaker: 'azami' });
    } else if (this.sequence === 'region-boss') {
      GameState.save();
      this.scene.start('Battle', { enemyId: getRegion(this.regionId).guardian });
    } else if (this.sequence === 'region-epilogue') {
      if (!campaign.coresRepaired.includes(this.regionId)) campaign.coresRepaired.push(this.regionId);
      campaign.unlockedRegion = Math.max(campaign.unlockedRegion, REGIONS.findIndex((r) => r.id === this.regionId) + 1);
      campaign.activeRegion = null;
      campaign.regionActions = 0;
      campaign.regionInsight = 0;
      GameState.data.week = 1;
      GameState.save();
      if (campaign.unlockedRegion >= REGIONS.length) this.scene.start('Story', { sequence: 'campaign-finale', regionId: 'demon-castle' });
      else this.scene.start('Hub', { result: `${getRegion(this.regionId).core}を修復した。次の道が地図に開いた。` });
    } else if (this.sequence === 'campaign-finale') {
      this.scene.start('Battle', { enemyId: 'new-hero' });
    } else if (this.sequence === 'finale-epilogue') {
      campaign.finaleComplete = true;
      campaign.activeRegion = null;
      GameState.save();
      this.scene.start('Hub', { result: '五つの核がつながり、新しい勇者も刃を収めた。二人の旅は、まだ続いていく。' });
    }
  }
}
