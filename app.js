const server = require('http').createServer(),
      webSocketServer = require('ws').Server,
      wss = new webSocketServer({ server: server }),
      express = require('express'),
      bodyParser  = require('body-parser'),
      app = express(),
      port = process.env.PORT || 3000;

const Game = require('./src/index');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

wss.on('connection', ws => {
  console.log('connection established');
  ws.on('message', message => {
    let dirObj = JSON.parse(message);
    console.log(dirObj.direction);
    Game.changeDirection(dirObj.direction);
  });

  ws.send('something');
});

server.on('request', app);
server.listen(port, () => console.log(`Listening on ${port}`));
