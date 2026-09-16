(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})(),gsap.registerPlugin(ScrollTrigger);function e(e){for(let t of[/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,/(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/]){let n=e.match(t);if(n)return n[1]}return null}function t(t){if(!t||t.length===0)return``;let n=t.filter(e=>e.type===`link`),r=t.filter(e=>e.type===`image`),i=t.filter(e=>e.type===`video`),a=`
    <div class="sources-section">
      <div class="sources-label">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
        </svg>
        Sources &amp; References
      </div>`;if(n.length>0){a+=`<div class="sources-links">`;for(let e of n)a+=`
        <a href="${e.url}" target="_blank" rel="noopener noreferrer" class="source-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          ${e.label}
        </a>`;a+=`</div>`}if(r.length>0||i.length>0){a+=`<div class="sources-media">`;for(let e of r)a+=`
        <div class="source-image-thumb" data-lightbox="image" data-src="${e.url}" data-caption="${e.label||``}${e.credit?` — `+e.credit:``}">
          <img src="${e.url}" alt="${e.label||``}" loading="lazy"/>
          <div class="thumb-overlay">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 3 21 3 21 9"/>
              <line x1="14" y1="10" x2="21" y2="3"/>
              <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>
            </svg>
          </div>
        </div>`;for(let t of i){let n=e(t.url),r=n?`https://img.youtube.com/vi/${n}/mqdefault.jpg`:``,i=n?`https://www.youtube-nocookie.com/embed/${n}?autoplay=1&rel=0`:t.url;a+=`
        <div class="source-video-thumb" data-lightbox="video" data-embed="${i}" data-caption="${t.label||``}">
          ${r?`<img src="${r}" alt="${t.label||``}" loading="lazy"/>`:``}
          <div class="video-play-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <div class="source-video-label">${t.label||``}</div>
        </div>`}a+=`</div>`}return a+=`</div>`,a}function n(){let e=document.getElementById(`lightbox`),t=document.getElementById(`lightbox-body`),n=document.getElementById(`lightbox-close`);function r(n,r,i){t.innerHTML=``,n===`image`?t.innerHTML=`
        <img src="${r}" alt="${i||``}"/>
        ${i?`<div class="lightbox-caption">${i}</div>`:``}`:n===`video`&&(t.innerHTML=`
        <iframe src="${r}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
        ${i?`<div class="lightbox-caption">${i}</div>`:``}`),e.classList.add(`open`)}function i(){e.classList.remove(`open`),setTimeout(()=>{t.innerHTML=``},300)}n.addEventListener(`click`,i),e.addEventListener(`click`,t=>{t.target===e&&i()}),document.addEventListener(`keydown`,t=>{t.key===`Escape`&&e.classList.contains(`open`)&&i()}),document.addEventListener(`click`,e=>{let t=e.target.closest(`[data-lightbox="image"]`);if(t){r(`image`,t.dataset.src,t.dataset.caption);return}let n=e.target.closest(`[data-lightbox="video"]`);n&&r(`video`,n.dataset.embed,n.dataset.caption)})}async function r(){try{let e=await fetch(`./data/timeline.json?v=${new Date().getTime()}`);if(!e.ok)throw Error(`Failed to fetch timeline data`);let n=await e.json(),r=document.getElementById(`events-wrapper`);n.forEach((e,n)=>{let i=n%2==0?`left`:`right`,a=document.createElement(`div`);a.className=`event-row ${i}`;let o=t(e.sources);a.innerHTML=`
        <div class="event-node"></div>
        <div class="event-card">
          <div class="event-category">${e.category}</div>
          <div class="event-header">
            <div class="event-year">${e.year}</div>
            ${e.flag?`<div class="event-flag"><span class="fi fi-${e.flag}"></span></div>`:``}
          </div>
          <h2 class="event-title">${e.title}</h2>
          <p class="event-description">${e.description}</p>
          ${o}
        </div>
      `,r.appendChild(a)}),i()}catch(e){console.error(`Error initializing timeline:`,e)}}function i(){gsap.to(`#timeline-progress`,{height:`100%`,ease:`none`,scrollTrigger:{trigger:`.timeline-section`,start:`top center`,end:`bottom bottom`,scrub:!0}}),document.querySelectorAll(`.event-row`).forEach(e=>{let t=e.querySelector(`.event-card`),n=e.querySelector(`.event-node`);ScrollTrigger.create({trigger:e,start:`top 50%`,onEnter:()=>{gsap.to(t,{x:0,opacity:1,duration:.8,ease:`power3.out`}),n.classList.add(`active`)},onLeaveBack:()=>{let r=e.classList.contains(`left`),i=window.innerWidth<=768?20:r?-50:50;gsap.to(t,{x:i,opacity:0,duration:.5,ease:`power2.in`}),n.classList.remove(`active`)}})})}document.addEventListener(`DOMContentLoaded`,()=>{r(),o(),a(),n()});function a(){document.querySelectorAll(`.glow-hover`).forEach(e=>{e.addEventListener(`mousemove`,t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top;e.style.setProperty(`--mouse-x`,`${r}px`),e.style.setProperty(`--mouse-y`,`${i}px`)})})}function o(){let e=document.getElementById(`support-modal`),t=document.getElementById(`open-support-btn`),n=document.getElementById(`close-support-btn`),r=document.getElementById(`copy-link-btn`);t.addEventListener(`click`,()=>{e.classList.add(`open`)}),n.addEventListener(`click`,()=>{e.classList.remove(`open`)}),e.addEventListener(`click`,t=>{t.target===e&&e.classList.remove(`open`)}),r.addEventListener(`click`,()=>{navigator.clipboard.writeText(`https://aviperera.com/ai-policy-timeline`).then(()=>{let e=r.innerHTML;r.innerHTML=`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> LINK COPIED!`,r.style.color=`#4ade80`,r.style.borderColor=`rgba(74, 222, 128, 0.3)`,setTimeout(()=>{r.innerHTML=e,r.style.color=``,r.style.borderColor=``},2e3)})})}