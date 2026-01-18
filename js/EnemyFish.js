class EnemyFish {
    constructor(x, y, imgSrc, weight, direction, directionVertical) {
        this.x = x;
        this.y = y;
        this.width = 100 * weight;
        this.height = 60 * weight;
        this.imgSrc = `./images/Enemies/${direction}/${imgSrc}`;
        this.direction = direction;
        this.directionVertical = directionVertical;
        this.weight = weight;
        this.speedX = 3 * level;
        this.speedY = 0.3 * level;
        this.element = null;
    }

    createFish() {
        this.element = document.createElement("img"); // create a new image element
        this.element.src = this.imgSrc;
        Object.assign(this.element.style, {
            position: "absolute",
            height: `${this.height}px`,
            width: `${this.width}px`
        });
        // Determine starting X position based on direction
        if (this.direction === "left") {
            //  start at the far right 
            this.x = window.innerWidth + this.width;
        } else {
            // If swimming Right, start at the left 
            this.x = -this.width;
        }

        this.element.style.top = `${this.y}px`;
        this.element.style.left = `${this.x}px`;
        container.appendChild(this.element);
    }

    moveFishes() {
        //left and right movement
    if (this.direction === "left") {
        this.x -= this.speedX; 
    } else {
        this.x += this.speedX;
    }
    //up and down movement
    if (this.directionVertical === "top") {
        this.y -= this.speedY; 
    } else {
        this.y += this.speedY; 
    }
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
}
}