console.log('sound.js loaded');

// Sound manager using Web Audio API
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.initialized = false;
        this.sounds = {};
    }

    init() {
        if (this.initialized) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
            console.log('Sound system initialized');
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    playTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.initialized) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playChord(frequencies, duration, type = 'sine', volume = 0.2) {
        if (!this.initialized) return;
        
        frequencies.forEach(freq => {
            this.playTone(freq, duration, type, volume);
        });
    }

    // Eating a dot sound
    eatDot() {
        this.playTone(800, 0.05, 'square', 0.1);
    }

    // Eating power pellet sound
    eatPowerPellet() {
        this.playChord([400, 600, 800], 0.2, 'square', 0.15);
    }

    // Eating a ghost sound
    eatGhost() {
        if (!this.initialized) return;
        
        const notes = [200, 400, 600, 800, 1000, 1200];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 0.08, 'sine', 0.2);
            }, i * 30);
        });
    }

    // Death sound
    death() {
        if (!this.initialized) return;
        
        const notes = [800, 700, 600, 500, 400, 300, 200, 150, 100];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 0.1, 'sawtooth', 0.25);
            }, i * 50);
        });
    }

    // Level complete sound
    levelComplete() {
        if (!this.initialized) return;
        
        const melody = [
            { freq: 523, dur: 0.15 }, // C
            { freq: 659, dur: 0.15 }, // E
            { freq: 784, dur: 0.15 }, // G
            { freq: 1047, dur: 0.3 }  // C (high)
        ];
        
        let time = 0;
        melody.forEach(note => {
            setTimeout(() => {
                this.playTone(note.freq, note.dur, 'triangle', 0.3);
            }, time * 1000);
            time += note.dur;
        });
    }

    // Game over sound
    gameOver() {
        if (!this.initialized) return;
        
        const melody = [
            { freq: 392, dur: 0.2 }, // G
            { freq: 349, dur: 0.2 }, // F
            { freq: 311, dur: 0.2 }, // D#
            { freq: 262, dur: 0.5 }  // C
        ];
        
        let time = 0;
        melody.forEach(note => {
            setTimeout(() => {
                this.playTone(note.freq, note.dur, 'triangle', 0.3);
            }, time * 1000);
            time += note.dur;
        });
    }

    // Siren sound (plays continuously)
    startSiren() {
        if (!this.initialized || this.sirenInterval) return;
        
        let toggle = false;
        this.sirenInterval = setInterval(() => {
            this.playTone(toggle ? 400 : 500, 0.3, 'sine', 0.08);
            toggle = !toggle;
        }, 300);
    }

    stopSiren() {
        if (this.sirenInterval) {
            clearInterval(this.sirenInterval);
            this.sirenInterval = null;
        }
    }

    // Power mode sound (when ghosts are frightened)
    startPowerMode() {
        if (!this.initialized || this.powerModeInterval) return;
        
        let note = 0;
        const notes = [330, 370, 330, 370]; // E and F#
        this.powerModeInterval = setInterval(() => {
            this.playTone(notes[note % notes.length], 0.15, 'square', 0.12);
            note++;
        }, 150);
    }

    stopPowerMode() {
        if (this.powerModeInterval) {
            clearInterval(this.powerModeInterval);
            this.powerModeInterval = null;
        }
    }

    // Initialize on first user interaction
    enable() {
        this.init();
    }
}

// Create global sound manager instance
const soundManager = new SoundManager();
