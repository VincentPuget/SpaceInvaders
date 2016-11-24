"use strict";


// let monster1 = {
//   width: 55,
//   height: 40,
//   className: "monster_1",
//   point: 10,
//   speed: 0.3
// };
// let monster2 = {
//   width: 40,
//   height: 40,
//   className: "monster_2",
//   point: 20,
//   speed: 0.3
// };
// let monster3 = {
//   width: 60,
//   height: 40,
//   className: "monster_3",
//   point: 30,
//   speed: 0.3
// };

class Monster1 extends Monster{
  constructor(i, j){
    super(i, j);

    this.width = 55;
    this.height = 40;
    this.className = "monster_1";
    this.point = 10;
    this.speed = 0.3;
  }
}
