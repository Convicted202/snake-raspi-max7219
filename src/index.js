const five = require("johnny-five"),
      Rasp = require("raspi-io");

const GameObject = require("./Game"),
      Splash = require("./Splash");

const board = new five.Board({
  io: new Rasp()
});

const wiringPins = {
  'data-in': 12,
  'clock': 14,
  'chip-select': 10
}

let Game = new GameObject(),
    splash = new Splash();

board.on("ready", function() {
  let matrix = new five.Led.Matrix({
        pins: {
          data: wiringPins['data-in'],
          clock: wiringPins['clock'],
          cs: wiringPins['chip-select']
        }
      });

  // Game.runLoop(() => matrix.draw(Game.leds));
  // splash.runLoop(view => matrix.draw(view));

  this.on('exit', () => {
    // Game.endGame();
    matrix.clear();
    matrix.off();
  });
});

module.exports = Game;
