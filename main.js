const steeringWheel = document.getElementById("steeringWheel");
const rotationDisplay = document.getElementById("rotationValue");
let isDragging = false;
let angle = 0;  // Current rotation angle in radians
let startAngle = 0;  // Angle when touch starts
let animationFrame;
const maxAngle = 150 * (Math.PI / 180);  // Maximum angle (100° in radians)
const minAngle = -150 * (Math.PI / 180);  // Minimum angle (-100° in radians)

// Function to update the rotation of the steering wheel image
function updateSteeringWheel() {
  // Convert radians to degrees and apply the rotation to the image
  const angleInDegrees = (angle * 180) / Math.PI;
  steeringWheel.style.transform = `rotate(${angleInDegrees}deg)`;

  // Display the rotation value in degrees
  const displayAngleInDegrees = Math.round(angleInDegrees);
  rotationDisplay.innerText = `Rotation: ${displayAngleInDegrees}°`;
}

// Function to handle steering wheel rotation
function rotateSteeringWheel(e) {
  const { x, y } = getTouchPos(e);
  const newAngle = Math.atan2(y, x);  // Calculate the angle based on touch position
  const deltaAngle = newAngle - startAngle;  // Calculate the difference from the initial touch angle

  // Update angle while ensuring it doesn't exceed the max or min limits
  angle += deltaAngle;

  // Clamp the angle between -100° (minAngle) and 100° (maxAngle)
  if (angle > maxAngle) {
    angle = maxAngle;
  } else if (angle < minAngle) {
    angle = minAngle;
  }

  // Update the starting angle to the new touch angle
  startAngle = newAngle;

  updateSteeringWheel();
}

// Function to get touch position
function getTouchPos(e) {
  const rect = steeringWheel.getBoundingClientRect();
  const x = e.touches[0].clientX - rect.left - rect.width / 2;  // Centering x
  const y = e.touches[0].clientY - rect.top - rect.height / 2;  // Centering y
  return { x, y };
}

// Function to smoothly return the steering wheel to 0° with easing
function animateReturnToCenter() {
  const damping = 0.1;
  if (Math.abs(angle) > 0.01) {  // Ensure to stop close to 0
    angle *= 1 - damping;  // Gradually reduce angle to return to 0°
    updateSteeringWheel();
    animationFrame = requestAnimationFrame(animateReturnToCenter);
  } else {
    angle = 0;  // Ensure the final angle is exactly 0°
    updateSteeringWheel();
    cancelAnimationFrame(animationFrame);  // Stop the animation
  }
}

// Event listener for touch (mobile)
steeringWheel.addEventListener("touchstart", (e) => {
  if (e.touches.length > 1) return;  // Ignore multiple touches

  isDragging = true;
  cancelAnimationFrame(animationFrame);  // Stop animation while dragging

  // Set the initial angle based on the current touch position
  const { x, y } = getTouchPos(e);
  startAngle = Math.atan2(y, x);  // Reset the reference angle to the current touch position
});

steeringWheel.addEventListener("touchmove", (e) => {
  if (isDragging) {
    rotateSteeringWheel(e);  // Rotate based on the touch movement
    e.preventDefault();  // Prevent scrolling during touch
  }
});

steeringWheel.addEventListener("touchend", () => {
  isDragging = false;
  animateReturnToCenter();  // Return to 0° when touch ends
});
document.addEventListener('contextmenu', function(e) {
  if (e.target.classList.contains('non-downloadable')) {
    e.preventDefault();
  }
});

// Initialize the steering wheel display
updateSteeringWheel();
