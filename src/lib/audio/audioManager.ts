type Tone = "click" | "enter" | "confirm";

class AudioManager {
  private context: AudioContext | null = null;
  private muted = true;
  private alarm: { oscillator: OscillatorNode; gain: GainNode } | null = null;
  private hum: { oscillator: OscillatorNode; gain: GainNode } | null = null;

  setMuted(muted: boolean) {
    this.muted = muted;
    if (muted) {
      this.stopAlarm();
      this.stopHum();
      return;
    }
    this.ensure();
  }

  play(tone: Tone) {
    const ctx = this.ensure();
    if (!ctx || this.muted) return;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    const pitch = tone === "click" ? 640 : tone === "enter" ? 180 : 420;
    oscillator.type = tone === "enter" ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime(pitch, now);
    if (tone === "confirm") {
      oscillator.frequency.exponentialRampToValueAtTime(720, now + 0.12);
    }
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.03, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.15);
  }

  startAlarm() {
    const ctx = this.ensure();
    if (!ctx || this.muted || this.alarm) return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 310;
    gain.gain.value = 0.012;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    this.alarm = { oscillator, gain };
  }

  stopAlarm() {
    if (!this.alarm) return;
    this.alarm.oscillator.stop();
    this.alarm = null;
  }

  startHum() {
    const ctx = this.ensure();
    if (!ctx || this.muted || this.hum) return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 62;
    gain.gain.value = 0.008;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    this.hum = { oscillator, gain };
  }

  stopHum() {
    if (!this.hum) return;
    this.hum.oscillator.stop();
    this.hum = null;
  }

  private ensure() {
    if (this.muted) return null;
    if (typeof window === "undefined") return null;
    if (!this.context) {
      const Context = window.AudioContext;
      this.context = new Context();
    }
    if (this.context.state === "suspended") {
      void this.context.resume();
    }
    return this.context;
  }
}

export const audio = new AudioManager();
