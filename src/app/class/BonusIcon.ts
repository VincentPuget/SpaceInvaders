import { DomElem } from './DomElem';

export const BONUS_ICON_WIDTH: number = 40;
export const BONUS_ICON_HEART: number = 40;
export const BONUS_ICON_CLASS_NAME: string = 'bonusIcon';

export class BonusIcon extends DomElem {
  constructor(iconClassName: string = '') {
    super();

    this.width = BONUS_ICON_WIDTH;
    this.height = BONUS_ICON_HEART;
    this.elem = document.createElement('div');
    this.elem.className = BONUS_ICON_CLASS_NAME;

    this.elem.style.width = this.width + 'px';
    this.elem.style.height = this.height + 'px';

    this.elem.classList.add(iconClassName);

    const ref = document.querySelector('.bonusIconsContainer');
    if (ref !== null && this.elem !== null) {
      ref.appendChild(this.elem);
    }
  }

  static reset(): void {
    const ref: Element | null = document.querySelector('.bonusIconsContainer');
    while (ref?.firstChild) {
      ref.removeChild(ref.firstChild);
    }
  }
}
