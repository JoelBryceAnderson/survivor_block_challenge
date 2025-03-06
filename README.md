# Survivor Block Sliding Puzzle

This is an implementation of a puzzle challenge seen on the TV show Survivor. The goal is to arrange 15 numbered blocks into three rows in ascending order (1-5 in the first row, 6-10 in the second row, and 11-15 in the third row).

## How to Play

1. The game starts with 15 blocks randomly arranged in three rows of five blocks each.
2. To move blocks:
   - Click a "Slide Row" button to slide that row's rightmost block into the displaced area
   - Once a block is in the displaced area, you can drag it to any row
   - When you drop a block on a row:
     - The block is placed at the leftmost position of that row
     - If the row already had 5 blocks, its rightmost block moves to the displaced area
     - If the row had 4 blocks (the row you took from), the block just completes that row

3. A timer starts with your first move and runs until you solve the puzzle.
4. The puzzle is solved when:
   - Row 1 contains blocks 1-5 in order
   - Row 2 contains blocks 6-10 in order
   - Row 3 contains blocks 11-15 in order
   - No block is in the displaced area

## Features

- Drag and drop interface
- Slide animations
- Timer to track solving speed
- Win detection
- Reset game functionality

## Technical Details

- Built with vanilla JavaScript, HTML, and CSS
- Uses CSS transitions for smooth animations
- Implements HTML5 drag and drop API
- No external dependencies

## Development

This project was developed with the assistance of [Goose](https://github.com/block/goose), an AI agent created by Block. Goose helped implement the game mechanics, animations, and user interface based on the original Survivor challenge concept.

## Running Locally

Simply open `index.html` in a web browser. No server or build process required.

## License

MIT License - feel free to use and modify as you like!