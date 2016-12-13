const wsLocation = location.href.replace(location.protocol, 'ws:'),
      ws = new WebSocket(wsLocation),
      connection = { open: false, error: false },
      color = '#597bb6';

const directions = {
  'up'    : [[315, 361], [0, 45]],
  'right' : [[45, 135]],
  'down'  : [[135, 225]],
  'left'  : [[225, 315]]
};

const sides = {
  'up'    : 'Top',
  'right' : 'Right',
  'down'  : 'Bottom',
  'left'  : 'Left'
};

const btnState = {
  'true': 'Stop',
  'false': 'Start'
};

let isDragging = false,
    isDragAllowed = false,
    dir = 'up';

const startDrag = e => isDragAllowed && (isDragging = true);

const endDrag = e => isDragging = false;

const processDrag = (circle, drag, shadow, e) => {
  let pos, delta,
      angle, direction,
      boundRect = circle.getBoundingClientRect();

  if (!isDragging) return;
  e.preventDefault();

  pos = {
    x: (e.touches[0] || e).pageX,
    y: (e.touches[0] || e).pageY
  }

  delta = {
    x: circle.clientWidth / 2 + boundRect.left - pos.x,
    y: circle.clientHeight / 2 + boundRect.top - pos.y
  };

  angle = Math.round(Math.atan2(delta.y, delta.x) * (180 / Math.PI) - 90);
  if (angle < 0) angle += 360;
  drag.style.transform = `rotate(${angle}deg)`;

  direction = getDirectionFromAngle(angle);

  shadow.style.borderColor = 'transparent';
  shadow.style[`border${sides[direction]}Color`] = color;

  processDirection(direction);
}

const getDirectionFromAngle = angle =>
  Object.keys(directions)
    .filter(key =>
      directions[key].some(arr =>
        arr[0] <= angle && angle < arr[1]
      )
    )[0]

const wsSend = data => {
  if (connection.open && !connection.error)
    ws.send(JSON.stringify(data));
}

const processDirection = direction => {
  if (dir === direction) return;
  dir = direction;

  wsSend({direction: dir});
}

const processStart = (isStarted, cb) => {
  const start = isStarted();

  isDragAllowed = start;
  wsSend({start});
  cb && cb();
}

ws.onopen = () => {
  connection.open = true;
  connection.error = false;
}

ws.onclose = () => {
  connection.open = false;
  console.warn('Connection is in CLOSED state, your actions will not emit events');
}

ws.onerror = () => {
  connection.error = true;
  console.warn('An error occurred with WebSocket connection');
}

const processWSMessage = scoreElement =>
  ws.onmessage = event => {
    msgObj = JSON.parse(event.data);
    if (msgObj.score) scoreElement.textContent = msgObj.score;
  }

document.addEventListener('DOMContentLoaded', () => {
  let drag      = document.querySelector('.slider'),
      circle    = document.querySelector('.slider-path'),
      shadow    = document.querySelector('.shadow'),
      startBtn  = document.querySelector('.start-control'),
      score     = document.querySelector('.score-value'),
      controls  = document.querySelector('.movement-controls'),
      btnObserver = null, configs = { attributes: true };

  const doDrag = processDrag.bind(null, circle, drag, shadow);

  shadow.style.borderTopColor = color;

  processWSMessage(score);

  btnObserver = new MutationObserver(mutations =>
    mutations.forEach(mutation => {
      const attr = mutation.target.getAttribute(mutation.attributeName);

      controls.classList.toggle('disabled', /^true$/.test(attr));

    })
  );

  btnObserver.observe(startBtn, configs);

  startBtn.addEventListener('click', processStart.bind(
    null,
    () => /^true$/.test(startBtn.dataset.start),
    () => {
      let startAttr = startBtn.dataset.start;
      startBtn.textContent = btnState[startAttr];
      startBtn.dataset.start = /^false$/.test(startAttr);
    }
  ));

  circle.addEventListener('mousedown', startDrag);
  circle.addEventListener('touchstart', startDrag);

  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchend', endDrag);

  window.addEventListener('mousemove', doDrag);
  window.addEventListener('touchmove', doDrag);
})
