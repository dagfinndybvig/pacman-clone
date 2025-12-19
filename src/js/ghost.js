console.log('ghost.js loaded');

class Ghost {
    constructor(x, y, color, tileSize, name) {
        this.gridX = Math.floor(x / tileSize);
        this.gridY = Math.floor(y / tileSize);
        this.x = this.gridX * tileSize + tileSize / 2;
        this.y = this.gridY * tileSize + tileSize / 2;
        this.startGridX = this.gridX;
        this.startGridY = this.gridY;
        this.color = color;
        this.tileSize = tileSize;
        this.name = name;
        this.speed = 2;
        this.direction = { x: 1, y: 0 }; // Start moving right
        this.radius = 15;
        this.frightened = false;
        this.frightenedTimer = 0;
        this.targetX = this.x + tileSize;
        this.targetY = this.y;
    }

    update(map, playerX, playerY) {
        if (this.frightened) {
            this.frightenedTimer--;
            if (this.frightenedTimer <= 0) {
                this.frightened = false;
            }
        }

        // Check if at grid center
        const centerX = this.gridX * this.tileSize + this.tileSize / 2;
        const centerY = this.gridY * this.tileSize + this.tileSize / 2;
        const atCenter = Math.abs(this.x - centerX) < 1 && Math.abs(this.y - centerY) < 1;

        if (atCenter) {
            // Snap to center
            this.x = centerX;
            this.y = centerY;

            // Choose next direction
            this.chooseDirection(map, playerX, playerY);

            // Move to next grid position
            const nextGridX = this.gridX + this.direction.x;
            const nextGridY = this.gridY + this.direction.y;
            
            if (!map.isWall(nextGridX * this.tileSize + this.tileSize / 2, 
                            nextGridY * this.tileSize + this.tileSize / 2)) {
                this.gridX = nextGridX;
                this.gridY = nextGridY;
                this.targetX = this.gridX * this.tileSize + this.tileSize / 2;
                this.targetY = this.gridY * this.tileSize + this.tileSize / 2;
            } else {
                // Hit a wall, reverse direction
                this.direction.x *= -1;
                this.direction.y *= -1;
            }
        }

        // Move towards target
        if (this.x < this.targetX) {
            this.x = Math.min(this.x + this.speed, this.targetX);
        } else if (this.x > this.targetX) {
            this.x = Math.max(this.x - this.speed, this.targetX);
        }

        if (this.y < this.targetY) {
            this.y = Math.min(this.y + this.speed, this.targetY);
        } else if (this.y > this.targetY) {
            this.y = Math.max(this.y - this.speed, this.targetY);
        }

        // Wrap around screen edges
        if (this.gridX < 0) {
            this.gridX = map.layout[0].length - 1;
            this.x = this.gridX * this.tileSize + this.tileSize / 2;
            this.targetX = this.x;
        }
        if (this.gridX >= map.layout[0].length) {
            this.gridX = 0;
            this.x = this.gridX * this.tileSize + this.tileSize / 2;
            this.targetX = this.x;
        }
        if (this.gridY < 0) {
            this.gridY = map.layout.length - 1;
            this.y = this.gridY * this.tileSize + this.tileSize / 2;
            this.targetY = this.y;
        }
        if (this.gridY >= map.layout.length) {
            this.gridY = 0;
            this.y = this.gridY * this.tileSize + this.tileSize / 2;
            this.targetY = this.y;
        }
    }

    chooseDirection(map, playerX, playerY) {
        const directions = [
            { x: 0, y: -1 }, // up
            { x: 0, y: 1 },  // down
            { x: -1, y: 0 }, // left
            { x: 1, y: 0 }   // right
        ];

        const validDirections = directions.filter(dir => {
            // Don't reverse direction unless necessary
            if (dir.x === -this.direction.x && dir.y === -this.direction.y) {
                return false;
            }

            const nextGridX = this.gridX + dir.x;
            const nextGridY = this.gridY + dir.y;
            const nextX = nextGridX * this.tileSize + this.tileSize / 2;
            const nextY = nextGridY * this.tileSize + this.tileSize / 2;
            return !map.isWall(nextX, nextY);
        });

        // If no valid directions (dead end), allow reversing
        if (validDirections.length === 0) {
            const reverseDir = { x: -this.direction.x, y: -this.direction.y };
            const nextGridX = this.gridX + reverseDir.x;
            const nextGridY = this.gridY + reverseDir.y;
            const nextX = nextGridX * this.tileSize + this.tileSize / 2;
            const nextY = nextGridY * this.tileSize + this.tileSize / 2;
            if (!map.isWall(nextX, nextY)) {
                this.direction = reverseDir;
            }
            return;
        }

        if (this.frightened) {
            // Random movement when frightened
            this.direction = validDirections[Math.floor(Math.random() * validDirections.length)];
        } else {
            // Chase player (simplified AI)
            let bestDir = validDirections[0];
            let bestDist = Infinity;

            const playerGridX = Math.floor(playerX / this.tileSize);
            const playerGridY = Math.floor(playerY / this.tileSize);

            for (let dir of validDirections) {
                const newGridX = this.gridX + dir.x;
                const newGridY = this.gridY + dir.y;
                const dist = Math.abs(newGridX - playerGridX) + Math.abs(newGridY - playerGridY);
                
                if (dist < bestDist) {
                    bestDist = dist;
                    bestDir = dir;
                }
            }
            this.direction = bestDir;
        }
    }

    setFrightened(duration) {
        this.frightened = true;
        this.frightenedTimer = duration;
    }

    draw(ctx) {
        const bodyColor = this.frightened ? '#0000FF' : this.color;
        const eyeColor = this.frightened ? '#FFFFFF' : '#FFFFFF';
        
        // Draw body
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, Math.PI, 0, false);
        ctx.lineTo(this.x + this.radius, this.y + this.radius);
        
        // Draw wavy bottom
        for (let i = 0; i < 4; i++) {
            const waveX = this.x + this.radius - (i * this.radius / 2);
            const waveY = this.y + this.radius + (i % 2 === 0 ? 5 : 0);
            ctx.lineTo(waveX, waveY);
        }
        
        ctx.lineTo(this.x - this.radius, this.y + this.radius);
        ctx.closePath();
        ctx.fill();

        // Draw eyes
        if (!this.frightened) {
            const eyeRadius = 4;
            const eyeOffsetX = 5;
            const eyeOffsetY = -3;

            // Left eye
            ctx.fillStyle = eyeColor;
            ctx.beginPath();
            ctx.arc(this.x - eyeOffsetX, this.y + eyeOffsetY, eyeRadius, 0, Math.PI * 2);
            ctx.fill();

            // Right eye
            ctx.beginPath();
            ctx.arc(this.x + eyeOffsetX, this.y + eyeOffsetY, eyeRadius, 0, Math.PI * 2);
            ctx.fill();

            // Pupils
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(this.x - eyeOffsetX, this.y + eyeOffsetY, eyeRadius / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x + eyeOffsetX, this.y + eyeOffsetY, eyeRadius / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Frightened face
            ctx.fillStyle = eyeColor;
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('○ ○', this.x, this.y);
        }
    }

    reset() {
        this.gridX = this.startGridX;
        this.gridY = this.startGridY;
        this.x = this.gridX * this.tileSize + this.tileSize / 2;
        this.y = this.gridY * this.tileSize + this.tileSize / 2;
        this.direction = { x: 1, y: 0 };
        this.targetX = this.x + this.tileSize;
        this.targetY = this.y;
        this.frightened = false;
        this.frightenedTimer = 0;
    }

    getGridPosition() {
        return {
            x: this.gridX,
            y: this.gridY
        };
    }
}