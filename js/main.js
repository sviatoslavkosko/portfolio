/* ============================================================
   SVIATOSLAV KOSKO — main.js
   Loader (matrix rain + typewriter + segmented bar) · mosaic · hero · nav
   ============================================================ */

/* ---- Service sliders (global for inline onclick) ---- */
window.nextSlide = (id) => {
    const s = document.getElementById(`slider-${id}`); if (!s) return;
    const imgs = s.querySelectorAll('.slider-img');
    const i = Array.from(imgs).findIndex(x => x.classList.contains('active'));
    if (i === -1) return;
    imgs[i].classList.remove('active');
    imgs[(i + 1) % imgs.length].classList.add('active');
};
window.prevSlide = (id) => {
    const s = document.getElementById(`slider-${id}`); if (!s) return;
    const imgs = s.querySelectorAll('.slider-img');
    const i = Array.from(imgs).findIndex(x => x.classList.contains('active'));
    if (i === -1) return;
    imgs[i].classList.remove('active');
    imgs[(i - 1 + imgs.length) % imgs.length].classList.add('active');
};

/* ============================================================
   LOADING SCREEN — Slow Snake Wipe & Brightness Pulse
   ============================================================ */
(function loader() {
    const el = document.getElementById('loader');
    if (!el) return;
    const canvas = el.querySelector('.loader-dither');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = Date.now();
    const MIN_MS = 2000; 
    
    document.body.style.overflow = 'hidden';

    let ctx, W, H, cols, rows;
    const chunkSize = 50; // Розмір блоку
    const pixelSize = 15;  // Розмір пікселя для ефекту на краю
    const accentColor = '#FF2E00'; 
    
    let wipeIndex = 0; 
    let isExiting = false;
    let raf;

    const initCanvas = () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        ctx = canvas.getContext('2d', { alpha: true });
        cols = Math.ceil(W / chunkSize);
        rows = Math.ceil(H / chunkSize);
    };

    // Малює дізеринг тільки на "голові" змійки
    const drawDither = (x, y, size, color) => {
        ctx.fillStyle = color;
        for(let dx=0; dx<size; dx+=pixelSize) {
            for(let dy=0; dy<size; dy+=pixelSize) {
                if(Math.random() < 0.6) {
                    ctx.fillRect(x+dx, y+dy, pixelSize, pixelSize);
                }
            }
        }
    };

    const renderCanvas = () => {
        ctx.clearRect(0, 0, W, H);
        let activeBlocks = 0;
        const totalChunks = cols * rows;

        for(let j=0; j<rows; j++) {
            for(let i=0; i<cols; i++) {
                const x = i * chunkSize;
                const y = j * chunkSize;
                
                // СПРАВЖНЯ ЗМІЙКА: Парні ряди ->, Непарні <-
                const linearIndex = (j % 2 === 0) 
                    ? (j * cols + i) 
                    : (j * cols + (cols - 1 - i));
                
                let dist = isExiting ? (linearIndex - wipeIndex) : 1000;

                // Якщо блок позаду змійки — він зникає (показує сайт)
                if (dist < 0) continue;
                
                activeBlocks++;
                ctx.fillStyle = '#0A0806'; // Глибокий чорний фон
                ctx.fillRect(x, y, chunkSize, chunkSize);

                // Голова змійки (8 блоків, які зараз будуть знищені)
                if (isExiting && dist >= 0 && dist < 8) {
                    drawDither(x, y, chunkSize, accentColor);
                }
            }
        }

        if (isExiting) {
            // ШВИДКІСТЬ ЗМІЙКИ: Значно повільніше (було /45, стало /80)
            wipeIndex += (totalChunks / 80); 
            
            if (activeBlocks > 0) {
                raf = requestAnimationFrame(renderCanvas);
            } else {
                document.body.style.overflow = '';
                el.remove();
            }
        } else {
            raf = requestAnimationFrame(renderCanvas);
        }
    };

    if (!reduce) {
        initCanvas();
        window.addEventListener('resize', initCanvas);
        raf = requestAnimationFrame(renderCanvas);
    }

    /* ---- TRIGGER EXIT ---- */
    const startExit = () => {
        el.classList.add('exiting');
        isExiting = true; 
    };

    const finish = () => {
        const elapsed = Date.now() - start;
        const remain = Math.max(0, MIN_MS - elapsed);
        setTimeout(() => {
            if (reduce) { document.body.style.overflow = ''; el.remove(); } 
            else startExit();
        }, remain);
    };

    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish);
})();

document.addEventListener('DOMContentLoaded', () => {

    /* ---- HERO slideshow cross-fade ---- */
    (function heroShow() {
        const slides = [...document.querySelectorAll('.hero-slide')];
        if (slides.length < 2) return;
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        let i = 0;
        setInterval(() => {
            slides[i].classList.remove('is-active');
            i = (i + 1) % slides.length;
            slides[i].classList.add('is-active');
        }, 5000);
    })();

    /* ---- Portfolio grids by category ---- */
    const grids = { gamedev: document.getElementById('grid-gamedev'), motion: document.getElementById('grid-motion') };
    const tile = (work) => {
        const isLocked = work.status === 'locked';
        const hasVideo = work.video && !isLocked;
        const img = encodeURI(work.image);
        const vid = hasVideo ? encodeURI(work.video) : '';
        const size = work.size ? `size-${work.size}` : '';
        return `
            <div class="portfolio-item-wrapper ${size} ${isLocked ? 'item-locked' : ''}">
                ${isLocked
                    ? `<div class="portfolio-item reveal">`
                    : `<a href="${work.link}" target="_blank" rel="noopener" class="portfolio-item-link reveal"><div class="portfolio-item">`}
                    <img src="${img}" alt="${work.title}" class="portfolio-image" loading="lazy">
                    ${hasVideo ? `<video class="portfolio-video" muted loop playsinline preload="metadata"><source src="${vid}" type="video/mp4"></video>` : ''}
                    ${isLocked ? `<div class="locked-overlay"><i class="fa-solid fa-lock"></i><span class="locked-status">Classified / In Progress</span></div>` : ''}
                    <div class="portfolio-info">
                        <h3>${work.title}</h3>
                        <p>${work.role}</p>
                        <div class="work-tags">${work.tags ? work.tags.map(t => `<span class="tag">${t}</span>`).join('') : ''}</div>
                    </div>
                ${isLocked ? `</div>` : `</div></a>`}
            </div>`;
    };
    if (typeof portfolioData !== 'undefined') {
        Object.values(grids).forEach(g => g && (g.innerHTML = ''));
        portfolioData.forEach(work => { const g = grids[work.category] || grids.gamedev; if (g) g.innerHTML += tile(work); });
        const host = grids.motion || grids.gamedev;
        if (host) host.innerHTML += `
            <div class="portfolio-item-wrapper item-cta">
                <a href="#connect" class="portfolio-item-link reveal">
                    <div class="portfolio-item">
                        <img src="assets/images/222.jpg" alt="Open for work" class="portfolio-image" loading="lazy">
                        <div class="cta-overlay"><i class="fa-solid fa-location-dot"></i><span class="cta-status">Your Project</span></div>
                        <div class="portfolio-info cta-info"><h3>Let's build your world</h3><p>Level Artist · Motion</p></div>
                    </div>
                </a>
            </div>`;
        initSmartVideoLogic();
    }
    function initSmartVideoLogic() {
        const items = document.querySelectorAll('.portfolio-item');
        const stopObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const v = entry.target.querySelector('.portfolio-video');
                if (v && !entry.isIntersecting) { v.pause(); v.style.opacity = '0'; v.currentTime = 0; }
            });
        }, { threshold: 0.1 });
        items.forEach(item => {
            const v = item.querySelector('.portfolio-video');
            if (!v) return;
            stopObserver.observe(item);
            item.addEventListener('mouseenter', () => { v.play().catch(() => {}); v.style.opacity = '1'; });
            item.addEventListener('mouseleave', () => { v.pause(); v.style.opacity = '0'; v.currentTime = 0; });
            item.addEventListener('touchstart', () => { v.play().catch(() => {}); v.style.opacity = '1'; }, { passive: true });
        });
    }

    /* ---- Custom cursor (desktop only) ---- */
    const cursor = document.querySelector('.cursor');
    if (cursor && window.innerWidth > 1024) {
        document.addEventListener('mousemove', (e) => { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; });
        document.querySelectorAll('a, button, .portfolio-item, .burger, .slider-nav button, .connect-btn').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    /* ---- Burger + mobile nav ---- */
    const burger = document.querySelector('#burger');
    const nav = document.querySelector('.nav-links');
    if (burger && nav) {
        burger.addEventListener('click', () => { nav.classList.toggle('nav-active'); burger.classList.toggle('toggle'); });
        nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { nav.classList.remove('nav-active'); burger.classList.remove('toggle'); }));
    }

    /* ---- Smooth anchor scroll ---- */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); history.replaceState(null, '', ' '); }
        });
    });

    /* ---- Reveal on scroll ---- */
    const reveal = () => {
        document.querySelectorAll('.reveal, section, .service-card').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) el.classList.add('active');
        });
    };
    window.addEventListener('scroll', reveal, { passive: true });
    reveal();

    /* ---- Parallax (desktop only) ---- */
    if (window.innerWidth > 1024) {
        document.querySelectorAll('.portfolio-item').forEach(item => {
            const img = item.querySelector('.portfolio-image');
            if (!img) return;
            item.addEventListener('mousemove', (e) => {
                const r = item.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                img.style.transform = `translate(${x * 12}px, ${y * 12}px) scale(1.08)`;
            });
            item.addEventListener('mouseleave', () => { img.style.transform = 'translate(0,0) scale(1)'; });
        });
    }

    /* ---- Smart navbar hide (robust) ---- */
    const header = document.querySelector('.header');
    let lastY = window.scrollY, ticking = false;
    window.addEventListener('scroll', () => {
        if (window.innerWidth > 1024 || !header) return;
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const y = window.scrollY;
            const open = nav && nav.classList.contains('nav-active');
            if (!open && Math.abs(y - lastY) > 12) {
                if (y > lastY && y > 140) header.classList.add('nav-hidden');
                else header.classList.remove('nav-hidden');
                lastY = y;
            }
            ticking = false;
        });
    }, { passive: true });
});
