# Flappy Bird Game

A browser-based implementation of the classic Flappy Bird game using HTML, CSS, and JavaScript.

## Features

- High-level graphics with canvas rendering
- Responsive controls (keyboard, mouse, touch)
- Game state management (start screen, gameplay, game over screen)
- Score tracking
- Collision detection
- Animated bird and pipe obstacles
- Beautiful city background with buildings, cars, and flying birds
- Progressive difficulty that increases with your score

## How to Play

1. Open `index.html` in a web browser
2. Click the "Start Game" button or press the Space bar / Up arrow key
3. Control the bird:
   - Click the screen
   - Press the Space bar
   - Press the Up arrow key
4. Navigate through the pipes without hitting them
5. Each pipe you pass earns you 1 point
6. The game becomes faster every 10 points
7. Try to achieve the highest score possible

## Play Online

You can play the game online at [https://nihal27055.github.io/flappy_bird/](https://nihal27055.github.io/flappy_bird/)

## Game Controls

- **Space / Up Arrow / Click**: Make the bird flap its wings and go up
- **Start Button**: Begin the game
- **Play Again Button**: Restart the game after Game Over

## Files

- `index.html`: The main HTML file containing the game structure
- `style.css`: CSS file for styling the game interface
- `script.js`: JavaScript file with game logic and mechanics

## Game Mechanics

- The bird constantly falls due to gravity
- Pressing the flap controls makes the bird jump upward
- Pipes appear from the right side of the screen and move to the left
- Colliding with pipes or the ground ends the game
- Each successfully passed pipe pair adds 1 to your score
- Game speed increases gradually as your score increases
- Your high score is recorded and displayed when the game ends

## Development
This game was created using:
- HTML5 Canvas for rendering
- JavaScript for game logic
- CSS for styling

## License

Feel free to modify and use this code for personal and educational purposes.

---

Enjoy the game! 