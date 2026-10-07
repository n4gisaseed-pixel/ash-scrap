import Phaser from 'phaser';
import { GameState } from '../state/GameState';

export class ExploreScene extends Phaser.Scene {
  private result!: Phaser.GameObjects.Text;
  private searches=0;

  constructor(){ super('Explore'); }

  create(){
    this.cameras.main.setBackgroundColor('#0e0c0a');
    this.add.rectangle(270,480,510,930,0x181613).setStrokeStyle(4,0x4f4437);
    this.add.text(30,28,'SCRAPYARD 01',{fontFamily:'monospace',fontSize:'24px',color:'#e8d7be',fontStyle:'bold'});
    this.add.text(30,65,'NON-FIELD EXPLORATION',{fontFamily:'monospace',fontSize:'13px',color:'#8f7760'});

    this.add.rectangle(270,295,470,330,0x292721).setStrokeStyle(3,0x625243);
    for(let i=0;i<20;i++){
      this.add.rectangle(
        Phaser.Math.Between(65,475),Phaser.Math.Between(165,405),
        Phaser.Math.Between(22,66),Phaser.Math.Between(12,40),
        Phaser.Math.RND.pick([0x4d443b,0x5d4939,0x38332e]),1
      ).setAngle(Phaser.Math.Between(-25,25));
    }
    this.add.text(270,282,'SCRAP FIELD',{
      fontFamily:'monospace',fontSize:'28px',color:'#d0aa78',
      backgroundColor:'#171411',padding:{x:15,y:9}
    }).setOrigin(.5);

    this.result=this.add.text(38,505,'周囲を調べる。',{
      fontFamily:'"Noto Sans JP", sans-serif',fontSize:'18px',color:'#eee3d4',
      backgroundColor:'#171411',padding:{x:16,y:16},wordWrap:{width:430},fixedWidth:464
    });

    this.makeButton(270,675,'SEARCH','ガラクタを探す',()=>this.search());
    this.makeButton(270,770,'BATTLE','奥から機械音がする',()=>this.scene.start('Battle'));
    this.makeButton(270,865,'RETURN','工房へ戻る',()=>this.scene.start('Hub'));
  }

  private makeButton(x:number,y:number,title:string,sub:string,fn:()=>void){
    const bg=this.add.rectangle(x,y,450,72,0x30241c).setStrokeStyle(2,0x8a6544).setInteractive();
    this.add.text(58,y-15,title,{fontFamily:'monospace',fontSize:'19px',color:'#f2dfc7',fontStyle:'bold'});
    this.add.text(58,y+12,sub,{fontFamily:'"Noto Sans JP", sans-serif',fontSize:'13px',color:'#a68a72'});
    bg.on('pointerdown',()=>{ bg.setFillStyle(0x5a3925); this.time.delayedCall(70,fn); });
  }

  private search(){
    this.searches++;
    const table=[
      ['Rusted Gear','錆びた歯車を見つけた。'],
      ['Copper Wire','まだ導通しそうな銅線だ。'],
      ['Pressure Cylinder','小型の圧力シリンダー。使える。']
    ] as const;
    const [item,msg]=Phaser.Math.RND.pick(table);
    GameState.add(item,1);
    GameState.data.scrap += Phaser.Math.Between(2,5);
    GameState.save();
    this.result.setText(`SALVAGE +1 : ${item}\n${msg}\nSCRAPも少し回収した。`);
  }
}
