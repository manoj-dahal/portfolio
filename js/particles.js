// ===================================
// Particle Background Effect
// ===================================

(function() {
    'use strict';

    class ParticleBackground {
        constructor(containerId, options = {}) {
            this.container = document.getElementById(containerId);
            if (!this.container) return;

            // Configuration
            this.config = {
                particleCount: options.particleCount || 80,
                particleSize: options.particleSize || 2,
                particleColor: options.particleColor || '#6366f1',
                lineColor: options.lineColor || '#6366f1',
                lineOpacity: options.lineOpacity || 0.15,
                particleOpacity: options.particleOpacity || 0.5,
                speed: options.speed || 0.5,
                connectDistance: options.connectDistance || 150,
                interactive: options.interactive !== false,
                responsiveBreakpoint: options.responsiveBreakpoint || 768
            };

            this.canvas = null;
            this.ctx = null;
            this.particles = [];
            this.mouse = { x: null, y: null, radius: 150 };
            this.animationFrame = null;

            this.init();
        }

        init() {
            this.createCanvas();
            this.createParticles();
            this.bindEvents();
            this.animate();
        }

        createCanvas() {
            this.canvas = document.createElement('canvas');
            this.canvas.style.position = 'absolute';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.style.pointerEvents = 'none';
            
            this.container.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
            
            this.resize();
        }

        createParticles() {
            const particleCount = window.innerWidth < this.config.responsiveBreakpoint 
                ? Math.floor(this.config.particleCount / 2) 
                : this.config.particleCount;

            this.particles = [];
            
            for (let i = 0; i < particleCount; i++) {
                this.particles.push(new Particle(
                    Math.random() * this.canvas.width,
                    Math.random() * this.canvas.height,
                    this.config
                ));
            }
        }

        bindEvents() {
            window.addEventListener('resize', () => this.resize());
            
            if (this.config.interactive) {
                this.canvas.addEventListener('mousemove', (e) => {
                    const rect = this.canvas.getBoundingClientRect();
                    this.mouse.x = e.clientX - rect.left;
                    this.mouse.y = e.clientY - rect.top;
                });

                this.canvas.addEventListener('mouseleave', () => {
                    this.mouse.x = null;
                    this.mouse.y = null;
                });

                // Touch support
                this.canvas.addEventListener('touchmove', (e) => {
                    const rect = this.canvas.getBoundingClientRect();
                    const touch = e.touches[0];
                    this.mouse.x = touch.clientX - rect.left;
                    this.mouse.y = touch.clientY - rect.top;
                });

                this.canvas.addEventListener('touchend', () => {
                    this.mouse.x = null;
                    this.mouse.y = null;
                });
            }
        }

        resize() {
            this.canvas.width = this.container.offsetWidth;
            this.canvas.height = this.container.offsetHeight;
            
            // Recreate particles on significant resize
            if (this.particles.length === 0) {
                this.createParticles();
            }
        }

        connectParticles() {
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const dx = this.particles[i].x - this.particles[j].x;
                    const dy = this.particles[i].y - this.particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < this.config.connectDistance) {
                        const opacity = this.config.lineOpacity * (1 - distance / this.config.connectDistance);
                        this.ctx.strokeStyle = this.hexToRGBA(this.config.lineColor, opacity);
                        this.ctx.lineWidth = 1;
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        this.ctx.stroke();
                    }
                }
            }
        }

        connectMouse() {
            if (this.mouse.x === null || this.mouse.y === null) return;

            this.particles.forEach(particle => {
                const dx = particle.x - this.mouse.x;
                const dy = particle.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouse.radius) {
                    const opacity = 0.3 * (1 - distance / this.mouse.radius);
                    this.ctx.strokeStyle = this.hexToRGBA(this.config.lineColor, opacity);
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.stroke();

                    // Repel particles from mouse
                    const angle = Math.atan2(dy, dx);
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    particle.vx += Math.cos(angle) * force * 0.5;
                    particle.vy += Math.sin(angle) * force * 0.5;
                }
            });
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.particles.forEach(particle => {
                particle.update(this.canvas.width, this.canvas.height);
                particle.draw(this.ctx);
            });

            this.connectParticles();
            
            if (this.config.interactive) {
                this.connectMouse();
            }

            this.animationFrame = requestAnimationFrame(() => this.animate());
        }

        hexToRGBA(hex, alpha) {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }

        destroy() {
            cancelAnimationFrame(this.animationFrame);
            this.canvas.remove();
            window.removeEventListener('resize', this.resize);
        }
    }

    class Particle {
        constructor(x, y, config) {
            this.x = x;
            this.y = y;
            this.config = config;
            this.size = Math.random() * config.particleSize + 1;
            this.speedX = (Math.random() - 0.5) * config.speed;
            this.speedY = (Math.random() - 0.5) * config.speed;
            this.vx = this.speedX;
            this.vy = this.speedY;
            this.color = config.particleColor;
            this.opacity = config.particleOpacity;
        }

        update(canvasWidth, canvasHeight) {
            // Add some friction to mouse interaction
            this.vx += (this.speedX - this.vx) * 0.05;
            this.vy += (this.speedY - this.vy) * 0.05;

            this.x += this.vx;
            this.y += this.vy;

            // Bounce off walls
            if (this.x < 0 || this.x > canvasWidth) {
                this.vx *= -1;
                this.x = this.x < 0 ? 0 : canvasWidth;
            }

            if (this.y < 0 || this.y > canvasHeight) {
                this.vy *= -1;
                this.y = this.y < 0 ? 0 : canvasHeight;
            }
        }

        draw(ctx) {
            ctx.fillStyle = this.hexToRGBA(this.color, this.opacity);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();

            // Add glow effect
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size * 3
            );
            gradient.addColorStop(0, this.hexToRGBA(this.color, this.opacity));
            gradient.addColorStop(1, this.hexToRGBA(this.color, 0));
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fill();
        }

        hexToRGBA(hex, alpha) {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
    }

    // Initialize particles when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!prefersReducedMotion) {
            new ParticleBackground('particles', {
                particleCount: 80,
                particleSize: 2,
                particleColor: getComputedStyle(document.documentElement)
                    .getPropertyValue('--primary-color').trim() || '#6366f1',
                speed: 0.5,
                connectDistance: 150,
                interactive: true
            });
        }
    });

    // Export for use in other scripts if needed
    window.ParticleBackground = ParticleBackground;

})();