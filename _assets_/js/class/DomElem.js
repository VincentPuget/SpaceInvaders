"use strict";

class DomElem{
  constructor(className){}

  move(){
    this.y += this.speed;
  }

  remove(){
    this.elem.remove();
  }

}
