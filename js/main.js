// 1. Слайдери (Global Functions) - Мають бути зверху, щоб HTML їх бачив
window.nextSlide = (id) => {
    const slider = document.getElementById(`slider-${id}`);
    if (!slider) return;
    const images = slider.querySelectorAll('.slider-img');
    let activeIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
    if (activeIndex === -1) return;
    images[activeIndex].classList.remove('active');
    images[(activeIndex + 1) % images.length].classList.add('active');
};

window.prevSlide = (id) => {
    const slider = document.getElementById(`slider-${id}`);
    if (!slider) return;
    const images = slider.querySelectorAll('.slider-img');
    let activeIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
    if (activeIndex === -1) return;
    images[activeIndex].classList.remove('active');
    images[(activeIndex - 1 + images.length) % images.length].classList.add('active');
};
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
    window.nextSlide = (id) => {
    const slider = document.getElementById(`slider-${id}`);
    if (!slider) return;
    const images = slider.querySelectorAll('.slider-img');
    let activeIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
    if (activeIndex === -1) return;
    images[activeIndex].classList.remove('active');
    images[(activeIndex + 1) % images.length].classList.add('active');
};

window.prevSlide = (id) => {
    const slider = document.getElementById(`slider-${id}`);
    if (!slider) return;
    const images = slider.querySelectorAll('.slider-img');
    let activeIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
    if (activeIndex === -1) return;
    images[activeIndex].classList.remove('active');
    images[(activeIndex - 1 + images.length) % images.length].classList.add('active');
};

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('portfolio-grid');
    if (grid && typeof portfolioData !== 'undefined') {
        grid.innerHTML = ''; 
        portfolioData.forEach(work => {
            const isLocked = work.status === 'locked';
            const hasVideo = work.video && !isLocked;
            grid.innerHTML += `
                <div class="portfolio-item-wrapper ${isLocked ? 'item-locked' : ''}">
                    ${isLocked ? `<div class="portfolio-item reveal">` : `<a href="${work.link}" target="_blank" class="portfolio-item-link reveal"><div class="portfolio-item">`}
                        <img src="${encodeURI(work.image)}" alt="${work.title}" class="portfolio-image" loading="lazy">
                        ${hasVideo ? `<video class="portfolio-video" muted loop playsinline preload="metadata"><source src="${encodeURI(work.video)}" type="video/mp4"></video>` : ''}
                        <div class="locked-overlay">
                            <i class="fa-solid fa-lock"></i>
                            ${isLocked ? `<span class="locked-status">Classified</span>` : ''}
                        </div>
                        <div class="portfolio-info">
                            <h3>${work.title}</h3>
                            <p>${work.role}</p>
                        </div>
                    ${isLocked ? `</div>` : `</div></a>`}
                </div>`;
        });

        // CTA Плитка (Твій "байт")
        grid.innerHTML += `
            <div class="portfolio-item-wrapper item-cta">
                <a href="#contact" class="portfolio-item-link reveal">
                    <div class="portfolio-item">
                        <img src="assets/images/222.jpg" class="portfolio-image" loading="lazy">
                        <div class="cta-overlay"><i class="fa-solid fa-location-dot"></i></div>
                        <div class="portfolio-info">
                            <h3>LET'S BUILD YOUR WORLD...</h3>
                            <p>WORLD BUILDER | LEVEL ARTIST</p>
                        </div>
                    </div>
                </a>
            </div>`;
        initSmartVideoLogic();
    }

    // 3. ФІКС ПОСИЛАНЬ (Працює завжди)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                // Прибираємо хеш, щоб посилання спрацьовувало знову
                window.history.replaceState(null, null, ' '); 
            }
        });
    });

function initSmartVideoLogic() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Спрощена логіка: тільки мобільний автоплей/автостоп
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('.portfolio-video');
            if (!video) return;

            if (entry.isIntersecting) {
                // Якщо відео на екрані — пробуємо запустити
                video.play().catch(() => {
                    // Якщо автоплей заблоковано браузером — ігноруємо
                });
                video.style.opacity = '1';
            } else {
                // Якщо відео пішло з екрана — примусово стопимо
                video.pause();
                video.style.opacity = '0';
                video.currentTime = 0; // Скидаємо на початок
            }
        });
    }, { 
        threshold: 0.2 // Відіео має бути видно на 20%, щоб запуститися
    });

    portfolioItems.forEach(item => {
        obs.observe(item);
    });
}

// 5. КУРСОР ТА БУРГЕР
const cursor = document.querySelector('.cursor');
if (cursor) {
    if (window.innerWidth > 1024) {
        // Логіка для ПК (залишаємо як була)
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        document.querySelectorAll('a, button, .portfolio-item, .burger, .slider-btn').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    } else {
        // МАГІЯ ДЛЯ IPHONE: з'являється хрестик на тапі
        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            cursor.style.left = touch.clientX + 'px';
            cursor.style.top = touch.clientY + 'px';
            
            cursor.classList.add('active', 'hover'); // Додаємо 'hover', щоб був хрестик
            cursor.style.opacity = '1';

            // Плавно ховаємо через 1 сек
            setTimeout(() => {
                cursor.style.opacity = '0';
                setTimeout(() => cursor.classList.remove('active', 'hover'), 500);
            }, 800);
        }, { passive: true });
    }
}

    // 6. REVEAL ANIMATION
    const reveal = () => {
        document.querySelectorAll('.reveal, section, .service-card').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) el.classList.add('active');
        });
    };
    window.addEventListener('scroll', reveal);
    reveal();

    // 7. PARALLAX (ВИМКНЕНО НА МОБІЛЬНИХ ДЛЯ ПЛАВНОСТІ)
    if (window.innerWidth > 1024) {
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
    }
});
// ЛОГІКА РОЗУМНОГО НАВБАРУ (Тільки для мобілок)
let lastScrollY = window.scrollY;
const header = document.querySelector('header');
const navLinks = document.querySelector('.nav-links'); // Твоє мобільне меню

window.addEventListener('scroll', () => {
    if (window.innerWidth <= 1024) {
        const currentScrollY = window.scrollY;
        
        // Перевіряємо, чи не відкрите зараз мобільне меню
        const isNavOpen = navLinks && navLinks.classList.contains('nav-active');

        // Якщо меню закрите — працюємо зі скролом
        if (!isNavOpen) {
            // scrollY > 70 — щоб не ховався відразу біля самого верху
            if (currentScrollY > lastScrollY && currentScrollY > 70) {
                header.classList.add('nav-hidden');
            } else {
                header.classList.remove('nav-hidden');
            }
        }
        
        lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    }
}, { passive: true });

});