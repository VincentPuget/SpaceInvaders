import { DomElem } from './DomElem';

export class Screen extends DomElem {
  public static screen: Screen;
  constructor() {
    super();
    const screen: HTMLElement | null = document.querySelector('.screen');
    if (screen) {
      this.elem = screen;
    }

    this.width = this.elem.getBoundingClientRect().width;
    this.height = this.elem.getBoundingClientRect().height;
    Screen.screen = this;
  }

  static get(): Screen {
    return Screen.screen;
  }
}
