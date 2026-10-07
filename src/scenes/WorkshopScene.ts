import Phaser from 'phaser';
import { MobileControls } from '../ui/MobileControls';
import { GameState } from '../state/GameState';

export class WorkshopScene extends Phaser.Scene {
 private player!: Phaser.Physics.Arcade.Sprite;
 private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
 private keys!: Record<string,Phaser.Input.Keyboard.Key>;
 private mobile!: MobileControls;
 private message!: Phaser.GameObjects.Text;
 private bench!: Phaser.GameObjects.Rectangle;
 private door!: Phaser.GameObjects.Rectangle;
 private inventoryText!: Phaser.GameObjects.Text;

 constructor(){super('Workshop');}

 create(){
  const W=960,H=540;
  this.cameras.main.setBackgroundColor('#17130f');
  this.add.rectangle(W/2,H/2,W-70,H-70,0x29231c).setStrokeStyle(5,0x5d4734);
  for(let y=55;y<500;y+=48) for(let x=55;x<920;x+=64) this.add.rectangle(x,y,58,42,0x302920).setStrokeStyle(1,0x3d3328);

  this.add.rectangle(155,100,190,72,0x4a3425).setStrokeStyle(3,0x8a6544);
  this.add.text(78,82,'PARTS / JUNK',{fontFamily:'monospace',fontSize:'15px',color:'#c3a37e'});

  this.bench=this.add.rectangle(770,125,230,95,0x563b27).setStrokeStyle(4,0xb07745);
  this.add.text(700,105,'WORKBENCH',{fontFamily:'monospace',fontSize:'18px',color:'#f0c58e'});
  this.add.text(690,145,'PILE-01\nGear + Wire + Cylinder',{fontFamily:'monospace',fontSize:'12px',color:'#cfa87a'});

  this.add.circle(655,380,58,0x342b22).setStrokeStyle(7,0x765237);
  this.add.circle(655,380,24,0x181614).setStrokeStyle(4,0xa56b3d);
  this.add.text(610,447,'OLD BOILER',{fontFamily:'monospace',fontSize:'12px',color:'#96775d'});

  this.door=this.add.rectangle(83,310,48,130,0x2b211b).setStrokeStyle(4,0xa46d42);
  this.add.text(83,225,'EXIT',{fontFamily:'monospace',fontSize:'14px',color:'#e2c49f'}).setOrigin(.5);

  const g=this.add.graphics(); g.fillStyle(0xd7d2c9).fillCircle(16,10,8);g.fillStyle(0x24201e).fillRect(8,18,16,20);g.fillStyle(0x8b4c37).fillRect(7,20,18,5);g.fillStyle(0xb88951).fillRect(6,4,20,4);g.generateTexture('ash-placeholder',32,42);g.destroy();
  this.player=this.physics.add.sprite(470,320,'ash-placeholder').setCollideWorldBounds(true);
  this.player.body!.setSize(22,28).setOffset(5,13);
  this.physics.world.setBounds(42,42,W-84,H-84);

  this.cursors=this.input.keyboard!.createCursorKeys();
  this.keys=this.input.keyboard!.addKeys('W,A,S,D,E') as Record<string,Phaser.Input.Keyboard.Key>;
  this.mobile=new MobileControls(this);

  this.add.text(18,14,'ASH\'S WORKSHOP',{fontFamily:'monospace',fontSize:'18px',color:'#e6d7c1',backgroundColor:'#15120f',padding:{x:10,y:6}}).setDepth(10);
  this.inventoryText=this.add.text(690,14,'',{fontFamily:'monospace',fontSize:'12px',color:'#d2b48b',backgroundColor:'#15120f',padding:{x:9,y:6}}).setDepth(10);
  this.refreshInventory();

  this.message=this.add.text(W/2,H-92,'',{fontFamily:'monospace',fontSize:'17px',color:'#eee3d4',backgroundColor:'#171411',padding:{x:18,y:12},wordWrap:{width:720}}).setOrigin(.5).setDepth(1200).setVisible(false);
 }

 update(){
  const speed=180; let x=0,y=0;
  if(this.cursors.left.isDown||this.keys.A.isDown)x=-1; else if(this.cursors.right.isDown||this.keys.D.isDown)x=1;
  if(this.cursors.up.isDown||this.keys.W.isDown)y=-1; else if(this.cursors.down.isDown||this.keys.S.isDown)y=1;
  const mv=this.mobile.vector(); x+=mv.x; y+=mv.y;
  const v=new Phaser.Math.Vector2(x,y).normalize().scale(speed); this.player.setVelocity(v.x,v.y);

  const act=Phaser.Input.Keyboard.JustDown(this.keys.E)||this.mobile.consumeAction();
  if(!act) return;

  const doorDist=Phaser.Math.Distance.Between(this.player.x,this.player.y,this.door.x,this.door.y);
  if(doorDist<100){ this.scene.start('Scrapyard'); return; }

  const benchDist=Phaser.Math.Distance.Between(this.player.x,this.player.y,this.bench.x,this.bench.y);
  if(benchDist<150){ this.craftPile(); return; }

  this.say('ASH: 「外のスクラップ置き場、まだ漁ってなかったな。」');
 }

 private craftPile(){
  if(GameState.data.crafted.includes('PILE-01')){
    this.say('PILE-01 は完成済み。\nASH: 「悪くない。次は実戦で試す。」'); return;
  }
  const cost={'Rusted Gear':1,'Copper Wire':1,'Pressure Cylinder':1};
  if(GameState.consume(cost)){
    GameState.data.crafted.push('PILE-01'); GameState.save(); this.refreshInventory();
    this.cameras.main.flash(280,210,170,110);
    this.say('CRAFT COMPLETE: PILE-01\nASH: 「……動く。たぶん。」');
  } else {
    this.say('CRAFT: PILE-01\n必要: Rusted Gear / Copper Wire / Pressure Cylinder\nASH: 「部品が足りない。外で拾ってくるか。」');
  }
 }

 private refreshInventory(){
  const inv=GameState.data.inventory;
  const weapon=GameState.data.crafted.includes('PILE-01')?'PILE-01':'—';
  this.inventoryText.setText(`GEAR ${inv['Rusted Gear']??0}  WIRE ${inv['Copper Wire']??0}  CYL ${inv['Pressure Cylinder']??0}\nWEAPON ${weapon}`);
 }

 private say(t:string){this.message.setText(t).setVisible(true);this.time.delayedCall(2500,()=>this.message.setVisible(false));}
}
