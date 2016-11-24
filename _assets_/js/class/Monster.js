"use strict";


let monster1 = {
  width: 55,
  height: 40,
  className: "monster_1",
  point: 10,
  speed: 0.5
};
let monster2 = {
  width: 40,
  height: 40,
  className: "monster_2",
  point: 20,
  speed: 0.5
};
let monster3 = {
  width: 60,
  height: 40,
  className: "monster_3",
  point: 30,
  speed: 0.5
};

const numTotalMonster = 30;
const linesOfMonster = 3;
let monstersByLine = 10;
const paddingAroundAllMonsters = 30;
const spaceAroundMonsters = 10;
let monsterBottomLimit;

class Monster {
  constructor(i, j){
    let monster_;

    if(i === 0){
      monster_ = monster1;
    }
    else if(i === 1){
      monster_ = monster2;
    }
    else if(i === 2){
      monster_ = monster3;
    }

    let monster = {
      elem: document.createElement("div"),
      x: (j * monster_.width) + (j * spaceAroundMonsters) + paddingAroundAllMonsters,
      y: (i * monster_.height) + (i * spaceAroundMonsters) + paddingAroundAllMonsters * 2,
      width: monster_.width,
      height: monster_.height,
      speed: monster_.speed,
      point: monster_.point
    };
    monster.elem.className = monster_.className;
    monster.elem.style.width = monster.width + "px";
    monster.elem.style.height = monster.height + "px";
    if(Spaceship.get() !== null && Spaceship.get().elem !== null && monster !== null && monster.element !== null){
      Spaceship.get().elem.parentNode.insertBefore(monster.elem, Spaceship.get().elem);
    }
    return monster;
  }

  static getMonsterBottomLimit(){
    return Screen.get().height - 5;
  }

  static getMonstersByLine(i){
    let monstersByLine1 = Math.round(screen.width / (monster1.width + spaceAroundMonsters )) - 1;
    let monstersByLine2 = Math.round(screen.width / (monster2.width + spaceAroundMonsters )) - 1;
    let monstersByLine3 = Math.round(screen.width / (monster3.width + spaceAroundMonsters )) - 1;

    let monstersByLine12 = Math.min(monstersByLine1, monstersByLine2);
    monstersByLine = Math.min(monstersByLine12, monstersByLine3);

    return monstersByLine;
  }

  static getLineOfMonster(){
    return linesOfMonster;
  }
}
