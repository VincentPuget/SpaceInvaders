"use strict";

//TODO set default value of bonus in config

const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_ECHAP = 27;
const KEY_SPACE = 32;
const KEY_a = 65;
const KEY_b = 66;

let screen = new Screen();

let requestId;
let pause = true;
let gameStarted = false;

let bonusWidth = 30,
    bonusHeight = 40,
    bonusSpeed = 1;

let bonusAvailables = [
  {
    name: "bonusTripleFire",
    active: false
  },
  {
    name: "speedSpaceShip",
    active: false
  },
  {
    name: "bulletHz",
    active: false
  }
];
let bonusActive;


// let monster1 = {
//   width: 55,
//   height: 40,
//   className: "monster_1",
//   point: 10,
//   speed: 0.5
// };
// let monster2 = {
//   width: 40,
//   height: 40,
//   className: "monster_2",
//   point: 20,
//   speed: 0.5
// };
// let monster3 = {
//   width: 60,
//   height: 40,
//   className: "monster_3",
//   point: 30,
//   speed: 0.5
// };
//
// let numTotalMonster = 30,
//     linesOfMunster = 3,
//     monstersByLine = 10,
//     paddingAroundAllMonsters = 30,
//     spaceAroundMonsters = 10,
// let monsterBottomLimit = screen.height - 50;
// let monsterPoint = 10;


let bulletTimeout = null;
let bullets = [];
let monsters = [];
let monsterBombs = [];
let bonuss = [];


let spaceship = new Spaceship();

let buttonPause = {
  elem: document.querySelector(".buttonPause")
};

let buttonStart = {
  elem: document.querySelector(".buttonStart")
};

let buttonReStart = {
  elem: document.querySelector(".buttonReStart")
};

let buttonContinue = {
  elem: document.querySelector(".buttonContinue")
};

let score = {
  elem: document.querySelector(".score"),
  value: 0
};

let menu = {
  elem: document.querySelector(".menu")
};

let result = {
  elem: document.querySelector(".result")
};
let win = {
  elem: document.querySelector(".win")
};
let loose = {
  elem: document.querySelector(".loose")
};



function init() {
  bullets = [];
  monsterBombs = [];
  bonuss = [];
  score.value = 0;
  showElement(spaceship);
  createMonsters();
  loop();
}

function showElement(el){
  el.elem.classList.remove("hide");
}

function hideElement(el){
  el.elem.classList.add("hide");
}


function update() {
  moveSpaceship();
  moveBullets();
  moveMonsters();
  chooseMonsterForBombing();
  moveBombMonster();
  randomBonus();
  moveBonus();
  spaceshipFire();
  containSpaceships();
  checkCollisions();
  checkMonsterPosition();
  deleteOutBullet();
  deleteOutMonsterBombs();
  deleteOutBonus();

  checkWinState();
}

function getRandomInt(min, max)
{
  let random = Math.floor(Math.random() * (max - min + 1)) + min;
  return random;
}

function chooseMonsterForBombing(){
  let rand = getRandomInt(1, 1000);
  if(rand < 10){
    let randMonster = getRandomInt(1, monsters.length - 1);
    createMonsterBomb(monsters[randMonster]);
  }
}

function randomBonus(){
  let rand = getRandomInt(1, 100);
  if(rand < 10 && bonuss.length < 2){
    createBonus();
  }
}

function render() {
  spaceship.elem.style.transform = "translate(" + spaceship.x + "px, " + spaceship.y + "px)";

  _.forEach(bullets, (bullet) => {
    bullet.elem.style.transform = "translate(" + bullet.x + "px, " + bullet.y + "px)";
  });

  _.forEach(monsters, (monster) => {
    monster.elem.style.transform = "translate(" + monster.x + "px, " + monster.y + "px)";
  });

  _.forEach(monsterBombs, (monsterBomb) => {
    monsterBomb.elem.style.transform = "translate(" + monsterBomb.x + "px, " + monsterBomb.y + "px)";
  });

  _.forEach(bonuss, (bonus) => {
    bonus.elem.style.transform = "translate(" + bonus.x + "px, " + bonus.y + "px)";
  });

  score.elem.innerHTML = "Score : " + score.value;
}

function loop() {
  if(!pause){
    requestId = requestAnimationFrame(loop);
    update();
    render();
  }
}

function containSpaceships() {
  spaceship.x = Math.max(0, spaceship.x); // débordement à gauche (spaceship.x devient négatif)
  spaceship.x = Math.min(screen.width - spaceship.width, spaceship.x);// débordement à droite

  spaceship.y = Math.max(0, spaceship.y); // débordement en haut (spaceship.y devient négatif)
  spaceship.y = Math.min(screen.height - spaceship.height, spaceship.y);// débordement en bas
}

function spaceshipFire() {
  if(spaceship.fire && bulletTimeout === null){

    let bullet = new Bullet("center");
    bullets.push(bullet);

    if(typeof bonusActive !== "undefined" && bonusActive.name === "bulletHz"){
      Bullet.setHz(10);
    }
    else{
      Bullet.setHz(75);
    }

    if(typeof bonusActive !== "undefined" && bonusActive.name === "bonusTripleFire"){
      let bulletLeft = new Bullet("left");
      bullets.push(bulletLeft);

      let bulletRight = new Bullet("right");
      bullets.push(bulletRight);
    }
    bulletTimeout = setTimeout(() => {
      clearTimeout(bulletTimeout);
      bulletTimeout = null;
    }, Bullet.getHz());
  }
}

function generateMonster(i, j){
  let monster = new Monster(i, j);
  return monster;
}

function createMonsters(){

  // monstersByLine = Math.max(Math.round(screen.width / (monster_1_width + spaceAroundMonsters )), monstersByLine) - 1;
  // monstersByLine = 10;
  // numTotalMonster = linesOfMunster * monstersByLine;

  monsters = [];
  let totalMonster = 0;
  for(let i = 0; i < Monster.getLineOfMonster() ; i++){
    for(let j = 0; j < Monster.getMonstersByLine(i) ; j++){
      let monster = generateMonster(i, j);

      monsters.push(monster);
    }
  }
}

function createMonsterBomb(monster){
  if(typeof monster === "undefined"){
    return;
  }
  let monsterBomb = new MonsterBomb(monster);
  monsterBombs.push(monsterBomb);
}

function getRandomBonusType(){
  let randBonus = getRandomInt(0, bonusAvailables.length - 1);
  bonusAvailables[randBonus].active = true;
  return bonusAvailables[randBonus];
}

function getActivatedBonus(){
  let activatedBonus;
  _.forEach(bonusAvailables, (oneBonus) => {
    if(oneBonus.active){
      activatedBonus = oneBonus;
      return false;
    }
  });
  return activatedBonus;
}

function createBonus(){
  if(!gameStarted) { return; }
  let bonus = {
    elem: document.createElement("div"),
    x: getRandomInt(1, (screen.width - bonusWidth)),
    y: getRandomInt(0, 100),
    width: bonusWidth,
    height: bonusHeight,
    speed: bonusSpeed,
    type: getRandomBonusType()
  };
  bonus.elem.className = "bonus";
  bonus.elem.style.width = bonus.width + "px";
  bonus.elem.style.height = bonus.height + "px";
  if(spaceship !== null && spaceship.elem !== null && bonus !== null && bonus.element !== null){
    spaceship.elem.parentNode.insertBefore(bonus.elem, spaceship.elem);
  }
  bonus.elem.style.transform = "translate(" + bonus.x + "px, " + bonus.y + "px)";

  bonuss.push(bonus);
}

function moveSpaceship() {

  if(typeof bonusActive !== "undefined" && bonusActive.name === "speedSpaceShip"){
    spaceship.speed = 12;
  }
  else{
    spaceship.speed = 6;
  }


  if (spaceship.moveLeft) {
    spaceship.x -= spaceship.speed;
  }
  else if (spaceship.moveRight) {
    spaceship.x += spaceship.speed;
  }
  if (spaceship.moveUp) {
    spaceship.y -= spaceship.speed;
  }
  else if (spaceship.moveDown) {
    spaceship.y += spaceship.speed;
  }
}

function moveBullets() {
  _.forEach(bullets, (bullet) => {
    bullet.y -= bullet.speed;
  });
}

function moveMonsters() {
  _.forEach(monsters, (monster) => {
    monster.y += monster.speed;
  });
}

function moveBombMonster() {
  _.forEach(monsterBombs, (monsterBomb) => {
    monsterBomb.y += monsterBomb.speed;
  });
}

function moveBonus(){
  _.forEach(bonuss, (bonus) => {
    bonus.y += bonus.speed;
  });
}

function deleteOutBullet(){
  _.forEach(bullets, (bullet) => {
    if(typeof bullet !== "undefined" && typeof bullet.elem !== "undefined"){
      if(bullet.y < 0){
        bullet.elem.remove();
        _.remove(bullets, bullet);
      }
    }
  });
}

function deleteOutMonsterBombs(){
  _.forEach(monsterBombs, (monsterBomb) => {
    if(typeof monsterBomb !== "undefined" && typeof monsterBomb.elem !== "undefined"){
      if(monsterBomb.y > screen.height){
        monsterBomb.elem.remove();
        _.remove(monsterBombs, monsterBomb);
      }
    }
  });
}

function deleteOutBonus(){
  _.forEach(bonuss, (bonus) => {
    if(typeof bonus !== "undefined" && typeof bonus.elem !== "undefined"){
      if(bonus.y > screen.height){
        bonus.elem.remove();
        _.remove(bonuss, bonus);
      }
    }
  });
}

function checkCollisions(){
  _.forEach(monsters, (monster) => {
    _.forEach(bullets, (bullet) => {
      if(typeof bullet !== "undefined" && typeof bullet.elem !== "undefined" &&
          bullet !== null && bullet.elem !== null &&
          typeof monster !== "undefined" && typeof monster.elem !== "undefined" &&
          monster !== null && monster.elem !== null
        ){
        if (collisionAABB(bullet, monster)) {
          score.value += monster.point;
          Boum.create(monster);
          bullet.elem.remove();
          monster.elem.remove();
          _.remove(bullets, bullet);
          _.remove(monsters, monster);
        }
      }
    });

    if(typeof monster !== "undefined" && typeof monster.elem !== "undefined"){
      if (collisionAABB(spaceship, monster)) {
        resetGame();
        return false;
      }
    }
  });
  _.forEach(monsterBombs, (monsterBomb) => {
    _.forEach(bullets, (bullet) => {
      if(typeof bullet !== "undefined" && typeof bullet.elem !== "undefined" &&
        typeof monsterBomb !== "undefined" && typeof monsterBomb.elem !== "undefined"){
        if (collisionAABB(bullet, monsterBomb)) {
          score.value += monsterBomb.point;
          MiniBoum.create(monsterBomb);
          bullet.elem.remove();
          monsterBomb.elem.remove();
          _.remove(bullets, bullet);
          _.remove(monsterBombs, monsterBomb);
        }
      }
    });
    _.forEach(monsterBombs, (monsterBomb) => {
      if(typeof monsterBomb !== "undefined" && typeof monsterBomb.elem !== "undefined"){
        if (collisionAABB(spaceship, monsterBomb)) {
          resetGame();
          return false;
        }
      }
    });
  });
  _.forEach(bonuss, (bonus) => {
    if(typeof bonus !== "undefined" && typeof bonus.elem !== "undefined"){
      if (collisionAABB(spaceship, bonus)) {
        rasAllBonus();
        bonus.type.active = true;
        bonusActive = bonus.type;
        bonus.elem.remove();
        _.remove(bonuss, bonus);
      }
    }
  });
}

function checkMonsterPosition(){
  _.forEach(monsters, (monster) => {
    if(typeof monster !== "undefined"){
      if(monster.y > Monster.getMonsterBottomLimit()){
        resetGame();
        return false;
      }
    }
  });
}

function collisionAABB(r1, r2) {
	if (!(
    r1.y + r1.height < r2.y ||    // rect1 is above rect2
    r1.x > r2.x + r2.width ||  // rect1 is on the right of rect2
    r1.y > r2.y + r2.height || // rect1 is below rect2
    r1.x + r1.width < r2.x  // rect1 is on the left of rect2
  )) {
    return true;
  }
}

function addEventListeners() {

  let k = [KEY_UP, KEY_UP, KEY_DOWN, KEY_DOWN, KEY_LEFT, KEY_RIGHT, KEY_LEFT, KEY_RIGHT, KEY_b, KEY_a],
  n = 0;

  window.addEventListener("keydown", (event) => {
    if (event.which === KEY_LEFT) { spaceship.moveLeft = true; } //left
    if (event.which === KEY_RIGHT) { spaceship.moveRight = true; } //right
    if (event.which === KEY_UP) { spaceship.moveUp = true; } // up
    if (event.which === KEY_DOWN) { spaceship.moveDown = true; } //down
    if (event.which === KEY_SPACE) { spaceship.fire = true; } //space
    if (event.which === KEY_ECHAP) {
      if(gameStarted){
        if(pause){
          continueGame();
        }
        else{
          pauseGame();
        }
      }
    }

    if (event.keyCode === k[n]) {
      if (n === k.length - 1) {
        Bullet.setHz(10);
        console.log("YEAH");
        n = 0;
        return false;
      }
      n++;
    }
    else {
      n = 0;
    }
  });

  window.addEventListener("keyup", (event) => {
    if (event.which === KEY_LEFT) { spaceship.moveLeft = false; } //left
    if (event.which === KEY_RIGHT) { spaceship.moveRight = false; } //right
    if (event.which === KEY_UP) { spaceship.moveUp = false; } // up
    if (event.which === KEY_DOWN) { spaceship.moveDown = false; } //down
    if (event.which === KEY_SPACE) { spaceship.fire = false; } //space
  });

  buttonPause.elem.addEventListener("click", (event) => {
    pauseGame();
  });

  buttonStart.elem.addEventListener("click", (event) => {
    startGame();
  });

  buttonReStart.elem.addEventListener("click", (event) => {
    restartGame();
  });

  buttonContinue.elem.addEventListener("click", (event) => {
    continueGame();
  });
}

function removeAllBullets(){
  _.forEach(bullets, (bullet) => {
    if(typeof bullet !== "undefined" && typeof bullet.elem !== "undefined"){
      bullet.elem.remove();
    }
  });
}

function removeAllMonsters(){
  _.forEach(monsters, (monster) => {
    if(typeof monster !== "undefined" && typeof monster.elem !== "undefined"){
      monster.elem.remove();
    }
  });
}

function removeAllMonsterBombs(){
  _.forEach(monsterBombs, (monsterBomb) => {
    if(typeof monsterBomb !== "undefined" && typeof monsterBomb.elem !== "undefined"){
      monsterBomb.elem.remove();
    }
  });
}

function removeAllBonuss(){
  _.forEach(bonuss, (bonus) => {
    if(typeof bonus !== "undefined" && typeof bonus.elem !== "undefined"){
      bonus.elem.remove();
    }
  });
}

function rasAllBonus(){
  _.forEach(bonusAvailables, (oneBonus) => {
    oneBonus.active = false;
  });
  bonusActive = undefined;
}

function resetGame(){

  window.cancelAnimationFrame(requestId);
  requestId = undefined;

  showElement(menu);
  hideElement(win);
  showElement(loose);
  showElement(buttonReStart);
  hideElement(buttonStart);
  hideElement(buttonContinue);
  hideElement(buttonPause);
  gameStarted = false;
  rasAllBonus();

  removeAllBullets();
  removeAllMonsters();
  removeAllMonsterBombs();
  removeAllBonuss();

  spaceship.x = (screen.width - spaceship.width) / 2;
  spaceship.y = screen.height - spaceship.height - 4;

}

function checkWinState(){
  if(_.isArray(monsters) && monsters.length === 0 && _.isArray(monsterBombs) && monsterBombs.length === 0){
    removeAllBonuss();
    showElement(menu);
    showElement(win);
    hideElement(loose);
    showElement(buttonReStart);
    hideElement(buttonStart);
    hideElement(buttonContinue);
    hideElement(buttonPause);
    gameStarted = false;
  }
}

function pauseGame(){
  pause = true;
  showElement(menu);
  showElement(buttonContinue);
  showElement(buttonReStart);
  hideElement(buttonStart);
  hideElement(buttonPause);
  loop();
}

function startGame(){
  pause = false;
  gameStarted = true;
  hideElement(menu);
  showElement(buttonPause);
  showElement(buttonContinue);
  showElement(buttonReStart);
  hideElement(buttonStart);
  // loop();
  init();
}

function restartGame(){
  pause = false;
  resetGame();
  hideElement(menu);
  showElement(buttonPause);
  gameStarted = true;
  init();
}

function continueGame(){
  pause = false;
  gameStarted = true;
  hideElement(menu);
  showElement(buttonPause);
  loop();
}


addEventListeners();
hideElement(buttonPause);
