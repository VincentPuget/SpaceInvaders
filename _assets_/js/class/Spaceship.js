"use strict";

const SPACESHIP_WIDTH = 30;
const SPACESHIP_HEIGHT = 38;

let spaceshipSpeed = 6;
let spaceship_;

class Spaceship {
  constructor(){
    let spaceship = {
      elem: document.querySelector(".spaceship"),
      x: (screen.width - SPACESHIP_WIDTH) / 2,
      y: screen.height - SPACESHIP_HEIGHT - 4,
      width: SPACESHIP_WIDTH,
      height: SPACESHIP_HEIGHT,
      speed: spaceshipSpeed,
      moveLeft: false,
      moveRight: false,
      moveUp: false,
      moveDown: false,
      fire: false
    };

    spaceship_ = spaceship;
    return spaceship;
  }

  static get() {
    return spaceship_;
  }
}
