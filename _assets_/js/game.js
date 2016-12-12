"use strict";

//TODO set default value of bonus in config
//TODO create class Bonus
//TODO Display active bonus UI

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

let bulletTimeout = null;
let bullets = [];
let monsters = [];
let monsterBombs = [];
let bonuss = [];

let sound = new Sound();

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

let health = {
  elem: document.querySelector(".health")
};

let bonusIconContainer = {
  elem: document.querySelector(".bonusIconsContainer")
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
let keyInfo = {
  elem: document.querySelector(".keyInfo")
};

function init() {
  bullets = [];
  monsterBombs = [];
  bonuss = [];
  score.value = 0;
  showElement(spaceship);
  new Hearts();
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
  spaceship.move();
  moveBullets();
  moveMonsters();
  chooseMonsterForBombing();
  moveBombMonster();
  randomBonus();
  moveBonus();
  spaceshipFire();
  spaceship.contain();
  checkCollisions();
  checkMonsterPosition();
  deleteOutBullet();
  deleteOutMonsterBombs();
  deleteOutBonus();
  checkHearts();
  checkWinState();
}

function chooseMonsterForBombing(){
  let rand = Utils.getRandomInt(1, 1000);
  if(rand < 10){
    let randMonster = Utils.getRandomInt(1, monsters.length - 1);
    createMonsterBomb(monsters[randMonster]);
  }
}

function randomBonus(){
  let rand = Utils.getRandomInt(1, 1000);
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

function spaceshipFire() {
  if(spaceship.fire && bulletTimeout === null){

    let bullet = new Bullet("center");
    bullets.push(bullet);

    sound.play("laser");

    if(spaceship.tripleFire){
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

function createMonsters(){
  monsters = [];
  let totalMonster = 0;
  for(let i = 0; i < Monster.getLineOfMonster() ; i++){
    for(let j = 0; j < Monster.getMonstersByLine(i) ; j++){
      let monster = new Monster(i, j);
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

function createBonus(){
  if(!gameStarted) { return; }
  let bonus = new Bonus();
  bonuss.push(bonus);
}

function moveSpaceship() {
  spaceship.move();
}

function moveBullets() {
  _.forEach(bullets, (bullet) => {
    bullet.move();
  });
}

function moveMonsters() {
  _.forEach(monsters, (monster) => {
    monster.move();
  });
}

function moveBombMonster() {
  _.forEach(monsterBombs, (monsterBomb) => {
    monsterBomb.move();
  });
}

function moveBonus(){
  _.forEach(bonuss, (bonus) => {
    bonus.move();
  });
}

function deleteOutBullet(){
  _.forEach(bullets, (bullet) => {
    if(typeof bullet !== "undefined" && typeof bullet.elem !== "undefined"){
      if(bullet.y < 0){
        bullet.remove();
        _.remove(bullets, bullet);
      }
    }
  });
}

function deleteOutMonsterBombs(){
  _.forEach(monsterBombs, (monsterBomb) => {
    if(typeof monsterBomb !== "undefined" && typeof monsterBomb.elem !== "undefined"){
      if(monsterBomb.y > screen.height){
        monsterBomb.remove();
        _.remove(monsterBombs, monsterBomb);
      }
    }
  });
}

function deleteOutBonus(){
  _.forEach(bonuss, (bonus) => {
    if(typeof bonus !== "undefined" && typeof bonus.elem !== "undefined"){
      if(bonus.y > screen.height){
        bonus.remove();
        _.remove(bonuss, bonus);
      }
    }
  });
}

function checkCollisions(){
  _.forEach(monsters, (monster) => {
    //monster => buller
    _.forEach(bullets, (bullet) => {
      if(typeof bullet !== "undefined" && typeof bullet.elem !== "undefined" &&
          bullet !== null && bullet.elem !== null &&
          typeof monster !== "undefined" && typeof monster.elem !== "undefined" &&
          monster !== null && monster.elem !== null
        ){
        if (collisionAABB(bullet, monster)) {
          score.value += monster.point;
          new Boum(monster);
          bullet.remove();
          monster.remove();
          _.remove(bullets, bullet);
          _.remove(monsters, monster);
        }
      }
    });

    //monster => spaceship
    if(typeof monster !== "undefined" && typeof monster.elem !== "undefined"){
      if (collisionAABB(spaceship, monster)) {
        // resetGame();
        new Boum(monster);
        monster.remove();
        _.remove(monsters, monster);
        Hearts.looseOneHealth();
        return false;
      }
    }
  });
  //bullet => monstaer
  _.forEach(monsterBombs, (monsterBomb) => {
    _.forEach(bullets, (bullet) => {
      if(typeof bullet !== "undefined" && typeof bullet.elem !== "undefined" &&
        typeof monsterBomb !== "undefined" && typeof monsterBomb.elem !== "undefined"){
        if (collisionAABB(bullet, monsterBomb)) {
          score.value += monsterBomb.point;
          new MiniBoum(monsterBomb);
          bullet.remove();
          monsterBomb.remove();
          _.remove(bullets, bullet);
          _.remove(monsterBombs, monsterBomb);
        }
      }
    });
    // monsterBomb => spachship
    _.forEach(monsterBombs, (monsterBomb) => {
      if(typeof monsterBomb !== "undefined" && typeof monsterBomb.elem !== "undefined"){
        if (collisionAABB(spaceship, monsterBomb)) {
          // resetGame();
          new Boum(monsterBomb);
          monsterBomb.remove();
          _.remove(monsterBombs, monsterBomb);
          Hearts.looseOneHealth();
          return false;
        }
      }
    });
  });
  //bonus => spaceship
  _.forEach(bonuss, (bonus) => {
    if(typeof bonus !== "undefined" && typeof bonus.elem !== "undefined"){
      if (collisionAABB(spaceship, bonus)) {
        new Boum(bonus);
        Bonus.rasAllBonus();
        Bonus.setActiveBonus(bonus);
        bonus.displayIcon();
        bonus.remove();
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
      bullet.remove();
    }
  });
}

function removeAllMonsters(){
  _.forEach(monsters, (monster) => {
    if(typeof monster !== "undefined" && typeof monster.elem !== "undefined"){
      monster.remove();
    }
  });
}

function removeAllMonsterBombs(){
  _.forEach(monsterBombs, (monsterBomb) => {
    if(typeof monsterBomb !== "undefined" && typeof monsterBomb.elem !== "undefined"){
      monsterBomb.remove();
    }
  });
}

function removeAllBonuss(){
  _.forEach(bonuss, (bonus) => {
    if(typeof bonus !== "undefined" && typeof bonus.elem !== "undefined"){
      bonus.remove();
    }
  });
}

function resetGame(){

  window.cancelAnimationFrame(requestId);
  requestId = undefined;

  showElement(menu);
  hideElement(win);
  hideElement(score);
  hideElement(health);
  showElement(loose);
  showElement(buttonReStart);
  hideElement(buttonStart);
  hideElement(keyInfo);
  hideElement(buttonContinue);
  hideElement(buttonPause);
  gameStarted = false;

  removeAllBullets();
  removeAllMonsters();
  removeAllMonsterBombs();
  removeAllBonuss();

  Bonus.rasAllBonus();
  BonusIcon.reset();

  spaceship.replaceInScreen();

}

function checkHearts(){
  if(Hearts.getHealth() === 0){
    Hearts.removeAll();
    resetGame();
  }
}

function checkWinState(){
  if(_.isArray(monsters) && monsters.length === 0 && _.isArray(monsterBombs) && monsterBombs.length === 0){
    removeAllBonuss();
    showElement(menu);
    showElement(win);
    hideElement(loose);
    hideElement(score);
    hideElement(health);
    showElement(buttonReStart);
    hideElement(keyInfo);
    hideElement(buttonStart);
    hideElement(buttonContinue);
    hideElement(buttonPause);
    Bonus.rasAllBonus();
    BonusIcon.reset();
    gameStarted = false;
  }
}

function pauseGame(){
  pause = true;
  showElement(menu);
  showElement(buttonContinue);
  showElement(buttonReStart);
  showElement(keyInfo);
  hideElement(buttonStart);
  hideElement(buttonPause);
  hideElement(win);
  hideElement(loose);
  loop();
}

function startGame(){
  pause = false;
  gameStarted = true;
  hideElement(menu);
  showElement(buttonPause);
  showElement(buttonContinue);
  showElement(buttonReStart);
  showElement(score);
  showElement(health);
  hideElement(keyInfo);
  hideElement(buttonStart);
  init();
}

function restartGame(){
  pause = false;
  resetGame();
  hideElement(menu);
  showElement(buttonPause);
  showElement(score);
  showElement(health);
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
