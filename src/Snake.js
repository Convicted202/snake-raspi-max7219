const Point = require('./Point');

const allowed = {
  'left' : ['up', 'down'],
  'right': ['up', 'down'],
  'up'   : ['left', 'right'],
  'down' : ['left', 'right']
}

class Snake {
  constructor (maxX, maxY) {
    this.snake = [];
    this.dir = 'up';
    this.maxX = maxX;
    this.maxY = maxY;

    this.initSnake();
  }

  initSnake (row = 3, col = 3, parts = 2) {
    let i = 0, part;

    for (; i < parts; i++) {
      part = new Point(col, row + i);
      this.snake.push(part);
    }
  }

  doMove () {
    let tail = this.snake.pop(),
        head = this.snake[0];

    tail
      .move(head.x, head.y)
      .shift(this.dir)
      .normalize(this.maxX, this.maxY);
    this.snake.unshift(tail);

    return this;
  }

  set direction (direction) {
    if (allowed[this.dir].includes(direction))
      this.dir = direction;
  }
}

module.exports = Snake;
