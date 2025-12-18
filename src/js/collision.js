console.log('collision.js loaded');

function checkGhostCollision(player, ghost) {
    // Check if on same grid cell
    if (player.gridX === ghost.gridX && player.gridY === ghost.gridY) {
        return true;
    }
    
    // Also check distance for smooth collision
    const dx = player.x - ghost.x;
    const dy = player.y - ghost.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Collision if distance is less than sum of radii
    return distance < (player.radius + ghost.radius - 10);
}

function checkDotCollision(player, map) {
    const gridX = Math.floor(player.x / map.tileSize);
    const gridY = Math.floor(player.y / map.tileSize);
    
    // Check if player is close enough to center of tile
    const centerX = (gridX + 0.5) * map.tileSize;
    const centerY = (gridY + 0.5) * map.tileSize;
    
    const dx = player.x - centerX;
    const dy = player.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < map.tileSize / 3) {
        return map.collectDot(player.x, player.y);
    }
    
    return 0;
}

function checkAllGhostCollisions(player, ghosts) {
    const collisions = [];
    
    for (let i = 0; i < ghosts.length; i++) {
        if (checkGhostCollision(player, ghosts[i])) {
            collisions.push({
                index: i,
                ghost: ghosts[i],
                frightened: ghosts[i].frightened
            });
        }
    }
    
    return collisions;
}