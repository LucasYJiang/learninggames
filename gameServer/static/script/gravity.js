/**
 * Created by lucasjiang on 10/4/15.
 */
var config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'phaser-game',
    scene:  {
        preload: preload,
        create: create,
        update: update
},
    physics: {
        default: 'arcade',
        arcade: {debug: true}
    }
}
var game = new Phaser.Game(config);
var gameOptions = {

                   // width of the path, in pixels
                   pathWidth: 500,

                   // height of the path, in pixels
                   pathHeight: 800,

                   // radius of path curves, in pixels
                   curveRadius: 50,

                   // amount of targets in game
                   targets: 5,

                   // min and max milliseconds needed by the targets
                   // to run all the way around the path
                   targetSpeed: {
                       min: 6000,
                       max: 10000
                   },

                   // min and max target size, in pixels
                   targetSize: {
                       min: 100,
                       max: 200
                   },

                   // milliseconds needed by the gun to rotate by 360 degrees
                   gunSpeed: 5000,

                   // multiplier to be applied to gun rotation speed each time
                   // the gun fires
                   gunThrust: 2,

                   // maximum gun speed multiplier.
                   // If gunSpeed is 5000 and maxGunSpeedMultiplier is 15,
                   // maximum gun rotation will allow to rotate by 360 degrees
                   // in 5000/15 seconds
                   maxGunSpeedMultiplier: 15,

                   //gunFriction will reduce gun rotating speed each time the gun
                   // completes a 360 degrees rotation
                   gunFriction: 0.9
               }

var guns =[];
var t = 0;
var balloon1;
var points;
var bombs;
var score
var scoreText

function preload() {
    this.load.image('background', 'static/assets/background.jpg');
    this.load.image("gun", "static/assets/gun.png");
    this.load.image("fireline", "static/assets/fireline.png");
    this.load.image("balloon1","static/assets/gold-balloon_.jpg" )
    this.load.image('bomb', 'static/assets/bomb.png');
}


function create() {
    var game =this;

    this.add.image(512, 384, 'background');
    path = new Phaser.Curves.Path(0, 60);
    path.lineTo(70, 60);
    path.lineTo(70, 205);
    path.lineTo(110, 205);
    path.lineTo(110, 415);
    path.lineTo(190, 415);
    path.lineTo(190, 490);
    path.lineTo(400, 490);
    path.lineTo(400, 345);
    path.lineTo(300, 345);
    path.lineTo(300, 190);
    path.lineTo(400, 190);
    path.lineTo(400, 100);
    path.lineTo(630, 100);
    path.lineTo(630, 240);
    path.lineTo(700, 240);
    path.lineTo(700, 370);
    path.lineTo(600, 370);
    path.lineTo(600, 440);
    path.lineTo(850, 440);
    path.lineTo(850, 213);
    path.lineTo(1024, 213);
    graphics = this.add.graphics();
    graphics.lineStyle(2, 0xffffff, 1);

    path.draw(graphics);

    graphics = this.add.graphics();
    graphics.lineStyle(2, 0xffffff, 1);

    path.draw(graphics);
    points = path.getSpacedPoints(32);
     bombs = this.physics.add.group();
     var gunOrigin = this.physics.add.image(100, 680, "gun")

  balloon1 = this.physics.add.image(20, 60, "balloon1")

     balloon1.setScale(0.1)

     nextPoint(game);

    addGun(this);




  // tween to rotate the gun
   this.input.on('dragstart', function (pointer, gameObject) {
          console.log("drag start")
         gameObject.setTint(0xff0000);
     });
     this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
         gameObject.x = dragX;
         gameObject.y = dragY;
     });
     this.input.on('dragend', function (pointer, gameObject) {

         gameObject.clearTint();
         gameObject.disableInteractive();
         guns.push(gameObject)

        var bomb = bombs.create(gameObject.x, gameObject.y, 'bomb');
         bomb.setBounce(1);
      //   bomb.setCollideWorldBounds(true);
         bomb.setVelocity(Phaser.Math.Between(-200, 200), 200);

        addGun(game);
     var gunTween = game.tweens.add({
         targets: [gameObject],
         angle: 360,
         duration: gameOptions.gunSpeed,
         repeat: -1,
         callbackScope: game,
         onRepeat: function(){
         gunTween.timeScale = Math.max(1, gunTween.timeScale * gameOptions.gunFriction);
         }
     });
     });

       this.physics.add.collider(balloon1, bombs, hitBomb, null, this);
       scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
}

function update() {

}

function addGun(game){
    var gunOrigin = game.add.sprite(100, 680, "gun").setInteractive();

    gunOrigin.on('pointerover', function () {
        this.setTint(0x00ff00);
    });
    gunOrigin.on('pointerout', function () {
        this.clearTint();
    });
    game.input.setDraggable(gunOrigin);




}
function nextPoint (scene)
{
    var next = points[t % points.length];

    moveToXY(balloon1, next.x, next.y, 0, 200);
    t++;

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

        speed = Math.sqrt(dx * dx + dy * dy) / (maxTime / 700);
    }
console.log(Math.cos(angle) * speed)
    gameObject.setVelocityX(Math.cos(angle) * speed);
    gameObject.setVelocityY(Math.sin(angle) * speed);

    // gameObject.rotation = angle;
}
function hitBomb (player, bomb )
{

    player.setTint(0xff0000);

    // player.anims.play('turn');

    //gameOver = false;
    bomb.disableBody(true, true);
    player.disableBody(true, true);



    score += 10;
    scoreText.setText('Score: ' + score);
    addBomb(player, bomb);
}

function addBomb (player, bomb)
{
     bomb.enableBody(true, true);
}