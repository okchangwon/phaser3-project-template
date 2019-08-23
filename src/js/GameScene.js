import { Scene } from "phaser";
import { getAssetImg } from "./helper/util";

export default class GameScene extends Scene {

  constructor ()
  {
      super({key: "GameScene", active: true});

      this.score = 0;
      this.scoreText = null;
      this.cursors = null;
      this.player = null;
      this.stars = null;

  }

  preload() {
      this.load.image('sky', getAssetImg("sky"));
      this.load.image('ground', getAssetImg("platform"));
      this.load.image('star', getAssetImg("star"));
      this.load.image('bomb', getAssetImg("bomb"));
      this.load.spritesheet('dude', getAssetImg("dude"), { frameWidth: 32, frameHeight: 48 });
  }

  create ()
  {
    this.add.image(400, 300, 'sky');

    const platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    this.player = this.physics.add.sprite(100, 450, 'dude');

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

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

    this.stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    this.stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
    });

    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.stars, platforms);
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
  }

  update ()
  {
    if (this.cursors.left.isDown)
    {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    }
    else if (this.cursors.right.isDown)
    {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    }
    else
    {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.player.body.touching.down)
    {
      this.player.setVelocityY(-330);
    }
  }

  collectStar (player, star)
  {
    star.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);
  }
}