const steeringWheel = document.getElementById("_svg");
const rotationDisplay = document.getElementById("rotationValue");
const button = document.getElementById("fs");

let isDragging = false;
let angle = 0; // Current rotation angle in radians
let startAngles = {}; // Store the starting angles for each touch
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
  Array.from(e.touches).forEach((touch) => {
    const touchId = touch.identifier;
    const { x, y } = getAverageTouchPos(e.touches);
    const newAngle = Math.atan2(y, x);
    
    let deltaAngle = newAngle - (startAngles[touchId] || 0);
    
    // Normalize deltaAngle to [-π, π]
    if (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
    if (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;

    angle = Math.max(MIN_ANGLE, Math.min(MAX_ANGLE, angle + deltaAngle));
    startAngles[touchId] = newAngle; // Update the starting angle for this touch
  });

  updateSteeringWheel();
}

// Function to get the average touch position
function getAverageTouchPos(touches) {
  const total = Array.from(touches).reduce(
    (acc, touch) => {
      acc.x += touch.clientX;
      acc.y += touch.clientY;
      return acc;
    },
    { x: 0, y: 0 }
  );

  const avgX = total.x / touches.length;
  const avgY = total.y / touches.length;
  const rect = steeringWheel.getBoundingClientRect();
  return { x: avgX - rect.left - rect.width / 2, y: avgY - rect.top - rect.height / 2 };
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
  if (e.touches.length > 2 || button.contains(e.target)) return; // Ignore more than two touches or if touching the button

  isDragging = true;
  cancelAnimationFrame(animationFrame); // Stop animation

  Array.from(e.touches).forEach((touch) => {
    const touchId = touch.identifier;
    const { x, y } = getAverageTouchPos(e.touches);
    startAngles[touchId] = Math.atan2(y, x); // Store the starting angle for each touch
  });

  e.preventDefault(); // Prevent default touch behavior for the steering wheel
});

steeringWheel.addEventListener("touchmove", (e) => {
  if (isDragging) {
    rotateSteeringWheel(e);
    e.preventDefault(); // Prevent scrolling
  }
});

steeringWheel.addEventListener("touchend", (e) => {
  // Remove the starting angles for released touches
  Array.from(e.changedTouches).forEach((touch) => {
    delete startAngles[touch.identifier];
  });

  if (Object.keys(startAngles).length === 0) {
    isDragging = false;
    animateReturnToCenter();
  }
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
