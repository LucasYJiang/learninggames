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



function preload() {
    this.load.image('background', 'static/assets/background.jpg');
    this.load.image("gun", "static/assets/gun.png");
    this.load.image("fireline", "static/assets/fireline.png");
}


function create() {
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

     // the rotating gun

     var places = [];
     places.push([400,280]);
     places.push([200,200]);
     places.push([800,382]);
//        var gun2 = this.add.sprite(501, 479, "gun");
        var guns =[];
        var i;
        for (i = 0; i < places.length; i++){
         var gun1 = this.add.sprite(places[i][0],  places[i][1], "gun");
         guns.push(gun1)
        }

           // gun angular speed increases
      // tween to rotate the gun
         this.gunTween = this.tweens.add({
             targets: guns,
             angle: 360,
             duration: gameOptions.gunSpeed,
             repeat: -1,
             callbackScope: this,
             onRepeat: function(){

                 // each round, gun angular speed decreases
                 this.gunTween.timeScale = Math.max(1, this.gunTween.timeScale * gameOptions.gunFriction);
             }
         });
}

function update() {


}
