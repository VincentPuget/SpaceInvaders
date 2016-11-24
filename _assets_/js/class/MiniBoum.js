"use strict";

const MINI_BOUM_WIDTH = 55;
const MINI_BOUM_HEIGHT = 40;

class MiniBoum {
  static create(element){
    if(typeof element === "undefined") { return; }
    let deltaW = (MINI_BOUM_WIDTH > element.width) ? (MINI_BOUM_WIDTH - element.width) / 2 : (element.width - MINI_BOUM_WIDTH) / 2;
    let deltaH = (MINI_BOUM_HEIGHT > element.height) ? (MINI_BOUM_HEIGHT - element.height) / 2 : (element.height - MINI_BOUM_HEIGHT) / 2;
    let miniBoum = {
      elem: document.createElement("div"),
      x: element.x - deltaW,
      y: element.y - deltaH,
      width: MINI_BOUM_WIDTH,
      height: MINI_BOUM_HEIGHT
    };
    miniBoum.elem.className = "miniBoum";
    miniBoum.elem.style.width = miniBoum.width + "px";
    miniBoum.elem.style.height = miniBoum.height + "px";
    if(element !== null && element.elem !== null && miniBoum !== null && miniBoum.element !== null){
      element.elem.parentNode.insertBefore(miniBoum.elem, element.elem);
    }
    miniBoum.elem.style.transform = "translate(" + miniBoum.x + "px, " + miniBoum.y + "px)";
    setTimeout(() => {
      miniBoum.elem.remove();
    }, 200);
  }
}
