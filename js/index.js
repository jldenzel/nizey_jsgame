import Paddle from "/js/paddle.js";
import InputHandler from "/js/input.js";
import Ball from "/js/ball.js";
import { buildLevel, level1, level2, level3, level4 } from "/js/levels.js";


const playBtn = document.querySelector('.play');
const muteBtn = document.querySelector('.mute');


let id;

let assets;

const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3,
  NEWLEVEL: 4,
  RESTART: 5,
  WIN : 6
};

export default class Game {
  constructor(gameWidth, gameHeight,) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.gamestate = GAMESTATE.MENU;
    this.ball = new Ball(this);
    this.paddle = new Paddle(this);
    this.gameObjects = [];
    this.bricks = [];
    this.lives = 3;

    this.levels = [level1, level2, level3, level4];
    this.currentLevel = 0;
    this.Level = 1;

    new InputHandler(this.paddle, this);
  }


  start() {

    loadAssets(game.sound);


    if (this.gamestate !== GAMESTATE.MENU){
    }
    if (
      this.gamestate !== GAMESTATE.MENU &&
      this.gamestate !== GAMESTATE.NEWLEVEL
    )
      return;


    this.bricks = buildLevel(this, this.levels[this.currentLevel]);
    
    this.ball.reset();
    this.gameObjects = [this.ball, this.paddle];
    console.log(this.paddle)

    this.gamestate = GAMESTATE.RUNNING;
    
    this.sound();

  }

  update(deltaTime) {


    //Si on a plus de vie -> GAMEOVER
    if (this.lives === 0) this.gamestate = GAMESTATE.GAMEOVER;

    if (this.currentLevel === 3 && this.bricks.length === 0 ){
      this.currentLevel ===0;
      this.gamestate = GAMESTATE.WIN;
    }
  
    if (
      this.gamestate === GAMESTATE.PAUSED ||
      this.gamestate === GAMESTATE.MENU ||
      this.gamestate === GAMESTATE.GAMEOVER ||
      this.gamestate === GAMESTATE.WIN

    )
      return;
    
    
    if (this.bricks.length === 0 && this.currentLevel !=3) {
      this.currentLevel++;
      console.log(this.currentLevel);

      
      this.gamestate = GAMESTATE.NEWLEVEL;
      this.start();
    }
    console.log(this.currentLevel);
    [...this.gameObjects, ...this.bricks].forEach(object =>
      object.update(deltaTime)
    );

    this.bricks = this.bricks.filter(brick => !brick.markedForDeletion);

    if (this.currentLevel === 0) {
      GAMESTATE.GAMEOVER;
    }


  }
  sound(){


    assets = assetsLoaded;

    playBtn.onclick = function() { id = assets.fond.play(); }
    muteBtn.onclick = function() { assets.fond.mute(true, id); }

  }

  showGameStats(){
    // Stats du jeu
    ctx.fillStyle = "black";
    ctx.font = "25px CranberryBlues";
    ctx.fillText("LIFES : ", 65, 25);
    ctx.fillText(this.lives, 115, 25);
    ctx.fillText("SCORE :  ", 360, 25)
    ctx.fillText(this.currentLevel * 10, 420, 25)
    ctx.fillText("LEVEL : ", 700, 25)
    ctx.fillText(this.currentLevel + 1, 760, 25)

}

  draw(ctx) {
    [...  this.gameObjects, ...this.bricks].forEach(object => object.draw(ctx));

    if (this.gamestate === GAMESTATE.PAUSED) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fill();

      ctx.font = "30px CranberryBlues";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("PAUSE    ", this.gameWidth / 2, this.gameHeight / 2);
    }

    if (this.gamestate === GAMESTATE.MENU) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(232,236,241,1)";
      ctx.fill();

      ctx.font = "30px";
      ctx.fillStyle = "blue";
      ctx.textAlign = "center";
      ctx.fillText(
        "Press SPACEBAR to start playing",
        this.gameWidth / 2,
        this.gameHeight / 2
      );
    }
    if (this.gamestate === GAMESTATE.GAMEOVER) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(232,236,241,1)";
      ctx.fill();

      ctx.font = "30px";
      ctx.fillStyle = "blue";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER :/ Press ENTER to return to the home page", this.gameWidth / 2, this.gameHeight / 2);

    }

    if (this.gamestate === GAMESTATE.WIN) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(232,236,241,1)";
      ctx.fill();

      ctx.font = "50px";
      ctx.fillStyle = "blue";
      ctx.textAlign = "center";
      ctx.fillText("CONGRATS You finished the game !! Press ENTER", this.gameWidth / 2, this.gameHeight / 2);

    }
  }

  togglePause() {
    if (this.gamestate == GAMESTATE.PAUSED) {
      this.gamestate = GAMESTATE.RUNNING;
    } else {
      this.gamestate = GAMESTATE.PAUSED;
    }

  }
  
  restart() {
    location.reload();
  }


}

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");



const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;


let game = new Game(GAME_WIDTH, GAME_HEIGHT);

let lastTime = 0;

function gameLoop(timestamp) {
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  game.update(deltaTime);
  game.draw(ctx);
  game.showGameStats();
  

  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);