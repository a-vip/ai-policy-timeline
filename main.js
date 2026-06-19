// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

async function initTimeline() {
  try {
    // Add a cache-busting timestamp so the browser always fetches the latest data
    const response = await fetch(`./data/timeline.json?v=${new Date().getTime()}`);
    if (!response.ok) throw new Error('Failed to fetch timeline data');
    const events = await response.json();
    
    const wrapper = document.getElementById('events-wrapper');
    
    // Create HTML for each event row
    events.forEach((event, index) => {
      const isEven = index % 2 === 0;
      const sideClass = isEven ? 'left' : 'right';
      
      const row = document.createElement('div');
      row.className = `event-row ${sideClass}`;
      
      row.innerHTML = `
        <div class="event-node"></div>
        <div class="event-card">
          <div class="event-category">${event.category}</div>
          <div class="event-header">
            <div class="event-year">${event.year}</div>
            ${event.flag ? `<div class="event-flag">${event.flag}</div>` : ''}
          </div>
          <h2 class="event-title">${event.title}</h2>
          <p class="event-description">${event.description}</p>
        </div>
      `;
      wrapper.appendChild(row);
    });

    setupGSAPAnimations();
    
  } catch (error) {
    console.error('Error initializing timeline:', error);
  }
}

function setupGSAPAnimations() {
  // 1. Animate the center glowing line progress
  gsap.to('#timeline-progress', {
    height: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: '.timeline-section',
      start: 'top center',
      end: 'bottom bottom',
      scrub: true
    }
  });

  // 2. Animate each event row as it enters the viewport
  const rows = document.querySelectorAll('.event-row');
  
  rows.forEach((row) => {
    const card = row.querySelector('.event-card');
    const node = row.querySelector('.event-node');
    
    // The ScrollTrigger for this specific row
    ScrollTrigger.create({
      trigger: row,
      start: 'top 50%', // Triggers precisely when the neon progress bar hits the node
      onEnter: () => {
        // Animate the card sliding in and fading up
        gsap.to(card, {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out'
        });
        
        // Light up the node
        node.classList.add('active');
      },
      onLeaveBack: () => {
        // Optional: animate it back out if they scroll up
        const isLeft = row.classList.contains('left');
        // If mobile (window width < 768), everything comes from the right
        const offset = window.innerWidth <= 768 ? 20 : (isLeft ? -50 : 50);
        
        gsap.to(card, {
          x: offset,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.in'
        });
        
        node.classList.remove('active');
      }
    });
  });
}

// Start app
document.addEventListener('DOMContentLoaded', initTimeline);
