/**
 * script.js — Interactivity for Enhanced Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- 1. THEME TOGGLE ---------- */
    const themeBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;
    
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        root.setAttribute('data-theme', savedTheme);
    } else if (!prefersDark) {
        root.setAttribute('data-theme', 'light');
    }

    themeBtn.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });


    /* ---------- 2. MOBILE MENU & NAVBAR ---------- */
    const navBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-link');

    navBtn.addEventListener('click', () => {
        navLinks.classList.toggle('nav-open');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('nav-open');
        });
    });


    /* ---------- 3. CUSTOM CURSOR ---------- */
    const cursor = document.getElementById('cursor-glow');
    if (cursor && window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
    }


    /* ---------- 4. SCROLL ANIMATIONS (Intersection Observer) ---------- */
    const animElements = document.querySelectorAll('.anim-fade-up, .anim-fade-left, .anim-fade-right');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Unobserve after animating once
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    animElements.forEach(el => scrollObserver.observe(el));


    /* ---------- 5. NUMBER COUNT-UP ---------- */
    const stats = document.querySelectorAll('.count-up');
    let hasCounted = false;

    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasCounted) {
            hasCounted = true;
            stats.forEach(stat => {
                const target = parseFloat(stat.getAttribute('data-target'));
                const duration = 2000; // ms
                const isDecimal = stat.hasAttribute('data-decimal');
                const start = 0;
                let startTime = null;

                const animate = (currentTime) => {
                    if (!startTime) startTime = currentTime;
                    const progress = Math.min((currentTime - startTime) / duration, 1);
                    
                    // Ease out cubic
                    const easeProgress = 1 - Math.pow(1 - progress, 3);
                    const currentVal = start + (target - start) * easeProgress;

                    stat.innerText = isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal);

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        stat.innerText = target;
                    }
                };
                requestAnimationFrame(animate);
            });
        }
    }, { threshold: 0.5 });
    
    const statsContainer = document.querySelector('.hero-stats');
    if (statsContainer) statsObserver.observe(statsContainer);


    /* ---------- 6. TYPEWRITER EFFECT ---------- */
    const phrases = [
        "Spring Boot Architect",
        "JWT & OAuth2 Expert",
        "Microservices Engineer",
        "Cloud-Native Developer",
        "Enterprise Java Specialist"
    ];
    const typeEl = document.getElementById('typewriter-text');
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function type() {
        if (!typeEl) return;
        const currentPhrase = phrases[phraseIdx];
        
        if (isDeleting) {
            typeEl.innerText = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typeEl.innerText = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
        }

        let typeSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && charIdx === currentPhrase.length) {
            typeSpeed = 2000; // Pause at full word
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            typeSpeed = 500; // Pause before typing next
        }

        setTimeout(type, typeSpeed);
    }
    setTimeout(type, 1000);


    /* ---------- 7. SKILL BAR FILL ---------- */
    const skillFills = document.querySelectorAll('.skill-fill');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                fill.style.width = fill.getAttribute('data-width');
                skillObserver.unobserve(fill);
            }
        });
    }, { threshold: 0.5 });

    skillFills.forEach(fill => skillObserver.observe(fill));


    /* ---------- 8. PARALLAX CARD EFFECT (Mousemove) ---------- */
    const cardWrap = document.getElementById('hero-code-card');
    const card = document.querySelector('.code-card');
    
    if (cardWrap && card && window.matchMedia('(pointer: fine)').matches) {
        cardWrap.addEventListener('mousemove', (e) => {
            const rect = cardWrap.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        cardWrap.addEventListener('mouseleave', () => {
            card.style.transform = `rotateX(5deg) rotateY(-5deg)`; // Default tilt
        });
    }


    /* ---------- 9. PARTICLE CANVAS (Subtle Background) ---------- */
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let w, h;

        function resize() {
            w = canvas.width = canvas.offsetWidth;
            h = canvas.height = canvas.offsetHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > w) this.x = 0;
                if (this.x < 0) this.x = w;
                if (this.y > h) this.y = 0;
                if (this.y < 0) this.y = h;
            }
            draw() {
                // Read accent color from DOM computed style to match themes
                const appStyle = getComputedStyle(document.documentElement);
                const colorBase = appStyle.getPropertyValue('--accent-secondary-rgb').trim() || '0, 194, 255';
                
                ctx.fillStyle = `rgba(${colorBase}, 0.3)`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.min(Math.floor((w * h) / 15000), 50); // Responsive count
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }
        initParticles();

        function animateCanvas() {
            ctx.clearRect(0, 0, w, h);
            
            const appStyle = getComputedStyle(document.documentElement);
            const colorBase = appStyle.getPropertyValue('--accent-secondary-rgb').trim() || '0, 194, 255';

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                // Draw lines between close particles
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${colorBase}, ${0.1 - (dist/120)*0.1})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }

});
