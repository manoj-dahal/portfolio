// ===================================
// Portfolio Main JavaScript
// ===================================

(function() {
    'use strict';

    // ===================================
    // Global Variables
    // ===================================
    const navbar = document.getElementById('navbar');
    const navMenu = document.getElementById('navMenu');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('themeToggle');
    const scrollTop = document.getElementById('scrollTop');
    const scrollProgress = document.getElementById('scrollProgress');
    const preloader = document.getElementById('preloader');

    // ===================================
    // Preloader
    // ===================================
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1000);
    });

    // ===================================
    // Navigation Scroll Effect
    // ===================================
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update scroll progress bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + '%';

        // Show/hide scroll to top button
        if (currentScroll > 300) {
            scrollTop.classList.add('visible');
        } else {
            scrollTop.classList.remove('visible');
        }

        lastScroll = currentScroll;
    });

    // ===================================
    // Mobile Navigation Toggle
    // ===================================
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ===================================
    // Active Navigation Link on Scroll
    // ===================================
    const sections = document.querySelectorAll('section[id]');

    function highlightNavigation() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink?.classList.add('active');
            } else {
                navLink?.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);

    // ===================================
    // Smooth Scroll for Anchor Links
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===================================
    // Theme Toggle (Dark/Light Mode) - DARK MODE DEFAULT
    // ===================================
    // Force dark mode as default (unless user explicitly set light)
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Default to dark unless user explicitly chose light
    const isDark = savedTheme ? (savedTheme === 'dark') : true;
    
    document.body.classList.toggle('dark-mode', isDark);
    updateThemeIcon(isDark);
    
    // Persist the default dark mode
    if (!savedTheme) {
        localStorage.setItem('theme', 'dark');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isCurrentlyDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isCurrentlyDark ? 'dark' : 'light');
        updateThemeIcon(isCurrentlyDark);
    });

    function updateThemeIcon(isDark) {
        const icon = themeToggle.querySelector('i');
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }

    // ===================================
    // Typing Effect
    // ===================================
    const typingText = document.getElementById('typingText');
    const roles = [
        'Full Stack Developer',
        'UI/UX Designer',
        'Problem Solver',
        'Creative Thinker'
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before next word
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // Start typing effect
    if (typingText) {
        typeEffect();
    }

    // ===================================
    // Skills Progress Animation
    // ===================================
    const skillsSection = document.getElementById('skills');
    let skillsAnimated = false;

    function animateSkills() {
        if (skillsAnimated) return;

        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            bar.style.setProperty('--progress-width', progress + '%');
            bar.style.width = progress + '%';
        });

        skillsAnimated = true;
    }

    // Animate skills when section is in view
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
            }
        });
    }, { threshold: 0.3 });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // ===================================
    // Testimonials Carousel
    // ===================================
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    const carouselDotsContainer = document.getElementById('carouselDots');

    if (carouselTrack && carouselPrev && carouselNext) {
        const slides = carouselTrack.children;
        let currentSlide = 0;
        let slideWidth = 0;
        let autoSlideInterval = null;

        function updateSlideWidth() {
            slideWidth = slides[0].offsetWidth;
        }

        function updateCarousel() {
            carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
            updateDots();
        }

        function goToSlide(index) {
            currentSlide = Math.max(0, Math.min(index, slides.length - 1));
            updateCarousel();
            resetAutoSlide();
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            updateCarousel();
            resetAutoSlide();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateCarousel();
            resetAutoSlide();
        }

        function createDots() {
            if (!carouselDotsContainer) return;
            carouselDotsContainer.innerHTML = '';
            
            for (let i = 0; i < slides.length; i++) {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                carouselDotsContainer.appendChild(dot);
            }
        }

        function updateDots() {
            if (!carouselDotsContainer) return;
            const dots = carouselDotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        function resetAutoSlide() {
            if (autoSlideInterval) clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextSlide, 6200);
        }

        // Auto-pause on hover
        const carouselWrapper = carouselTrack.parentElement;
        carouselWrapper.addEventListener('mouseenter', () => {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        });

        carouselWrapper.addEventListener('mouseleave', () => {
            if (!autoSlideInterval) {
                resetAutoSlide();
            }
        });

        // Event listeners
        carouselNext.addEventListener('click', nextSlide);
        carouselPrev.addEventListener('click', prevSlide);

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (document.activeElement.closest('.testimonials')) {
                if (e.key === 'ArrowRight') nextSlide();
                if (e.key === 'ArrowLeft') prevSlide();
            }
        });

        // Touch swipe support
        let touchStartX = 0;
        carouselTrack.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        carouselTrack.addEventListener('touchend', e => {
            const touchEndX = e.changedTouches[0].screenX;
            if (touchEndX < touchStartX - 50) nextSlide();
            if (touchEndX > touchStartX + 50) prevSlide();
        });

        // Resize handling
        window.addEventListener('resize', () => {
            updateSlideWidth();
            updateCarousel();
        });

        // Initialize
        setTimeout(() => {
            updateSlideWidth();
            createDots();
            updateCarousel();
            resetAutoSlide();
        }, 150);
    }

    // ===================================
    // Project Filtering
    // ===================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ===================================
    // Contact Form Handling (Improved + Confetti)
    // ===================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Validate form
            if (!validateForm(formData)) {
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('.btn');
            const originalText = submitBtn.innerHTML;
            contactForm.classList.add('submitting');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
            submitBtn.disabled = true;

            try {
                // Simulate sending
                await simulateFormSubmission(formData);

                // Success: confetti + nice state
                triggerConfetti();
                showFormSuccessState(contactForm, submitBtn, originalText);

            } catch (error) {
                showNotification('Failed to send message. Please try again.', 'error');
                contactForm.classList.remove('submitting');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    function showFormSuccessState(form, btn, originalText) {
        // Replace form content with success state
        form.innerHTML = `
            <div class="form-success-state">
                <i class="fas fa-check-circle"></i>
                <h3 style="margin-bottom: 0.5rem; color: var(--primary-color);">Thank you!</h3>
                <p style="margin-bottom: 1.5rem; color: var(--text-secondary);">Your message has been sent successfully.<br>I'll get back to you within 24 hours.</p>
                <button type="button" class="btn btn-primary" onclick="location.reload()">
                    <span>Send Another Message</span>
                </button>
            </div>
        `;
        
        // Optional: show a toast too
        setTimeout(() => {
            showNotification("Message received! I'll reply soon.", 'success');
        }, 1200);
    }

    function validateForm(data) {
        let isValid = true;

        // Name validation
        if (data.name.trim().length < 2) {
            showError('name', 'Name must be at least 2 characters');
            isValid = false;
        } else {
            clearError('name');
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError('email');
        }

        // Subject validation
        if (data.subject.trim().length < 3) {
            showError('subject', 'Subject must be at least 3 characters');
            isValid = false;
        } else {
            clearError('subject');
        }

        // Message validation
        if (data.message.trim().length < 10) {
            showError('message', 'Message must be at least 10 characters');
            isValid = false;
        } else {
            clearError('message');
        }

        return isValid;
    }

    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');
        
        field.style.borderColor = '#ef4444';
        errorElement.textContent = message;
    }

    function clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');
        
        field.style.borderColor = '';
        errorElement.textContent = '';
    }

    function simulateFormSubmission(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    console.log('Form submitted:', data);
                    resolve();
                } else {
                    reject(new Error('Submission failed'));
                }
            }, 2000);
        });
    }

    // ===================================
    // Notification System
    // ===================================
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: type === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            zIndex: '9999',
            animation: 'slideInRight 0.3s ease',
            maxWidth: '400px'
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // Add notification animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ===================================
    // Counter Animation
    // ===================================
    const counters = document.querySelectorAll('.stat-item h4');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            const increment = target / 50;
            let current = 0;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current) + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            };

            updateCounter();
        });

        countersAnimated = true;
    }

    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                }
            });
        }, { threshold: 0.5 });

        counterObserver.observe(aboutSection);
    }

    // ===================================
    // Initialize AOS (Animate On Scroll)
    // ===================================
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-in-out'
        });
    }

    // ===================================
    // Scroll to Top Button
    // ===================================
    scrollTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ===================================
    // Image Lazy Loading (for older browsers)
    // ===================================
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

    // ===================================
    // Easter Egg - Konami Code
    // ===================================
    let konamiCode = [];
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.keyCode);
        konamiCode.splice(-konamiSequence.length - 1, konamiCode.length - konamiSequence.length);

        if (konamiCode.join('').includes(konamiSequence.join(''))) {
            activateEasterEgg();
        }
    });

    function activateEasterEgg() {
        document.body.style.animation = 'rainbow 2s linear infinite';
        showNotification('🎮 Konami Code Activated! You found the easter egg!', 'success');
        
        const rainbowStyle = document.createElement('style');
        rainbowStyle.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(rainbowStyle);

        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }

    // ===================================
    // Performance Monitoring
    // ===================================
    if ('PerformanceObserver' in window) {
        const perfObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'largest-contentful-paint') {
                    console.log('LCP:', entry.renderTime || entry.loadTime);
                }
            }
        });

        perfObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    // ===================================
    // Confetti on Form Success
    // ===================================
    function triggerConfetti() {
        const canvas = document.createElement('canvas');
        canvas.id = 'confetti-canvas';
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const colors = ['#14b8a6', '#a855f7', '#67e8f9', '#f59e0b'];
        const particles = [];
        const particleCount = 180;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 7 + 5,
                speed: Math.random() * 3 + 2,
                angle: Math.random() * 360,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 8
            });
        }

        let frame = 0;
        const maxFrames = 180;

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            let stillAlive = false;
            
            particles.forEach(p => {
                if (p.y < canvas.height + 30) {
                    stillAlive = true;
                    
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation * Math.PI / 180);
                    
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                    
                    ctx.restore();
                    
                    // physics
                    p.y += p.speed;
                    p.x += Math.sin(frame / 12) * 0.6;
                    p.rotation += p.rotationSpeed;
                    p.speed *= 0.995;
                }
            });

            frame++;

            if (stillAlive && frame < maxFrames) {
                requestAnimationFrame(draw);
            } else {
                canvas.style.transition = 'opacity 0.6s ease';
                canvas.style.opacity = '0';
                setTimeout(() => canvas.remove(), 600);
            }
        }

        draw();

        // Clean up on window resize
        const resizeHandler = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resizeHandler, { once: true });
    }

    // ===================================
    // Magnetic Buttons (Light Effect)
    // ===================================
    function initMagneticButtons() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(btn => {
            btn.classList.add('btn-magnetic');
            
            btn.addEventListener('mousemove', function(e) {
                const rect = btn.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                
                btn.style.setProperty('--mx', `${x}%`);
                btn.style.setProperty('--my', `${y}%`);
                
                const moveX = (x - 50) * 0.14;
                const moveY = (y - 50) * 0.14;
                btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
            
            btn.addEventListener('mouseleave', function() {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ===================================
    // Hero Image Parallax (subtle)
    // ===================================
    function initHeroParallax() {
        const heroImage = document.querySelector('.hero-image .image-wrapper');
        if (!heroImage) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const factor = Math.min(scrollY * 0.065, 32);
                    heroImage.style.transform = `translateY(${factor}px)`;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ===================================
    // Performance & Accessibility tweaks
    // ===================================
    // Add loading="lazy" to all project and case study images
    document.querySelectorAll('img[src*="projects/"], .case-study-image img').forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });

    // Add aria-labels to some interactive elements for better a11y
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach((btn, i) => {
        if (!btn.getAttribute('aria-label')) {
            btn.setAttribute('aria-label', `Filter projects: ${btn.textContent}`);
        }
    });

    // ===================================
    // Case Study Modal Viewer
    // ===================================
    const caseModal = document.getElementById('caseModal');
    const modalClose = document.getElementById('modalClose');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const modalBody = document.getElementById('modalBody');

    // ===================================
    // Project Detail Modals
    // ===================================
    const projectModal = document.getElementById('projectModal');
    const projectModalClose = document.getElementById('projectModalClose');
    const projectModalTitle = document.getElementById('projectModalTitle');
    const projectModalMeta = document.getElementById('projectModalMeta');
    const projectModalBody = document.getElementById('projectModalBody');

    const projectData = {
        ecommerce: {
            title: "E-Commerce Platform",
            meta: "Full-Stack • React + Node.js • 2024",
            body: `
                <img src="images/projects/project1.jpg" alt="E-Commerce Platform" class="project-detail-image" loading="lazy">
                <div class="project-detail-meta">
                    <span><strong>Tech:</strong> React, Node.js, MongoDB, Stripe, Redis</span>
                    <span><strong>Duration:</strong> 4 months</span>
                </div>
                <div class="case-modal-section">
                    <h4>Overview</h4>
                    <p>A production-ready e-commerce platform built for high-volume retail with real-time inventory, cart persistence, and secure checkout.</p>
                </div>
                <div class="case-modal-section">
                    <h4>Key Features</h4>
                    <ul>
                        <li>Admin dashboard with real-time analytics</li>
                        <li>Stripe integration + multi-currency support</li>
                        <li>Advanced search + filtering with Elasticsearch</li>
                        <li>Inventory management and low-stock alerts</li>
                        <li>Progressive Web App with offline cart</li>
                    </ul>
                </div>
                <div class="case-modal-section">
                    <h4>Results</h4>
                    <p>Handled 1.1M monthly users and 3.2× conversion lift. 99.8% uptime during Black Friday.</p>
                </div>
                <a href="https://demo.example.com/ecommerce" class="btn btn-primary" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Live Demo</a>
                <a href="https://github.com/manoj-dahal/portfolio" class="btn btn-secondary" target="_blank" rel="noopener" style="margin-left: 0.5rem"><i class="fab fa-github"></i> Source Code</a>
            `
        },
        taskapp: {
            title: "Task Management App",
            meta: "Collaborative • Vue.js + Firebase • 2024",
            body: `
                <img src="images/projects/project2.jpg" alt="Task Management App" class="project-detail-image" loading="lazy">
                <div class="project-detail-meta">
                    <span><strong>Tech:</strong> Vue.js, Firebase, Tailwind, Chart.js</span>
                    <span><strong>Users:</strong> 28,000+</span>
                </div>
                <div class="case-modal-section">
                    <h4>Overview</h4>
                    <p>Real-time collaborative task manager with team workspaces, AI suggestions, and beautiful analytics.</p>
                </div>
                <div class="case-modal-section">
                    <h4>Key Features</h4>
                    <ul>
                        <li>Drag-and-drop Kanban + list views</li>
                        <li>Real-time comments and presence indicators</li>
                        <li>Built-in time tracking and reporting</li>
                        <li>Smart due date reminders via Firebase Cloud Functions</li>
                    </ul>
                </div>
                <div class="case-modal-section">
                    <h4>Results</h4>
                    <p>4.8★ rating. 94% weekly retention among teams.</p>
                </div>
                <a href="https://demo.example.com/tasks" class="btn btn-primary" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Live Demo</a>
                <a href="https://github.com/manoj-dahal/portfolio" class="btn btn-secondary" target="_blank" rel="noopener" style="margin-left: 0.5rem"><i class="fab fa-github"></i> Source Code</a>
            `
        },
        fitness: {
            title: "Fitness Tracker Mobile App",
            meta: "Mobile • React Native • 2023",
            body: `
                <img src="images/projects/project3.jpg" alt="Fitness Tracker" class="project-detail-image" loading="lazy">
                <div class="project-detail-meta">
                    <span><strong>Tech:</strong> React Native, Firebase, Redux, ML</span>
                    <span><strong>Platforms:</strong> iOS + Android</span>
                </div>
                <div class="case-modal-section">
                    <h4>Overview</h4>
                    <p>Cross-platform fitness coach with personalized workouts, nutrition tracking, and community challenges.</p>
                </div>
                <div class="case-modal-section">
                    <h4>Key Features</h4>
                    <ul>
                        <li>AI workout generator based on goals</li>
                        <li>Apple Health & Google Fit sync</li>
                        <li>Social feed and leaderboard</li>
                        <li>Offline mode with sync</li>
                    </ul>
                </div>
                <div class="case-modal-section">
                    <h4>Results</h4>
                    <p>180k active users • 42% 30-day retention • 4.9★ rating</p>
                </div>
                <a href="https://demo.example.com/fitness" class="btn btn-primary" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Live Demo</a>
                <a href="https://github.com/manoj-dahal/portfolio" class="btn btn-secondary" target="_blank" rel="noopener" style="margin-left: 0.5rem"><i class="fab fa-github"></i> Source Code</a>
            `
        },
        banking: {
            title: "Banking Dashboard UI",
            meta: "Design System + Web • 2024",
            body: `
                <img src="images/projects/project4.jpg" alt="Banking Dashboard" class="project-detail-image" loading="lazy">
                <div class="project-detail-meta">
                    <span><strong>Tech:</strong> Figma, Next.js, TypeScript, Chart.js</span>
                    <span><strong>Users:</strong> 12,000 advisors</span>
                </div>
                <div class="case-modal-section">
                    <h4>Overview</h4>
                    <p>Enterprise-grade banking dashboard with a complete design system and powerful analytics.</p>
                </div>
                <div class="case-modal-section">
                    <h4>Highlights</h4>
                    <ul>
                        <li>WCAG 2.1 AA compliant</li>
                        <li>Real-time portfolio sync</li>
                        <li>Advanced charting & export tools</li>
                        <li>Role-based access control</li>
                    </ul>
                </div>
                <a href="https://demo.example.com/banking" class="btn btn-primary" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Live Demo</a>
                <a href="https://github.com/manoj-dahal/portfolio" class="btn btn-secondary" target="_blank" rel="noopener" style="margin-left: 0.5rem"><i class="fab fa-github"></i> Source Code</a>
            `
        },
        social: {
            title: "Social Media Platform",
            meta: "Full-Stack • Next.js + GraphQL • 2024",
            body: `
                <img src="images/projects/project5.jpg" alt="Social Media Platform" class="project-detail-image" loading="lazy">
                <div class="project-detail-meta">
                    <span><strong>Tech:</strong> Next.js, GraphQL, PostgreSQL, WebSockets</span>
                </div>
                <div class="case-modal-section">
                    <h4>Overview</h4>
                    <p>Modern social network featuring real-time messaging, stories, AI content moderation, and advanced privacy controls.</p>
                </div>
                <div class="case-modal-section">
                    <h4>Highlights</h4>
                    <ul>
                        <li>250k daily active users</li>
                        <li>Sub-50ms message latency</li>
                        <li>AI-powered feed ranking</li>
                        <li>End-to-end encryption for DMs</li>
                    </ul>
                </div>
                <a href="https://demo.example.com/social" class="btn btn-primary" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Live Demo</a>
                <a href="https://github.com/manoj-dahal/portfolio" class="btn btn-secondary" target="_blank" rel="noopener" style="margin-left: 0.5rem"><i class="fab fa-github"></i> Source Code</a>
            `
        },
        realestate: {
            title: "Real Estate Portal",
            meta: "Marketplace • Django + React • 2023",
            body: `
                <img src="images/projects/project6.jpg" alt="Real Estate Portal" class="project-detail-image" loading="lazy">
                <div class="project-detail-meta">
                    <span><strong>Tech:</strong> Django, React, PostgreSQL, Mapbox, Three.js</span>
                </div>
                <div class="case-modal-section">
                    <h4>Overview</h4>
                    <p>End-to-end real estate marketplace with immersive virtual tours and AI-powered recommendations.</p>
                </div>
                <div class="case-modal-section">
                    <h4>Highlights</h4>
                    <ul>
                        <li>320k active listings</li>
                        <li>360° virtual tours using Three.js</li>
                        <li>Integrated mortgage calculator</li>
                        <li>Smart matching algorithm</li>
                    </ul>
                </div>
                <a href="https://demo.example.com/realestate" class="btn btn-primary" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Live Demo</a>
                <a href="https://github.com/manoj-dahal/portfolio" class="btn btn-secondary" target="_blank" rel="noopener" style="margin-left: 0.5rem"><i class="fab fa-github"></i> Source Code</a>
            `
        }
    };

    function openProjectModal(projectId) {
        const data = projectData[projectId];
        if (!data || !projectModal) return;

        projectModalTitle.textContent = data.title;
        projectModalMeta.innerHTML = data.meta;
        projectModalBody.innerHTML = data.body;

        projectModal.classList.add('active');
        projectModal.setAttribute('aria-hidden', 'false');
        projectModal.setAttribute('role', 'dialog');
        projectModal.setAttribute('aria-modal', 'true');
        document.body.style.overflow = 'hidden';

        setTimeout(() => projectModalClose.focus(), 80);
        trapFocus(projectModal);
    }

    function closeProjectModal() {
        if (!projectModal) return;
        projectModal.classList.remove('active');
        projectModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Attach to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        const projectId = card.dataset.project;
        if (!projectId) return;

        // Click entire card (except overlay buttons)
        card.addEventListener('click', (e) => {
            if (e.target.closest('.project-link')) return;
            openProjectModal(projectId);
        });

        // Also the "View details" text
        const viewMore = card.querySelector('.project-view-more');
        if (viewMore) {
            viewMore.addEventListener('click', (e) => {
                e.stopImmediatePropagation();
                openProjectModal(projectId);
            });
        }
    });

    if (projectModalClose) projectModalClose.addEventListener('click', closeProjectModal);
    if (projectModal) {
        projectModal.addEventListener('click', e => {
            if (e.target === projectModal) closeProjectModal();
        });
    }

    // Robust focus trap for all modals (case study, project, blog)
    function trapFocus(modal) {
        const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        let focusable = modal.querySelectorAll(focusableSelectors);
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        modal.addEventListener('keydown', function handler(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    }
                } else {
                    if (document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            }
            if (e.key === 'Escape') {
                // Let the existing ESC handlers close the modal
                modal.removeEventListener('keydown', handler);
            }
        });
    }

    // ===================================
    // Blog Post Modal
    // ===================================
    const blogModal = document.getElementById('blogModal');
    const blogModalClose = document.getElementById('blogModalClose');
    const blogModalTitle = document.getElementById('blogModalTitle');
    const blogModalMeta = document.getElementById('blogModalMeta');
    const blogModalBody = document.getElementById('blogModalBody');

    const blogPosts = {
        0: {
            title: "Building Performant Full-Stack Apps in 2025",
            meta: "Jul 12, 2025 • Development • 12 min read",
            body: `
                <p>In 2025, performance is no longer optional. Here's how I approach building apps that feel instant.</p>
                <h4>Core Principles</h4>
                <ul>
                    <li>Server components + selective hydration</li>
                    <li>Edge caching with stale-while-revalidate</li>
                    <li>Streaming UI with React Suspense</li>
                </ul>
                <h4>Tools I Love</h4>
                <p>Next.js App Router, TanStack Query, Drizzle ORM, and Vercel Edge Functions.</p>
                <p>These choices have consistently delivered sub-100ms TTFB on production apps.</p>
            `
        },
        1: {
            title: "Designing Systems That Actually Scale",
            meta: "Jun 28, 2025 • Design • 9 min read",
            body: `
                <p>Design systems only succeed when they reduce friction for everyone.</p>
                <h4>What Worked</h4>
                <ul>
                    <li>Token-based theming with CSS variables</li>
                    <li>Strict component API contracts</li>
                    <li>Built-in accessibility tests</li>
                </ul>
                <p>A good design system should feel invisible to developers.</p>
            `
        },
        2: {
            title: "Lessons from Leading Remote Teams",
            meta: "Jun 5, 2025 • Career • 14 min read",
            body: `
                <p>Remote work is here to stay. Here are the practices that actually moved the needle.</p>
                <h4>Key Lessons</h4>
                <ul>
                    <li>Over-communicate context, not status</li>
                    <li>Async-first documentation</li>
                    <li>Regular 1:1s that are actually useful</li>
                </ul>
                <p>Great remote teams don't just survive — they outperform colocated ones.</p>
            `
        }
    };

    function openBlogModal(index) {
        const post = blogPosts[index];
        if (!post || !blogModal) return;

        blogModalTitle.textContent = post.title;
        blogModalMeta.innerHTML = post.meta;
        blogModalBody.innerHTML = post.body;

        blogModal.classList.add('active');
        blogModal.setAttribute('aria-hidden', 'false');
        blogModal.setAttribute('role', 'dialog');
        blogModal.setAttribute('aria-modal', 'true');
        document.body.style.overflow = 'hidden';
        setTimeout(() => blogModalClose.focus(), 80);
        trapFocus(blogModal);
    }

    function closeBlogModal() {
        if (!blogModal) return;
        blogModal.classList.remove('active');
        blogModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Attach to blog teaser cards
    document.querySelectorAll('.blog-card').forEach((card, index) => {
        const link = card.querySelector('.blog-link');
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                openBlogModal(index);
            });
        }
        // Also allow clicking the whole card
        card.addEventListener('click', (e) => {
            if (e.target.closest('.blog-link')) return;
            openBlogModal(index);
        });
    });

    if (blogModalClose) blogModalClose.addEventListener('click', closeBlogModal);
    if (blogModal) {
        blogModal.addEventListener('click', e => {
            if (e.target === blogModal) closeBlogModal();
        });
    }

    // ESC key support for all modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (caseModal && caseModal.classList.contains('active')) closeCaseModal();
            if (projectModal && projectModal.classList.contains('active')) closeProjectModal();
            if (blogModal && blogModal.classList.contains('active')) closeBlogModal();
        }
    });

    const caseStudyData = {
        ecommerce: {
            title: "Scaling E-Commerce to 1M+ Users",
            subtitle: "TechMart Inc. • 2024 • E-Commerce Platform",
            content: `
                <div class="case-modal-section">
                    <h4>The Challenge</h4>
                    <p>TechMart was struggling with a legacy monolithic system that couldn't handle peak traffic during sales events. Conversion rate had plateaued and page load times averaged 4.2 seconds.</p>
                </div>
                <div class="case-modal-section">
                    <h4>Approach</h4>
                    <p>I led the full-stack migration to a modern microservices architecture using React + Node.js + MongoDB. Implemented edge caching, database sharding, and a new checkout flow with Stripe integration.</p>
                </div>
                <div class="case-modal-results">
                    <div class="result-item"><div class="value">3.2×</div><div class="label">Conversion Rate</div></div>
                    <div class="result-item"><div class="value">1.1M</div><div class="label">Monthly Active Users</div></div>
                    <div class="result-item"><div class="value">67%</div><div class="label">Faster Load Time</div></div>
                    <div class="result-item"><div class="value">99.8%</div><div class="label">Uptime</div></div>
                </div>
                <div class="case-modal-section">
                    <h4>Key Results</h4>
                    <p>Black Friday 2024 handled 4.8× previous peak traffic without a single incident. Average order value increased 18%. The platform now serves over 1 million monthly users with sub-100ms checkout experiences.</p>
                </div>
                <div class="case-modal-section">
                    <h4>Technologies Used</h4>
                    <div class="case-modal-tech">
                        <span>React</span>
                        <span>Node.js</span>
                        <span>MongoDB</span>
                        <span>Redis</span>
                        <span>Stripe</span>
                        <span>Docker</span>
                        <span>AWS</span>
                    </div>
                </div>
            `
        },
        social: {
            title: "Building Real-Time Social at Scale",
            subtitle: "Connectly • 2024 • Social Platform",
            content: `
                <div class="case-modal-section">
                    <h4>The Challenge</h4>
                    <p>Connectly needed a reliable real-time social experience capable of handling hundreds of thousands of concurrent users with low-latency messaging, stories, and content moderation.</p>
                </div>
                <div class="case-modal-section">
                    <h4>Approach</h4>
                    <p>Architected a Next.js frontend with a GraphQL + WebSocket backend. Built custom AI moderation using lightweight ML models. Implemented presence systems and optimistic UI updates.</p>
                </div>
                <div class="case-modal-results">
                    <div class="result-item"><div class="value">250k</div><div class="label">Daily Active Users</div></div>
                    <div class="result-item"><div class="value">99.9%</div><div class="label">Uptime</div></div>
                    <div class="result-item"><div class="value">4.8</div><div class="label">App Store Rating</div></div>
                    <div class="result-item"><div class="value">42ms</div><div class="label">Avg Message Latency</div></div>
                </div>
                <div class="case-modal-section">
                    <h4>Technologies Used</h4>
                    <div class="case-modal-tech">
                        <span>Next.js</span>
                        <span>GraphQL</span>
                        <span>WebSockets</span>
                        <span>PostgreSQL</span>
                        <span>Redis</span>
                        <span>Python (ML)</span>
                    </div>
                </div>
            `
        },
        fitness: {
            title: "Cross-Platform Fitness Platform",
            subtitle: "VitalFit Health • 2023 • Mobile App",
            content: `
                <div class="case-modal-section">
                    <h4>The Challenge</h4>
                    <p>VitalFit wanted a single codebase to deliver personalized fitness coaching on both iOS and Android while maintaining high performance and rich offline capabilities.</p>
                </div>
                <div class="case-modal-section">
                    <h4>Approach</h4>
                    <p>Built a React Native app backed by Firebase and a custom ML recommendation engine. Added social feed, live workouts, and deep integration with Apple Health & Google Fit.</p>
                </div>
                <div class="case-modal-results">
                    <div class="result-item"><div class="value">180k</div><div class="label">Active Users</div></div>
                    <div class="result-item"><div class="value">42%</div><div class="label">30-Day Retention</div></div>
                    <div class="result-item"><div class="value">4.9</div><div class="label">App Rating</div></div>
                    <div class="result-item"><div class="value">18%</div><div class="label">Avg Health Improvement</div></div>
                </div>
                <div class="case-modal-section">
                    <h4>Technologies Used</h4>
                    <div class="case-modal-tech">
                        <span>React Native</span>
                        <span>Firebase</span>
                        <span>Python ML</span>
                        <span>GraphQL</span>
                        <span>Expo</span>
                    </div>
                </div>
            `
        },
        banking: {
            title: "Enterprise Banking Dashboard",
            subtitle: "GlobalBank • 2024 • Design System + Web App",
            content: `
                <div class="case-modal-section">
                    <h4>The Challenge</h4>
                    <p>GlobalBank needed a unified, accessible dashboard for 12,000 wealth advisors across multiple regions with strict compliance and performance requirements.</p>
                </div>
                <div class="case-modal-section">
                    <h4>Approach</h4>
                    <p>Designed a complete design system in Figma and implemented it with Next.js + TypeScript. Built powerful data visualization, role-based permissions, and real-time portfolio syncing.</p>
                </div>
                <div class="case-modal-results">
                    <div class="result-item"><div class="value">12k</div><div class="label">Advisors</div></div>
                    <div class="result-item"><div class="value">89%</div><div class="label">Adoption</div></div>
                    <div class="result-item"><div class="value">41%</div><div class="label">Faster Tasks</div></div>
                    <div class="result-item"><div class="value">100%</div><div class="label">WCAG 2.1 AA</div></div>
                </div>
                <div class="case-modal-section">
                    <h4>Technologies Used</h4>
                    <div class="case-modal-tech">
                        <span>Next.js</span>
                        <span>TypeScript</span>
                        <span>Figma</span>
                        <span>PostgreSQL</span>
                        <span>Chart.js</span>
                    </div>
                </div>
            `
        },
        realestate: {
            title: "Modern Real Estate Marketplace",
            subtitle: "HomeVista • 2023 • Marketplace Platform",
            content: `
                <div class="case-modal-section">
                    <h4>The Challenge</h4>
                    <p>HomeVista wanted to modernize the home buying experience with immersive virtual tours, smart recommendations, and seamless mortgage integration.</p>
                </div>
                <div class="case-modal-section">
                    <h4>Approach</h4>
                    <p>Built a full-stack Django + React platform with 360° virtual tours, AI-powered recommendations, and real-time bidding. Integrated with major map providers and mortgage APIs.</p>
                </div>
                <div class="case-modal-results">
                    <div class="result-item"><div class="value">320k</div><div class="label">Active Listings</div></div>
                    <div class="result-item"><div class="value">2.8M</div><div class="label">Monthly Visits</div></div>
                    <div class="result-item"><div class="value">38%</div><div class="label">Inquiry Conversion</div></div>
                    <div class="result-item"><div class="value">3</div><div class="label">Countries</div></div>
                </div>
                <div class="case-modal-section">
                    <h4>Technologies Used</h4>
                    <div class="case-modal-tech">
                        <span>Django</span>
                        <span>React</span>
                        <span>PostgreSQL</span>
                        <span>Three.js</span>
                        <span>Mapbox</span>
                        <span>AWS</span>
                    </div>
                </div>
            `
        }
    };

    function openCaseModal(caseId) {
        const data = caseStudyData[caseId];
        if (!data || !caseModal) return;

        modalTitle.textContent = data.title;
        modalSubtitle.innerHTML = data.subtitle;
        modalBody.innerHTML = data.content;

        caseModal.classList.add('active');
        caseModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Focus close button
        setTimeout(() => modalClose.focus(), 100);
        trapFocus(caseModal);
    }

    function closeCaseModal() {
        if (!caseModal) return;
        caseModal.classList.remove('active');
        caseModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Attach listeners to all case study links
    document.querySelectorAll('.case-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const caseId = link.getAttribute('data-case');
            if (caseId) {
                openCaseModal(caseId);
            }
        });
    });

    // Modal close handlers
    if (modalClose) modalClose.addEventListener('click', closeCaseModal);
    
    if (caseModal) {
        caseModal.addEventListener('click', (e) => {
            if (e.target === caseModal) closeCaseModal();
        });
    }

    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && caseModal && caseModal.classList.contains('active')) {
            closeCaseModal();
        }
    });

    // ===================================
    // Initialize new features
    // ===================================
    initMagneticButtons();
    initHeroParallax();

    // ===================================
    // Console Message
    // ===================================
    console.log('%c👋 Hello, Developer!', 'font-size: 20px; font-weight: bold; color: #14b8a6;');
    console.log('%cLooking at the code? Feel free to reach out!', 'font-size: 14px; color: #a855f7;');
    console.log('%cEmail: info@manoj-dahal.com.np', 'font-size: 12px; color: #64748b;');

})();

// ===================================
// Utility Functions
// ===================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Get browser info
function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browserName = 'Unknown';
    
    if (userAgent.indexOf('Firefox') > -1) browserName = 'Firefox';
    else if (userAgent.indexOf('Chrome') > -1) browserName = 'Chrome';
    else if (userAgent.indexOf('Safari') > -1) browserName = 'Safari';
    else if (userAgent.indexOf('Edge') > -1) browserName = 'Edge';
    
    return browserName;
}