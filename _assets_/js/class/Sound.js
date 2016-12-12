"use strict";

const LASER_SOUND = "sounds/piou.mp3";

class Sound {
  constructor() {
    this.initLaser();
    return this;
  }

  initLaser(){
    this.laser = {};
    this.laser.ready = false;
    this.laser.audio = new Audio();
    this.laser.audio.src = LASER_SOUND;
    this.laser.audio.addEventListener("canplaythrough" , () => {
      this.laser.ready = true;
    });
  }

  play(key) {
    if(this[key].ready){
      this[key].audio.pause();
      this[key].audio.currentTime = 0;
      this[key].audio.play();
    }
  }


}
