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
        // Array to store background birds
        birds: [
            {x: 50, y: 50, direction: 1, speed: 0.5},
            {x: 150, y: 90, direction: -1, speed: 0.3},
            {x: 250, y: 70, direction: 1, speed: 0.7}
        ],
        
        // Array to store cars
        cars: [
            {x: 0, y: canvas.height - 100, color: 'red', speed: 1.5, width: 40},
            {x: 150, y: canvas.height - 95, color: 'blue', speed: 2.2, width: 45},
            {x: 300, y: canvas.height - 105, color: 'yellow', speed: 1.8, width: 35}
        ],
        
        // Buildings data
        buildings: [
            {x: 10, width: 60, height: 120, color: '#8B4513'},
            {x: 80, width: 50, height: 150, color: '#A9A9A9'},
            {x: 140, width: 70, height: 180, color: '#708090'},
            {x: 220, width: 65, height: 140, color: '#B8860B'},
            {x: 295, width: 55, height: 160, color: '#CD853F'}
        ],
        
        draw: function() {
            // Sky gradient
            const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height - 150);
            skyGradient.addColorStop(0, '#6EC9E0');  // Light blue at top
            skyGradient.addColorStop(1, '#CCEEFF');  // Lighter blue at bottom
            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height - 150);
            
            // Sun
            ctx.fillStyle = '#FDB813';
            ctx.beginPath();
            ctx.arc(canvas.width - 60, 60, 30, 0, Math.PI * 2);
            ctx.fill();
            
            // Sun rays
            ctx.strokeStyle = '#FDB813';
            ctx.lineWidth = 2;
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI / 4);
                ctx.beginPath();
                ctx.moveTo(
                    canvas.width - 60 + Math.cos(angle) * 35,
                    60 + Math.sin(angle) * 35
                );
                ctx.lineTo(
                    canvas.width - 60 + Math.cos(angle) * 45,
                    60 + Math.sin(angle) * 45
                );
                ctx.stroke();
            }
            
            // Flying birds in the background
            ctx.fillStyle = 'black';
            for (let bird of this.birds) {
                // Update bird position
                bird.x += bird.speed * bird.direction;
                if (bird.x > canvas.width + 20) bird.x = -20;
                if (bird.x < -20) bird.x = canvas.width + 20;
                
                // Draw simple bird shape (like a horizontal "V")
                ctx.beginPath();
                if (bird.direction > 0) {
                    // Flying right
                    ctx.moveTo(bird.x, bird.y);
                    ctx.lineTo(bird.x - 10, bird.y - 5);
                    ctx.lineTo(bird.x - 10, bird.y + 5);
                } else {
                    // Flying left
                    ctx.moveTo(bird.x, bird.y);
                    ctx.lineTo(bird.x + 10, bird.y - 5);
                    ctx.lineTo(bird.x + 10, bird.y + 5);
                }
                ctx.fill();
            }
            
            // Buildings
            for (let building of this.buildings) {
                // Building body
                ctx.fillStyle = building.color;
                ctx.fillRect(building.x, canvas.height - 150 - building.height, building.width, building.height);
                
                // Windows
                ctx.fillStyle = '#FFFF99';
                const windowSize = 8;
                const windowSpacing = 15;
                for (let wx = building.x + 10; wx < building.x + building.width - 10; wx += windowSpacing) {
                    for (let wy = canvas.height - 150 - building.height + 15; wy < canvas.height - 150 - 10; wy += windowSpacing) {
                        // Randomly make some windows lit, some dark
                        if (Math.random() > 0.3) {
                            ctx.fillRect(wx, wy, windowSize, windowSize);
                        }
                    }
                }
            }
            
            // Road
            ctx.fillStyle = '#555555';
            ctx.fillRect(0, canvas.height - 120, canvas.width, 40);
            
            // Road markings
            ctx.fillStyle = 'white';
            for (let x = 0; x < canvas.width; x += 40) {
                ctx.fillRect(x, canvas.height - 100, 20, 5);
            }
            
            // Cars
            for (let car of this.cars) {
                // Update car position
                car.x += car.speed;
                if (car.x > canvas.width) {
                    car.x = -car.width;
                }
                
                // Car body
                ctx.fillStyle = car.color;
                ctx.fillRect(car.x, car.y, car.width, 15);
                ctx.fillRect(car.x + 5, car.y - 10, car.width - 10, 10);
                
                // Car wheels
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.arc(car.x + 10, car.y + 15, 5, 0, Math.PI * 2);
                ctx.arc(car.x + car.width - 10, car.y + 15, 5, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Grassy area between road and foreground
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(0, canvas.height - 80, canvas.width, 20);
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
            // Speed dramatically increases at score 10, 20, 30, etc.
            // Calculate how many multiples of 10 in the score
            const scoreLevel = Math.floor(score / 10);
            
            // If score is a multiple of 10 (10, 20, 30, etc), apply high speed, otherwise normal speed
            let expectedMultiplier;
            if (score > 0 && score % 10 === 0) {
                // Apply high speed for multiple of 10
                expectedMultiplier = 10.5;
            } else {
                // Normal speed for other scores - increased base multiplier from 1.0 to 2.0
                expectedMultiplier = 2.0 + scoreLevel * 0.8; // Increased from 0.5 to 0.8 for faster progression
            }
            
            // Check if multiplier has changed
            if (expectedMultiplier !== speedMultiplier) {
                speedMultiplier = expectedMultiplier;
                this.dx = this.baseSpeed * speedMultiplier;
                
                // Make pipes appear more frequently as score increases
                pipeSpawnRate = Math.max(70, 120 - scoreLevel * 5);
                
                // Visual feedback when speed increases
                if (score > 0 && score % 10 === 0) {
                    // Flash the score to indicate speed increase
                    scoreElement.style.fontSize = '60px';
                    scoreElement.style.color = '#FF0000'; // Bright red for dramatic effect
                    // Add screen flash effect
                    document.body.style.backgroundColor = '#FFF';
                    setTimeout(function() {
                        scoreElement.style.fontSize = '40px';
                        scoreElement.style.color = 'white';
                        document.body.style.backgroundColor = '';
                    }, 300);
                }
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