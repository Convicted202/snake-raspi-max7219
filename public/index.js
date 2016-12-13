const wsLocation = location.href.replace(location.protocol, 'ws:'),
      ws = new WebSocket(wsLocation),
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

let isDragging = false,
    dir = 'up';

const startDrag = e => isDragging = true;

const endDrag = e => isDragging = false;

const processDrag = (circle, drag, shadow) => e => {
  let center_x, center_y,
      pos_x, pos_y, delta_y, delta_x,
      touch, angle, boundRect, direction;

  if (!isDragging) return;
  if (e.touches) touch = e.touches[0];

  e.preventDefault();

  boundRect = circle.getBoundingClientRect();

  center_x = (circle.clientWidth / 2) + boundRect.left;
  center_y = (circle.clientHeight / 2) + boundRect.top;
  pos_x = e.pageX || touch.pageX;
  pos_y = e.pageY || touch.pageY;
  delta_y = center_y - pos_y;
  delta_x = center_x - pos_x;
  angle = Math.atan2(delta_y, delta_x) * (180 / Math.PI);
  angle -= 90;
  if (angle < 0) angle += 360;
  angle = Math.round(angle);
  drag.style.transform = `rotate(${angle}deg)`;

  direction = getDirectionFromAngle(angle);

  shadow.style.borderColor = 'transparent';
  shadow.style[`border${sides[direction]}Color`] = color;

  sendDirection(direction);
}

const getDirectionFromAngle = angle =>
  Object.keys(directions)
    .filter(key =>
      directions[key].some(arr =>
        arr[0] <= angle && angle < arr[1]
      )
    )[0]

const sendDirection = direction => {
  if (dir === direction) return;
  dir = direction;
  ws.send(JSON.stringify({direction: dir}));
}

document.addEventListener('DOMContentLoaded', () => {
  let drag = document.querySelector('.slider'),
      circle = document.querySelector('.slider-path'),
      shadow = document.querySelector('.shadow');

  const doDrag = processDrag(circle, drag, shadow);

  shadow.style.borderTopColor = color;

  circle.addEventListener('mousedown', startDrag);
  circle.addEventListener('touchstart', startDrag);

  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchend', endDrag);

  window.addEventListener('mousemove', doDrag);
  window.addEventListener('touchmove', doDrag);
})
