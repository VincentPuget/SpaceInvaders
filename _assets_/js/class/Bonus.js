"use strict";

const bonusWidth = 30;
const bonusHeight = 40;
let bonusSpeed = 1;

let bonusAvailables = [
  {
    name: "bonusTripleFire",
    active: false
  },
  {
    name: "speedSpaceShip",
    active: false
  },
  {
    name: "bulletHz",
    active: false
  }
];
let bonusActive;

class Bonus extends DomElem{
  constructor(){
    super();
    let spaceship = Spaceship.get();

    this.elem = document.createElement("div");
    this.x = Utils.getRandomInt(1, (screen.width - bonusWidth));
    this.y = Utils.getRandomInt(0, 100);
    this.width = bonusWidth;
    this.height = bonusHeight;
    this.speed = bonusSpeed;
    this.type = Bonus.getRandomBonusType();

    this.elem.className = "bonus";
    this.elem.style.width = this.width + "px";
    this.elem.style.height = this.height + "px";
    if(spaceship !== null && spaceship.elem !== null && spaceship.elem.parentNode.parentNode !== null && this.element !== null){
      spaceship.elem.parentNode.insertBefore(this.elem, spaceship.elem);
    }
    this.elem.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
    return this;
  }

  static getRandomBonusType(){
    let randBonus = Utils.getRandomInt(0, bonusAvailables.length - 1);
    bonusAvailables[randBonus].active = true;
    return bonusAvailables[randBonus];
  }

  static setActiveBonus(bonus){
    bonus.type.active = true;
    bonusActive = bonus;
  }

  static rasAllBonus(){
    _.forEach(bonusAvailables, (oneBonus) => {
      oneBonus.active = false;
    });
    bonusActive = undefined;
  }

  static getActiveBonus(){
    return bonusActive;
  }
}
