"use strict";


let monster1 = {
  width: 55,
  height: 40,
  className: "monster_1",
  point: 10,
  speed: 0.3
};
let monster2 = {
  width: 40,
  height: 40,
  className: "monster_2",
  point: 20,
  speed: 0.3
};
let monster3 = {
  width: 60,
  height: 40,
  className: "monster_3",
  point: 30,
  speed: 0.3
};

const numTotalMonster = 30;
const linesOfMonster = 3;
const paddingAroundAllMonsters = 30;
const spaceAroundMonsters = 10;

class Monster extends DomElem{
  constructor(i, j){
    super();
    let monster_;
    let spaceship = Spaceship.get();
    if(i === 0){
      monster_ = monster1;
    }
    else if(i === 1){
      monster_ = monster2;
    }
    else if(i === 2){
      monster_ = monster3;
    }

    this.elem = document.createElement("div");
    let paddingX = i === 0 ? 14 : i === 1 ? 30 : 10;
    let paddingY = 10;
    let paddingXall = 20;
    let paddingYall = 60;
    this.x = (j * monster_.width) + (j * paddingX) + paddingX / 2 + paddingXall;
    this.y = (i * monster_.height) + (i * paddingY) + paddingYall;
    this.width = monster_.width;
    this.height = monster_.height;
    this.speed = monster_.speed;
    this.point = monster_.point;

    this.elem.className = monster_.className;
    this.elem.style.width = this.width + "px";
    this.elem.style.height = this.height + "px";
    if(spaceship !== null && spaceship.elem !== null && this.element !== null){
      spaceship.elem.parentNode.insertBefore(this.elem, spaceship.elem);
    }
    return this;
  }

  static getMonsterBottomLimit(){
    let screen = Screen.get();
    return screen.height - 5;
  }

  static getMonstersByLine(i){
    let paddingX = i === 0 ? 14 : i === 1 ? 30 : 10;
    let monstersByLine1 = Math.round(screen.width / (monster1.width + spaceAroundMonsters )) - 1;
    let monstersByLine2 = Math.round(screen.width / (monster2.width + spaceAroundMonsters )) - 1;
    let monstersByLine3 = Math.round(screen.width / (monster3.width + spaceAroundMonsters )) - 1;

    let monstersByLine12 = Math.min(monstersByLine1, monstersByLine2);
    let monstersByLine = Math.min(monstersByLine12, monstersByLine3);

    return monstersByLine;
  }

  static getLineOfMonster(){
    return linesOfMonster;
  }
}
