"use strict";

let screen_;

class Screen {
  constructor(){
    let screen = {
      elem: document.querySelector(".screen")
    };
    screen.width = screen.elem.getBoundingClientRect().width;
    screen.height = screen.elem.getBoundingClientRect().height;
    screen_ = screen;
    return screen;
  }

  static get(){
    return screen_;
  }
}
