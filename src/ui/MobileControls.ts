import Phaser from 'phaser';

type Dir = 'left' | 'right' | 'up' | 'down';

export class MobileControls {
  private active = new Set<Dir>();
  private actionQueued = false;

  constructor(private scene: Phaser.Scene) {
    const depth = 1000;
    const alpha = 0.46;
    const make = (x:number,y:number,label:string,dir:Dir) => {
      const c = scene.add.circle(x,y,34,0x171411,alpha).setStrokeStyle(2,0xd0aa78,.55).setDepth(depth).setScrollFactor(0).setInteractive();
      const t = scene.add.text(x,y,label,{fontFamily:'monospace',fontSize:'22px',color:'#f3dfc1'}).setOrigin(.5).setDepth(depth+1).setScrollFactor(0);
      const on=()=>{this.active.add(dir); c.setFillStyle(0x5f3d25,.78)};
      const off=()=>{this.active.delete(dir); c.setFillStyle(0x171411,alpha)};
      c.on('pointerdown',on).on('pointerup',off).on('pointerout',off);
      return [c,t];
    };
    make(92,452,'◀','left');
    make(166,452,'▶','right');
    make(129,415,'▲','up');
    make(129,489,'▼','down');

    const a = scene.add.circle(850,452,48,0x7b3d24,.72).setStrokeStyle(3,0xe4bb84,.8).setDepth(depth).setScrollFactor(0).setInteractive();
    scene.add.text(850,452,'A',{fontFamily:'monospace',fontSize:'28px',fontStyle:'bold',color:'#fff0da'}).setOrigin(.5).setDepth(depth+1).setScrollFactor(0);
    a.on('pointerdown',()=>{ this.actionQueued = true; a.setScale(.92); });
    a.on('pointerup',()=>a.setScale(1));
  }

  vector() {
    let x=0,y=0;
    if(this.active.has('left')) x-=1;
    if(this.active.has('right')) x+=1;
    if(this.active.has('up')) y-=1;
    if(this.active.has('down')) y+=1;
    return new Phaser.Math.Vector2(x,y);
  }

  consumeAction() {
    const v=this.actionQueued;
    this.actionQueued=false;
    return v;
  }
}
