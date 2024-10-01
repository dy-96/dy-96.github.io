// .......................
const steeringWheel = document.getElementById("_steering");
// const forward = document.getElementById("_forward");
const rotationDisplay = document.getElementById("rotationValue");
const button = document.getElementById("fs");
const _index = document.getElementById("_index");

const slider = document.getElementById("slider");
const sliderContainer = document.getElementById("sliderBox");
const valueDisplay = document.getElementById("valueDisplay");

let isDraggingStr = false;
let angle = 0; // Current rotation angle in radians
let startAngle = 0; // Store the starting angle for the touch
let animationFrame;
const MAX_ANGLE = 100 * (Math.PI / 180); // Max angle in radians
const MIN_ANGLE = -100 * (Math.PI / 180); // Min angle in radians
const DAMPING = 0.06; // Damping factor for return animation

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
  return {
    x: touch.clientX - rect.left - rect.width / 2,
    y: touch.clientY - rect.top - rect.height / 2,
  };
}

// Function to animate return to center
function animateReturnToCenter() {
  if (Math.abs(angle) > 0.01) {
    angle *= 1 - DAMPING;
    updateSteeringWheel();
    animationFrame = requestAnimationFrame(animateReturnToCenter);
  } else {
    angle = 0; // Snap to 0°
    updateSteeringWheel();
    cancelAnimationFrame(animationFrame);
  }
}

function handleTouchStart(e, index) {
  const touches = e.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    const touch = touches[i];
    console.log(touch);
    _index.textContent = `touch = ${touch.identifier}`;

    // if (index === 1) {
    //   // alert("hello");
    // }
    if (index === 0) {
      isDraggingStr = true;
      cancelAnimationFrame(animationFrame); // Stop animation
      const { x, y } = getAverageTouchPos(e.touches);
      startAngle = Math.atan2(y, x); // Store the starting angle for the touch
    }
  }
}
// Event listeners
steeringWheel.addEventListener("touchstart", (e) => {
  e.preventDefault(); // Prevent default touch behavior for the steering wheel
  handleTouchStart(e, 0);
});

steeringWheel.addEventListener("touchmove", (e) => {
  if (isDraggingStr) {
    rotateSteeringWheel(e);
    e.preventDefault(); // Prevent scrolling
  }
});

steeringWheel.addEventListener("touchend", (e) => {
  isDraggingStr = false; // End dragging
  animateReturnToCenter();
});

// forward.addEventListener("touchstart", (e) => {
//   e.preventDefault();
//   handleTouchStart(e, 1);
// });
// document.addEventListener("touchstart", (e) => {
//   e.preventDefault();
//   handleTouchStart(e, 0);
// });
document.addEventListener("gesturestart", (e) => e.preventDefault());
document.addEventListener(
  "touchmove",
  (e) => {
    if (!isDraggingStr) e.preventDefault(); // Prevent scrolling only when not dragging
  },
  { passive: false }
);
window.addEventListener("scroll", () => window.scrollTo(0, 0));

// Fullscreen functionality
button.addEventListener("click", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    button.textContent = "fs";
  } else {
    document.documentElement.requestFullscreen().catch((err) => {
      console.log(`Error message: ${err.message}`);
    });
    button.textContent = "ex";
  }
});

//...........................................................
//...............handleSlider................................
let isDragging = false;

function updateSliderValue(yPosition) {
    const containerHeight = sliderContainer.clientHeight;
    const sliderHeight = slider.clientHeight;
    const maxPosition = containerHeight - sliderHeight;

    let newPosition = containerHeight - yPosition - sliderHeight / 2;
    newPosition = Math.max(0, Math.min(newPosition, maxPosition));

    const value = Math.round((newPosition / maxPosition) * 100);
    slider.style.bottom = `${newPosition}px`;
    valueDisplay.textContent = `Value: ${value}`;
}

// Mouse events
slider.addEventListener("mousedown", (e) => {
    isDragging = true;
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        const rect = sliderContainer.getBoundingClientRect();
        const y = e.clientY - rect.top;
        updateSliderValue(y);
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});

// Touch events
slider.addEventListener("touchstart", (e) => {
    isDragging = true;
});

document.addEventListener("touchmove", (e) => {
    if (isDragging) {
        const rect = sliderContainer.getBoundingClientRect();
        const y = e.touches[0].clientY - rect.top;
        updateSliderValue(y);
    }
});

document.addEventListener("touchend", () => {
    isDragging = false;
});