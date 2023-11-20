import { DomElem } from './DomElem';

export interface Heart {
  elem: HTMLElement;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const MAX_HEALTH: number = 3;
export const HEART_WIDTH: number = 35;
export const HEART_HEART: number = 30;

export class Hearts extends DomElem {
  public static healthNum: number = 3;
  public static hearts: Heart[] = [];

  constructor() {
    super();
    this.createHeart();
  }

  createHeart() {
    Hearts.healthNum = 3;

    for (let i = 0; i < MAX_HEALTH; i++) {
      const heart: Heart = {
        elem: document.createElement('div'),
        x: i * HEART_WIDTH + i * 10,
        y: 0,
        width: HEART_WIDTH,
        height: HEART_HEART,
      };
      heart.elem.className = 'heart';
      heart.elem.style.width = heart.width + 'px';
      heart.elem.style.height = heart.height + 'px';

      const ref = document.querySelector('.health');
      if (ref !== null && heart.elem !== null) {
        ref.appendChild(heart.elem);
        heart.elem.style.transform = 'translate(' + heart.x + 'px, ' + heart.y + 'px)';
      }

      Hearts.hearts.push(heart);
    }
  }

  static getHealth() {
    return Hearts.healthNum;
  }

  static getOneHealth() {
    if (Hearts.healthNum < MAX_HEALTH) {
      Hearts.healthNum += 1;
    }
    Hearts.display();
  }

  static looseOneHealth() {
    if (Hearts.healthNum > 0) {
      Hearts.healthNum -= 1;
    }
    Hearts.display();
  }

  static display() {
    for (let i = 0; i < Hearts.hearts.length; i++) {
      if (i <= Hearts.healthNum - 1) {
        Hearts.hearts[i].elem.classList.remove('lost');
      } else {
        Hearts.hearts[i].elem.classList.add('lost');
      }
    }
  }

  static removeAll() {
    Hearts.hearts.forEach((heart) => {
      if (typeof heart !== 'undefined' && typeof heart.elem !== 'undefined') {
        heart.elem.remove();
        this.hearts = this.hearts.filter((heart_) => heart_ !== heart);
      }
    });
  }
}
