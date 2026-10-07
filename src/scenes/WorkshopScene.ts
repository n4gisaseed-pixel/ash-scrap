import Phaser from 'phaser';

export class WorkshopScene extends Phaser.Scene {
 private player!: Phaser.Physics.Arcade.Sprite;
 private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
 private keys!: Record<string,Phaser.Input.Keyboard.Key>;
 private hint!: Phaser.GameObjects.Text;
 private message!: Phaser.GameObjects.Text;
 private bench!: Phaser.GameObjects.Rectangle;
 constructor(){super('Workshop');}
 create(){
  const W=960,H=540;
  this.cameras.main.setBackgroundColor('#17130f');
  this.add.rectangle(W/2,H/2,W-70,H-70,0x29231c).setStrokeStyle(5,0x5d4734);
  // floor plates
  for(let y=55;y<500;y+=48) for(let x=55;x<920;x+=64) this.add.rectangle(x,y,58,42,0x302920).setStrokeStyle(1,0x3d3328);
  // walls / clutter
  this.add.rectangle(155,100,190,72,0x4a3425).setStrokeStyle(3,0x8a6544);
  this.add.text(78,82,'PARTS / JUNK',{fontFamily:'monospace',fontSize:'15px',color:'#c3a37e'});
  this.bench=this.add.rectangle(770,125,230,95,0x563b27).setStrokeStyle(4,0xb07745);
  this.add.text(700,105,'WORKBENCH',{fontFamily:'monospace',fontSize:'18px',color:'#f0c58e'});
  this.add.circle(655,380,58,0x342b22).setStrokeStyle(7,0x765237);
  this.add.circle(655,380,24,0x181614).setStrokeStyle(4,0xa56b3d);
  this.add.text(610,447,'OLD BOILER',{fontFamily:'monospace',fontSize:'12px',color:'#96775d'});
  // player placeholder texture
  const g=this.add.graphics(); g.fillStyle(0xd7d2c9).fillCircle(16,10,8);g.fillStyle(0x24201e).fillRect(8,18,16,20);g.fillStyle(0x8b4c37).fillRect(7,20,18,5);g.fillStyle(0xb88951).fillRect(6,4,20,4);g.generateTexture('ash-placeholder',32,42);g.destroy();
  this.player=this.physics.add.sprite(470,320,'ash-placeholder').setCollideWorldBounds(true);
  this.player.body!.setSize(22,28).setOffset(5,13);
  this.cursors=this.input.keyboard!.createCursorKeys();
  this.keys=this.input.keyboard!.addKeys('W,A,S,D,E') as Record<string,Phaser.Input.Keyboard.Key>;
  this.add.text(18,14,'ASH\'S WORKSHOP',{fontFamily:'monospace',fontSize:'18px',color:'#e6d7c1',backgroundColor:'#15120f',padding:{x:10,y:6}}).setDepth(10);
  this.hint=this.add.text(W/2,H-30,'WASD / ARROWS : MOVE    E : INTERACT',{fontFamily:'monospace',fontSize:'13px',color:'#b99b79',backgroundColor:'#15120f',padding:{x:10,y:5}}).setOrigin(.5).setDepth(10);
  this.message=this.add.text(W/2,H-92,'',{fontFamily:'monospace',fontSize:'17px',color:'#eee3d4',backgroundColor:'#171411',padding:{x:18,y:12},wordWrap:{width:720}}).setOrigin(.5).setDepth(20).setVisible(false);
  this.physics.world.setBounds(42,42,W-84,H-84);
 }
 update(){
  const speed=180; let x=0,y=0;
  if(this.cursors.left.isDown||this.keys.A.isDown)x=-1; else if(this.cursors.right.isDown||this.keys.D.isDown)x=1;
  if(this.cursors.up.isDown||this.keys.W.isDown)y=-1; else if(this.cursors.down.isDown||this.keys.S.isDown)y=1;
  const v=new Phaser.Math.Vector2(x,y).normalize().scale(speed); this.player.setVelocity(v.x,v.y);
  const d=Phaser.Math.Distance.Between(this.player.x,this.player.y,this.bench.x,this.bench.y);
  if(Phaser.Input.Keyboard.JustDown(this.keys.E)){
   if(d<150)this.showMessage('ASH: 「……圧力シリンダー、まだ使えるな。」\nWORKBENCH は次の開発段階で CRAFT に接続されます。');
   else this.showMessage('ASH: 「使えそうなガラクタ、どっかに落ちてないかな。」');
  }
 }
 private showMessage(t:string){this.message.setText(t).setVisible(true);this.time.delayedCall(2600,()=>this.message.setVisible(false));}
}