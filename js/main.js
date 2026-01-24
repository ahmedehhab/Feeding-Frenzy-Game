import Game from './Game.js';

console.log('Main.js loaded');

const container = document.getElementById('game');
console.log('Container:', container);

const game = new Game(container);
console.log('Game created:', game);
/*
// Debug: Check if fish elements are being created
setInterval(() => {
    const fishElements = document.querySelectorAll('.fish, .shark-img, .bomb-img');
    console.log('Fish elements count:', fishElements.length);
    fishElements.forEach((el, i) => {
        console.log(`Element ${i}:`, {
            src: el.src,
            left: el.style.left,
            top: el.style.top,
            width: el.style.width,
            height: el.style.height,
            zIndex: el.style.zIndex,
            display: el.style.display
        });
    });
}, 3000);*/