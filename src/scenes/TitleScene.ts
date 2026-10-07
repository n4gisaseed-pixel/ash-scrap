import Phaser from 'phaser';

export class TitleScene extends Phaser.Scene {
  constructor(){ super('Title'); }

  create(){
    const W=540,H=960;
    this.cameras.main.setBackgroundColor('#0d0b09');
    this.add.rectangle(W/2,H/2,W,H,0x0d0b09);

    for(let i=0;i<42;i++){
      this.add.circle(Phaser.Math.Between(0,W),Phaser.Math.Between(0,H),Phaser.Math.Between(1,3),0x8d6241,Phaser.Math.FloatBetween(.06,.24));
    }

    this.add.text(W/2,245,'ASH / SCRAP',{
      fontFamily:'monospace',fontSize:'54px',color:'#eadfce',fontStyle:'bold',
      stroke:'#241a14',strokeThickness:8
    }).setOrigin(.5);

    this.add.text(W/2,310,'NON-FIELD JUNKPUNK RPG',{
      fontFamily:'monospace',fontSize:'16px',color:'#9f8064'
    }).setOrigin(.5);

    this.add.rectangle(W/2,455,330,190,0x1d1814).setStrokeStyle(3,0x5d4734);
    this.add.text(W/2,420,'ASH',{
      fontFamily:'monospace',fontSize:'40px',color:'#d8d1c6'
    }).setOrigin(.5);
    this.add.text(W/2,480,'“まだ使える。”',{
      fontFamily:'"Noto Sans JP", sans-serif',fontSize:'22px',color:'#c99a66'
    }).setOrigin(.5);

    const start=this.add.text(W/2,660,'NEW GAME',{
      fontFamily:'monospace',fontSize:'28px',color:'#f3e2ca',
      backgroundColor:'#5a3925',padding:{x:34,y:17}
    }).setOrigin(.5).setInteractive();

    start.on('pointerdown',()=>this.scene.start('Hub'));
    this.add.text(W/2,725,'TAP TO START',{
      fontFamily:'monospace',fontSize:'13px',color:'#746252'
    }).setOrigin(.5);
  }
}
