document.addEventListener('DOMContentLoaded', () => {
    // 1. Portfolio Generation
    const grid = document.getElementById('portfolio-grid');
    if (grid && typeof portfolioData !== 'undefined') {
        grid.innerHTML = ''; 
        
        portfolioData.forEach(work => {
            const isLocked = work.status === 'locked';
            const hasVideo = work.video && !isLocked;
            const safeImagePath = encodeURI(work.image);
            const safeVideoPath = hasVideo ? encodeURI(work.video) : '';
            
            const itemHTML = `
                <div class="portfolio-item-wrapper ${isLocked ? 'item-locked' : ''}">
                    ${isLocked ? 
                        `<div class="portfolio-item reveal">` : 
                        `<a href="${work.link}" target="_blank" class="portfolio-item-link reveal"><div class="portfolio-item">`
                    }
                        <img src="${safeImagePath}" alt="${work.title}" class="portfolio-image" loading="lazy">
                        
                        ${hasVideo ? `
                            <video class="portfolio-video" muted loop playsinline preload="metadata">
                                <source src="${safeVideoPath}" type="video/mp4">
                            </video>
                        ` : ''}
                        
                        ${isLocked ? `
                            <div class="locked-overlay">
                                <i class="fa-solid fa-lock"></i>
                                <span class="locked-status">Classified / In Progress</span>
                            </div>
                        ` : ''}

                        <div class="portfolio-info">
                            <h3>${work.title}</h3>
                            <p>${work.role}</p>
                            <div class="work-tags">
                                ${work.tags ? work.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                            </div>
                        </div>
                    ${isLocked ? `</div>` : `</div></a>`}
                </div>
            `;
            grid.innerHTML += itemHTML;
        });

        // CTA Плитка
        const ctaHTML = `
            <div class="portfolio-item-wrapper item-cta">
                <a href="#contact" class="portfolio-item-link reveal">
                    <div class="portfolio-item">
                        <img src="assets/images/222.jpg" alt="Open Opportunities" class="portfolio-image" loading="lazy">
                        <div class="cta-overlay">
                            <span class="cta-status">Your Space / Project</span>
                        </div>
                        <div class="portfolio-info">
                            <h3>LET'S BUILD YOUR WORLD...</h3>
                            <p>WORLD BUILDER | LEVEL ARTIST</p>
                        </div>
                    </div>
                </a>
            </div>
        `;
        grid.innerHTML += ctaHTML;

        initSmartVideoLogic();
    }

    function initSmartVideoLogic() {
        const items = document.querySelectorAll('.portfolio-item');
        
        // Обсервер, який ТІЛЬКИ зупиняє відео, коли воно зникає з екрана
        const stopObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target.querySelector('.portfolio-video');
                if (video && !entry.isIntersecting) {
                    video.pause();
                    video.style.opacity = '0';
                    video.currentTime = 0;
                }
            });
        }, { threshold: 0.1 });

        items.forEach(item => {
            const video = item.querySelector('.portfolio-video');
            if (!video) return;

            stopObserver.observe(item);

            // ПК: Hover
            item.addEventListener('mouseenter', () => {
                video.play().catch(() => {});
                video.style.opacity = '1';
            });
            item.addEventListener('mouseleave', () => {
                video.pause();
                video.style.opacity = '0';
                video.currentTime = 0;
            });

            // Мобілки: Touch
            item.addEventListener('touchstart', () => {
                video.play().catch(() => {});
                video.style.opacity = '1';
            }, {passive: true});
        });
    }

    // 2. Custom Cursor
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('a, button, .portfolio-item, .burger').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // 3. Burger & Navigation (Fix #home)
    const burger = document.querySelector('#burger');
    const nav = document.querySelector('.nav-links');
    if (burger) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
        });

        document.querySelectorAll('.nav-links li a').forEach(link => {
            link.addEventListener('click', (e) => {
                // Якщо це лінк на головну, прибираємо хеш
                if (link.getAttribute('href') === '#home') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    history.replaceState(null, null, ' '); // Видаляє # з URL
                }
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
            });
        });
    }

    // 4. Reveal & Parallax
    const reveal = () => {
        document.querySelectorAll('.reveal, section').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', reveal);
    reveal();

    document.querySelectorAll('.portfolio-item').forEach(item => {
        const img = item.querySelector('.portfolio-image');
        if (!img) return;
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            img.style.transform = `translateX(${x * 15}px) translateY(${y * 15}px) scale(1.1)`;
        });
        item.addEventListener('mouseleave', () => {
            img.style.transform = `translateX(0px) translateY(0px) scale(1.0)`;
        });
    });
});