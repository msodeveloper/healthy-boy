(function(root) {
  'use strict';

  // Constants
  var IMAGES_PATH = 'assets/images/',
    SOUNDS_PATH = 'assets/sounds/';

  var GameState = function() {};

  GameState.prototype.preload = function() {
    // loads all food assets
    this.game.load.image('fruit-1', IMAGES_PATH + 'fruit-1.png');
    this.game.load.image('fruit-2', IMAGES_PATH + 'fruit-2.png');
    this.game.load.image('fruit-3', IMAGES_PATH + 'fruit-3.png');
    this.game.load.image('junk-1', IMAGES_PATH + 'junk-1.png');
    this.game.load.image('junk-2', IMAGES_PATH + 'junk-2.png');
    this.game.load.image('junk-3', IMAGES_PATH + 'junk-3.png');

    this.game.load.image('timer', IMAGES_PATH + 'timer.jpg');

    this.game.load.audio('crunch', SOUNDS_PATH + 'crunch.mp3');
  };

  GameState.prototype.create = function() {
    this.game.stage.backgroundColor = 0x4488cc;

    // constants
    this.DIFFICULT_2 = 5;
    this.DIFFICULT_3 = 10;

    this.addTimer();
    this.addFruit();

    this.points = new Points(this.game);
  };

  GameState.prototype.update = function() {
    if(this.junk && this.junk.overlap(this.fruit)) {
      this.junk.updateXY();
      console.log('update');
    }
  };

  GameState.prototype.addTimer = function() {
    this.timer = new Timer(this.game);
    this.game.add.existing(this.timer);
  };

  GameState.prototype.addFruit = function() {
    var fruitType = 1;
    if(Fruit.killed >= this.DIFFICULT_2 && Fruit.killed < this.DIFFICULT_3) {
      fruitType = Phaser.GAMES[0].rnd.integerInRange(1, 2);
    } else if(Fruit.killed >= this.DIFFICULT_3) {
      fruitType = Phaser.GAMES[0].rnd.integerInRange(1, 3);
    }

    this.fruit = new Fruit({
      game: this.game,
      timer: this.timer,
      type: fruitType
    });
    this.game.add.existing(this.fruit);

    this.junk = new Junk({
      game: this.game,
      timer: this.timer,
      type: 1,
      fruit: this.fruit
    });
    this.game.add.existing(this.junk);

    // when killed, add another fruit :)
    this.fruit.on('kill', this.onKill, this);
  };

  GameState.prototype.onKill= function(fruit) {
    this.points.increase(fruit.type);
    this.addFruit();
  };

  root.GameState = GameState;
} (this));
