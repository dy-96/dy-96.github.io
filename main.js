const steeringWheel = document.getElementById("_svg");
const rotationDisplay = document.getElementById("rotationValue");
let isDragging = false;
let angle = 0; // Current rotation angle in radians
let startAngle = 0; // Angle when touch starts
let animationFrame;
const maxAngle = 100 * (Math.PI / 180); // Maximum angle (100° in radians)
const minAngle = -100 * (Math.PI / 180); // Minimum angle (-100° in radians)

// Function to update the rotation of the steering wheel image
function updateSteeringWheel() {
  const angleInDegrees = (angle * 180) / Math.PI;
  steeringWheel.style.transform = `rotate(${angleInDegrees}deg)`;
  
  const displayAngleInDegrees = Math.round(angleInDegrees);
  rotationDisplay.innerText = `Rotation: ${displayAngleInDegrees}°`;
}

// Function to handle steering wheel rotation
function rotateSteeringWheel(e) {
  const { x, y } = getAverageTouchPos(e.touches);
  const newAngle = Math.atan2(y, x); // Calculate the angle based on touch position

  // Calculate the delta angle, ensuring it is the shortest direction
  let deltaAngle = newAngle - startAngle;

  // Normalize the deltaAngle to the range [-π, π]
  if (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
  if (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;

  // Update angle while ensuring it doesn't exceed the max or min limits
  angle += deltaAngle;

  // Clamp the angle between minAngle and maxAngle
  angle = Math.max(minAngle, Math.min(maxAngle, angle));

  // Update the starting angle to the new touch angle
  startAngle = newAngle;

  updateSteeringWheel();
}

// Function to get the average touch position for multiple touches
function getAverageTouchPos(touches) {
  let totalX = 0;
  let totalY = 0;

  for (let i = 0; i < touches.length; i++) {
    totalX += touches[i].clientX;
    totalY += touches[i].clientY;
  }

  const avgX = totalX / touches.length;
  const avgY = totalY / touches.length;

  const rect = steeringWheel.getBoundingClientRect();
  const x = avgX - rect.left - rect.width / 2; // Centering x
  const y = avgY - rect.top - rect.height / 2; // Centering y
  
  return { x, y };
}

// Function to smoothly return the steering wheel to 0° with easing
function animateReturnToCenter() {
  const damping = 0.03;
  if (Math.abs(angle) > 0.01) {
    angle *= (1 - damping); // Gradually reduce angle to return to 0°
    updateSteeringWheel();
    animationFrame = requestAnimationFrame(animateReturnToCenter);
  } else {
    angle = 0; // Ensure the final angle is exactly 0°
    updateSteeringWheel();
    cancelAnimationFrame(animationFrame); // Stop the animation
  }
}

// Event listener for touch (mobile)
steeringWheel.addEventListener("touchstart", (e) => {
  if (e.touches.length > 2) return; // Ignore more than two touches

  isDragging = true;
  cancelAnimationFrame(animationFrame); // Stop animation while dragging

  // Set the initial angle based on the average touch position
  const { x, y } = getAverageTouchPos(e.touches);
  startAngle = Math.atan2(y, x); // Reset the reference angle to the current touch position
});

steeringWheel.addEventListener("touchmove", (e) => {
  if (isDragging) {
    rotateSteeringWheel(e); // Rotate based on the touch movement
    e.preventDefault(); // Prevent scrolling during touch
  }
});

steeringWheel.addEventListener("touchend", () => {
  isDragging = false;
  animateReturnToCenter(); // Return to 0° when touch ends
});

// Initialize the steering wheel display
updateSteeringWheel();

// Prevent default gestures
document.addEventListener("gesturestart", function (e) {
  e.preventDefault();
});

document.addEventListener("touchmove", function (e) {
  e.preventDefault();
}, { passive: false });

// Prevent refresh on pull down
window.addEventListener("scroll", function (e) {
  window.scrollTo(0, 0);
});
