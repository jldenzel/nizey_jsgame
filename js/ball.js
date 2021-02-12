import { detectCollision } from "./collisionDetection.js";


export default class Ball {
  constructor(game) {
    this.image = document.getElementById("img_ball");

    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;

    this.game = game;
    this.size = 27;
    this.radius = 27;
    this.reset();
  }

  reset() {
    this.position = { x: 11, y: 399 };
    this.speed = { x: 8, y: -7 };
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.size,
      this.size
    );
  }

  update() {
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;

    // limite à gauche et droite du canvas
    if (this.position.x + this.size > this.gameWidth || this.position.x < 0) {
      this.speed.x = -this.speed.x;
    }

    // limite au dessus du canvas
    if (this.position.y < 0) {
      this.speed.y = -this.speed.y;
    }

    // pas de limite vers le bas mais si la balle tombe on perd  une vie
    if (this.position.y + this.size > this.gameHeight ) {
      this.game.lives--;
      this.reset();
    }

    if (detectCollision(this, this.game.paddle)) {
      this.speed.y = -this.speed.y;
      this.position.y = this.game.paddle.position.y - this.size;
    }
  }
}
