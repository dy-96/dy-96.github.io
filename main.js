const steeringWheel = document.getElementById("_svg");
const rotationDisplay = document.getElementById("rotationValue");
const button = document.getElementById("fs");

let isDragging = false;
let angle = 0; // Current rotation angle in radians
let startAngle = 0; // Store the starting angle for the touch
let animationFrame;
const MAX_ANGLE = 100 * (Math.PI / 180); // Max angle in radians
const MIN_ANGLE = -100 * (Math.PI / 180); // Min angle in radians
const DAMPING = 0.03; // Damping factor for return animation

// Initialize the steering wheel display
updateSteeringWheel();

// Function to update the steering wheel's rotation
function updateSteeringWheel() {
  const angleInDegrees = (angle * 180) / Math.PI;
  steeringWheel.style.transform = `rotate(${angleInDegrees}deg)`;
  rotationDisplay.innerText = `Rotation: ${Math.round(angleInDegrees)}°`;
}

// Function to handle steering wheel rotation
function rotateSteeringWheel(e) {
  if (e.touches.length === 0) return; // No touch, do nothing

  const { x, y } = getAverageTouchPos(e.touches);
  const newAngle = Math.atan2(y, x);
  
  let deltaAngle = newAngle - startAngle;

  // Normalize deltaAngle to [-π, π]
  if (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
  if (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;

  angle = Math.max(MIN_ANGLE, Math.min(MAX_ANGLE, angle + deltaAngle));
  startAngle = newAngle; // Update the starting angle for this touch

  updateSteeringWheel();
}

// Function to get the average touch position
function getAverageTouchPos(touches) {
  const touch = touches[0]; // Use only the first touch
  const rect = steeringWheel.getBoundingClientRect();
  return { x: touch.clientX - rect.left - rect.width / 2, y: touch.clientY - rect.top - rect.height / 2 };
}

// Function to animate return to center
function animateReturnToCenter() {
  if (Math.abs(angle) > 0.01) {
    angle *= (1 - DAMPING);
    updateSteeringWheel();
    animationFrame = requestAnimationFrame(animateReturnToCenter);
  } else {
    angle = 0; // Snap to 0°
    updateSteeringWheel();
    cancelAnimationFrame(animationFrame);
  }
}

// Event listeners
steeringWheel.addEventListener("touchstart", (e) => {
  isDragging = true;
  cancelAnimationFrame(animationFrame); // Stop animation

  const touch = e.touches[0]; // Get the first touch
  const { x, y } = getAverageTouchPos(e.touches);
  startAngle = Math.atan2(y, x); // Store the starting angle for the touch

  e.preventDefault(); // Prevent default touch behavior for the steering wheel
});

steeringWheel.addEventListener("touchmove", (e) => {
  if (isDragging) {
    rotateSteeringWheel(e);
    e.preventDefault(); // Prevent scrolling
  }
});

steeringWheel.addEventListener("touchend", (e) => {
  isDragging = false; // End dragging
  animateReturnToCenter();
});

// Prevent default gestures and refresh on pull down
document.addEventListener("gesturestart", e => e.preventDefault());
document.addEventListener("touchmove", e => {
  if (!isDragging) e.preventDefault(); // Prevent scrolling only when not dragging
}, { passive: false });
window.addEventListener("scroll", () => window.scrollTo(0, 0));

// Fullscreen functionality
button.addEventListener("click", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    button.textContent = "ex";
  } else {
    document.documentElement.requestFullscreen().catch(err => {
      console.log(`Error message: ${err.message}`);
    });
    button.textContent = "fs";
  }
});
