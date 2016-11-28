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

    spaceship_ = this;
    return this;
  }

  move() {
    let activeBonus = Bonus.getActiveBonus();
    if(typeof activeBonus !== "undefined" && activeBonus.type.name === "speedSpaceShip"){
      this.speed = 9;
    }
    else{
      this.speed = 6;
    }

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


  static get() {
    return spaceship_;
  }
}
