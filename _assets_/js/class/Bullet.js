"use strict";

const BULET_WIDTH = 2;
const BULLET_HEIGHT = 8;

let bulletSpeed = 1;
let bulletHz = 75;

class Bullet {
  constructor(position = "center"){
    let positionX;
    let positionY;
    if(position === "left"){
      positionX = Spaceship.get().x + Spaceship.get().width / 2 - 1 - 14;
      positionY = Spaceship.get().y - BULLET_HEIGHT + 20;
    }
    else if(position === "center"){
      positionX = Spaceship.get().x + Spaceship.get().width / 2 - 1;
      positionY = Spaceship.get().y - BULLET_HEIGHT;
    }
    else if(position === "right"){
      positionX = Spaceship.get().x + Spaceship.get().width / 2 - 1 + 14;
      positionY = Spaceship.get().y - BULLET_HEIGHT + 20;
    }

    let bullet = {
      elem: document.createElement("div"),
      x: positionX,
      y: positionY,
      width: BULET_WIDTH,
      height: BULLET_HEIGHT,
      speed: BULLET_HEIGHT
    };

    bullet.elem.className = "bullet";
    bullet.elem.style.width = bullet.width + "px";
    bullet.elem.style.height = bullet.height + "px";
    bullet.elem.style.background = "white";

    if(Spaceship.get() !== null && Spaceship.get().elem !== null && bullet !== null && bullet.elem !== null){
      Spaceship.get().elem.parentNode.insertBefore(bullet.elem, Spaceship.get().elem);
    }

    return bullet;
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
