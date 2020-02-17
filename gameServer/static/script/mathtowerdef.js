/**
 * Created by lucasjiang on 10/4/15.
 */

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var platforms;
var player;
var stars;
var cursors;
var score = 0;
var scoreText;
var bombs;
var path;
var t = 0;
var curve;
var points;
var ship;
var tempVec;
var tempVecP;

var graphics;


function preload ()
{
    this.load.image('sky', 'static/assets/sky.png');
    this.load.image('ground', 'static/assets/platform.png');
    this.load.image('star', 'static/assets/star.png');
    this.load.image('bomb', 'static/assets/bomb.png');
    this.load.spritesheet('dude',
        'static/assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

function create ()
{this.add.image(400, 300, 'sky');

platforms = this.physics.add.staticGroup();

platforms.create(400, 568, 'ground').setScale(2).refreshBody();

platforms.create(600, 400, 'ground');
platforms.create(50, 250, 'ground');
platforms.create(750, 220, 'ground');

    // player = this.physics.add.sprite(100, 450, 'dude');
    //
    // player.setBounce( 0.7 );
    // player.setCollideWorldBounds(true);

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
    // this.physics.add.collider(player, platforms);
    stars = this.physics.add.group({
        key: 'star',
        repeat: 23,
        setXY: { x: 20, y: 0, stepX: 32 }
    });

    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));


    });
    this.physics.add.collider(stars, platforms);
    // this.physics.add.overlap(player, stars, collectStar, null, this)
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);

    // this.physics.add.collider(player, bombs, hitBomb, null, this);
    path = new Phaser.Curves.Path(40, 200);
    path.lineTo(270, 200);
    path.lineTo(270, 500);
    path.lineTo(380, 500);
    path.lineTo(380, 350);
    path.lineTo(530, 350);
    path.lineTo(530, 180);
    path.lineTo(760, 180);
    path.lineTo(40, 200);

    graphics = this.add.graphics();
    graphics.lineStyle(2, 0xffffff, 1);

    path.draw(graphics);

    curve = new Phaser.Curves.Ellipse(400, 300, 200);

    points = path.getSpacedPoints(32);

    tempVec = new Phaser.Math.Vector2();
    tempVecP = new Phaser.Math.Vector2();

    ship = this.physics.add.image(points[0].x, points[0].y, 'dude');
    this.physics.add.overlap(ship, stars, collectStar, null, this);
    this.physics.add.collider(ship, bombs, hitBomb, null, this);

    nextPoint(this);
}




function update ()
{
    // cursors = this.input.keyboard.createCursorKeys();
    // if (cursors.left.isDown)
    // {
    //     player.setVelocityX(-160);
    //
    //     player.anims.play('left', true);
    // }
    // else if (cursors.right.isDown)
    // {
    //     player.setVelocityX(160);
    //
    //     player.anims.play('right', true);
    // }
    // else
    // {
    //     player.setVelocityX(0);
    //
    //     player.anims.play('turn');
    // }
    //
    // if (cursors.up.isDown && player.body.touching.down)
    // {
    //     player.setVelocityY(-330);
    //
    // }
}
function collectStar (player, star)
{
    star.disableBody(true, true);





        score += 10;
        scoreText.setText('Score: ' + score);
    if (stars.countActive(true) === 0)
    {
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 200);

    }

}
function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    // player.anims.play('turn');

    gameOver = true;
}
function nextPoint (scene)
{
    var next = points[t % points.length];

    moveToXY(ship, next.x, next.y, 0, 200);

    t++;
    console.log(t,next);
    bombs.children.entries.forEach(function (bomb) {

        if (next.x-bomb.x<100){
            console.log(bomb.x,bomb.y,bomb);

           if (bomb.x<100||bomb.x>700){
               bomb.y = bomb.y-100
               bomb.x=bomb.x+600;
           }
           else {
               bomb.x=bomb.x-100;
           }

        }

    });


    scene.time.addEvent({ delay: 200, callback: nextPoint, callbackScope: scene, args: [ scene ] });
}

function moveToXY (gameObject, x, y, speed, maxTime)
{
    if (speed === undefined) { speed = 50; }
    if (maxTime === undefined) { maxTime = 0; }

    var angle = Math.atan2(y - gameObject.y, x - gameObject.x);

    if (maxTime > 0)
    {
        //  We know how many pixels we need to move, but how fast?
        var dx = gameObject.x - x;
        var dy = gameObject.y - y;

        speed = Math.sqrt(dx * dx + dy * dy) / (maxTime / 1000);
    }

    gameObject.setVelocityX(Math.cos(angle) * speed);
    gameObject.setVelocityY(Math.sin(angle) * speed);

    // gameObject.rotation = angle;
}
