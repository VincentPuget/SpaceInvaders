import piou from '../../assets/sounds/piou.mp3';

export class Sound {
  public laser: { ready: boolean; audio: HTMLAudioElement | undefined } = { ready: false, audio: undefined };
  constructor() {
    this.initLaser();
    return this;
  }

  initLaser(): void {
    this.laser = { ready: false, audio: undefined };
    this.laser.ready = false;
    this.laser.audio = new Audio(piou);
    this.laser.audio.addEventListener('canplaythrough', () => {
      this.laser.ready = true;
    });
  }

  playLaser() {
    if (this.laser && this.laser.ready && this.laser.audio) {
      this.laser.audio.pause();
      this.laser.audio.currentTime = 0;
      this.laser.audio.play();
    }
  }
}
