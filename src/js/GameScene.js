import { Scene } from "phaser";
import { getAssetImg } from "./helper/util";
import { SCALE_RATIO } from "./constants";

const CHAR_MOVING_INERTIA = 40; // 캐릭터 좌우 이동 관성
const CHAR_MOVING_SPEED = 0.1 * SCALE_RATIO; // 캐릭터 좌우 이동 속도

const DROP_TIMER_SEC = 300; // 드랍 간격(밀리초))
const DROP_TIMER_DIF = 0.3; // 간격 편차(0.0 ~ 1.0)

function getRootBody(body) {
    if (body.parent === body) {
        return body;
    }
    while (body.parent !== body) {
        body = body.parent;
    }
    return body;
}

export default class GameScene extends Scene {

  constructor ()
  {
      super({key: "GameScene", active: true});

      this.score = 0;
      this.scoreText = null;
      this.cursors = null;
      this.player = null;
      this.balls = null;

      window.addEventListener("blur", () => this.pause());
      window.addEventListener("focus", () => this.resume());
  }

  preload() {
      this.load.image('ground', getAssetImg("platform"));
      this.load.image('ball', getAssetImg("dung"));
      this.load.image('bomb', getAssetImg("bomb"));
      this.load.spritesheet('dude', getAssetImg("dude"), { frameWidth: 32, frameHeight: 48 });
  }

  create ()
  {
    this.player = this.matter.add.sprite(this.game.canvas.width/2, this.game.canvas.height, 'dude');
    this.player.setScale(SCALE_RATIO, SCALE_RATIO);
    this.player.setFixedRotation();
    this.player.setAngle(0);
    this.player.setMass(CHAR_MOVING_INERTIA);
    
    console.log(Phaser);
    // this.scale.scaleMode = Phaser.Scale.ScaleModes.WIN
    // this.scale.pageAlignHorizontally = true;
    // this.scale.pageAlignVertically = true;

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.balls = this.add.group();

    this.startDropInterval();

    this.matter.world.on('collisionstart', (event, a, b) =>{
        for (let i = 0; i < event.pairs.length; i++) {
            const bodyA = getRootBody(event.pairs[i].bodyA);
            const bodyB = getRootBody(event.pairs[i].bodyB);
            const keyA = bodyA.gameObject && bodyA.gameObject.texture && bodyA.gameObject.texture.key;
            const keyB = bodyB.gameObject && bodyB.gameObject.texture && bodyB.gameObject.texture.key;

            if (keyA === "dude" && keyB === "ball") {
                console.log("충돌")
            }
        }
 
    });

    // this.stars = this.matter.add.group({
    //     key: 'star',
    //     repeat: 11,
    //     setXY: { x: 12, y: 0, stepX: 70 }
    // });

    // this.stars.children.iterate(function (child) {
    //     child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
    // });

    // this.matter.add.overlap(this.player, this.stars, this.collectStar, null, this);
  }

  pause() {
    this.scene.pause();
  }

  resume() {
    if (!this.scene.isPaused()) {
        return;
    }
    this.scene.resume();

    requestAnimationFrame(() => this.startDropInterval());
  }

  getRandimgDropTerm() {
    const diffSec = DROP_TIMER_SEC * DROP_TIMER_DIF;
    const minSec = DROP_TIMER_SEC - diffSec;

    return minSec + (Math.random() * diffSec * 2);
  }

  startDropInterval() {
    if (this.scene.isPaused()) {
        return;
    }

    this.drop();

    setTimeout(() => this.startDropInterval(), this.getRandimgDropTerm());
  }

  drop() {
    const ball = this.matter.add.sprite(Math.random() * this.game.canvas.width, 0, 'ball').setSensor(true);

    ball.name = "star";
    ball.setScale(SCALE_RATIO, SCALE_RATIO);
    
    // ball.gravity = 10;
    // ball.body.collideWorldBounds = true;
    // ball.body.bounce.setTo(0.8, 0.8);
    // ball.body.velocity.setTo(10 + Math.random() * 40, 10 + Math.random() * 40);

    this.balls.add(ball);
  }

  isLeftDown() {
    const leftKeyIsDown = this.cursors.left.isDown;
    const pointer = this.input.activePointer;
    const pointerIsLeft = pointer.isDown && pointer.x < window.innerWidth/2;
    
    return leftKeyIsDown || pointerIsLeft;
  }

  isRightDown() {
    const rightKeyIsDown = this.cursors.right.isDown;
    const pointer = this.input.activePointer;
    const pointerIsRight = pointer.isDown && pointer.x >= window.innerWidth/2;
    
    return rightKeyIsDown || pointerIsRight;
  }

  update ()
  {
    // console.log("update", this.player.body.velocity.x);

    if (this.isLeftDown()) {
        this.player.thrustBack(CHAR_MOVING_SPEED);
        this.player.anims.play('left', true);
    } else if (this.isRightDown()) {
        this.player.thrust(CHAR_MOVING_SPEED);
        this.player.anims.play('right', true);
    } else if (Math.abs(this.player.body.velocity.x) <= 0.3) {
        this.player.anims.play('turn', true);
    }
  }

  collectStar (player, star)
  {
    star.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);
  }
}