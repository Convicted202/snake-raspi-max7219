const directionShift = {
  'left' : [-1, 0],
  'right': [1, 0],
  'up'   : [0, -1],
  'down' : [0, 1]
};

class Point {
  constructor (x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  move (x, y) {
    this.x = x;
    this.y = y;

    return this;
  }

  shift (dir) {
    const shift = directionShift[dir];

    this.x += shift[0];
    this.y += shift[1];

    return this;
  }

  normalize(maxX, maxY) {
    if (this.x < 0) this.x = maxX;
    if (this.y < 0) this.y = maxY;
    this.x %= maxX + 1;
    this.y %= maxY + 1;

    return this;
  }
}

module.exports = Point;
