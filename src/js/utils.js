// Utility functions for the game
console.log('utils.js loaded');

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function loadSound(url) {
    const audio = new Audio(url);
    return audio;
}

function playSound(audio) {
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Audio play failed:', e));
    }
}

// Grid conversion utilities
function pixelToGrid(pixel, tileSize) {
    return Math.floor(pixel / tileSize);
}

function gridToPixel(grid, tileSize) {
    return grid * tileSize;
}

function gridToPixelCenter(grid, tileSize) {
    return (grid + 0.5) * tileSize;
}