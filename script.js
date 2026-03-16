/* ============================================
   PERFORMANCE DASHBOARDS - PORTFOLIO
   Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ---------- Custom Cursor ----------
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    // Smooth ring follow
    function animateCursor() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .glass-card, .project-card, input, .btn');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('hover');
            cursorRing.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('hover');
            cursorRing.classList.remove('hover');
        });
    });

    // ---------- Navbar Scroll Effect ----------
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar background
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ---------- Mobile Nav Toggle ----------
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('open');
    });

    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinksContainer.classList.remove('open');
        });
    });

    // ---------- Neon Lines Canvas ----------
    const canvas = document.getElementById('neonCanvas');
    const ctx = canvas.getContext('2d');
    let lines = [];
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class NeonLine {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.length = Math.random() * 120 + 60;
            this.angle = Math.random() * Math.PI * 2;
            this.speed = Math.random() * 0.3 + 0.1;
            this.opacity = Math.random() * 0.25 + 0.05;
            this.width = Math.random() * 1.5 + 0.5;
            this.hue = Math.random() > 0.5 ? 28 : 25; // orange tones
            this.life = 0;
            this.maxLife = Math.random() * 400 + 200;
        }

        update() {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.life++;
            if (this.life > this.maxLife || this.x < -50 || this.x > canvas.width + 50 || this.y < -50 || this.y > canvas.height + 50) {
                this.reset();
            }
        }

        draw() {
            const fadeRatio = Math.min(this.life / 50, 1, (this.maxLife - this.life) / 50);
            const alpha = this.opacity * fadeRatio;
            const endX = this.x + Math.cos(this.angle) * this.length;
            const endY = this.y + Math.sin(this.angle) * this.length;

            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = `hsla(${this.hue}, 100%, 55%, ${alpha})`;
            ctx.lineWidth = this.width;
            ctx.lineCap = 'round';
            ctx.shadowBlur = 15;
            ctx.shadowColor = `hsla(${this.hue}, 100%, 55%, ${alpha * 0.5})`;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }

    class FloatingParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.pulse = Math.random() * Math.PI * 2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.pulse += 0.02;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            const pulsedOpacity = this.opacity * (0.5 + 0.5 * Math.sin(this.pulse));
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 122, 0, ${pulsedOpacity})`;
            ctx.fill();
            ctx.shadowBlur = 8;
            ctx.shadowColor = `rgba(255, 122, 0, ${pulsedOpacity * 0.4})`;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    // Initialize
    for (let i = 0; i < 15; i++) lines.push(new NeonLine());
    for (let i = 0; i < 30; i++) particles.push(new FloatingParticle());

    function animateCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        lines.forEach(line => { line.update(); line.draw(); });
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateCanvas);
    }
    animateCanvas();

    // ---------- Hero Floating Particles ----------
    const heroParticles = document.getElementById('heroParticles');
    for (let i = 0; i < 20; i++) {
        const dot = document.createElement('div');
        dot.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(255, 122, 0, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 6 + 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 4}s;
            box-shadow: 0 0 ${Math.random() * 8 + 4}px rgba(255, 122, 0, 0.3);
            pointer-events: none;
        `;
        heroParticles.appendChild(dot);
    }

    // ---------- 3D Tilt Effect ----------
    const tiltElements = document.querySelectorAll('[data-tilt]');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;

            // Move glow
            const glow = el.querySelector('.card-glow');
            if (glow) {
                glow.style.left = (x - 100) + 'px';
                glow.style.top = (y - 100) + 'px';
            }
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ---------- Hero 3D Parallax on Mouse ----------
    const heroContent = document.getElementById('heroContent');

    document.addEventListener('mousemove', (e) => {
        if (!heroContent) return;
        const rect = heroContent.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) return;

        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        heroContent.style.transform = `perspective(1200px) rotateX(${y * -2}deg) rotateY(${x * 2}deg)`;
    });

    // ---------- Counter Animation ----------
    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        countersAnimated = true;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const start = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                // easeOutQuart
                const eased = 1 - Math.pow(1 - progress, 4);
                counter.textContent = Math.floor(target * eased);

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    // ---------- Scroll-Triggered Animations (Intersection Observer) ----------
    const revealElements = document.querySelectorAll('.section-header, .glass-card, .project-card, .contact-grid, .footer');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered delay for cards
                const delay = entry.target.classList.contains('glass-card') || entry.target.classList.contains('project-card')
                    ? (index * 150)
                    : 0;

                setTimeout(() => {
                    entry.target.classList.add('active');
                }, delay);

                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // Counter observer
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const counterObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                counterObserver.unobserve(statsSection);
            }
        }, { threshold: 0.5 });
        counterObserver.observe(statsSection);
    }

    // ---------- Parallax on Scroll ----------
    const heroVideo = document.querySelector('.hero-video-wrapper');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Parallax hero video (slower movement)
        if (heroVideo && scrollY < window.innerHeight) {
            heroVideo.style.transform = `translateY(${scrollY * 0.35}px)`;
        }

        // Parallax for floating particles
        if (heroParticles && scrollY < window.innerHeight) {
            heroParticles.style.transform = `translateY(${scrollY * 0.15}px)`;
        }
    }, { passive: true });

    // ---------- Liquid Blobs ----------
    const aboutSection = document.querySelector('.about');
    const projectsSection = document.querySelector('.projects');
    const contactSection = document.querySelector('.contact');

    [aboutSection, projectsSection, contactSection].forEach((section, i) => {
        if (!section) return;
        const blob = document.createElement('div');
        blob.classList.add('liquid-blob');
        blob.style.animationDelay = `${i * 2}s`;
        blob.style.left = i % 2 === 0 ? '-5%' : '70%';
        blob.style.top = '20%';
        section.style.position = 'relative';
        section.appendChild(blob);
    });

    // ---------- Magnetic Button Effect ----------
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-whatsapp, .btn-project');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.03)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0) scale(1)';
        });
    });

    // ---------- Smooth Scroll for Nav Links ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ---------- Search Functionality ----------
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.toLowerCase().trim();
                if (!query) return;

                const sectionMap = {
                    'sobre': '#about',
                    'serviço': '#about',
                    'servico': '#about',
                    'dashboard': '#about',
                    'gráfico': '#about',
                    'grafico': '#about',
                    'design': '#about',
                    'projeto': '#projects',
                    'portfólio': '#projects',
                    'portfolio': '#projects',
                    'contato': '#contact',
                    'email': '#contact',
                    'whatsapp': '#contact',
                    'telefone': '#contact',
                };

                for (const [key, value] of Object.entries(sectionMap)) {
                    if (query.includes(key)) {
                        document.querySelector(value)?.scrollIntoView({ behavior: 'smooth' });
                        searchInput.value = '';
                        searchInput.blur();
                        return;
                    }
                }

                // Default: scroll to about
                document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
                searchInput.value = '';
            }
        });
    }

    // ---------- Video Fallback ----------
    const heroVideoEl = document.getElementById('heroVideo');
    if (heroVideoEl) {
        heroVideoEl.addEventListener('error', () => {
            // If video fails, use a gradient background
            const wrapper = document.querySelector('.hero-video-wrapper');
            if (wrapper) {
                wrapper.style.background = `
                    linear-gradient(135deg, #0B0B0B 0%, #1A0F0A 50%, #0B0B0B 100%)
                `;
                heroVideoEl.style.display = 'none';
            }
        });
    }

    // ---------- Page Load Animation ----------
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-out';
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });
});
