export class DomElem {
  public elem!: HTMLElement;
  public x!: number;
  public y!: number;
  public width!: number;
  public height!: number;
  public speed!: number;

  constructor(className: string = "") {}

  move() {
    this.y += this.speed;
  }

  remove() {
    this.elem.remove();
  }
}
