import { Boum } from './Boum';
import { DomElem } from './DomElem';

export const MINI_BOUM_WIDTH: number = 35;
export const MINI_BOUM_HEIGHT: number = 25;
export const MINI_BOUM_CLASS_NAME: string = 'miniBoum';

export class MiniBoum extends Boum {
  constructor(element: DomElem) {
    super(element);
    this.width = MINI_BOUM_WIDTH;
    this.height = MINI_BOUM_HEIGHT;
    this.elem.className = MINI_BOUM_CLASS_NAME;
    this.elem.style.width = this.width + 'px';
    this.elem.style.height = this.height + 'px';
  }
}
