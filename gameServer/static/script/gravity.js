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

function preload() {
    this.load.image('background', 'static/assets/background.jpg');
    this.load.image("level 1 tower.png", "static/assets/level 1 tower.png");
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

}

function update() {


}
