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

var game;
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

var gameConfig = {
    type: Phaser.AUTO,
    backgroundColor: 0x222222,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: "spinnygun",
        width: 750,
        height: 1334
    },
    scene: {
        preload: preload,
        create: create
    }
}
game = new Phaser.Game(gameConfig);


function preload ()
{


    this.load.image("tile", "static/assets/tile.png");
    this.load.image("gun", "static/assets/gun.png");
    this.load.image("fireline", "static/assets/fireline.png");
}

function create () {
    // determine the offset to make path always stand in the center of the stage
    var offset = new Phaser.Math.Vector2((game.config.width - gameOptions.pathWidth) / 2, (game.config.height - gameOptions.pathHeight) / 2);

    // building a path using lines and ellipses. Ellipses are used to create
    // circle arcs and build the curves
    var path = new Phaser.Curves.Path(offset.x + gameOptions.curveRadius, offset.y);
    path.lineTo(offset.x + gameOptions.pathWidth - gameOptions.curveRadius, offset.y);
    path.ellipseTo(-gameOptions.curveRadius, -gameOptions.curveRadius, 90, 180, false, 0);
    path.lineTo(offset.x + gameOptions.pathWidth, offset.y + gameOptions.pathHeight - gameOptions.curveRadius);
    path.ellipseTo(-gameOptions.curveRadius, -gameOptions.curveRadius, 180, 270, false, 0);
    path.lineTo(offset.x + gameOptions.curveRadius, offset.y + gameOptions.pathHeight);
    path.ellipseTo(-gameOptions.curveRadius, -gameOptions.curveRadius, 270, 0, false, 0);
    path.lineTo(offset.x, offset.y + gameOptions.curveRadius);
    path.ellipseTo(-gameOptions.curveRadius, -gameOptions.curveRadius, 0, 90, false, 0);

    // drawing the path
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(4, 0xffff00, 1);
    path.draw(this.graphics);

    this.fireLine = this.add.sprite(game.config.width / 2, game.config.height / 2, "fireline");
    this.fireLine.setOrigin(0, 0.5);
    this.fireLine.displayWidth = 700;
    this.fireLine.displayHeight = 8;
    this.fireLine.visible = false;

    // the rotating gun
    var gun = this.add.sprite(game.config.width / 2, game.config.height / 2, "gun");

    // the group of targets
    var targets = this.add.group();
    // for(var i = 0; i < gameOptions.targets; i++){

        // target aren't sprites but followers!!!!
        var target = this.add.follower(path, offset.x + gameOptions.curveRadius, offset.y, "tile");
        target.alpha = 0.8;
        target.displayWidth = Phaser.Math.RND.between(gameOptions.targetSize.min, gameOptions.targetSize.max)
        // targets.add(target);


        // the core of the script: targets run along the path starting from a random position
        target.startFollow({
        duration: 4000,
        from:0,
        to:1,
        repeat: -1,
        positionOnPath:true,
        rotateToPath: true
    });

    // }

    // tween to rotate the gun
    this.gunTween = this.tweens.add({
        targets: [gun],
        angle: 360,
        duration: gameOptions.gunSpeed,
        repeat: -1,
        callbackScope: this,
        onRepeat: function(){

            // each round, gun angular speed decreases
            this.gunTween.timeScale = Math.max(1, this.gunTween.timeScale * gameOptions.gunFriction);
        }
    });
    // waiting for user input
    this.input.on("pointerdown", function(pointer){

        // we say we can fire when the fire line is not visible
        if(!this.fireLine.visible){
            this.fireLine.visible = true;
            this.fireLine.angle = gun.angle;

            // gun angular speed increases
            this.gunTween.timeScale = Math.min(gameOptions.maxGunSpeedMultiplier, this.gunTween.timeScale * gameOptions.gunThrust);

            // fire line disappears after 50 milliseconds
            this.time.addEvent({
                delay: 50,
                callbackScope: this,
                callback: function(){
                    this.fireLine.visible = false;
                }
            });

            // calculate the line of fire starting from sprite angle
            var radians = Phaser.Math.DegToRad(this.fireLine.angle);
            var fireStartX = game.config.width / 2;
            var fireStartY = game.config.height / 2;
            var fireEndX = fireStartX + game.config.height / 2 * Math.cos(radians);
            var fireEndY = fireStartY + game.config.height / 2 * Math.sin(radians);
            var lineOfFire = new Phaser.Geom.Line(fireStartX, fireStartY, fireEndX, fireEndY);

            // loop through all targets
            targets.getChildren().forEach(function(target){
                if(target.visible){

                    // get target bounding box
                    var  bounds = target.getBounds();

                    // check if the line intersect the bounding box
                    if(Phaser.Geom.Intersects.LineToRectangle(lineOfFire, bounds)){

                        // target HIT!!!! hide it for 3 seconds
                        target.visible = false;
                        this.time.addEvent({
                            delay: 3000,
                            callback: function(){
                                target.visible = true;
                            }
                        });
                    }
                }
            }.bind(this))
        }
    }, this);
}

function update ()
{

}
