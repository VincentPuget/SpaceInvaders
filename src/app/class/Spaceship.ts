import { DomElem } from './DomElem';
import { Screen } from './Screen';

export const SPACESHIP_WIDTH: number = 30;
export const SPACESHIP_HEIGHT: number = 38;

export class Spaceship extends DomElem {
  public static spaceshipSpeed: number = 6;
  public static spaceship: Spaceship;

  public moveLeft: boolean;
  public moveRight: boolean;
  public moveUp: boolean;
  public moveDown: boolean;
  public fire: boolean;
  public tripleFire: boolean;

  constructor() {
    super();

    const elem: HTMLElement | null = document.querySelector('.spaceship');
    if (elem) {
      this.elem = elem;
    }
    let screen: Screen = Screen.get();
    this.x = (screen.width - SPACESHIP_WIDTH) / 2;
    this.x = (screen.width - SPACESHIP_WIDTH) / 2;
    this.y = screen.height - SPACESHIP_HEIGHT - 4;
    this.width = SPACESHIP_WIDTH;
    this.height = SPACESHIP_HEIGHT;
    this.speed = Spaceship.spaceshipSpeed;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveUp = false;
    this.moveDown = false;
    this.fire = false;
    this.tripleFire = false;

    Spaceship.spaceship = this;
  }

  move(): void {
    if (this.moveLeft) {
      this.x -= this.speed;
    } else if (this.moveRight) {
      this.x += this.speed;
    }
    if (this.moveUp) {
      this.y -= this.speed;
    } else if (this.moveDown) {
      this.y += this.speed;
    }
  }

  replaceInScreen(): void {
    let screen: Screen = Screen.get();
    this.x = (screen.width - this.width) / 2;
    this.y = screen.height - this.height - 4;
  }

  contain(): void {
    let screen: Screen = Screen.get();
    this.x = Math.max(0, this.x); // débordement à gauche (this.x devient négatif)
    this.x = Math.min(screen.width - this.width, this.x); // débordement à droite

    this.y = Math.max(0, this.y); // débordement en haut (this.y devient négatif)
    this.y = Math.min(screen.height - this.height, this.y); // débordement en bas
  }

  static get(): Spaceship {
    return Spaceship.spaceship;
  }
}
