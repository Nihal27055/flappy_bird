// Flappy Bird Game JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Canvas setup
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    
    // Game elements
    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('start-button');
    const scoreElement = document.getElementById('score');
    const gameOverScreen = document.getElementById('game-over');
    const finalScoreElement = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-button');
    
    // Game states
    const GAME_STATE = {
        READY: 0,
        PLAYING: 1,
        GAME_OVER: 2
    };
    
    // Game variables
    let gameState = GAME_STATE.READY;
    let score = 0;
    let frames = 0;
    let bestScore = 0;
    let speedMultiplier = 1.0;
    
    // Bird object
    const bird = {
        x: 50,
        y: canvas.height / 2,
        width: 34,
        height: 24,
        gravity: 0.15,
        velocity: 0,
        jump: 3.8,
        rotation: 0,
        
        draw: function() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            
            // Bird body
            ctx.fillStyle = '#FFD700'; // Golden yellow color
            ctx.beginPath();
            ctx.ellipse(0, 0, this.width/2, this.height/2, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Wings
            ctx.fillStyle = '#FFA500'; // Orange color for wings
            ctx.beginPath();
            ctx.ellipse(-this.width/4, 0, this.width/3, this.height/3, -Math.PI/4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(-this.width/4, 0, this.width/3, this.height/3, Math.PI/4, 0, Math.PI * 2);
            ctx.fill();
            
            // Head
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.ellipse(this.width/4, -this.height/6, this.width/3, this.height/3, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Eye
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(this.width/3, -this.height/4, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Pupil
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(this.width/3, -this.height/4, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Beak
            ctx.fillStyle = '#FFA500';
            ctx.beginPath();
            ctx.moveTo(this.width/2, -this.height/6);
            ctx.lineTo(this.width/1.5, -this.height/8);
            ctx.lineTo(this.width/1.5, -this.height/24);
            ctx.fill();
            
            ctx.restore();
        },
        
        update: function() {
            // If game is ready state, bird should float up and down
            if (gameState === GAME_STATE.READY) {
                this.y = canvas.height / 2 + Math.sin(frames / 10) * 15;
                return;
            }
            
            // Game physics when playing
            this.velocity += this.gravity;
            this.y += this.velocity;
            
            // Rotation based on velocity
            if (this.velocity >= this.jump) {
                this.rotation = Math.PI / 4; // 45 degrees down
            } else {
                this.rotation = -Math.PI / 6; // 30 degrees up
            }
            
            // Bottom boundary
            if (this.y + this.height/2 >= canvas.height - foreground.h) {
                this.y = canvas.height - foreground.h - this.height/2;
                if (gameState === GAME_STATE.PLAYING) {
                    gameState = GAME_STATE.GAME_OVER;
                    gameOver();
                }
            }
            
            // Top boundary
            if (this.y - this.height/2 <= 0) {
                this.y = this.height/2;
                this.velocity = 0;
            }
        },
        
        flap: function() {
            this.velocity = -this.jump;
        },
        
        reset: function() {
            this.velocity = 0;
            this.y = canvas.height / 2;
            this.rotation = 0;
        }
    };
    
    // Background
    const background = {
        draw: function() {
            ctx.fillStyle = '#70c5ce'; // Sky color
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw clouds
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(100, 80, 30, 0, Math.PI * 2);
            ctx.arc(130, 80, 35, 0, Math.PI * 2);
            ctx.arc(160, 80, 25, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(280, 120, 25, 0, Math.PI * 2);
            ctx.arc(310, 120, 30, 0, Math.PI * 2);
            ctx.arc(340, 120, 20, 0, Math.PI * 2);
            ctx.fill();
        }
    };
    
    // Foreground (ground)
    const foreground = {
        h: 80,
        dx: 2, // Speed of movement
        
        draw: function() {
            ctx.fillStyle = '#ded895'; // Ground color
            ctx.fillRect(0, canvas.height - this.h, canvas.width, this.h);
            
            // Draw grass
            ctx.fillStyle = '#33cc33';
            ctx.fillRect(0, canvas.height - this.h, canvas.width, 15);
        }
    };
    
    // Pipes
    const pipes = {
        position: [],
        gap: 160,
        maxYPos: -80,
        baseSpeed: 1.2, // Base speed that will be multiplied
        dx: 1.2, // Current speed
        
        draw: function() {
            for (let i = 0; i < this.position.length; i++) {
                let p = this.position[i];
                
                // Top pipe
                ctx.fillStyle = '#73c900';
                ctx.fillRect(p.x, p.y, p.width, p.height);
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2;
                ctx.strokeRect(p.x, p.y, p.width, p.height);
                
                // Bottom pipe
                ctx.fillRect(p.x, p.y + p.height + this.gap, p.width, canvas.height - (p.y + p.height + this.gap));
                ctx.strokeRect(p.x, p.y + p.height + this.gap, p.width, canvas.height - (p.y + p.height + this.gap));
            }
        },
        
        update: function() {
            if (gameState !== GAME_STATE.PLAYING) return;
            
            // Adjust speed based on score
            // Speed increases at score 10, 20, 30, etc.
            let expectedMultiplier = 1.0 + Math.floor(score / 10) * 0.1;
            if (expectedMultiplier !== speedMultiplier) {
                speedMultiplier = expectedMultiplier;
                this.dx = this.baseSpeed * speedMultiplier;
                // Make pipes appear more frequently as speed increases
                pipeSpawnRate = Math.max(80, 120 - Math.floor(score / 10) * 4);
            }
            
            if (frames % pipeSpawnRate === 0) {
                this.position.push({
                    x: canvas.width,
                    y: this.maxYPos * (Math.random() + 1),
                    width: 52,
                    height: 242
                });
            }
            
            for (let i = 0; i < this.position.length; i++) {
                let p = this.position[i];
                
                // Move the pipes to the left
                p.x -= this.dx;
                
                // Remove pipes that move off screen
                if (p.x + p.width <= 0) {
                    this.position.shift();
                    // Add score when pipe is passed
                    score += 1;
                    scoreElement.textContent = score;
                }
                
                // Collision detection with bird
                if (
                    bird.x + bird.width/2 > p.x && 
                    bird.x - bird.width/2 < p.x + p.width && 
                    (
                        bird.y - bird.height/2 < p.y + p.height || 
                        bird.y + bird.height/2 > p.y + p.height + this.gap
                    )
                ) {
                    gameState = GAME_STATE.GAME_OVER;
                    gameOver();
                }
            }
        },
        
        reset: function() {
            this.position = [];
            this.dx = this.baseSpeed; // Reset speed
            speedMultiplier = 1.0;
            pipeSpawnRate = 120;
        }
    };
    
    // Variable for pipe spawn rate
    let pipeSpawnRate = 120;
    
    // Game loops
    function render() {
        background.draw();
        pipes.draw();
        foreground.draw();
        bird.draw();
    }
    
    function update() {
        bird.update();
        if (gameState === GAME_STATE.PLAYING) {
            pipes.update();
        }
    }
    
    function loop() {
        update();
        render();
        frames++;
        requestAnimationFrame(loop);
    }
    
    // Start the game
    function startGame() {
        gameState = GAME_STATE.PLAYING;
        startScreen.style.display = 'none';
        score = 0;
        scoreElement.textContent = score;
    }
    
    // Game over
    function gameOver() {
        gameOverScreen.style.display = 'flex';
        
        // Update best score if current score is higher
        if (score > bestScore) {
            bestScore = score;
        }
        
        // Show final score and best score
        finalScoreElement.textContent = `Score: ${score}  |  Best: ${bestScore}`;
    }
    
    // Reset game
    function resetGame() {
        bird.reset();
        pipes.reset();
        gameState = GAME_STATE.READY;
        gameOverScreen.style.display = 'none';
        startScreen.style.display = 'flex';
    }
    
    // Event listeners
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', resetGame);
    
    // Keyboard controls
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            if (gameState === GAME_STATE.READY) {
                startGame();
            }
            if (gameState === GAME_STATE.PLAYING) {
                bird.flap();
            }
        }
    });
    
    // Mouse/touch controls
    canvas.addEventListener('click', function() {
        if (gameState === GAME_STATE.PLAYING) {
            bird.flap();
        }
    });
    
    // Start the game loop
    loop();
}); 