"use strict";

const MONSTER_BOMB_WIDTH = 15;
const MONSTER_BOMB_HEIGHT = 21;

let monsterBombSpeed = 1;
let monsterBombPoint = 5;

class MonsterBomb {
  constructor(monster){
    if(typeof monster === "undefined") { return; }
    let monsterBomb = {
      elem: document.createElement("div"),
      x: monster.x,
      y: monster.y,
      width: MONSTER_BOMB_WIDTH,
      height: MONSTER_BOMB_HEIGHT,
      speed: monsterBombSpeed,
      point: monsterBombPoint
    };
    monsterBomb.elem.className = "monsterBomb";
    monsterBomb.elem.style.width = monsterBomb.width + "px";
    monsterBomb.elem.style.height = monsterBomb.height + "px";
    if(monster !== null && monster.elem !== null && monsterBomb !== null && monsterBomb.element !== null){
      monster.elem.parentNode.insertBefore(monsterBomb.elem, monster.elem);
    }
    monsterBomb.elem.style.transform = "translate(" + monsterBomb.x + "px, " + monsterBomb.y + "px)";
    return monsterBomb;
  }
}
