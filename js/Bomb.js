import { CONFIG } from '../config/config.js';

export default class Bomb {
    constructor() {
        this.x = Math.random() * (CONFIG.CANVAS_WIDTH - 100) + 50;
        this.y = -80;
        this.speed = CONFIG.BOMB.SPEED;
        this.width = CONFIG.BOMB.WIDTH;
        this.height = CONFIG.BOMB.HEIGHT;
        this.exploded = false;
        this.explosionRadius = CONFIG.BOMB.EXPLOSION_RADIUS;
        
        this.element = document.createElement('img');
        this.element.src = 'assets/characters/bomb.png';
        this.element.className = 'bomb-img';
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        this.element.style.position = 'fixed';
        this.element.style.zIndex = '1000';
        this.element.style.display = 'block';
        
        const container = document.querySelector('#game-container') || document.querySelector('#game');
        container.appendChild(this.element);
        
        console.log('Bomb created at:', this.x, this.y);
        
        this.render();
    }

    update() {
        if (!this.exploded) {
            this.y += this.speed;
            this.render();
        }
    }

    render() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.zIndex = '1000';
        this.element.style.display = 'block';
        this.element.style.position = 'fixed';
    }

    explode() {
        if (this.exploded) return;
        
        this.exploded = true;
        this.element.src = 'assets/characters/boom.png';
        
        // Remove after explosion animation
        setTimeout(() => {
            this.destroy();
        }, 300);
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.remove();
        }
    }

    isOffscreen() {
        return this.y > CONFIG.CANVAS_HEIGHT + 100;
    }

    checkCollision(fish) {
        const dx = this.x + this.width / 2 - (fish.x + fish.width / 2);
        const dy = this.y + this.height / 2 - (fish.y + fish.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance < this.explosionRadius;
    }
}