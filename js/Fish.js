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
        this.element.style.position = 'absolute';
        this.element.style.pointerEvents = 'none';
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';

        document.querySelector('#game').appendChild(this.element);
    }

    render() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
        this.element.style.transform = this.direction < 0 ? 'scaleX(-1)' : 'scaleX(1)';
    }

isColliding(other) {
    const offsetW = this.width * 0.2;
    const offsetH = this.height * 0.2;

    const otherOffsetW = other.width * 0.2;
    const otherOffsetH = other.height * 0.2;

    return (
        this.x + offsetW < other.x + other.width - otherOffsetW &&
        this.x + this.width - offsetW > other.x + otherOffsetW &&
        this.y + offsetH < other.y + other.height - otherOffsetH &&
        this.y + this.height - offsetH > other.y + otherOffsetH
    );
}

    destroy() {
        this.element.remove();
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
