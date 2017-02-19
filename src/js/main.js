let PlayState = {};

PlayState.preload = function() {
  this.game.load.image('background', 'images/background.png');
};
PlayState.create = function() {
  this.game.add.image(0, 0, 'background');
};

window.onload = function() {
  new Phaser.Game(512, 512, Phaser.AUTO, 'game', PlayState);
};
