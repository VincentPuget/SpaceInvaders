"use strict";

const BOUM_WIDTH = 55;
const BOUM_HEIGHT = 40;

class Boum {
  static create(element){
    if(typeof element === "undefined") { return; }
    let deltaW = (BOUM_WIDTH > element.width) ? (BOUM_WIDTH - element.width) / 2 : (element.width - BOUM_WIDTH) / 2;
    let deltaH = (BOUM_HEIGHT > element.height) ? (BOUM_HEIGHT - element.height) / 2 : (element.height - BOUM_HEIGHT) / 2;
    let boum = {
      elem: document.createElement("div"),
      x: element.x - deltaW,
      y: element.y - deltaH,
      width: BOUM_WIDTH,
      height: BOUM_HEIGHT
    };
    boum.elem.className = "boum";
    boum.elem.style.width = boum.width + "px";
    boum.elem.style.height = boum.height + "px";
    if(element !== null && element.elem !== null && boum !== null && boum.element !== null){
      element.elem.parentNode.insertBefore(boum.elem, element.elem);
    }
    boum.elem.style.transform = "translate(" + boum.x + "px, " + boum.y + "px)";
    setTimeout(() => {
      boum.elem.remove();
    }, 200);
  }
}
