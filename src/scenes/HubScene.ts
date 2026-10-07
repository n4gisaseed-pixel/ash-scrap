import Phaser from 'phaser';
import { GameState } from '../state/GameState';

export class HubScene extends Phaser.Scene {
  private log!: Phaser.GameObjects.Text;
  private inv!: Phaser.GameObjects.Text;

  constructor(){ super('Hub'); }

  create(){
    this.drawShell('ASH\'S WORKSHOP','HOME / DAY '+GameState.data.day);

    this.add.rectangle(270,250,480,270,0x211b16).setStrokeStyle(3,0x5c4938);
    this.add.text(56,155,'WORKSHOP',{
      fontFamily:'monospace',fontSize:'18px',color:'#b58a61'
    });
    this.add.text(54,195,'ASH',{
      fontFamily:'monospace',fontSize:'42px',color:'#e3dbcf',fontStyle:'bold'
    });
    this.add.text(54,250,'灰色の髪 / 赤錆色の目\nガラクタ整備士',{
      fontFamily:'"Noto Sans JP", sans-serif',fontSize:'18px',color:'#a99782',lineSpacing:8
    });

    this.add.circle(415,250,74,0x40352b).setStrokeStyle(5,0xa8764a);
    this.add.circle(415,225,30,0xd3cec6);
    this.add.rectangle(415,292,70,78,0x22201f);
    this.add.rectangle(415,266,90,16,0x8f4d35);

    this.inv=this.add.text(42,335,'',{
      fontFamily:'monospace',fontSize:'15px',color:'#dac2a4',
      backgroundColor:'#15120f',padding:{x:14,y:12},wordWrap:{width:430}
    });
    this.refresh();

    this.log=this.add.text(42,455,'「今日は何を直す。」',{
      fontFamily:'"Noto Sans JP", sans-serif',fontSize:'18px',color:'#eee3d4',
      backgroundColor:'#171411',padding:{x:16,y:15},wordWrap:{width:430}
    });

    this.makeButton(270,610,'探索する','SCRAPYARDへ',()=>this.scene.start('Explore'));
    this.makeButton(270,710,'クラフト','PILE-01を組み立てる',()=>this.craft());
    this.makeButton(270,810,'休む','HPを回復 / 日付を進める',()=>this.rest());
  }

  private drawShell(title:string,sub:string){
    this.cameras.main.setBackgroundColor('#0e0c0a');
    this.add.rectangle(270,480,510,930,0x15120f).setStrokeStyle(4,0x4d3b2e);
    this.add.text(30,28,title,{fontFamily:'monospace',fontSize:'24px',color:'#eadfce',fontStyle:'bold'});
    this.add.text(30,65,sub,{fontFamily:'monospace',fontSize:'13px',color:'#8e735d'});
    this.add.line(270,105,25,0,515,0,0x664a36).setLineWidth(2);
  }

  private makeButton(x:number,y:number,title:string,sub:string,fn:()=>void){
    const bg=this.add.rectangle(x,y,450,78,0x30241c).setStrokeStyle(2,0x8a6544).setInteractive();
    this.add.text(64,y-17,title,{fontFamily:'"Noto Sans JP", sans-serif',fontSize:'22px',color:'#f2dfc7'});
    this.add.text(64,y+12,sub,{fontFamily:'monospace',fontSize:'12px',color:'#9d836c'});
    bg.on('pointerdown',()=>{ bg.setFillStyle(0x5a3925); this.time.delayedCall(80,fn); });
  }

  private craft(){
    if(GameState.data.crafted.includes('PILE-01')){
      this.say('PILE-01 は完成済み。次は実戦で試したい。'); return;
    }
    const cost={'Rusted Gear':1,'Copper Wire':1,'Pressure Cylinder':1};
    if(GameState.consume(cost)){
      GameState.data.crafted.push('PILE-01'); GameState.save(); this.refresh();
      this.cameras.main.flash(220,205,155,90);
      this.say('CRAFT COMPLETE : PILE-01');
    }else{
      this.say('素材不足：GEAR ×1 / WIRE ×1 / CYLINDER ×1');
    }
  }

  private rest(){
    GameState.data.hp=GameState.data.maxHp;
    GameState.data.day+=1;
    GameState.save();
    this.scene.restart();
  }

  private refresh(){
    const i=GameState.data.inventory;
    const weapon=GameState.data.crafted.includes('PILE-01')?'PILE-01':'NONE';
    this.inv?.setText(
      `HP ${GameState.data.hp}/${GameState.data.maxHp}    SCRAP ${GameState.data.scrap}\n`+
      `GEAR ${i['Rusted Gear']??0} / WIRE ${i['Copper Wire']??0} / CYL ${i['Pressure Cylinder']??0}\n`+
      `WEAPON : ${weapon}`
    );
  }

  private say(t:string){
    this.log.setText(t);
  }
}
