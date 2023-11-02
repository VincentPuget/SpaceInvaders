import { DomElem } from "./DomElem";
import { Spaceship } from "./Spaceship";

export const BULET_WIDTH: number = 2;
export const BULLET_HEIGHT: number = 8;

export class Bullet extends DomElem {
  public static bulletSpeed: number = 8;
  public static bulletHz: number = 100;

  public positionX: number = 0;
  public positionY: number = 0;
  public spaceship: Spaceship = Spaceship.get();

  constructor(position = "center") {
    super();

    if (position === "left") {
      this.positionX = this.spaceship.x + this.spaceship.width / 2 - 1 - 14;
      this.positionY = this.spaceship.y - BULLET_HEIGHT + 20;
    } else if (position === "center") {
      this.positionX = this.spaceship.x + this.spaceship.width / 2 - 1;
      this.positionY = this.spaceship.y - BULLET_HEIGHT;
    } else if (position === "right") {
      this.positionX = this.spaceship.x + this.spaceship.width / 2 - 1 + 14;
      this.positionY = this.spaceship.y - BULLET_HEIGHT + 20;
    }

    this.elem = document.createElement("div");
    this.x = this.positionX;
    this.y = this.positionY;
    this.width = BULET_WIDTH;
    this.height = BULLET_HEIGHT;
    this.speed = Bullet.bulletSpeed;

    this.elem.className = "bullet";
    this.elem.style.width = this.width + "px";
    this.elem.style.height = this.height + "px";
    this.elem.style.background = "white";

    if (
      this.spaceship !== null &&
      this.spaceship.elem !== null &&
      this.spaceship.elem.parentNode !== null &&
      this.elem !== null
    ) {
      this.spaceship.elem.parentNode.insertBefore(
        this.elem,
        this.spaceship.elem
      );
    }

    return this;
  }

  move(): void {
    this.y -= this.speed;
  }

  static getSpeed(): number {
    return Bullet.bulletSpeed;
  }

  static setSpeed(bulletSpeed: number): void {
    Bullet.bulletSpeed = bulletSpeed;
  }

  static getHz(): number {
    return Bullet.bulletHz;
  }

  static setHz(bulletHz: number): void {
    Bullet.bulletHz = bulletHz;
  }
}
