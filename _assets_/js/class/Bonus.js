"use strict";

const bonusWidth = 30;
const bonusHeight = 40;
let bonusSpeed = 1;

let bonusAvailables = [
  {
    name: "bonusTripleFire",
    active: false,
    action: () => {
      let spaceship = Spaceship.get();
      spaceship.tripleFire = true;
    },
    default: () => {
      let spaceship = Spaceship.get();
      spaceship.tripleFire = false;
    }
  },
  {
    name: "speedSpaceShip",
    active: false,
    action: () => {
      let spaceship = Spaceship.get();
      spaceship.speed = 9;
    },
    default: () => {
      let spaceship = Spaceship.get();
      spaceship.speed = 6;
    }
  },
  {
    name: "bulletHz",
    active: false,
    action: () => {
      Bullet.setHz(50);
    },
    default: () => {
      Bullet.setHz(75);
    }
  },
  {
    name: "newHealth",
    active: false,
    action: () => {
      Hearts.getOneHealth();
    },
    default: () => {}
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
    this.config = Bonus.getRandomBonusConfig();

    this.elem.className = "bonus";
    this.elem.style.width = this.width + "px";
    this.elem.style.height = this.height + "px";
    if(spaceship !== null && spaceship.elem !== null && spaceship.elem.parentNode.parentNode !== null && this.element !== null){
      spaceship.elem.parentNode.insertBefore(this.elem, spaceship.elem);
    }
    this.elem.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
    return this;
  }

  displayIcon(){
    BonusIcon.reset();
    console.log(this.config.name);
    new BonusIcon(this.config.name);
  }

  static getRandomBonusConfig(){
    let randBonus = Utils.getRandomInt(0, bonusAvailables.length - 1);
    bonusAvailables[randBonus].active = true;
    return bonusAvailables[randBonus];
  }

  static setActiveBonus(bonus){
    bonus.config.action();
  }

  static rasAllBonus(){
    _.forEach(bonusAvailables, (oneBonus) => {
      oneBonus.default();
      oneBonus.active = false;
    });
    bonusActive = undefined;
  }

  static getActiveBonus(){
    return bonusActive;
  }
}
