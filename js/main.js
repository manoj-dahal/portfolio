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
    // Theme Toggle (Dark/Light Mode)
    // ===================================
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme) {
        document.body.classList.toggle('dark-mode', currentTheme === 'dark');
        updateThemeIcon(currentTheme === 'dark');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon(isDark);
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
    // Contact Form Handling
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
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
            submitBtn.disabled = true;

            try {
                // Simulate sending (replace with actual API call)
                await simulateFormSubmission(formData);

                // Success message
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();

            } catch (error) {
                showNotification('Failed to send message. Please try again.', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
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
    // Console Message
    // ===================================
    console.log('%c👋 Hello, Developer!', 'font-size: 20px; font-weight: bold; color: #6366f1;');
    console.log('%cLooking at the code? Feel free to reach out!', 'font-size: 14px; color: #8b5cf6;');
    console.log('%cEmail: john.doe@example.com', 'font-size: 12px; color: #6b7280;');

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