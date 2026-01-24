import { CONFIG } from '../config/config.js';

export default class Shark {
    constructor(direction) {
        this.direction = direction;
        this.width = CONFIG.SHARK.WIDTH;
        this.height = CONFIG.SHARK.HEIGHT;
        this.speed = CONFIG.SHARK.SPEED;
        this.level = 99; // Shark can eat everything
        this.isWarning = true;
        
        // Warning position
        if (direction === CONFIG.DIRECTION.RIGHT) {
            this.warningX = 50;
        } else {
            this.warningX = CONFIG.CANVAS_WIDTH - 200;
        }
        this.warningY = Math.random() * (CONFIG.CANVAS_HEIGHT - this.height - 100) + 50;
        
        // Create warning element
        this.warningElement = document.createElement('div');
        this.warningElement.className = 'shark-warning';
        this.warningElement.innerHTML = '<img src="assets/characters/shark.png" alt="warning">';
        this.warningElement.style.left = this.warningX + 'px';
        this.warningElement.style.top = this.warningY + 'px';
        
        // Make warning face same direction as shark
        const warningImg = this.warningElement.querySelector('img');
        if (direction === CONFIG.DIRECTION.LEFT) {
            warningImg.style.transform = 'scaleX(-1)';
        }
        
        document.querySelector('#game').appendChild(this.warningElement);
        
        // Create warning text
        this.warningText = document.createElement('div');
        this.warningText.className = 'shark-warning-text';
        this.warningText.textContent = 'WARNING: Eng. Mahmoud is COMING!!';
        document.querySelector('#game').appendChild(this.warningText);
        
        // After warning, spawn the actual shark
        setTimeout(() => {
            this.warningElement.remove();
            this.warningText.remove();
            this.isWarning = false;
            this.spawnShark();
        }, CONFIG.SHARK.WARNING_DURATION);
    }
    
    spawnShark() {
        // Start position based on direction
        if (this.direction === CONFIG.DIRECTION.RIGHT) {
            this.x = -this.width - 100;
        } else {
            this.x = CONFIG.CANVAS_WIDTH + 100;
        }
        
        this.y = this.warningY;
        
        this.element = document.createElement('img');
        this.element.src = 'assets/characters/shark.png';
        this.element.className = 'shark-img';
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        
        document.querySelector('#game').appendChild(this.element);
        
        this.render();
    }

    update() {
        if (this.isWarning) return;
        
        // Move shark across screen
        if (this.direction === CONFIG.DIRECTION.RIGHT) {
            this.x += this.speed;
        } else {
            this.x -= this.speed;
        }
        
        this.render();
    }

    render() {
        if (!this.element) return;
        
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.transform = this.direction < 0 ? 'scaleX(-1)' : 'scaleX(1)';
    }

    destroy() {
        if (this.warningElement && this.warningElement.parentNode) {
            this.warningElement.remove();
        }
        if (this.warningText && this.warningText.parentNode) {
            this.warningText.remove();
        }
        if (this.element && this.element.parentNode) {
            this.element.remove();
        }
    }

    isOffscreen() {
        if (this.isWarning) return false;
        return this.x < -this.width - 200 || this.x > CONFIG.CANVAS_WIDTH + 200;
    }
}