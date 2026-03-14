document.addEventListener('DOMContentLoaded', () => {
// 1. Portfolio Generation
const grid = document.getElementById('portfolio-grid');
if (grid && typeof portfolioData !== 'undefined') {
    grid.innerHTML = ''; // Очищуємо перед рендером
    
    // Геренуємо всі роботи з масиву
    portfolioData.forEach(work => {
        const isLocked = work.status === 'locked';
        const hasVideo = work.video && !isLocked; // Відео тільки для відкритих робіт
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
                        <video class="portfolio-video" muted loop playsinline preload="none">
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

    // Додаємо фінальний CTA-елемент manually ПІСЛЯ всіх робіт
    const ctaHTML = `
        <div class="portfolio-item-wrapper item-cta">
            <a href="#contact" class="portfolio-item-link reveal">
                <div class="portfolio-item">
                    
                    <img src="assets/images/222.jpg" alt="Open Opportunities" class="portfolio-image" loading="lazy">
                    
                    <div class="cta-overlay">
                        <i class="fa-solid fa-location-dot"></i>
                        <span class="cta-status">Your Space / Project</span>
                    </div>

                    <div class="portfolio-info">
                        <h3>LET'S BUILD YOUR WORLD...</h3>
                        <p>WORLD BUILDER | LEVEL ARTIST</p>
                        <div class="work-tags">
                            <span class="tag">UE5</span>
                            <span class="tag">LUMEN</span>
                            <span class="tag">VIRTUAL SETS</span>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    `;
    grid.innerHTML += ctaHTML;

    // Додаємо логіку відтворення відео ПІСЛЯ того, як згенерували сітку
    initVideoHovers();
}

// Функція для керування відео при наведенні
function initVideoHovers() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        const video = item.querySelector('.portfolio-video');
        if (video) {
            item.addEventListener('mouseenter', () => {
                video.play();
                video.style.opacity = '1';
            });
            item.addEventListener('mouseleave', () => {
                video.pause();
                video.style.opacity = '0';
                video.currentTime = 0; // Скидаємо відео на початок
            });
        }
    });
}
// Функція для керування відео: тільки при взаємодії
function initVideoInteractions() {
    const items = document.querySelectorAll('.portfolio-item');
    
    items.forEach(item => {
        const video = item.querySelector('.portfolio-video');
        if (!video) return;

        // Для ПК: Наведення мишки
        item.addEventListener('mouseenter', () => {
            video.play();
            video.style.opacity = '1';
        });

        item.addEventListener('mouseleave', () => {
            video.pause();
            video.style.opacity = '0';
            video.currentTime = 0;
        });

        // Для мобільних: Дотик
        // На телефонах mouseenter зазвичай спрацьовує при першому тапі
        item.addEventListener('touchstart', () => {
            video.play();
            video.style.opacity = '1';
        }, {passive: true});
    });
}

// Виклич цю функцію в кінці генерації портфоліо замість старого initVideoObserver
    // 2. Custom Cursor
    const cursor = document.querySelector('.cursor');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const handleHover = () => {
        const interactiveEls = document.querySelectorAll('a, button, .portfolio-item, .burger');
        interactiveEls.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    };
    handleHover();

    // 3. Burger Menu
    const burger = document.querySelector('#burger');
    const nav = document.querySelector('.nav-links');
    if (burger) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
            // Автозакриття меню після кліку на лінк
    const navLinksList = document.querySelectorAll('.nav-links li a');
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            const nav = document.querySelector('.nav-links');
            const burger = document.querySelector('#burger');
            
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
        });
    });
        });
    }

    // 4. Reveal Animation
    const reveal = () => {
        const reveals = document.querySelectorAll('.reveal, section, .service-card');
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 100) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', reveal);
    reveal(); // Запуск при старті

    // 5. Sliders (Global functions)
    window.nextSlide = (id) => {
        const images = document.querySelectorAll(`#slider-${id} .slider-img`);
        let activeIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
        if(activeIndex === -1) return;
        images[activeIndex].classList.remove('active');
        images[(activeIndex + 1) % images.length].classList.add('active');
    };

    window.prevSlide = (id) => {
        const images = document.querySelectorAll(`#slider-${id} .slider-img`);
        let activeIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
        if(activeIndex === -1) return;
        images[activeIndex].classList.remove('active');
        images[(activeIndex - 1 + images.length) % images.length].classList.add('active');
    };

    document.querySelectorAll('.portfolio-item').forEach(item => {
    const img = item.querySelector('img');

    item.addEventListener('mousemove', (e) => {
        const speed = 2;
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        img.style.transform = `translateX(${x}px) translateY(${y}px) scale(1.1)`;
    });

    // Оцей блок повертає все на місце
    item.addEventListener('mouseleave', () => {
        img.style.transform = `translateX(0px) translateY(0px) scale(1.0)`;
    });
});
});