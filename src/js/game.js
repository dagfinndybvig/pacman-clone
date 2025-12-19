// Main game controller
console.log('game.js loaded');

const canvas = document.getElementById('gameCanvas');
console.log('Canvas found:', canvas);
console.log('Canvas dimensions:', canvas ? `${canvas.width}x${canvas.height}` : 'N/A');

const ctx = canvas ? canvas.getContext('2d') : null;
console.log('Context:', ctx);

if (!canvas || !ctx) {
    console.error('FATAL: Canvas or context not available!');
}

// Game state
let player;
let ghosts = [];
let map;
let gameInterval;
let score = 0;
let lives = 3;
let level = 1;
let isGameOver = false;
let isPaused = false;

// Constants (TILE_SIZE is defined in map.js)
const FPS = 60;
const FRIGHTENED_DURATION = 300; // 5 seconds at 60 FPS
const GHOST_SCORE = 200;

// DOM elements
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const levelElement = document.getElementById('level');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');

function init() {
    console.log('Initializing game...');
    console.log('Canvas:', canvas);
    console.log('Context:', ctx);
    
    // Create map
    map = createMap();
    console.log('Map created:', map);
    
    // Create player - start in bottom middle area
    player = new Player(TILE_SIZE * 6, TILE_SIZE * 14, TILE_SIZE);
    console.log('Player created:', player);
    
    // Create ghosts with different colors in the ghost house
    ghosts = [
        new Ghost(TILE_SIZE * 6, TILE_SIZE * 8, '#FF0000', TILE_SIZE, 'Blinky'),  // Red
        new Ghost(TILE_SIZE * 7, TILE_SIZE * 8, '#FFB8FF', TILE_SIZE, 'Pinky'),   // Pink
        new Ghost(TILE_SIZE * 5, TILE_SIZE * 8, '#00FFFF', TILE_SIZE, 'Inky'),    // Cyan
        new Ghost(TILE_SIZE * 8, TILE_SIZE * 8, '#FFB852', TILE_SIZE, 'Clyde')    // Orange
    ];
    console.log('Ghosts created:', ghosts.length);
    
    // Reset game state
    score = 0;
    lives = 3;
    level = 1;
    isGameOver = false;
    isPaused = false;
    
    updateUI();
    
    // Hide game over screen
    gameOverScreen.classList.remove('show');
    
    // Start game loop
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 1000 / FPS);
    
    // Sound system ready
    soundManager.stopSiren();
    soundManager.stopPowerMode();
    
    console.log('Game initialized successfully!');
}

function gameLoop() {
    if (isGameOver || isPaused) {
        return;
    }
    
    update();
    render();
}

function update() {
    // Update player
    player.update(map);
    
    // Check dot collection
    const dotScore = checkDotCollision(player, map);
    if (dotScore > 0) {
        score += dotScore;
        updateUI();
        
        // Check if power pellet
        if (dotScore === 50) {
            soundManager.eatPowerPellet();
            frightenGhosts();
        } else {
            soundManager.eatDot();
        }
    }
    
    // Update ghosts
    ghosts.forEach(ghost => {
        ghost.update(map, player.x, player.y);
    });
    
    // Check ghost collisions (only if not invincible)
    if (!player.invincible) {
        const collisions = checkAllGhostCollisions(player, ghosts);
        
        if (collisions.length > 0) {
            handleGhostCollisions(collisions);
        }
    }
    
    // Check level completion
    if (map.isLevelComplete()) {
        nextLevel();
    }
}

let renderCount = 0;
function render() {
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw map
    map.draw(ctx);
    
    // Draw player
    player.draw(ctx);
    
    // Draw ghosts
    ghosts.forEach(ghost => ghost.draw(ctx));
    
    // Debug output (only first few frames)
    if (renderCount < 3) {
        console.log('Render frame', renderCount, '- Canvas size:', canvas.width, 'x', canvas.height);
        renderCount++;
    }
}

function handleGhostCollisions(collisions) {
    for (let collision of collisions) {
        if (collision.frightened) {
            // Eat ghost
            score += GHOST_SCORE;
            collision.ghost.reset();
            soundManager.eatGhost();
            updateUI();
        } else {
            // Lose a life
            soundManager.death();
            loseLife();
            break; // Only process one death at a time
        }
    }
}

function frightenGhosts() {
    ghosts.forEach(ghost => {
        ghost.setFrightened(FRIGHTENED_DURATION);
    });
    soundManager.startPowerMode();
    
    // Stop power mode sound when frightened period ends
    setTimeout(() => {
        soundManager.stopPowerMode();
    }, (FRIGHTENED_DURATION / FPS) * 1000);
}

function loseLife() {
    lives--;
    updateUI();
    
    if (lives <= 0) {
        endGame();
    } else {
        // Reset positions
        resetPositions();
    }
}

function resetPositions() {
    player.reset(TILE_SIZE * 6, TILE_SIZE * 14);
    ghosts.forEach(ghost => ghost.reset());
}

function nextLevel() {
    level++;
    soundManager.stopPowerMode();
    soundManager.levelComplete();
    
    map.reset();
    resetPositions();
    
    // Increase ghost speed slightly
    ghosts.forEach(ghost => {
        ghost.speed += 0.2;
    });
    
    updateUI();
}

function endGame() {
    isGameOver = true;
    clearInterval(gameInterval);
    
    soundManager.stopPowerMode();
    soundManager.gameOver();
    
    // Show game over screen
    finalScoreElement.textContent = score;
    gameOverScreen.classList.add('show');
}

function updateUI() {
    scoreElement.textContent = score;
    livesElement.textContent = lives;
    levelElement.textContent = level;
}

function togglePause() {
    isPaused = !isPaused;
}

// Event listeners
window.addEventListener('keydown', (event) => {
    // Initialize sound on first interaction
    soundManager.enable();
    
    if (isGameOver) return;
    
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            player.setDirection({ x: 0, y: -1 });
            event.preventDefault();
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            player.setDirection({ x: 0, y: 1 });
            event.preventDefault();
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            player.setDirection({ x: -1, y: 0 });
            event.preventDefault();
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            player.setDirection({ x: 1, y: 0 });
            event.preventDefault();
            break;
        case ' ':
            togglePause();
            event.preventDefault();
            break;
    }
});

restartBtn.addEventListener('click', () => {
    init();
});

// Touch/Swipe controls for mobile
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

const minSwipeDistance = 30;

canvas.addEventListener('touchstart', (e) => {
    // Initialize sound on first interaction
    soundManager.enable();
    
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    if (isGameOver) return;
    
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    
    handleSwipe();
    e.preventDefault();
}, { passive: false });

function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    
    // Check if it's a tap (small movement) - use for pause
    if (absDeltaX < minSwipeDistance && absDeltaY < minSwipeDistance) {
        togglePause();
        return;
    }
    
    // Determine swipe direction
    if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0) {
            player.setDirection({ x: 1, y: 0 }); // Right
        } else {
            player.setDirection({ x: -1, y: 0 }); // Left
        }
    } else {
        // Vertical swipe
        if (deltaY > 0) {
            player.setDirection({ x: 0, y: 1 }); // Down
        } else {
            player.setDirection({ x: 0, y: -1 }); // Up
        }
    }
}

// Start the game
init();