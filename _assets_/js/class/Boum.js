"use strict";

const BOUM_WIDTH = 55;
const BOUM_HEIGHT = 40;
const BOUM_CLASS_NAME = "boum";

class Boum extends DomElem{
  constructor(element){
    super();
    if(typeof element === "undefined") { return; }

    this.width = BOUM_WIDTH;
    this.height = BOUM_HEIGHT;
    this.elem = document.createElement("div");
    this.elem.className = BOUM_CLASS_NAME;

    this.deltaW = (this.width > element.width) ? (this.width - element.width) / 2 : (element.width - this.width) / 2;
    this.deltaH = (this.height > element.height) ? (this.height - element.height) / 2 : (element.height - this.height) / 2;
    this.x = element.x - this.deltaW;
    this.y = element.y - this.deltaH;

    this.elem.style.width = this.width + "px";
    this.elem.style.height = this.height + "px";
    if(element !== null && element.elem !== null && element.elem.parentNode !== null && this.element !== null){
      element.elem.parentNode.insertBefore(this.elem, element.elem);
    }
    this.elem.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
    setTimeout(() => {
      this.elem.remove();
    }, 200);
  }
}
