"use strict";

const BONUS_ICON_WIDTH = 40;
const BONUS_ICON_HEART = 40;
const BONUS_ICON_CLASS_NAME = "bonusIcon";



class BonusIcon extends DomElem{
  constructor(iconClass = ""){
    super();

    this.width = BONUS_ICON_WIDTH;
    this.height = BONUS_ICON_HEART;
    this.elem = document.createElement("div");
    this.elem.className = BONUS_ICON_CLASS_NAME;

    this.elem.style.width = this.width + "px";
    this.elem.style.height = this.height + "px";

    this.elem.classList.add(iconClass);

    let ref = document.querySelector(".bonusIconsContainer");
    if(ref !== null && this.elem !== null){
      ref.appendChild(this.elem);
    }
  }

  static reset(){
    let ref = document.querySelector(".bonusIconsContainer");
    while (ref.firstChild) {
      ref.removeChild(ref.firstChild);
    }
  }
}
