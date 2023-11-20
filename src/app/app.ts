import { Bonus } from './class/Bonus';
import { BonusIcon } from './class/BonusIcon';
import { Boum } from './class/Boum';
import { Bullet } from './class/Bullet';
import { DomElem } from './class/DomElem';
import { Hearts } from './class/Hearts';
import { MiniBoum } from './class/MiniBoum';
import { Monster } from './class/Monster';
import { MonsterBomb } from './class/MonsterBomb';
import { Screen } from './class/Screen';
import { Sound } from './class/Sound';
import { Spaceship } from './class/Spaceship';
import { Utils } from './class/Utils';

export interface Elem {
  elem: Element | HTMLElement | null;
  value?: unknown;
}

export const KEY_LEFT: string = 'ArrowLeft';
export const KEY_RIGHT: string = 'ArrowRight';
export const KEY_UP: string = 'ArrowUp';
export const KEY_DOWN: string = 'ArrowDown';
export const KEY_ECHAP: string = 'Escape';
export const KEY_SPACE: string = 'Space';

export class App {
  public screen: Screen = new Screen();

  public requestId!: number | undefined;
  public pause: boolean = true;
  public gameStarted: boolean = false;

  public bulletTimeout: number | null = null;
  public bullets: Bullet[] = [];
  public monsters: Monster[] = [];
  public monsterBombs: MonsterBomb[] = [];
  public bonuss: Bonus[] = [];

  public gameHasSound: boolean = true;

  public sound: Sound = new Sound();

  public spaceship: Spaceship = new Spaceship();

  public buttonPause: Elem = {
    elem: document.querySelector('.buttonPause'),
  };

  public buttonSoundContainer: Elem = {
    elem: document.querySelector('.buttonSoundContainer'),
  };
  public buttonSound: Elem = {
    elem: document.querySelector('.buttonSound'),
  };

  public buttonStart: Elem = {
    elem: document.querySelector('.buttonStart'),
  };

  public buttonReStart: Elem = {
    elem: document.querySelector('.buttonReStart'),
  };

  public buttonContinue: Elem = {
    elem: document.querySelector('.buttonContinue'),
  };

  public score: Elem = {
    elem: document.querySelector('.score'),
    value: 0,
  };

  public health: Elem = {
    elem: document.querySelector('.health'),
  };

  public BonusIconContainer: Elem = {
    elem: document.querySelector('.BonusIconsContainer'),
  };

  public menu: Elem = {
    elem: document.querySelector('.menu'),
  };

  public result: Elem = {
    elem: document.querySelector('.result'),
  };
  public win: Elem = {
    elem: document.querySelector('.win'),
  };
  public loose: Elem = {
    elem: document.querySelector('.loose'),
  };
  public keyInfo: Elem = {
    elem: document.querySelector('.keyInfo'),
  };

  constructor() {
    this.addEventListeners();
  }

  public init(): void {
    this.bullets = [];
    this.monsterBombs = [];
    this.bonuss = [];
    this.score.value = 0;
    this.showElement(this.spaceship);
    new Hearts();
    this.createMonsters();
    this.loop();
  }

  public showElement(el: Elem): void {
    el.elem?.classList.remove('hide');
  }
  public showElements(els: Elem[]): void {
    els.forEach((el: Elem) => {
      this.showElement(el);
    });
  }

  public hideElement(el: Elem): void {
    el.elem?.classList.add('hide');
  }
  public hideElements(els: Elem[]): void {
    els.forEach((el: Elem) => {
      this.hideElement(el);
    });
  }

  public update(): void {
    this.spaceship.move();
    this.moveBullets();
    this.moveMonsters();
    this.chooseMonsterForBombing();
    this.moveBombMonster();
    this.randomBonus();
    this.moveBonus();
    this.spaceshipFire();
    this.spaceship.contain();
    this.checkCollisions();
    this.checkMonsterPosition();
    this.deleteOutBullet();
    this.deleteOutMonsterBombs();
    this.deleteOutBonus();
    this.checkHearts();
    this.checkWinState();
  }

  public chooseMonsterForBombing(): void {
    const rand: number = Utils.getRandomInt(1, 1000);
    if (rand < 10) {
      const randMonster: number = Utils.getRandomInt(1, this.monsters.length - 1);
      this.createMonsterBomb(this.monsters[randMonster]);
    }
  }

  public randomBonus(): void {
    const rand: number = Utils.getRandomInt(1, 1000);
    if (rand < 10 && this.bonuss.length < 2) {
      this.createBonus();
    }
  }

  public render(): void {
    if (this.spaceship.elem) {
      (this.spaceship.elem as HTMLElement).style.transform = 'translate(' + this.spaceship.x + 'px, ' + this.spaceship.y + 'px)';
    }

    this.bullets.forEach((bullet) => {
      bullet.elem.style.transform = 'translate(' + bullet.x + 'px, ' + bullet.y + 'px)';
    });

    this.monsters.forEach((monster) => {
      monster.elem.style.transform = 'translate(' + monster.x + 'px, ' + monster.y + 'px)';
    });

    this.monsterBombs.forEach((monsterBomb) => {
      monsterBomb.elem.style.transform = 'translate(' + monsterBomb.x + 'px, ' + monsterBomb.y + 'px)';
    });

    this.bonuss.forEach((bonus) => {
      bonus.elem.style.transform = 'translate(' + bonus.x + 'px, ' + bonus.y + 'px)';
    });

    if (this.score.elem) {
      this.score.elem.innerHTML = 'Score : ' + this.score.value;
    }
  }

  public loop(): void {
    if (!this.pause) {
      this.requestId = requestAnimationFrame(this.loop.bind(this));
      this.update();
      this.render();
    }
  }

  public spaceshipFire(): void {
    if (this.spaceship.fire && this.bulletTimeout === null) {
      const bullet: Bullet = new Bullet('center');
      this.bullets.push(bullet);

      if (this.gameHasSound) {
        this.sound.playLaser();
      }

      if (this.spaceship.tripleFire) {
        const bulletLeft: Bullet = new Bullet('left');
        this.bullets.push(bulletLeft);

        const bulletRight: Bullet = new Bullet('right');
        this.bullets.push(bulletRight);
      }
      this.bulletTimeout = setTimeout(() => {
        clearTimeout(this.bulletTimeout ?? 0);
        this.bulletTimeout = null;
      }, Bullet.getHz()) as unknown as number;
    }
  }

  public createMonsters(): void {
    this.monsters = [];
    for (let i = 0; i < Monster.getLineOfMonster(); i++) {
      for (let j = 0; j < Monster.getMonstersByLine(); j++) {
        const monster: Monster = new Monster(i, j);
        this.monsters.push(monster);
      }
    }
  }

  public createMonsterBomb(monster: Monster): void {
    if (typeof monster === 'undefined') {
      return;
    }
    const monsterBomb: MonsterBomb = new MonsterBomb(monster);
    this.monsterBombs.push(monsterBomb);
  }

  public createBonus(): void {
    if (!this.gameStarted) {
      return;
    }
    const bonus: Bonus = new Bonus();
    this.bonuss.push(bonus);
  }

  public moveSpaceship(): void {
    this.spaceship.move();
  }

  public moveBullets(): void {
    this.bullets.forEach((bullet) => {
      bullet.move();
    });
  }

  public moveMonsters(): void {
    this.monsters.forEach((monster) => {
      monster.move();
    });
  }

  public moveBombMonster(): void {
    this.monsterBombs.forEach((monsterBomb) => {
      monsterBomb.move();
    });
  }

  public moveBonus(): void {
    this.bonuss.forEach((bonus: Bonus) => {
      bonus.move();
    });
  }

  public deleteOutBullet(): void {
    this.bullets.forEach((bullet: Bullet) => {
      if (typeof bullet !== 'undefined' && typeof bullet.elem !== 'undefined') {
        if (bullet.y < 0) {
          bullet.remove();
          this.bullets = this.bullets.filter((bullet_) => bullet_ !== bullet);
        }
      }
    });
  }

  public deleteOutMonsterBombs(): void {
    this.monsterBombs.forEach((monsterBomb: MonsterBomb) => {
      if (typeof monsterBomb !== 'undefined' && typeof monsterBomb.elem !== 'undefined') {
        if (monsterBomb.y - monsterBomb.height > this.screen.height) {
          // explosion de la bombe sur le sol.
          new MiniBoum(monsterBomb);
          if (monsterBomb.y > this.screen.height) {
            monsterBomb.remove();
            this.monsterBombs = this.monsterBombs.filter((monsterBomb_) => monsterBomb_ !== monsterBomb);
          }
        }
      }
    });
  }

  public deleteOutBonus(): void {
    this.bonuss.forEach((bonus: Bonus) => {
      if (typeof bonus !== 'undefined' && typeof bonus.elem !== 'undefined') {
        if (bonus.y > this.screen.height) {
          bonus.remove();
          this.bonuss = this.bonuss.filter((bonus_) => bonus_ !== bonus);
        }
      }
    });
  }

  public checkCollisions(): void {
    this.monsters.forEach((monster: Monster) => {
      //monster => buller
      this.bullets.forEach((bullet: Bullet) => {
        if (
          typeof bullet !== 'undefined' &&
          typeof bullet.elem !== 'undefined' &&
          bullet !== null &&
          bullet.elem !== null &&
          typeof monster !== 'undefined' &&
          typeof monster.elem !== 'undefined' &&
          monster !== null &&
          monster.elem !== null
        ) {
          if (this.collisionAABB(bullet, monster)) {
            (this.score.value as number) += monster.point;
            new Boum(monster);
            bullet.remove();
            monster.remove();
            this.bullets = this.bullets.filter((bullet_) => bullet_ !== bullet);
            this.monsters = this.monsters.filter((monster_) => monster_ !== monster);
          }
        }
      });

      //monster => spaceship
      if (typeof monster !== 'undefined' && typeof monster.elem !== 'undefined') {
        if (this.collisionAABB(this.spaceship, monster)) {
          // resetGame();
          new Boum(monster);
          monster.remove();
          this.monsters = this.monsters.filter((monster_) => monster_ !== monster);
          Hearts.looseOneHealth();
          return;
        }
      }
    });
    //bullet => monstaer
    this.monsterBombs.forEach((monsterBomb: MonsterBomb) => {
      this.bullets.forEach((bullet: Bullet) => {
        if (
          typeof bullet !== 'undefined' &&
          typeof bullet.elem !== 'undefined' &&
          typeof monsterBomb !== 'undefined' &&
          typeof monsterBomb.elem !== 'undefined'
        ) {
          if (this.collisionAABB(bullet, monsterBomb)) {
            (this.score.value as number) += monsterBomb.point;
            new MiniBoum(monsterBomb);
            bullet.remove();
            monsterBomb.remove();
            this.bullets = this.bullets.filter((bullet_) => bullet_ !== bullet);
            this.monsterBombs = this.monsterBombs.filter((monsterBomb_) => monsterBomb_ !== monsterBomb);
          }
        }
      });
      // monsterBomb => spachship
      this.monsterBombs.forEach((monsterBomb: MonsterBomb) => {
        if (typeof monsterBomb !== 'undefined' && typeof monsterBomb.elem !== 'undefined') {
          if (this.collisionAABB(this.spaceship, monsterBomb)) {
            // resetGame();
            new Boum(monsterBomb);
            monsterBomb.remove();
            this.monsterBombs = this.monsterBombs.filter((monsterBomb_) => monsterBomb_ !== monsterBomb);
            Hearts.looseOneHealth();
            return;
          }
        }
      });
    });
    //bonus => spaceship
    this.bonuss.forEach((bonus: Bonus) => {
      if (typeof bonus !== 'undefined' && typeof bonus.elem !== 'undefined') {
        if (this.collisionAABB(this.spaceship, bonus)) {
          new Boum(bonus);
          Bonus.rasAllBonus();
          Bonus.setActiveBonus(bonus);
          bonus.displayIcon();
          bonus.remove();
          this.bonuss = this.bonuss.filter((bonus_) => bonus_ !== bonus);
        }
      }
    });
  }

  public checkMonsterPosition(): void {
    this.monsters.forEach((monster: Monster) => {
      if (typeof monster !== 'undefined') {
        if (monster.y > Monster.getMonsterBottomLimit()) {
          this.resetGame();
          return;
        }
      }
    });
  }

  public collisionAABB(r1: DomElem, r2: DomElem): boolean {
    if (
      !(
        (
          r1.y + r1.height < r2.y || // rect1 is above rect2
          r1.x > r2.x + r2.width || // rect1 is on the right of rect2
          r1.y > r2.y + r2.height || // rect1 is below rect2
          r1.x + r1.width < r2.x
        ) // rect1 is on the left of rect2
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  public addEventListeners(): void {
    window.addEventListener('keydown', (event) => {
      if (event.code === KEY_LEFT) {
        this.spaceship.moveLeft = true;
      }
      if (event.code === KEY_RIGHT) {
        this.spaceship.moveRight = true;
      }
      if (event.code === KEY_UP) {
        this.spaceship.moveUp = true;
      }
      if (event.code === KEY_DOWN) {
        this.spaceship.moveDown = true;
      }
      if (event.code === KEY_SPACE) {
        this.spaceship.fire = true;
      }
      if (event.code === KEY_ECHAP) {
        if (this.gameStarted) {
          if (this.pause) {
            this.continueGame();
          } else {
            this.pauseGame();
          }
        }
      }
    });

    window.addEventListener('keyup', (event) => {
      if (event.code === KEY_LEFT) {
        this.spaceship.moveLeft = false;
      } //left
      if (event.code === KEY_RIGHT) {
        this.spaceship.moveRight = false;
      } //right
      if (event.code === KEY_UP) {
        this.spaceship.moveUp = false;
      } // up
      if (event.code === KEY_DOWN) {
        this.spaceship.moveDown = false;
      } //down
      if (event.code === KEY_SPACE) {
        this.spaceship.fire = false;
      } //space
    });

    this.buttonPause.elem?.addEventListener('click', () => {
      this.pauseGame();
    });

    this.buttonStart.elem?.addEventListener('click', () => {
      this.startGame();
    });

    this.buttonReStart.elem?.addEventListener('click', () => {
      this.restartGame();
    });

    this.buttonContinue.elem?.addEventListener('click', () => {
      this.continueGame();
    });

    this.buttonSound.elem?.addEventListener('click', () => {
      this.toggleSound();
    });
  }

  public removeAllBullets() {
    this.bullets.forEach((bullet) => {
      if (typeof bullet !== 'undefined' && typeof bullet.elem !== 'undefined') {
        bullet.remove();
      }
    });
  }

  public removeAllMonsters() {
    this.monsters.forEach((monster: Monster) => {
      if (typeof monster !== 'undefined' && typeof monster.elem !== 'undefined') {
        monster.remove();
      }
    });
  }

  public removeAllMonsterBombs() {
    this.monsterBombs.forEach((monsterBomb: MonsterBomb) => {
      if (typeof monsterBomb !== 'undefined' && typeof monsterBomb.elem !== 'undefined') {
        monsterBomb.remove();
      }
    });
  }

  public removeAllBonuss() {
    this.bonuss.forEach((bonus: Bonus) => {
      if (typeof bonus !== 'undefined' && typeof bonus.elem !== 'undefined') {
        bonus.remove();
      }
    });
  }

  public resetGame() {
    window.cancelAnimationFrame(this.requestId as number);
    this.requestId = undefined;

    this.showElements([this.menu, this.buttonReStart, this.loose]);
    this.hideElements([
      this.win,
      this.score,
      this.health,
      this.buttonStart,
      this.keyInfo,
      this.buttonContinue,
      this.buttonPause,
      this.buttonSoundContainer,
    ]);

    this.gameStarted = false;

    this.removeAllBullets();
    this.removeAllMonsters();
    this.removeAllMonsterBombs();
    this.removeAllBonuss();

    Bonus.rasAllBonus();
    BonusIcon.reset();

    this.spaceship.replaceInScreen();
  }

  public checkHearts() {
    if (Hearts.getHealth() === 0) {
      Hearts.removeAll();
      this.resetGame();
    }
  }

  public checkWinState() {
    if (Array.isArray(this.monsters) && this.monsters.length === 0 && Array.isArray(this.monsterBombs) && this.monsterBombs.length === 0) {
      this.removeAllBonuss();
      this.showElements([this.menu, this.win, this.buttonReStart]);
      this.hideElements([
        this.loose,
        this.score,
        this.health,
        this.keyInfo,
        this.buttonStart,
        this.buttonContinue,
        this.buttonPause,
        this.buttonSoundContainer,
        this.spaceship,
      ]);
      this.pause = true;
      this.removeAllBullets();
      Bonus.rasAllBonus();
      BonusIcon.reset();
      this.gameStarted = false;
    }
  }

  public pauseGame() {
    this.pause = true;
    this.showElements([this.menu, this.buttonContinue, this.buttonReStart, this.keyInfo]);
    this.hideElements([this.buttonStart, this.win, this.loose]);
    this.loop();
  }

  public startGame() {
    this.pause = false;
    this.gameStarted = true;
    this.showElements([this.buttonPause, this.buttonSoundContainer, this.buttonContinue, this.buttonReStart, this.score, this.health]);
    this.hideElements([this.menu, this.keyInfo, this.buttonStart]);
    this.init();
  }

  public restartGame() {
    this.pause = false;
    this.resetGame();
    this.hideElements([this.menu]);
    this.showElements([this.buttonPause, this.buttonSoundContainer, this.score, this.health]);
    this.gameStarted = true;
    this.init();
  }

  public continueGame() {
    this.pause = false;
    this.gameStarted = true;
    this.hideElements([this.menu]);
    this.showElements([this.buttonPause, this.buttonSoundContainer]);
    this.loop();
  }

  public toggleSound() {
    this.gameHasSound = !this.gameHasSound;
    if (this.gameHasSound) {
      this.buttonSound.elem?.classList.remove('off');
      this.buttonSound.elem?.classList.add('on');
    } else {
      this.buttonSound.elem?.classList.remove('on');
      this.buttonSound.elem?.classList.add('off');
    }
  }
}
