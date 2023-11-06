import { DomElem } from './DomElem';

export const MONSTER_BOMB_WIDTH: number = 15;
export const MONSTER_BOMB_HEIGHT: number = 21;

export class MonsterBomb extends DomElem {
  public static monsterBombSpeed = 1;
  public static monsterBombPoint = 5;

  public point!: number;

  constructor(monster: DomElem) {
    super();

    if (typeof monster === 'undefined') {
      return;
    }

    this.elem = document.createElement('div');
    this.width = MONSTER_BOMB_WIDTH;
    this.height = MONSTER_BOMB_HEIGHT;
    this.x = monster.x + (monster.width - this.width) / 2;
    this.y = monster.y;
    this.speed = MonsterBomb.monsterBombSpeed;
    this.point = MonsterBomb.monsterBombPoint;
    this.elem.className = 'monsterBomb';
    this.elem.style.width = this.width + 'px';
    this.elem.style.height = this.height + 'px';
    if (monster !== null && monster.elem !== null && monster.elem.parentNode !== null) {
      monster.elem.parentNode.insertBefore(this.elem, monster.elem);
    }
    this.elem.style.transform = 'translate(' + this.x + 'px, ' + this.y + 'px)';
    return this;
  }
}
