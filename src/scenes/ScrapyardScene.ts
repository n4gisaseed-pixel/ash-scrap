import Phaser from 'phaser';
import { MobileControls } from '../ui/MobileControls';
import { GameState } from '../state/GameState';

export class ScrapyardScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<string,Phaser.Input.Keyboard.Key>;
  private mobile!: MobileControls;
  private message!: Phaser.GameObjects.Text;
  private nodes: Phaser.GameObjects.Container[] = [];
  private exit!: Phaser.GameObjects.Rectangle;

  constructor(){super('Scrapyard');}

  create(){
    const W=960,H=540;
    this.cameras.main.setBackgroundColor('#161616');
    this.add.rectangle(W/2,H/2,W-50,H-50,0x25231f).setStrokeStyle(5,0x4f4437);
    for(let i=0;i<18;i++){
      const x=Phaser.Math.Between(70,890), y=Phaser.Math.Between(70,455);
      this.add.rectangle(x,y,Phaser.Math.Between(24,60),Phaser.Math.Between(14,34),0x4a4036,1).setAngle(Phaser.Math.Between(-25,25));
    }
    this.add.text(18,14,'SCRAPYARD 01',{fontFamily:'monospace',fontSize:'18px',color:'#e8d7be',backgroundColor:'#15120f',padding:{x:10,y:6}}).setDepth(10);
    this.add.text(420,40,'SALVAGE SITE',{fontFamily:'monospace',fontSize:'22px',color:'#b99772'}).setOrigin(.5);

    const g=this.add.graphics(); g.fillStyle(0xd7d2c9).fillCircle(16,10,8);g.fillStyle(0x24201e).fillRect(8,18,16,20);g.fillStyle(0x8b4c37).fillRect(7,20,18,5);g.fillStyle(0xb88951).fillRect(6,4,20,4);g.generateTexture('ash-placeholder-2',32,42);g.destroy();
    this.player=this.physics.add.sprite(120,300,'ash-placeholder-2').setCollideWorldBounds(true);
    this.player.body!.setSize(22,28).setOffset(5,13);
    this.physics.world.setBounds(30,30,W-60,H-60);

    this.cursors=this.input.keyboard!.createCursorKeys();
    this.keys=this.input.keyboard!.addKeys('W,A,S,D,E') as Record<string,Phaser.Input.Keyboard.Key>;
    this.mobile=new MobileControls(this);

    this.exit=this.add.rectangle(70,270,46,120,0x2f241c).setStrokeStyle(3,0xb48355);
    this.add.text(70,205,'WORKSHOP',{fontFamily:'monospace',fontSize:'12px',color:'#ddc5a4'}).setOrigin(.5);

    this.makeNode(380,180,'Rusted Gear');
    this.makeNode(640,320,'Copper Wire');
    this.makeNode(500,410,'Pressure Cylinder');

    this.message=this.add.text(W/2,H-84,'',{fontFamily:'monospace',fontSize:'17px',color:'#f2e7d7',backgroundColor:'#171411',padding:{x:18,y:12},wordWrap:{width:690}}).setOrigin(.5).setDepth(1200).setVisible(false);
  }

  private makeNode(x:number,y:number,item:string){
    const c=this.add.container(x,y);
    const body=this.add.circle(0,0,24,0x5a493a).setStrokeStyle(3,0xb07b4e);
    const gear=this.add.text(0,0,'✦',{fontFamily:'monospace',fontSize:'25px',color:'#e4be8a'}).setOrigin(.5);
    c.add([body,gear]); c.setData('item',item); c.setData('taken',false); this.nodes.push(c);
  }

  update(){
    const speed=175; let x=0,y=0;
    if(this.cursors.left.isDown||this.keys.A.isDown)x=-1; else if(this.cursors.right.isDown||this.keys.D.isDown)x=1;
    if(this.cursors.up.isDown||this.keys.W.isDown)y=-1; else if(this.cursors.down.isDown||this.keys.S.isDown)y=1;
    const mv=this.mobile.vector(); x+=mv.x; y+=mv.y;
    const v=new Phaser.Math.Vector2(x,y).normalize().scale(speed); this.player.setVelocity(v.x,v.y);

    const act=Phaser.Input.Keyboard.JustDown(this.keys.E)||this.mobile.consumeAction();
    if(!act) return;

    if(Phaser.Math.Distance.Between(this.player.x,this.player.y,this.exit.x,this.exit.y)<95){
      this.scene.start('Workshop'); return;
    }

    const target=this.nodes.find(n=>!n.getData('taken')&&Phaser.Math.Distance.Between(this.player.x,this.player.y,n.x,n.y)<90);
    if(target){
      const item=target.getData('item') as string;
      target.setData('taken',true); target.setAlpha(.18); GameState.add(item,1);
      this.say(`SALVAGE +1  ${item}\nASH: 「……これならまだ使える。」`);
    } else {
      this.say('ASH: 「近くに使えそうな物はないな。」');
    }
  }

  private say(t:string){this.message.setText(t).setVisible(true);this.time.delayedCall(2100,()=>this.message.setVisible(false));}
}
