import Phaser from 'phaser';
import { GameState } from '../state/GameState';

export class BattleScene extends Phaser.Scene {
  private enemyHp=80;
  private enemyMax=80;
  private heat=0;
  private log!: Phaser.GameObjects.Text;
  private enemyHpText!: Phaser.GameObjects.Text;
  private playerHpText!: Phaser.GameObjects.Text;
  private heatText!: Phaser.GameObjects.Text;
  private ended=false;

  constructor(){ super('Battle'); }

  create(){
    this.cameras.main.setBackgroundColor('#0c0b09');
    this.add.rectangle(270,480,510,930,0x15120f).setStrokeStyle(4,0x4f3c2f);
    this.add.text(30,28,'BATTLE / SCRAP HOUND',{fontFamily:'monospace',fontSize:'23px',color:'#eadfce',fontStyle:'bold'});

    this.add.rectangle(270,285,460,310,0x24221e).setStrokeStyle(3,0x5f5043);
    this.drawEnemy();
    this.enemyHpText=this.add.text(270,445,'',{fontFamily:'monospace',fontSize:'15px',color:'#dcb28a'}).setOrigin(.5);

    this.playerHpText=this.add.text(40,510,'',{fontFamily:'monospace',fontSize:'17px',color:'#d8c2a5'});
    this.heatText=this.add.text(350,510,'',{fontFamily:'monospace',fontSize:'17px',color:'#c8784d'});

    this.log=this.add.text(38,555,'SCRAP HOUND が現れた。',{
      fontFamily:'"Noto Sans JP", sans-serif',fontSize:'17px',color:'#eee3d4',
      backgroundColor:'#171411',padding:{x:16,y:14},wordWrap:{width:430},fixedWidth:464
    });

    this.makeButton(150,725,'ATTACK',()=>this.attack(18));
    this.makeButton(390,725,'GADGET',()=>this.attack(GameState.data.crafted.includes('PILE-01')?32:12));
    this.makeButton(150,820,'TUNE',()=>this.tune());
    this.makeButton(390,820,'RETURN',()=>this.scene.start('Explore'));
    this.refresh();
  }

  private drawEnemy(){
    this.add.circle(270,275,74,0x3a332c).setStrokeStyle(5,0x825d43);
    this.add.rectangle(270,290,145,80,0x4a4037);
    this.add.circle(232,250,11,0xd16043);
    this.add.circle(308,250,11,0xd16043);
    this.add.rectangle(270,330,100,14,0x1c1917);
    this.add.text(270,170,'SCRAP HOUND',{fontFamily:'monospace',fontSize:'19px',color:'#caa17b'}).setOrigin(.5);
  }

  private makeButton(x:number,y:number,label:string,fn:()=>void){
    const b=this.add.rectangle(x,y,210,72,0x34261e).setStrokeStyle(2,0x8f6748).setInteractive();
    this.add.text(x,y,label,{fontFamily:'monospace',fontSize:'20px',color:'#f0ddc3',fontStyle:'bold'}).setOrigin(.5);
    b.on('pointerdown',()=>{ if(this.ended)return; b.setFillStyle(0x674127); this.time.delayedCall(70,fn); });
  }

  private attack(base:number){
    const bonus=Math.floor(this.heat/20);
    const dmg=base+bonus;
    this.enemyHp=Math.max(0,this.enemyHp-dmg);
    this.heat=Math.min(100,this.heat+12);
    this.log.setText(`ASHの攻撃。 ${dmg} DAMAGE。`);
    if(this.enemyHp<=0){ this.win(); return; }
    this.enemyTurn();
  }

  private tune(){
    this.heat=Math.max(0,this.heat-35);
    this.log.setText('TUNE：冷却弁を調整。HEAT -35。');
    this.enemyTurn();
  }

  private enemyTurn(){
    const dmg=Phaser.Math.Between(8,14);
    GameState.data.hp=Math.max(0,GameState.data.hp-dmg);
    GameState.save();
    this.time.delayedCall(300,()=>{
      this.log.setText(this.log.text+`\nSCRAP HOUNDの攻撃。 ${dmg} DAMAGE。`);
      if(GameState.data.hp<=0){
        this.ended=true;
        GameState.data.hp=GameState.data.maxHp;
        GameState.save();
        this.log.setText('ASHは倒れた……工房へ戻された。');
        this.time.delayedCall(1000,()=>this.scene.start('Hub'));
      }
      this.refresh();
    });
    this.refresh();
  }

  private win(){
    this.ended=true;
    GameState.data.scrap+=12;
    GameState.add('Rusted Gear',1);
    GameState.save();
    this.log.setText('SCRAP HOUNDを撃破。\nRusted Gear +1 / SCRAP +12');
    this.refresh();
    this.time.delayedCall(900,()=>this.scene.start('Explore'));
  }

  private refresh(){
    this.enemyHpText.setText(`ENEMY HP  ${this.enemyHp}/${this.enemyMax}`);
    this.playerHpText.setText(`ASH HP  ${GameState.data.hp}/${GameState.data.maxHp}`);
    this.heatText.setText(`HEAT ${this.heat}%`);
  }
}
