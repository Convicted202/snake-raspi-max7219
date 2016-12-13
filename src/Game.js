const Snake = require('./Snake');

class GameObject {
  constructor (width = 8, height = 8) {
    this._grid = [];
    this.matrix = [];
    this.leds = [];
    this.snakeObj = new Snake(width - 1, height - 1);
    this.height = height;
    this.width = width;
  }

  createGameGrid () {
    [...Array(this.height)].forEach(() => this._grid.push([...Array(this.width)].fill(0)));
  }

  changeDirection (direction) {
    this.snakeObj.direction = direction;
  }

  produceGameMatrix () {
    this.matrix = this._grid.map(arr => arr.slice());
    this.snakeObj
      .doMove()
      .snake.forEach((point) => this.matrix[point.y][point.x] = 1);

    this.leds = this.matrix.map(arr => arr.join(''));
  }

  runLoop (cb) {
    this.createGameGrid();

    this.interval = setInterval(() => {
      this.produceGameMatrix();
      cb && cb();
    }, 100);
  }

  endGame () {
    clearInterval(this.interval);
  }
}

module.exports = GameObject;
