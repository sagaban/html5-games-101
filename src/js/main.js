/* global Phaser */

/*************************************************
 * Sprites
 ************************************************/
// ///////////// SHIP ////////////////
function Ship(game, x, y) {
  // call Phaser.Sprite parent constructor
  Phaser.Sprite.call(this, game, x, y, 'ship');

  this.anchor.setTo(0.5); // handle the sprite by its center
  this.game.physics.arcade.enable(this); // enable physics
}
// inherit from Phaser.Sprite
Ship.prototype = Object.create(Phaser.Sprite.prototype);
Ship.prototype.constructor = Ship;

Ship.prototype.move = function(dir) {
  const SPEED = 400;
  this.body.velocity.x = SPEED * dir;
};

Ship.prototype.shoot = function() {
  let y = this.y - 12; // vertical offset for bullets, rounded
  const HALF = 22; // width of our sprite, rounded

  this.game.add.existing(new Bullet(this.game, this.x + HALF, y));
  this.game.add.existing(new Bullet(this.game, this.x - HALF, y));
};

// ///////////// BULLET ////////////////
function Bullet(game, x, y) {
    // call Phaser.Sprite parent constructor
  Phaser.Sprite.call(this, game, x, y, 'bullet');

  this.anchor.setTo(0.5, 1); // handle from the bottom
  // set up physics
  this.game.physics.arcade.enable(this);

  this.reset(x, y);
}

// inherit from Phaser.Sprite
Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.reset = function(x, y) {
  // call parent method
  Phaser.Sprite.prototype.reset.call(this, x, y);

  this.body.velocity.y = -400;
};

Bullet.prototype.update = function() {
  // kill bullet when out of the screen
  if (this.y < 0) {
    this.kill();
  }
};

// Creates a new bullet object, using sprite pooling
Bullet.spawn = function(group, x, y) {
  let bullet = group.getFirstExists(false);
  // no free slot found, we need to create a new sprite
  if (bullet === null) {
    bullet = new Bullet(group.game, x, y);
    group.add(bullet);
  }
  // free slot found! we just need to reset the sprite to the initial position
  else {
    bullet.reset(x, y);
  }
};

// ///////////// ALIENS ////////////////
function Alien(game, x, y) {
    // call Phaser.Sprite parent constructor
  Phaser.Sprite.call(this, game, x, y, 'alien');

  this.anchor.setTo(0.5); // handle sprite from its center
  this.game.physics.enable(this); // enable physics

  this.animations.add('fly', [0, 1]); // add animation from sprite sheet
  this.animations.play('fly', 2, true); // play at 2fps, looped
}

// inherit from Phaser.Sprite
Alien.prototype = Object.create(Phaser.Sprite.prototype);
Alien.prototype.constructor = Alien;

/*************************************************
 *Play game state
 ************************************************/
let PlayState = {};

PlayState.preload = function() {
  // load our image assets
  this.game.load.image('background', 'images/background.png');
  this.game.load.image('ship', 'images/ship.png');
  this.game.load.image('bullet', 'images/bullet.png');
  this.game.load.spritesheet('alien', 'images/alien.png', 40, 44);
};

PlayState.create = function() {
  // create an image using the game's factory (.add)
  this.game.add.image(0, 0, 'background');

  // create the sprite ship
  this.ship = new Ship(this.game, 256, 436);
  // since we are instantiating the sprite and not using the factory method,
  // we need to manually add it to the game world
  this.game.add.existing(this.ship);
  // create a group to manage bullets
  this.bullets = this.game.add.group();

  // add sample alien
  this.game.add.existing(new Alien(this.game, 50, 50));

  // register keys
  this.keys = this.game.input.keyboard.addKeys({
    left: Phaser.KeyCode.LEFT,
    right: Phaser.KeyCode.RIGHT,
    space: Phaser.KeyCode.SPACEBAR
  });
// subscribe to keyboard events
  this.keys.space.onDown.add(function() {
    this.ship.shoot(this.bullets);
  }, this);
};

PlayState.update = function() {
  if (this.keys.left.isDown) { // move left
    this.ship.move(-1);
  } else if (this.keys.right.isDown) { // move right
    this.ship.move(1);
  } else { // stop
    this.ship.move(0);
  }
};

window.onload = function() {
  new Phaser.Game(512, 512, Phaser.AUTO, 'game', PlayState);
};
