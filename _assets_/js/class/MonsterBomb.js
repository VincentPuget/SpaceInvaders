"use strict";

const MONSTER_BOMB_WIDTH = 15;
const MONSTER_BOMB_HEIGHT = 21;

let monsterBombSpeed = 1;
let monsterBombPoint = 5;

class MonsterBomb extends DomElem{
  constructor(monster){
    super();
    if(typeof monster === "undefined") { return; }
    this.elem = document.createElement("div");
    this.x = monster.x;
    this.y = monster.y;
    this.width = MONSTER_BOMB_WIDTH;
    this.height = MONSTER_BOMB_HEIGHT;
    this.speed = monsterBombSpeed;
    this.point = monsterBombPoint;
    this.elem.className = "monsterBomb";
    this.elem.style.width = this.width + "px";
    this.elem.style.height = this.height + "px";
    if(monster !== null && monster.elem !== null && this.element !== null){
      monster.elem.parentNode.insertBefore(this.elem, monster.elem);
    }
    this.elem.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
    return this;
  }
}
