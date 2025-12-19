# Pacman Clone 🎮

A classic Pacman arcade game built with vanilla HTML5, CSS3, and JavaScript. Features grid-based movement, ghost AI, arcade sound effects, and authentic gameplay mechanics.

![Pacman Game](https://img.shields.io/badge/Game-Pacman%20Clone-yellow)
![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-blue)

## ✨ Features

- 🎯 **Classic Gameplay**: Navigate Pacman through a maze collecting dots
- 👻 **Ghost AI**: Four ghosts with chase behavior
- ⚡ **Power Pellets**: Eat power pellets to turn ghosts vulnerable
- 🔊 **Arcade Sounds**: Generated sound effects using Web Audio API
- 🎮 **Grid-Based Movement**: Authentic tile-by-tile navigation
- 💯 **Score & Lives System**: Track your progress with 3 lives
- 📈 **Level Progression**: Increasing difficulty as you advance
- 🛡️ **Invincibility Period**: Brief protection after respawning
- ⌨️ **Responsive Controls**: Arrow keys or WASD for movement

## 🚀 Quick Start

Try it on https://dagfinndybvig.github.io/pacman-clone/ or:

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pacman-clone.git
cd pacman-clone
```

2. Open `index.html` in your web browser, or serve with a local server:
```bash
python3 -m http.server 8000
```

3. Navigate to `http://localhost:8000` and start playing!

## 🎯 How to Play

- **Move**: Use Arrow Keys or WASD
- **Pause**: Press SPACE
- **Objective**: Collect all dots while avoiding ghosts
- **Power Pellets**: Large flashing dots that make ghosts vulnerable
- **Scoring**:
  - Regular dot: 10 points
  - Power pellet: 50 points
  - Eating ghost: 200 points

## 🛠️ Technology Stack

- **HTML5 Canvas** for rendering
- **Vanilla JavaScript** for game logic
- **CSS3** for styling
- **Web Audio API** for sound generation

## 📁 Project Structure

```
pacman-clone/
├── index.html          # Main game page
├── index-debug.html    # Debug version with console output
├── README.md
├── src/
│   ├── css/
│   │   └── style.css   # Game styling
│   ├── js/
│   │   ├── game.js     # Main game loop and logic
│   │   ├── player.js   # Pacman character
│   │   ├── ghost.js    # Ghost AI
│   │   ├── map.js      # Maze layout and rendering
│   │   ├── collision.js # Collision detection
│   │   ├── sound.js    # Sound effects
│   │   └── utils.js    # Utility functions
│   └── assets/
│       └── sounds/     # (Unused - sounds are generated)
```

## 🎨 Customization

You can easily customize the game by modifying:

- **Map Layout**: Edit `mapLayout` array in `src/js/map.js`
- **Colors**: Change colors in `src/js/player.js` and `src/js/ghost.js`
- **Difficulty**: Adjust speeds and timers in `src/js/game.js`
- **Sounds**: Modify frequencies and durations in `src/js/sound.js`

## 📝 License

MIT License - Feel free to use this project for learning or building your own games!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 🙏 Acknowledgments

- Inspired by the classic Pac-Man arcade game by Namco
- Built with assistance from GitHub Copilot

---

⭐ Star this repo if you enjoyed playing!
