"use strict";

const MINI_BOUM_WIDTH = 35;
const MINI_BOUM_HEIGHT = 25;
const MINI_BOUM_CLASS_NAME = "miniBoum";

class MiniBoum extends Boum{
  constructor(element){
    super(element);
    this.width = MINI_BOUM_WIDTH;
    this.height = MINI_BOUM_HEIGHT;
    this.elem.className = MINI_BOUM_CLASS_NAME;
  }
}
