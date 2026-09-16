// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// ── Helpers ──

/** Extract YouTube video ID from various URL formats */
function getYouTubeId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/** Build the sources HTML block for a single event */
function buildSourcesHTML(sources) {
  if (!sources || sources.length === 0) return '';

  const links = sources.filter(s => s.type === 'link');
  const images = sources.filter(s => s.type === 'image');
  const videos = sources.filter(s => s.type === 'video');

  let html = `
    <div class="sources-section">
      <div class="sources-label">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
        </svg>
        Sources &amp; References
      </div>`;

  // Link pills
  if (links.length > 0) {
    html += '<div class="sources-links">';
    for (const link of links) {
      html += `
        <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="source-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          ${link.label}
        </a>`;
    }
    html += '</div>';
  }

  // Media thumbnails (images + videos)
  if (images.length > 0 || videos.length > 0) {
    html += '<div class="sources-media">';

    for (const img of images) {
      html += `
        <div class="source-image-thumb" data-lightbox="image" data-src="${img.url}" data-caption="${img.label || ''}${img.credit ? ' — ' + img.credit : ''}">
          <img src="${img.url}" alt="${img.label || ''}" loading="lazy"/>
          <div class="thumb-overlay">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 3 21 3 21 9"/>
              <line x1="14" y1="10" x2="21" y2="3"/>
              <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>
            </svg>
          </div>
        </div>`;
    }

    for (const vid of videos) {
      const ytId = getYouTubeId(vid.url);
      const thumbUrl = ytId
        ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
        : '';
      const embedUrl = ytId
        ? `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`
        : vid.url;

      html += `
        <div class="source-video-thumb" data-lightbox="video" data-embed="${embedUrl}" data-caption="${vid.label || ''}">
          ${thumbUrl ? `<img src="${thumbUrl}" alt="${vid.label || ''}" loading="lazy"/>` : ''}
          <div class="video-play-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <div class="source-video-label">${vid.label || ''}</div>
        </div>`;
    }

    html += '</div>';
  }

  html += '</div>';
  return html;
}

// ── Lightbox ──

function setupLightbox() {
  const overlay = document.getElementById('lightbox');
  const body = document.getElementById('lightbox-body');
  const closeBtn = document.getElementById('lightbox-close');

  function openLightbox(type, src, caption) {
    body.innerHTML = '';
    if (type === 'image') {
      body.innerHTML = `
        <img src="${src}" alt="${caption || ''}"/>
        ${caption ? `<div class="lightbox-caption">${caption}</div>` : ''}`;
    } else if (type === 'video') {
      body.innerHTML = `
        <iframe src="${src}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
        ${caption ? `<div class="lightbox-caption">${caption}</div>` : ''}`;
    }
    overlay.classList.add('open');
  }

  function closeLightbox() {
    overlay.classList.remove('open');
    // Stop any playing video by clearing iframe
    setTimeout(() => { body.innerHTML = ''; }, 300);
  }

  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeLightbox();
  });

  // Delegate click events from thumbnails
  document.addEventListener('click', (e) => {
    const imageThumb = e.target.closest('[data-lightbox="image"]');
    if (imageThumb) {
      openLightbox('image', imageThumb.dataset.src, imageThumb.dataset.caption);
      return;
    }
    const videoThumb = e.target.closest('[data-lightbox="video"]');
    if (videoThumb) {
      openLightbox('video', videoThumb.dataset.embed, videoThumb.dataset.caption);
    }
  });
}

// ── Timeline Init ──

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
      
      const sourcesHTML = buildSourcesHTML(event.sources);
      
      row.innerHTML = `
        <div class="event-node"></div>
        <div class="event-card">
          <div class="event-category">${event.category}</div>
          <div class="event-header">
            <div class="event-year">${event.year}</div>
            ${event.flag ? `<div class="event-flag"><span class="fi fi-${event.flag}"></span></div>` : ''}
          </div>
          <h2 class="event-title">${event.title}</h2>
          <p class="event-description">${event.description}</p>
          ${sourcesHTML}
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
document.addEventListener('DOMContentLoaded', () => {
  initTimeline();
  setupModal();
  setupGlowHover();
  setupLightbox();
});

function setupGlowHover() {
  const cards = document.querySelectorAll('.glow-hover');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

function setupModal() {
  const modal = document.getElementById('support-modal');
  const openBtn = document.getElementById('open-support-btn');
  const closeBtn = document.getElementById('close-support-btn');
  const copyBtn = document.getElementById('copy-link-btn');

  openBtn.addEventListener('click', () => {
    modal.classList.add('open');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('open');
  });

  // Close when clicking outside modal content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
    }
  });

  // Copy link functionality
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('https://aviperera.com/ai-policy-timeline').then(() => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> LINK COPIED!';
      copyBtn.style.color = '#4ade80';
      copyBtn.style.borderColor = 'rgba(74, 222, 128, 0.3)';
      
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.style.color = '';
        copyBtn.style.borderColor = '';
      }, 2000);
    });
  });
}
