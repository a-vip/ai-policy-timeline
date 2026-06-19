// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

async function initTimeline() {
  try {
    const response = await fetch('./data/timeline.json');
    if (!response.ok) throw new Error('Failed to fetch timeline data');
    const events = await response.json();
    
    const wrapper = document.getElementById('events-wrapper');
    
    // Create HTML for each event
    events.forEach((event, index) => {
      const card = document.createElement('div');
      card.className = `event-card event-${index}`;
      
      // Determine side based on even/odd index
      const isEven = index % 2 === 0;
      // Use CSS variables or data attributes to help GSAP position them
      card.setAttribute('data-side', isEven ? 'left' : 'right');
      
      card.innerHTML = `
        <div class="event-category">${event.category}</div>
        <div class="event-year">${event.year}</div>
        <h2 class="event-title">${event.title}</h2>
        <p class="event-description">${event.description}</p>
      `;
      wrapper.appendChild(card);
    });

    setupGSAPAnimations();
    
  } catch (error) {
    console.error('Error initializing timeline:', error);
  }
}

function setupGSAPAnimations() {
  const cards = document.querySelectorAll('.event-card');
  
  // Create a master timeline linked to the scroll of .timeline-container
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.timeline-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1, // Smooth scrubbing
      pin: true,
      pinSpacing: true
    }
  });

  // Calculate staggering. 
  // We want each card to come from deep Z (e.g. -2000px) and fade in,
  // pass by the user (scale up, fade out), and move past Z=0.
  
  cards.forEach((card, index) => {
    const side = card.getAttribute('data-side');
    const xOffset = side === 'left' ? -300 : 300; // Offset them left/right of center axis
    
    // Initial state: hidden deep in Z space
    gsap.set(card, {
      z: -4000,
      x: xOffset,
      y: 0,
      opacity: 0,
      scale: 0.5
    });

    // We add tweens to the master timeline.
    // Each card's animation starts at a specific time (progress) based on its index.
    const startTime = index * 0.5; // Stagger start times
    
    // Animation for this card:
    // 1. Move from Z:-4000 to Z:1000 (past the camera)
    // 2. Fade in, then fade out as it gets too close
    // 3. Scale up slightly as it approaches
    
    tl.to(card, {
      z: 500,
      duration: 2,
      ease: 'none'
    }, startTime);

    // Opacity animation (fade in, stay, fade out)
    tl.to(card, {
      opacity: 1,
      duration: 0.5,
      ease: 'power1.inOut'
    }, startTime + 0.2);
    
    tl.to(card, {
      opacity: 0,
      duration: 0.4,
      ease: 'power1.inOut'
    }, startTime + 1.6); // Fade out right before it hits camera (z=0)
    
    // Scale animation
    tl.to(card, {
      scale: 1.2,
      duration: 2,
      ease: 'power1.in'
    }, startTime);
  });
}

// Start app
document.addEventListener('DOMContentLoaded', initTimeline);
