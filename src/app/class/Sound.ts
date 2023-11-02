import piou from "../../assets/sounds/piou.mp3";

export class Sound {
  public laser: any;
  constructor() {
    this.initLaser();
    return this;
  }

  initLaser(): void {
    this.laser = {};
    this.laser.ready = false;
    this.laser.audio = new Audio(piou);
    this.laser.audio.addEventListener("canplaythrough", () => {
      this.laser.ready = true;
    });
  }

  play(key: string) {
    if ((this as any)[key].ready) {
      (this as any)[key].audio.pause();
      (this as any)[key].audio.currentTime = 0;
      (this as any)[key].audio.play();
    }
  }
}
