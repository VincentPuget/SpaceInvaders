"use strict";


let healthNum = 3;
const maxHealth = 3;
const HEART_WIDTH = 35;
const HEART_HEART = 30;

let hearts = [];

class Hearts extends DomElem{
  constructor(){
    super();
    this.createHeart();
  }

  createHeart(){
    healthNum = 3;

    for (var i = 0; i < maxHealth; i++) {
      let heart = {
        elem: document.createElement("div"),
        x: (i * HEART_WIDTH) + i * 10,
        y: 0,
        width: HEART_WIDTH,
        height: HEART_HEART
      };
      heart.elem.className = "heart";
      heart.elem.style.width = heart.width + "px";
      heart.elem.style.height = heart.height + "px";

      let ref = document.querySelector(".health");
      if(ref !== null && heart.elem !== null){
        ref.appendChild(heart.elem);
        heart.elem.style.transform = "translate(" + heart.x + "px, " + heart.y + "px)";
      }

      hearts.push(heart);
    }
  }

  static getHealth(){
    return healthNum;
  }

  static getOneHealth(){
    if(healthNum < maxHealth){
      healthNum += 1;
    }
    Hearts.display();

  }

  static looseOneHealth(){
    if(healthNum > 0){
      healthNum -= 1;
    }
    Hearts.display();
  }

  static display(){
    for (var i = 0; i < hearts.length; i++) {
      if(i <= healthNum - 1){
        hearts[i].elem.classList.remove("lost");
      }
      else{
        hearts[i].elem.classList.add("lost");
      }
    }
  }

  static removeAll(){
    _.forEach(hearts, (heart) => {
      if(typeof heart !== "undefined" && typeof heart.elem !== "undefined"){
        heart.elem.remove();
        _.remove(hearts, heart);
      }
    });
  }
}
