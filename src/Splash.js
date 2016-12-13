class Splash {
  constructor () {
    this.letters = {
      '<': ['00001111', '00011110', '00111100', '01111000', '01111000', '00111100', '00011110', '00001111'],
      '>': ['11110000', '01111000', '00111100', '00011110', '00011110', '00111100', '01111000', '11110000'],
      's': ['0110', '1001', '1000', '0100', '0010', '0001', '1001', '0110'],
      'n': ['1001', '1101', '1101', '1111', '1111', '1011', '1011', '1001'],
      'a': ['001100', '001100', '011110', '010010', '011110', '110011', '100001', '100001'],
      'k': ['1001', '1011', '1110', '1100', '1100', '1110', '1011', '1001'],
      'e': ['1111', '1000', '1000', '1111', '1111', '1000', '1000', '1111'],
      ' ': ['0', '0', '0', '0', '0', '0', '0', '0']
    };
    this.word = '< s n a k e >';
    this.additional = '0000000';
    this.rows = 8;
    this.cols = 8;
    this.speed = 100;
  }

  createMap () {
    const rows = [...Array(this.rows)],
          letters = this.word.split('');

    this.viewMap = rows
      .map((v, k) =>
        this.additional
          .concat(
            letters
              .reduce((row, val) => {
                row.push(this.letters[val][k]);
                return row;
              }, [])
              .join(''),
            this.additional
          )
      );
  }

  getViewFromIndex (index) {
    if (index > this.viewMap[0].length - this.cols) return false;
    if (!this.viewMap) throw Error();

    return this.viewMap.map(str => str.slice(index, index + this.cols));
  }

  runLoop (cb) {
    let index = 0;

    this.createMap();

    this.interval = setInterval(() => {
      let view = this.getViewFromIndex(index++);
      if (!view) clearInterval(this.interval);
      cb && view && cb(view);
    }, this.speed);
  }
}

module.exports = Splash;
