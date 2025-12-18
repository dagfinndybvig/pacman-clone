// Map layout: 0 = empty, 1 = wall, 2 = dot, 3 = power pellet
console.log('map.js loaded');

const mapLayout = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 3, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 3, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 2, 1, 0, 0, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 1, 2, 1, 0, 0, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 3, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 3, 1],
    [1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 1],
    [1, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const TILE_SIZE = 40;
const GRID_WIDTH = 14;
const GRID_HEIGHT = 18;

class GameMap {
    constructor() {
        this.layout = JSON.parse(JSON.stringify(mapLayout)); // Deep copy
        this.tileSize = TILE_SIZE;
        this.totalDots = this.countDots();
        this.dotsCollected = 0;
    }

    countDots() {
        let count = 0;
        for (let row of this.layout) {
            for (let tile of row) {
                if (tile === 2 || tile === 3) {
                    count++;
                }
            }
        }
        return count;
    }

    getTile(x, y) {
        const gridX = Math.floor(x / this.tileSize);
        const gridY = Math.floor(y / this.tileSize);
        
        if (gridY >= 0 && gridY < this.layout.length && 
            gridX >= 0 && gridX < this.layout[0].length) {
            return this.layout[gridY][gridX];
        }
        return 1; // Return wall if out of bounds
    }

    setTile(x, y, value) {
        const gridX = Math.floor(x / this.tileSize);
        const gridY = Math.floor(y / this.tileSize);
        
        if (gridY >= 0 && gridY < this.layout.length && 
            gridX >= 0 && gridX < this.layout[0].length) {
            this.layout[gridY][gridX] = value;
        }
    }

    isWall(x, y) {
        return this.getTile(x, y) === 1;
    }

    collectDot(x, y) {
        const tile = this.getTile(x, y);
        if (tile === 2) {
            this.setTile(x, y, 0);
            this.dotsCollected++;
            return 10; // Regular dot score
        } else if (tile === 3) {
            this.setTile(x, y, 0);
            this.dotsCollected++;
            return 50; // Power pellet score
        }
        return 0;
    }

    isLevelComplete() {
        return this.dotsCollected >= this.totalDots;
    }

    reset() {
        this.layout = JSON.parse(JSON.stringify(mapLayout));
        this.dotsCollected = 0;
    }

    draw(ctx) {
        for (let row = 0; row < this.layout.length; row++) {
            for (let col = 0; col < this.layout[row].length; col++) {
                const tile = this.layout[row][col];
                const x = col * this.tileSize;
                const y = row * this.tileSize;

                if (tile === 1) {
                    // Draw wall
                    ctx.fillStyle = '#2121DE';
                    ctx.fillRect(x, y, this.tileSize, this.tileSize);
                    ctx.strokeStyle = '#1E1ECC';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x, y, this.tileSize, this.tileSize);
                } else if (tile === 2) {
                    // Draw dot
                    ctx.fillStyle = '#FFB897';
                    ctx.beginPath();
                    ctx.arc(x + this.tileSize / 2, y + this.tileSize / 2, 3, 0, Math.PI * 2);
                    ctx.fill();
                } else if (tile === 3) {
                    // Draw power pellet
                    ctx.fillStyle = '#FFB897';
                    ctx.beginPath();
                    ctx.arc(x + this.tileSize / 2, y + this.tileSize / 2, 8, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }
}

function createMap() {
    return new GameMap();
}