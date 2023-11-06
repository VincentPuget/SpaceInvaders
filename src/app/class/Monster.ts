import { DomElem } from './DomElem';
import { Screen } from './Screen';
import { Spaceship } from './Spaceship';

export interface MonsterConfig {
  width: number;
  height: number;
  className: string;
  point: number;
  speed: number;
}

export const TOTAL_MONSTERS: number = 30;
export const LINES_OF_MONSTERS: number = 3;
export const SPACE_ARROUND_MONSTERS: number = 10;

export class Monster extends DomElem {
  public static monster1: MonsterConfig = {
    width: 55,
    height: 40,
    className: 'monster_1',
    point: 10,
    speed: 0.3,
  };
  public static monster2: MonsterConfig = {
    width: 40,
    height: 40,
    className: 'monster_2',
    point: 20,
    speed: 0.3,
  };
  public static monster3: MonsterConfig = {
    width: 60,
    height: 40,
    className: 'monster_3',
    point: 30,
    speed: 0.3,
  };

  public monster!: MonsterConfig;
  public point!: number;

  constructor(i: number, j: number) {
    super();
    let spaceship = Spaceship.get();
    if (i === 0) {
      this.monster = Monster.monster1;
    } else if (i === 1) {
      this.monster = Monster.monster2;
    } else if (i === 2) {
      this.monster = Monster.monster3;
    }

    this.elem = document.createElement('div');
    let paddingX = i === 0 ? 14 : i === 1 ? 30 : 10;
    let paddingY = 10;
    let paddingXall = 20;
    let paddingYall = 60;
    this.x = j * this.monster.width + j * paddingX + paddingX / 2 + paddingXall;
    this.y = i * this.monster.height + i * paddingY + paddingYall;
    this.width = this.monster.width;
    this.height = this.monster.height;
    this.speed = this.monster.speed;
    this.point = this.monster.point;

    this.elem.className = this.monster.className;
    this.elem.style.width = this.width + 'px';
    this.elem.style.height = this.height + 'px';
    if (spaceship !== null && spaceship.elem !== null && spaceship.elem.parentNode !== null) {
      spaceship.elem.parentNode.insertBefore(this.elem, spaceship.elem);
    }
    return this;
  }

  static getMonsterBottomLimit(): number {
    let screen: Screen = Screen.get();
    return screen.height - 5;
  }

  static getMonstersByLine(): number {
    let screen: Screen = Screen.get();
    let monstersByLine1: number = Math.round(screen.width / (Monster.monster1.width + SPACE_ARROUND_MONSTERS)) - 1;
    let monstersByLine2: number = Math.round(screen.width / (Monster.monster2.width + SPACE_ARROUND_MONSTERS)) - 1;
    let monstersByLine3: number = Math.round(screen.width / (Monster.monster3.width + SPACE_ARROUND_MONSTERS)) - 1;

    let monstersByLine12: number = Math.min(monstersByLine1, monstersByLine2);
    let monstersByLine: number = Math.min(monstersByLine12, monstersByLine3);
    return monstersByLine;
  }

  static getLineOfMonster(): number {
    return LINES_OF_MONSTERS;
  }
}
