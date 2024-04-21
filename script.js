// Select all the blobs
const blobs = document.querySelectorAll('.blob');

// Function to update the position of a blob
function updateBlobPosition(blob, x, y) {
  blob.style.transform = `translate(${x}px, ${y}px)`;
}


// Function to initialize blob properties and event listeners
function initBlobs() {
  blobs.forEach(blob => {
    // Set initial position and velocity
    blob.x = 0;
    blob.y = 0;
    blob.vx = 0;
    blob.vy = 0;
    blob.radius = 100; // Assuming a radius of 100px for each blob

    // Add event listeners for touch or cursor move
    blob.addEventListener('mousemove', event => {
      // Update velocity based on cursor movement
      blob.vx = event.movementX;
      blob.vy = event.movementY;
    });

    // For touch devices
    blob.addEventListener('touchmove', event => {
      const touch = event.touches[0];
      // Update position based on touch
      blob.x = touch.clientX - blob.radius;
      blob.y = touch.clientY - blob.radius;
      updateBlobPosition(blob, blob.x, blob.y);
    });
  });
}

// Add gyroscope event listener
window.addEventListener('deviceorientation', handleOrientation);

// Function to handle device orientation
function handleOrientation(event) {
  const alpha = event.alpha; // Z-axis rotation in degrees
  const beta = event.beta; // X-axis rotation in degrees
  const gamma = event.gamma; // Y-axis rotation in degrees

  // Calculate movement based on device orientation
  const xMove = gamma * 2; // Multiply by a factor for sensitivity
  const yMove = beta * 2;

  // Update position of each blob based on device orientation
  blobs.forEach(blob => {
    updateBlobPosition(blob, blob.x + xMove, blob.y + yMove);
  });
}


function handleCollision(blob1, blob2) {
    // Calculate distance between blob centers
    const dx = blob2.x - blob1.x;
    const dy = blob2.y - blob1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
  
    // Check if blobs are colliding
    if (distance < blob1.radius + blob2.radius) {
      // Calculate overlap
      const overlap = blob1.radius + blob2.radius - distance;
  
      // Calculate adjustment ratio for each blob
      const totalSize = blob1.radius + blob2.radius;
      const ratio1 = blob1.radius / totalSize;
      const ratio2 = blob2.radius / totalSize;
  
      // Adjust positions to prevent overlap
      const adjustX = (overlap * ratio2) * (dx / distance);
      const adjustY = (overlap * ratio2) * (dy / distance);
      updateBlobPosition(blob1, blob1.x - adjustX, blob1.y - adjustY);
      updateBlobPosition(blob2, blob2.x + adjustX, blob2.y + adjustY);
  
      // Adjust sizes based on the overlap and ensure the radius doesn't go below a certain threshold
      const sizeAdjustment = overlap / 10;
      blob1.radius = Math.max(blob1.radius - sizeAdjustment * ratio2, 10); // Minimum radius of 10px
      blob2.radius = Math.max(blob2.radius - sizeAdjustment * ratio1, 10); // Minimum radius of 10px
    }
 }

// // Main animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update positions based on velocity
  blobs.forEach(blob => {
    blob.x += blob.vx;
    blob.y += blob.vy;

    // Reset velocity after movement
    blob.vx = 0;
    blob.vy = 0;

    // Check for containment within the display area
    if (blob.x < 0) blob.x = 0;
    if (blob.y < 0) blob.y = 0;
    if (blob.x > window.innerWidth) blob.x = window.innerWidth;
    if (blob.y > window.innerHeight) blob.y = window.innerHeight;

    // Update the blob's position
    updateBlobPosition(blob, blob.x, blob.y);
  });

  // Handle collisions
  for (let i = 0; i < blobs.length; i++) {
    for (let j = i + 1; j < blobs.length; j++) {
      handleCollision(blobs[i], blobs[j]);
    }
  }
}

  
  // Initialize blobs and start the animation
  initBlobs();
  animate();

