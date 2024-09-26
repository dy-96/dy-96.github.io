const canvas = document.getElementById("joystick");
const ctx = canvas.getContext("2d");
const output = document.getElementById("output");

const centerX1 = canvas.width / 4;
const centerY1 = canvas.height / 2;
const centerX2 = (canvas.width * 3) / 4;
const centerY2 = canvas.height / 2;
const radius = 50;

let joysticks = [
  { isMoving: false, currentX: centerX1, currentY: centerY1 },
  { isMoving: false, currentX: centerX2, currentY: centerY2 },
];

function drawJoystick(x, y, centerX, centerY) {
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

  output.textContent = `Posisi Joystick 1: (${normalizedX1}, ${normalizedY1}) | Posisi Joystick 2: (${normalizedX2}, ${normalizedY2})`;
}

function moveJoystick(event) {
  const touches = event.touches;

  for (let i = 0; i < touches.length; i++) {
    const touch = touches[i];
    const rect = canvas.getBoundingClientRect();
    const mouseX = touch.clientX - rect.left;
    const mouseY = touch.clientY - rect.top;

    // Mengidentifikasi joystick berdasarkan posisi sentuh
    if (mouseX < canvas.width / 2) {
      const joystick = joysticks[0];
      joystick.isMoving = true;

      const dx = mouseX - centerX1;
      const dy = mouseY - centerY1;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius) {
        joystick.currentX = mouseX;
        joystick.currentY = mouseY;
      } else {
        const angle = Math.atan2(dy, dx);
        joystick.currentX = centerX1 + radius * Math.cos(angle);
        joystick.currentY = centerY1 + radius * Math.sin(angle);
      }
    } else {
      const joystick = joysticks[1];
      joystick.isMoving = true;

      const dx = mouseX - centerX2;
      const dy = mouseY - centerY2;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius) {
        joystick.currentX = mouseX;
        joystick.currentY = mouseY;
      } else {
        const angle = Math.atan2(dy, dx);
        joystick.currentX = centerX2 + radius * Math.cos(angle);
        joystick.currentY = centerY2 + radius * Math.sin(angle);
      }
    }
  }

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawJoystick(
    joysticks[0].currentX,
    joysticks[0].currentY,
    centerX1,
    centerY1
  );
  drawJoystick(
    joysticks[1].currentX,
    joysticks[1].currentY,
    centerX2,
    centerY2
  );
  updateOutput();
}

// Event listeners untuk touch
canvas.addEventListener("touchstart", (event) => {
  event.preventDefault(); // Mencegah scroll
  moveJoystick(event);
});

canvas.addEventListener("touchmove", moveJoystick);
canvas.addEventListener("touchend", () => {
  joysticks.forEach((joystick) => {
    joystick.isMoving = false;
    joystick.currentX = joystick === joysticks[0] ? centerX1 : centerX2;
    joystick.currentY = centerY1; // Untuk kedua joystick, y tetap sama
  });
  draw();
});

// Gambar joystick awal
draw();

//fullScreen
const button = document.getElementById("fs");

button.addEventListener("click", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen().catch((err) => {
      console.log(`error mesage ${err.message}`);
    });
  }
});
