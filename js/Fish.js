export default class Fish {
    constructor(x, y, width, height, imageSrc) {
        if (this.constructor === Fish) throw new Error("Abstract Class");

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.imageSrc = imageSrc;

        this.element = document.createElement('img');
        this.element.src = this.imageSrc;
        this.element.className = 'fish';
        this.element.style.position = 'fixed';
        this.element.style.pointerEvents = 'none';
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        this.element.style.zIndex = '1000';
        this.element.style.imageRendering = 'auto';
        this.element.style.display = 'block';

        const container = document.querySelector('#game-container') || document.querySelector('#game');
        container.appendChild(this.element);
        
        console.log('Fish created:', {
            src: this.imageSrc,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        });
        
        // Force a render
        setTimeout(() => this.render(), 0);
    }

    render() {
        if (!this.element) return;
        
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
        this.element.style.transform = this.direction < 0 ? 'scaleX(-1)' : 'scaleX(1)';
        this.element.style.zIndex = '1000';
        this.element.style.display = 'block';
        this.element.style.position = 'fixed';
    }

    isColliding(other) {
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.remove();
        }
    }

    openMouth() {
        const currentSrc = this.element.src;
        this.element.src = currentSrc.replace('_closed', '_open');

        setTimeout(() => {
            if (this.element) {
                this.element.src = this.element.src.replace('_open', '_closed');
            }
        }, 200);
    }
}