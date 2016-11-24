"use strict";

let screen_;

class Screen extends DomElem{
  constructor(){
    super();
    this.elem = document.querySelector(".screen");
    this.width = this.elem.getBoundingClientRect().width;
    this.height = this.elem.getBoundingClientRect().height;
    screen_ = this;
    return this;
  }

  static get(){
    return screen_;
  }
}
