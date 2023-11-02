import { BonusIcon } from "./BonusIcon";
import { Bullet } from "./Bullet";
import { DomElem } from "./DomElem";
import { Hearts } from "./Hearts";
import { Spaceship } from "./Spaceship";
import { Utils } from "./Utils";

export interface BonusConfig {
  name: string;
  active: boolean;
  action: () => void;
  default: () => void;
}

export const BONUS_WIDTH: number = 30;
export const BONUS_HEIGHT: number = 40;
export const BONUS_SPEED: number = 1;

export class Bonus extends DomElem {
  public static bonusAvailables: BonusConfig[] = [
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
      },
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
      },
    },
    {
      name: "bulletHz",
      active: false,
      action: () => {
        Bullet.setHz(75);
      },
      default: () => {
        Bullet.setHz(100);
      },
    },
    {
      name: "newHealth",
      active: false,
      action: () => {
        Hearts.getOneHealth();
      },
      default: () => {},
    },
  ];

  private config: BonusConfig;

  constructor() {
    super();
    let spaceship = Spaceship.get();

    this.elem = document.createElement("div");
    this.x = Utils.getRandomInt(1, screen.width - BONUS_WIDTH);
    this.y = Utils.getRandomInt(0, 100);
    this.width = BONUS_WIDTH;
    this.height = BONUS_HEIGHT;
    this.speed = BONUS_SPEED;
    this.config = Bonus.getRandomBonusConfig();

    this.elem.className = "bonus";
    this.elem.style.width = this.width + "px";
    this.elem.style.height = this.height + "px";
    if (
      spaceship !== null &&
      spaceship.elem !== null &&
      spaceship.elem.parentNode?.parentNode !== null
    ) {
      spaceship.elem.parentNode?.insertBefore(this.elem, spaceship.elem);
    }
    this.elem.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
    return this;
  }

  displayIcon(): void {
    BonusIcon.reset();
    new BonusIcon(this.config.name);
  }

  public static getRandomBonusConfig(): BonusConfig {
    let randBonus = Utils.getRandomInt(0, Bonus.bonusAvailables.length - 1);
    Bonus.bonusAvailables[randBonus].active = true;
    return Bonus.bonusAvailables[randBonus];
  }

  public static setActiveBonus(bonus: Bonus): void {
    bonus.config.action();
  }

  public static rasAllBonus(): void {
    Bonus.bonusAvailables.forEach((oneBonus) => {
      oneBonus.default();
      oneBonus.active = false;
    });
  }
}
