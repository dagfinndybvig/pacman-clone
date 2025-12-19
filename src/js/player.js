console.log('player.js loaded');

class Player {
    constructor(x, y, tileSize) {
        this.gridX = Math.floor(x / tileSize);
        this.gridY = Math.floor(y / tileSize);
        this.x = this.gridX * tileSize + tileSize / 2;
        this.y = this.gridY * tileSize + tileSize / 2;
        this.tileSize = tileSize;
        this.speed = 2.5;
        this.direction = { x: 0, y: 0 };
        this.nextDirection = { x: 0, y: 0 };
        this.radius = 15;
        this.mouthAngle = 0;
        this.mouthSpeed = 0.15;
        this.targetX = this.x;
        this.targetY = this.y;
        this.invincible = false;
        this.invincibleTimer = 0;
    }

    setDirection(dir) {
        this.nextDirection = { ...dir };
    }

    update(map) {
        // Update invincibility
        if (this.invincible) {
            this.invincibleTimer--;
            if (this.invincibleTimer <= 0) {
                this.invincible = false;
            }
        }
        
        // Animate mouth when moving
        if (this.direction.x !== 0 || this.direction.y !== 0) {
            this.mouthAngle += this.mouthSpeed;
            if (this.mouthAngle > 0.4 || this.mouthAngle < 0) {
                this.mouthSpeed *= -1;
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

            // Try to change direction
            if (this.nextDirection.x !== 0 || this.nextDirection.y !== 0) {
                const nextGridX = this.gridX + this.nextDirection.x;
                const nextGridY = this.gridY + this.nextDirection.y;
                
                if (!map.isWall(nextGridX * this.tileSize + this.tileSize / 2, 
                                nextGridY * this.tileSize + this.tileSize / 2)) {
                    this.direction = { ...this.nextDirection };
                }
            }

            // Check if can continue in current direction
            if (this.direction.x !== 0 || this.direction.y !== 0) {
                const nextGridX = this.gridX + this.direction.x;
                const nextGridY = this.gridY + this.direction.y;
                
                if (!map.isWall(nextGridX * this.tileSize + this.tileSize / 2, 
                                nextGridY * this.tileSize + this.tileSize / 2)) {
                    this.gridX = nextGridX;
                    this.gridY = nextGridY;
                    this.targetX = this.gridX * this.tileSize + this.tileSize / 2;
                    this.targetY = this.gridY * this.tileSize + this.tileSize / 2;
                } else {
                    // Hit a wall, stop
                    this.direction = { x: 0, y: 0 };
                }
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

    draw(ctx) {
        // Don't draw if invincible and on even frame (flashing effect)
        if (this.invincible && Math.floor(this.invincibleTimer / 10) % 2 === 0) {
            return;
        }
        
        ctx.save();
        ctx.translate(this.x, this.y);

        // Rotate based on direction
        if (this.direction.x > 0) ctx.rotate(0);
        else if (this.direction.x < 0) ctx.rotate(Math.PI);
        else if (this.direction.y > 0) ctx.rotate(Math.PI / 2);
        else if (this.direction.y < 0) ctx.rotate(-Math.PI / 2);

        // Draw Pac-Man
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 
                0.2 * Math.PI + this.mouthAngle, 
                1.8 * Math.PI - this.mouthAngle);
        ctx.lineTo(0, 0);
        ctx.fill();

        ctx.restore();
    }

    reset(x, y) {
        this.gridX = Math.floor(x / this.tileSize);
        this.gridY = Math.floor(y / this.tileSize);
        this.x = this.gridX * this.tileSize + this.tileSize / 2;
        this.y = this.gridY * this.tileSize + this.tileSize / 2;
        this.direction = { x: 0, y: 0 };
        this.nextDirection = { x: 0, y: 0 };
        this.targetX = this.x;
        this.targetY = this.y;
        this.invincible = true;
        this.invincibleTimer = 120; // 2 seconds of invincibility
    }

    getGridPosition() {
        return {
            x: this.gridX,
            y: this.gridY
        };
    }
}