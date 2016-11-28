"use strict";

const BULET_WIDTH = 2;
const BULLET_HEIGHT = 8;

let bulletSpeed = 8;
let bulletHz = 75;


class Bullet extends DomElem{
  constructor(position = "center"){
    super();
    let positionX;
    let positionY;
    let spaceship = Spaceship.get();
    if(position === "left"){
      positionX = spaceship.x + spaceship.width / 2 - 1 - 14;
      positionY = spaceship.y - BULLET_HEIGHT + 20;
    }
    else if(position === "center"){
      positionX = spaceship.x + spaceship.width / 2 - 1;
      positionY = spaceship.y - BULLET_HEIGHT;
    }
    else if(position === "right"){
      positionX = spaceship.x + spaceship.width / 2 - 1 + 14;
      positionY = spaceship.y - BULLET_HEIGHT + 20;
    }

    this.elem = document.createElement("div");
    this.x = positionX;
    this.y = positionY;
    this.width = BULET_WIDTH;
    this.height = BULLET_HEIGHT;
    this.speed = bulletSpeed;

    this.elem.className = "bullet";
    this.elem.style.width = this.width + "px";
    this.elem.style.height = this.height + "px";
    this.elem.style.background = "white";

    if(spaceship !== null && spaceship.elem !== null && spaceship.elem.parentNode !== null && this.elem !== null){
      spaceship.elem.parentNode.insertBefore(this.elem, spaceship.elem);
    }

    return this;
  }

  move(){
    this.y -= this.speed;
  }

  static getSpeed(){
    return bulletSpeed;
  }

  static setSpeed(bulletSpeed_){
    bulletSpeed = bulletSpeed_;
  }

  static getHz(){
    return bulletHz;
  }

  static setHz(bulletHz_){
    bulletHz = bulletHz_;
  }
}
