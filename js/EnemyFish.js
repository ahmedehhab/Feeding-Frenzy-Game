import Fish from './Fish.js';
import { CONFIG } from '../config/config.js';

class EnemyFish extends Fish {
    constructor(x, y, imgSrc, weight, direction, directionVertical, level = 1) {
        // Calculate starting X position based on direction BEFORE calling super
        const width = 100 * weight;
        const height = 60 * weight;
        let startX = x;
        
        if (direction === "left") {
            // Start at the far right
            startX = CONFIG.CANVAS_WIDTH + width;
        } else {
            // Start at the left
            startX = -width;
        }

        const imagePath = `./images/Enemies/${direction}/${imgSrc}`;
        super(startX, y, width, height, imagePath);
        
        this.direction = direction;
        this.directionVertical = directionVertical;
        this.imgSrc = imagePath;
        this.speedX = 3 * level;
        this.speedY = 0.3 * level;
    }

    update() {
        // Left and right movement
        if (this.direction === "left") {
            this.x -= this.speedX;
        } else {
            this.x += this.speedX;
        }
        
        // Up and down movement
        if (this.directionVertical === "top") {
            this.y -= this.speedY;
        } else {
            this.y += this.speedY;
        }
        
        
        this.render();
    }
}