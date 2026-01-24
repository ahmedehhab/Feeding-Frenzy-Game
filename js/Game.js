import Player from './Player.js';
import EnemyFish from './EnemyFish.js';
import Spawner from './Spawner.js';
import Shark from './Shark.js';
import Bomb from './Bomb.js';
import { CONFIG } from '../config/config.js';

export default class Game {
  constructor(container) {
    this.container = container;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    
    this.state = 'STORY'; // Start with story
    this.mouseX = this.width / 2;
    this.mouseY = this.height / 2;
    
    const playerImages = [
      'assets/characters/hero1_right_closed.png',
      'assets/characters/hero2_right_closed.png',
      'assets/characters/hero3_right_closed.png',
      'assets/characters/hero4_right_closed.png'
    ];
    
    this.player = new Player(this.width / 2, this.height / 2, playerImages);
    this.enemies = [];
    this.sharks = [];
    this.bombs = [];
    this.spawner = new Spawner();

    this.lastSpawnTime = 0;
    this.spawnInterval = 2000;
    this.maxEnemies = 6;
    this.frameCount = 0;

    this.apexSpawned = false;
    this.storySlide = 0;
    
    this.createProgressBar();
    this.setupInput();
    this.setupStory();
    this.setupEndScreen();
  }
  
  setupStory() {
    this.updateStorySlide();
    
    document.getElementById('next-btn').addEventListener('click', () => {
      this.storySlide++;
      if (this.storySlide < CONFIG.STORY_SLIDES.length) {
        this.updateStorySlide();
        
        // Change button text to "PLAY" on last slide
        if (this.storySlide === CONFIG.STORY_SLIDES.length - 1) {
          document.getElementById('next-btn').textContent = 'PLAY';
        }
      } else {
        this.showLoadingTransition();
      }
    });
    
    document.getElementById('skip-btn').addEventListener('click', () => {
      this.showLoadingTransition();
    });
  }
  
  updateStorySlide() {
    const slide = CONFIG.STORY_SLIDES[this.storySlide];
    document.getElementById('story-title').textContent = slide.title;
    document.getElementById('story-text').textContent = slide.text;
    document.getElementById('story-avatar').src = slide.imgSrc;
  }
  
  showLoadingTransition() {
    document.getElementById('story-container').classList.add('hidden');
    const transition = document.getElementById('bubble-transition');
    transition.classList.remove('hidden');
    
    setTimeout(() => {
      transition.classList.add('hidden');
      document.getElementById('ui-layer').classList.remove('hidden');
      this.start();
    }, 2600);
  }
  
  setupEndScreen() {
    document.getElementById('restart-btn').addEventListener('click', () => {
      this.restart();
    });
  }
  
  restart() {
    // Clear all entities
    this.enemies.forEach(e => e.destroy());
    this.sharks.forEach(s => s.destroy());
    this.bombs.forEach(b => b.destroy());
    
    this.enemies = [];
    this.sharks = [];
    this.bombs = [];
    this.frameCount = 0;
    this.apexSpawned = false;
    
    // Reset player
    this.player.reset();
    
    // Hide end screen
    document.getElementById('end-screen').classList.add('hidden');
    
    // Start game
    this.start();
  }
  
  spawnEnemy() {
    if (this.enemies.length >= this.maxEnemies) return;

    const enemy = this.spawner.spawn(this.player.level);
    this.enemies.push(enemy);
  }
  
  spawnShark() {
    if (this.sharks.length >= CONFIG.SHARK.MAX_COUNT) return;
    if (this.frameCount % CONFIG.SHARK.SPAWN_INTERVAL !== 0) return;
    
    const direction = Math.random() > 0.5 ? CONFIG.DIRECTION.RIGHT : CONFIG.DIRECTION.LEFT;
    const shark = new Shark(direction);
    this.sharks.push(shark);
  }
  
  spawnBomb() {
    if (this.frameCount % CONFIG.BOMB.SPAWN_INTERVAL !== 0) return;
    
    const bomb = new Bomb();
    this.bombs.push(bomb);
  }
  
  setupInput() {
    this.container.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    });
  }
  
  start() {
    this.state = 'PLAYING';
    this.updateUI();
    
    // Show Level 1 announcement at start
    const announcement = document.createElement('div');
    announcement.className = 'level-announcement';
    announcement.textContent = 'LEVEL 1';
    document.querySelector('#game').appendChild(announcement);
    
    setTimeout(() => {
      announcement.remove();
    }, 2000);
    
    // Spawn initial batch
    for(let i = 0; i < 5; i++) this.spawnEnemy();
    this.gameLoop();
  }
  
  gameLoop() {
    this.update();
    if (this.state === 'PLAYING') {
      requestAnimationFrame(() => this.gameLoop());
    }
  }
  
  update() {
    this.frameCount++;
    
    this.player.update(this.mouseX, this.mouseY);
    
    // Spawn new enemies
    const currentTime = Date.now();
    if (currentTime - this.lastSpawnTime >= this.spawnInterval) {
      this.spawnEnemy();
      this.lastSpawnTime = currentTime;
    }

    // Spawn sharks and bombs
    this.spawnShark();
    this.spawnBomb();

    // Update all enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      this.enemies[i].update();
    }
    
    // Update sharks
    for (let i = this.sharks.length - 1; i >= 0; i--) {
      this.sharks[i].update();
      
      // Remove offscreen sharks
      if (this.sharks[i].isOffscreen()) {
        this.sharks[i].destroy();
        this.sharks.splice(i, 1);
      }
    }
    
    // Update bombs
    for (let i = this.bombs.length - 1; i >= 0; i--) {
      this.bombs[i].update();
      
      // Remove offscreen bombs
      if (this.bombs[i].isOffscreen()) {
        this.bombs[i].destroy();
        this.bombs.splice(i, 1);
      }
    }
    
    this.cleanupOffscreenEnemies();

    // Spawn APEX when player reaches Level 3
    if (this.player.level === CONFIG.SIZE.LARGE && !this.apexSpawned) {
      this.apexSpawned = true;
      const apex = this.spawner.spawnApex();
      this.enemies.push(apex);
    }
    
    this.checkPlayerCollisions();
    this.checkSharkCollisions();
    this.checkBombCollisions();
    this.checkEnemyCollisions();
  }

  cleanupOffscreenEnemies() {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      if (enemy.x < -200 || enemy.x > CONFIG.CANVAS_WIDTH + 200) {
        enemy.destroy();
        this.enemies.splice(i, 1);
      }
    }
  }

  checkPlayerCollisions() {
    if (this.state !== 'PLAYING') return;

    const player = this.player;
    const playerCenterX = player.x + player.width / 2;

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      const enemyCenterX = enemy.x + enemy.width / 2;

      const tolerance = 0.4;
      const playerLeft = player.x + player.width * tolerance;
      const playerRight = player.x + player.width * (1 - tolerance);
      const playerTop = player.y + player.height * tolerance;
      const playerBottom = player.y + player.height * (1 - tolerance);

      const enemyLeft = enemy.x + enemy.width * tolerance;
      const enemyRight = enemy.x + enemy.width * (1 - tolerance);
      const enemyTop = enemy.y + enemy.height * tolerance;
      const enemyBottom = enemy.y + enemy.height * (1 - tolerance);

      const isColliding = 
        playerLeft < enemyRight &&
        playerRight > enemyLeft &&
        playerTop < enemyBottom &&
        playerBottom > enemyTop;

      if (!isColliding) continue;

      if (player.level >= enemy.level) {
        const isFacing = 
          (player.direction === CONFIG.DIRECTION.RIGHT && enemyCenterX > playerCenterX) ||
          (player.direction === CONFIG.DIRECTION.LEFT && enemyCenterX < playerCenterX);

        if (isFacing) {
          const previousLevel = player.level;
          
          enemy.destroy();
          this.enemies.splice(i, 1);
          player.grow();
          this.updateProgressBar();
          this.updateUI();
          
          if (player.level > previousLevel) {
            const newEnemyLevel = player.level + 1;
            const newEnemy = this.spawner.spawnByLevel(newEnemyLevel);
            if (newEnemy) {
              this.enemies.push(newEnemy);
            }
          }
          
          if (player.score >= CONFIG.THRESHOLD.WIN) {
            this.win();
            return;
          }
        }
      } else {
        enemy.openMouth();
        this.gameOver('You were eaten by a bigger fish!');
        return;
      }
    }
  }
  
  checkSharkCollisions() {
    if (this.state !== 'PLAYING') return;
    
    const player = this.player;
    
    // Check shark vs player
    for (let shark of this.sharks) {
      if (shark.isWarning) continue; // Skip if still in warning phase
      
      const tolerance = 0.3;
      const playerLeft = player.x + player.width * tolerance;
      const playerRight = player.x + player.width * (1 - tolerance);
      const playerTop = player.y + player.height * tolerance;
      const playerBottom = player.y + player.height * (1 - tolerance);

      const sharkLeft = shark.x + shark.width * tolerance;
      const sharkRight = shark.x + shark.width * (1 - tolerance);
      const sharkTop = shark.y + shark.height * tolerance;
      const sharkBottom = shark.y + shark.height * (1 - tolerance);

      const isColliding = 
        playerLeft < sharkRight &&
        playerRight > sharkLeft &&
        playerTop < sharkBottom &&
        playerBottom > sharkTop;

      if (isColliding) {
        this.gameOver('You were eaten by a SHARK!');
        return;
      }
    }
    
    // Check shark vs enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      
      for (let shark of this.sharks) {
        if (shark.isWarning) continue; // Skip if still in warning phase
        
        const tolerance = 0.3;
        const enemyLeft = enemy.x + enemy.width * tolerance;
        const enemyRight = enemy.x + enemy.width * (1 - tolerance);
        const enemyTop = enemy.y + enemy.height * tolerance;
        const enemyBottom = enemy.y + enemy.height * (1 - tolerance);

        const sharkLeft = shark.x + shark.width * tolerance;
        const sharkRight = shark.x + shark.width * (1 - tolerance);
        const sharkTop = shark.y + shark.height * tolerance;
        const sharkBottom = shark.y + shark.height * (1 - tolerance);

        const isColliding = 
          enemyLeft < sharkRight &&
          enemyRight > sharkLeft &&
          enemyTop < sharkBottom &&
          enemyBottom > sharkTop;

        if (isColliding) {
          enemy.destroy();
          this.enemies.splice(i, 1);
          break;
        }
      }
    }
  }
  
  checkBombCollisions() {
    if (this.state !== 'PLAYING') return;
    
    for (let i = this.bombs.length - 1; i >= 0; i--) {
      const bomb = this.bombs[i];
      if (bomb.exploded) continue;
      
      // Check bomb vs player
      if (bomb.checkCollision(this.player)) {
        bomb.explode();
        this.gameOver('You hit a BOMB!');
        return;
      }
      
      // Check bomb vs enemies
      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const enemy = this.enemies[j];
        if (bomb.checkCollision(enemy)) {
          bomb.explode();
          enemy.destroy();
          this.enemies.splice(j, 1);
          break;
        }
      }
      
      // Check bomb vs sharks - الشارك يختفي لو القنبلة خبطت فيه
      for (let k = this.sharks.length - 1; k >= 0; k--) {
        const shark = this.sharks[k];
        if (bomb.checkCollision(shark)) {
          bomb.explode();
          shark.destroy();
          this.sharks.splice(k, 1);
          break;
        }
      }
    }
  }

  gameOver(message) {
    this.state = 'GAME_OVER';
    
    document.getElementById('end-title').textContent = 'GAME OVER';
    document.getElementById('end-msg').innerHTML = `${message}<br>Final Score: ${this.player.score}`;
    document.getElementById('end-screen').classList.remove('hidden');
  }

  win() {
    this.state = 'WIN';
    
    // Show VICTORY announcement
    const announcement = document.createElement('div');
    announcement.className = 'level-announcement';
    announcement.textContent = 'VICTORY!';
    document.querySelector('#game').appendChild(announcement);
    
    setTimeout(() => {
      announcement.remove();
      document.getElementById('end-title').textContent = 'VICTORY!';
      document.getElementById('end-msg').innerHTML = `You are the Ocean King!<br>Final Score: ${this.player.score}`;
      document.getElementById('end-screen').classList.remove('hidden');
    }, 2000);
  }

  createProgressBar() {
    this.progressFill = document.getElementById('progress-fill');
    this.progressText = document.getElementById('progress-text');
  }

  updateProgressBar() {
    const progress = Math.min((this.player.score / CONFIG.THRESHOLD.WIN) * 100, 100);
    this.progressFill.style.width = progress + '%';
    this.progressText.textContent = `${this.player.score} / ${CONFIG.THRESHOLD.WIN}`;
    
    const colors = [
      'linear-gradient(90deg, #4CAF50, #8BC34A)',
      'linear-gradient(90deg, #2196F3, #03A9F4)',
      'linear-gradient(90deg, #FF9800, #FFC107)',
      'linear-gradient(90deg, #E91E63, #F44336)'
    ];
    this.progressFill.style.background = colors[this.player.level] || colors[0];
  }
  
  updateUI() {
    document.getElementById('score-val').textContent = this.player.score;
    document.getElementById('level-name').textContent = CONFIG.LEVEL_NAMES[this.player.level];
    
    // Update target indicator
    const targetLevel = Math.min(this.player.level, 3);
    const targetData = this.spawner.getEnemyByLevel(targetLevel);
    
    if (targetData) {
      const targetImg = `assets/characters/${targetData.name}_right_closed.png`;
      document.getElementById('target-img').src = targetImg;
      document.getElementById('target-name').textContent = targetData.name.toUpperCase();
    }
  }
  
  checkEnemyCollisions() {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      for (let j = this.enemies.length - 1; j > i; j--) {
        const e1 = this.enemies[i];
        const e2 = this.enemies[j];

        let smallFish, bigFish;
        if (e1.weight < e2.weight) {
          smallFish = e1;
          bigFish = e2;
        } else if (e2.weight < e1.weight) {
          smallFish = e2;
          bigFish = e1;
        } else {
          continue; 
        }

        const bigFishCenter = bigFish.x + bigFish.width / 2;
        const smallFishCenter = smallFish.x + smallFish.width / 2;
        
        const isFacingSmallFish = 
          (bigFish.direction === CONFIG.DIRECTION.RIGHT && smallFishCenter > bigFishCenter) ||
          (bigFish.direction === CONFIG.DIRECTION.LEFT && smallFishCenter < bigFishCenter);
        
        if (!isFacingSmallFish) continue;

        const horizontalTolerance = bigFish.width * 0.5; 
        const horizontalOverlap = (
          smallFish.x < bigFish.x + bigFish.width - horizontalTolerance &&
          smallFish.x + smallFish.width > bigFish.x + horizontalTolerance
        );

        const verticalTolerance = bigFish.height * 0.5;
        const verticalOverlap = (
          smallFish.y < bigFish.y + bigFish.height - verticalTolerance &&
          smallFish.y + smallFish.height > bigFish.y + verticalTolerance
        );

        if (horizontalOverlap && verticalOverlap) {
          bigFish.openMouth();
          smallFish.destroy();
          if (smallFish === e1) {
            this.enemies.splice(i, 1);
            break; 
          } else {
            this.enemies.splice(j, 1);
          }
        }
      }
    }
  }
}