"use strict";

const SPACESHIP_WIDTH = 30;
const SPACESHIP_HEIGHT = 38;

let spaceshipSpeed = 6;
let spaceship_;

class Spaceship extends DomElem{
  constructor(){
    super();
    let screen = Screen.get();
    this.elem = document.querySelector(".spaceship");
    this.x = (screen.width - SPACESHIP_WIDTH) / 2;
    this.x = (screen.width - SPACESHIP_WIDTH) / 2;
    this.y = screen.height - SPACESHIP_HEIGHT - 4;
    this.width = SPACESHIP_WIDTH;
    this.height = SPACESHIP_HEIGHT;
    this.speed = spaceshipSpeed;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveUp = false;
    this.moveDown = false;
    this.fire = false;
    this.tripleFire = false;

    spaceship_ = this;
    return this;
  }

  move() {
    if (this.moveLeft) {
      this.x -= this.speed;
    }
    else if (this.moveRight) {
      this.x += this.speed;
    }
    if (this.moveUp) {
      this.y -= this.speed;
    }
    else if (this.moveDown) {
      this.y += this.speed;
    }
  }

  contain() {
    let screen = Screen.get();
    this.x = Math.max(0, this.x); // débordement à gauche (this.x devient négatif)
    this.x = Math.min(screen.width - this.width, this.x);// débordement à droite

    this.y = Math.max(0, this.y); // débordement en haut (this.y devient négatif)
    this.y = Math.min(screen.height - this.height, this.y);// débordement en bas
  }


  static get() {
    return spaceship_;
  }
}
