const canvas1 = document.getElementById("joystick1");
const canvas2 = document.getElementById("joystick2");
const ctx1 = canvas1.getContext("2d");
const ctx2 = canvas2.getContext("2d");
const output = document.getElementById("output");

const centerX1 = canvas1.width / 2;
const centerY1 = canvas1.height / 2;
const centerX2 = canvas2.width / 2;
const centerY2 = canvas2.height / 2;
const radius = 50;

const joysticks = [
  { isMoving: false, currentX: centerX1, currentY: centerY1, touchId: null },
  { isMoving: false, currentX: centerX2, currentY: centerY2, touchId: null }
];

function drawJoystick(ctx, x, y, centerX, centerY) {
  ctx.fillStyle = "rgba(211, 211, 211, 0.5)";
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(50, 54, 255, 0.5)";
  ctx.beginPath();
  ctx.arc(x, y, 30, 0, Math.PI * 2);
  ctx.fill();
}

function updateOutput() {
  const normalizedX1 = ((joysticks[0].currentX - centerX1) / radius).toFixed(2);
  const normalizedY1 = ((joysticks[0].currentY - centerY1) / radius).toFixed(2);
  const normalizedX2 = ((joysticks[1].currentX - centerX2) / radius).toFixed(2);
  const normalizedY2 = ((joysticks[1].currentY - centerY2) / radius).toFixed(2);

  output.textContent = `Joystick 1: (${normalizedX1}, ${normalizedY1}), Joystick 2: (${normalizedX2}, ${normalizedY2})`;
}

function moveJoystick(event, index) {
  const touches = event.touches;

  for (let i = 0; i < touches.length; i++) {
    const touch = touches[i];

    if (joysticks[index].touchId === touch.identifier) {
      const rect = index === 0 ? canvas1.getBoundingClientRect() : canvas2.getBoundingClientRect();
      const mouseX = touch.clientX - rect.left;
      const mouseY = touch.clientY - rect.top;

      const joystick = joysticks[index];
      joystick.isMoving = true;

      const dx = mouseX - (index === 0 ? centerX1 : centerX2);
      const dy = mouseY - (index === 0 ? centerY1 : centerY2);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius) {
        joystick.currentX = mouseX;
        joystick.currentY = mouseY;
      } else {
        const angle = Math.atan2(dy, dx);
        joystick.currentX = (index === 0 ? centerX1 : centerX2) + radius * Math.cos(angle);
        joystick.currentY = (index === 0 ? centerY1 : centerY2) + radius * Math.sin(angle);
      }
    }
  }

  draw();
}

function draw() {
  ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

  drawJoystick(ctx1, joysticks[0].currentX, joysticks[0].currentY, centerX1, centerY1);
  drawJoystick(ctx2, joysticks[1].currentX, joysticks[1].currentY, centerX2, centerY2);

  updateOutput();
}

function handleTouchStart(event, index) {
  const touches = event.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    const touch = touches[i];

    if (joysticks[index].touchId === null) {
      joysticks[index].touchId = touch.identifier;
      moveJoystick(event, index);
      break;
    }
  }
}

function handleTouchEnd(event, index) {
  const touches = event.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    const touch = touches[i];

    if (joysticks[index].touchId === touch.identifier) {
      joysticks[index].touchId = null;
      joysticks[index].isMoving = false;
      joysticks[index].currentX = index === 0 ? centerX1 : centerX2;
      joysticks[index].currentY = index === 0 ? centerY1 : centerY2;
      draw();
      break;
    }
  }
}

// Event listeners for touch on both joysticks
canvas1.addEventListener("touchstart", (event) => {
  event.preventDefault(); // Prevent scroll
  handleTouchStart(event, 0);
});

canvas1.addEventListener("touchmove", (event) => {
  moveJoystick(event, 0);
});

canvas1.addEventListener("touchend", (event) => {
  handleTouchEnd(event, 0);
});

canvas2.addEventListener("touchstart", (event) => {
  event.preventDefault(); // Prevent scroll
  handleTouchStart(event, 1);
});

canvas2.addEventListener("touchmove", (event) => {
  moveJoystick(event, 1);
});

canvas2.addEventListener("touchend", (event) => {
  handleTouchEnd(event, 1);
});

// Initial drawing of the joysticks
draw();

// Fullscreen functionality
const button = document.getElementById("fs");

button.addEventListener("click", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen().catch((err) => {
      console.log(`Error message: ${err.message}`);
    });
  }
});
