"use strict";


const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_ECHAP = 27;
const KEY_SPACE = 32;
const KEY_a = 65;
const KEY_b = 66;

let screen = {
  elem: document.querySelector(".screen")
};
screen.width = screen.elem.getBoundingClientRect().width;
screen.height = screen.elem.getBoundingClientRect().height;

let requestId;
let pause = true;
let gameStarted = false;

let spaceshipWidth = 30,
    spaceshipHeight = 38,
    spaceshipSpeed = 6;

let bulletWidth = 2,
    bulletHeight = 8,
    bulletSpeed = 1,
    bulletHz = 75;

let monsterBombWidth = 15,
    monsterBombHeight = 21,
    monsterBombSpeed = 1;

let monsterWidth = 55,
    monsterHeight = 40,
    monsterSpeed = 0.5,
    numTotalMonster = 40,
    linesOfMunster = 4,
    monstersByLine = 10,
    paddingAroundAllMonsters = 30,
    spaceAroundMonsters = 10,
    monsterBottomLimit = screen.height - 50;

let boumWidth = 55,
    boumHeight = 40,
    miniBoumWidth = 35,
    miniBoumHeight = 25;


let bulletTimeout = null;
let bullets = [];

let monsters = [];

let monsterBombs = [];

let spaceship = {
  elem: document.querySelector(".spaceship"),
  x: (screen.width - spaceshipWidth) / 2,
  y: screen.height - spaceshipHeight - 4,
  width: spaceshipWidth,
  height: spaceshipHeight,
  speed: spaceshipSpeed,
  moveLeft: false,
  moveRight: false,
  moveUp: false,
  moveDown: false,
  fire: false
};

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
  chooseMonsterFoBombing();
  moveBombMonster();
  spaceshipFire();
  containSpaceships();
  checkCollisions();
  checkMonsterPosition();
  deleteOutBullet();
  deleteOutMonsterBombs();
  checkWinState();
}

function getRandomInt(min, max)
{
  var random = Math.floor(Math.random() * (max - min + 1)) + min;
  return random;
}

function chooseMonsterFoBombing(){
  var rand = getRandomInt(1, 1000);
  var randMonster = getRandomInt(1, monsters.length - 1);
  if(rand < 10){
    createMonsterBomb(monsters[randMonster]);
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
    let bullet = {
      elem: document.createElement("div"),
      x: spaceship.x + spaceship.width / 2 - 1,
      y: spaceship.y - bulletHeight,
      width: bulletWidth,
      height: bulletHeight,
      speed: bulletHeight
    };
    bullet.elem.className = "bullet";
    bullet.elem.style.width = bullet.width + "px";
    bullet.elem.style.height = bullet.height + "px";
    bullet.elem.style.background = "white";
    spaceship.elem.parentNode.insertBefore(bullet.elem, spaceship.elem);
    bullets.push(bullet);
    bulletTimeout = setTimeout(() => {
      clearTimeout(bulletTimeout);
      bulletTimeout = null;
    }, bulletHz);
  }
}

function createMonsters(){

  monstersByLine = Math.max(Math.round(screen.width / (monsterWidth + spaceAroundMonsters )), monstersByLine) - 1;
  numTotalMonster = linesOfMunster * monstersByLine;

  monsters = [];
  let totalMonster = 0;
  for(var i = 0; i < linesOfMunster ; i++){
    for(var j = 0; j < monstersByLine ; j++){
      if(totalMonster < numTotalMonster){
        let monster = {
          elem: document.createElement("div"),
          x: (j * monsterWidth) + (j * spaceAroundMonsters) + paddingAroundAllMonsters,
          y: (i * monsterHeight) + (i * spaceAroundMonsters) + paddingAroundAllMonsters * 2,
          width: monsterWidth,
          height: monsterHeight,
          speed: monsterSpeed
        };
        monster.elem.className = "monster";
        monster.elem.style.width = monster.width + "px";
        monster.elem.style.height = monster.height + "px";
        spaceship.elem.parentNode.insertBefore(monster.elem, spaceship.elem);
        monsters.push(monster);
        totalMonster += 1;
      }
    }
  }
}

function createBoum(element){
  let deltaW = (boumWidth > element.width) ? (boumWidth - element.width) / 2 : (element.width - boumWidth) / 2;
  let deltaH = (boumHeight > element.height) ? (boumHeight - element.height) / 2 : (element.height - boumHeight) / 2;
  let boum = {
    elem: document.createElement("div"),
    x: element.x - deltaW,
    y: element.y - deltaH,
    width: boumWidth,
    height: boumHeight
  };
  boum.elem.className = "boum";
  boum.elem.style.width = boum.width + "px";
  boum.elem.style.height = boum.height + "px";
  element.elem.parentNode.insertBefore(boum.elem, element.elem);
  boum.elem.style.transform = "translate(" + boum.x + "px, " + boum.y + "px)";
  setTimeout(() => {
    boum.elem.remove();
  }, 200);
}

function createMiniBoum(element){
  let deltaW = (miniBoumWidth > element.width) ? (miniBoumWidth - element.width) / 2 : (element.width - miniBoumWidth) / 2;
  let deltaH = (miniBoumHeight > element.height) ? (miniBoumHeight - element.height) / 2 : (element.height - miniBoumHeight) / 2;
  let miniBoum = {
    elem: document.createElement("div"),
    x: element.x - deltaW,
    y: element.y - deltaH,
    width: miniBoumWidth,
    height: miniBoumHeight
  };
  miniBoum.elem.className = "miniBoum";
  miniBoum.elem.style.width = miniBoum.width + "px";
  miniBoum.elem.style.height = miniBoum.height + "px";
  element.elem.parentNode.insertBefore(miniBoum.elem, element.elem);
  miniBoum.elem.style.transform = "translate(" + miniBoum.x + "px, " + miniBoum.y + "px)";
  setTimeout(() => {
    miniBoum.elem.remove();
  }, 200);
}

function createMonsterBomb(monster){
  if(typeof monster === "undefined"){
    return;
  }
  let monsterBomb = {
    elem: document.createElement("div"),
    x: monster.x,
    y: monster.y,
    width: monsterBombWidth,
    height: monsterBombHeight,
    speed: monsterBombSpeed
  };
  monsterBomb.elem.className = "monsterBomb";
  monsterBomb.elem.style.width = monsterBomb.width + "px";
  monsterBomb.elem.style.height = monsterBomb.height + "px";
  monster.elem.parentNode.insertBefore(monsterBomb.elem, monster.elem);
  monsterBomb.elem.style.transform = "translate(" + monsterBomb.x + "px, " + monsterBomb.y + "px)";
  monsterBombs.push(monsterBomb);
}

function moveSpaceship() {
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

function checkCollisions(){
  _.forEach(monsters, (monster) => {
    _.forEach(bullets, (bullet) => {
      if(typeof bullet !== "undefined" && typeof bullet.elem !== "undefined" &&
          typeof monster !== "undefined" && typeof monster.elem !== "undefined"){
        if (collisionAABB(bullet, monster)) {
          score.value += 10;
          createBoum(monster);
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
        // createBoum(monster);
        // createBoum(spaceship);
        return false;
      }
    }
  });
  _.forEach(monsterBombs, (monsterBomb) => {
    _.forEach(bullets, (bullet) => {
      if(typeof bullet !== "undefined" && typeof bullet.elem !== "undefined" &&
        typeof monsterBomb !== "undefined" && typeof monsterBomb.elem !== "undefined"){
        if (collisionAABB(bullet, monsterBomb)) {
          score.value += 5;
          createMiniBoum(monsterBomb);
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
          // createBoum(monsterBombs);
          // createBoum(spaceship);
          resetGame();
          return false;
        }
      }
    });
  });
}

function checkMonsterPosition(){
  _.forEach(monsters, (monster) => {
    if(typeof monster !== "undefined"){
      if(monster.y > monsterBottomLimit){
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

  var k = [KEY_UP, KEY_UP, KEY_DOWN, KEY_DOWN, KEY_LEFT, KEY_RIGHT, KEY_LEFT, KEY_RIGHT, KEY_b, KEY_a],
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
        bulletHz = 10;
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

  _.forEach(bullets, (bullet) => {
    if(typeof bullet !== "undefined" && typeof bullet.elem !== "undefined"){
      bullet.elem.remove();
    }
  });

  _.forEach(monsters, (monster) => {
    if(typeof monster !== "undefined" && typeof monster.elem !== "undefined"){
      monster.elem.remove();
    }
  });

  _.forEach(monsterBombs, (monsterBomb) => {
    if(typeof monsterBomb !== "undefined" && typeof monsterBomb.elem !== "undefined"){
      monsterBomb.elem.remove();
    }
  });

  spaceship.x = (screen.width - spaceshipWidth) / 2;
  spaceship.y = screen.height - spaceshipHeight - 4;

}

function checkWinState(){
  if(_.isArray(monsters) && monsters.length === 0 && _.isArray(monsterBombs) && monsterBombs.length === 0){
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
