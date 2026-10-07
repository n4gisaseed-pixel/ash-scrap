import Phaser from 'phaser';

export class TitleScene extends Phaser.Scene {
 constructor(){ super('Title'); }
 create(){
  const {width:w,height:h}=this.scale;
  this.cameras.main.setBackgroundColor('#12100d');
  this.add.rectangle(w/2,h/2,w,h,0x12100d);
  for(let i=0;i<26;i++) this.add.circle(Phaser.Math.Between(0,w),Phaser.Math.Between(0,h),Phaser.Math.Between(1,3),0x8d6241,Phaser.Math.FloatBetween(.08,.28));
  this.add.text(w/2,h*.28,'ASH / SCRAP',{fontFamily:'monospace',fontSize:'62px',color:'#e4ddd0',fontStyle:'bold',stroke:'#241a14',strokeThickness:8}).setOrigin(.5);
  this.add.text(w/2,h*.39,'— discarded things still have a purpose —',{fontFamily:'monospace',fontSize:'15px',color:'#9f8064'}).setOrigin(.5);
  const start=this.add.text(w/2,h*.60,'[ NEW GAME ]',{fontFamily:'monospace',fontSize:'25px',color:'#d9c5a6',backgroundColor:'#29211b',padding:{x:18,y:10}}).setOrigin(.5).setInteractive({useHandCursor:true});
  this.add.text(w/2,h*.73,'ENTER / CLICK',{fontFamily:'monospace',fontSize:'13px',color:'#766557'}).setOrigin(.5);
  const go=()=>this.scene.start('Workshop');
  start.on('pointerover',()=>start.setColor('#ffffff')).on('pointerout',()=>start.setColor('#d9c5a6')).on('pointerdown',go);
  this.input.keyboard?.once('keydown-ENTER',go);
 }
}