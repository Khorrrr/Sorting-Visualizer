class AudioEngine {
    constructor() {
        this.audioCtx = null;
        this.mainGainNode = null;
    }

    init() {
        if (this.audioCtx) return;
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.mainGainNode = this.audioCtx.createGain();
        this.mainGainNode.connect(this.audioCtx.destination);
        this.mainGainNode.gain.value = 0.1;
    }

    setVolume(value) {
        if (this.mainGainNode) {
            this.mainGainNode.gain.setTargetAtTime(value, this.audioCtx.currentTime, 0.05);
        }
    }

    playNote(frequency, duration = 0.1, type = 'sine') {
        if (!this.audioCtx) this.init();
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }

        const oscillator = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

        gainNode.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.mainGainNode);

        oscillator.start();
        oscillator.stop(this.audioCtx.currentTime + duration);
    }

    getFrequency(value, minVal = 0, maxVal = 100) {
        const minFreq = 200;
        const maxFreq = 1000;
        return minFreq + (value / (maxVal - minVal)) * (maxFreq - minFreq);
    }
}

export const audioEngine = new AudioEngine();
