let blocks = Array.from({length: 15}, (_, i) => i + 1);
let displacedBlock = null;
let timerInterval = null;
let startTime = null;

function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (startTime === null) {
        startTime = Date.now();
        timerInterval = setInterval(() => {
            const currentTime = Date.now();
            const elapsedTime = currentTime - startTime;
            document.getElementById('timer').textContent = `Time: ${formatTime(elapsedTime)}`;
        }, 100);
    }
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createBlock(number) {
    const block = document.createElement('div');
    block.className = 'block';
    block.textContent = number;
    block.draggable = true;
    
    block.addEventListener('dragstart', handleDragStart);
    block.addEventListener('dragend', handleDragEnd);
    
    return block;
}

function updateSlideButtons() {
    // Disable slide buttons if there's a displaced block
    const buttons = document.querySelectorAll('.slide-button');
    buttons.forEach(button => {
        button.disabled = displacedBlock !== null;
    });
}

function initializeGame() {
    shuffleArray(blocks);
    const rows = document.querySelectorAll('.row');
    
    rows.forEach((row, rowIndex) => {
        row.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const blockNumber = blocks[rowIndex * 5 + i];
            const block = createBlock(blockNumber);
            row.appendChild(block);
        }
        
        row.addEventListener('dragover', handleDragOver);
        row.addEventListener('drop', handleDrop);
    });

    document.getElementById('displacedBlock').innerHTML = '';
    displacedBlock = null;
    document.getElementById('winMessage').style.display = 'none';
    document.getElementById('timer').textContent = 'Time: 0:00';
    startTime = null;
    stopTimer();
    updateSlideButtons();
}

function slideRow(rowIndex) {
    if (displacedBlock !== null) return; // Don't slide if there's already a displaced block
    
    startTimer(); // Start timer on first move
    
    const row = document.querySelector(`[data-row="${rowIndex}"]`);
    const blocks = Array.from(row.children);
    
    if (blocks.length === 0) return;
    
    // Get the first block
    const firstBlock = blocks[0];
    
    // Add sliding animation class
    firstBlock.classList.add('sliding-out');
    
    // Wait for animation to complete before moving block
    setTimeout(() => {
        // Move it to displaced area
        document.getElementById('displacedBlock').innerHTML = '';
        document.getElementById('displacedBlock').appendChild(firstBlock);
        firstBlock.classList.remove('sliding-out');
        displacedBlock = parseInt(firstBlock.textContent);
        
        // Update slide buttons
        updateSlideButtons();
    }, 300); // Match the transition duration from CSS
}

function handleDragStart(e) {
    // Only allow dragging from displaced area
    if (e.target.parentElement.id === 'displacedBlock') {
        startTimer(); // Start timer on first move
        e.target.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.target.textContent);
        e.dataTransfer.effectAllowed = 'move';
    } else {
        e.preventDefault();
    }
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e) {
    e.preventDefault();
    const row = e.target.closest('.row');
    if (!row || !displacedBlock) return;

    const sourceBlock = document.querySelector('.block.dragging');
    if (!sourceBlock || sourceBlock.parentElement.id !== 'displacedBlock') return;

    // Create new block and add sliding-in class
    const droppedNumber = parseInt(sourceBlock.textContent);
    const newBlock = createBlock(droppedNumber);
    newBlock.classList.add('sliding-in');
    
    // Insert at end of row
    row.appendChild(newBlock);
    
    // Remove sliding-in class after a frame to trigger animation
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            newBlock.classList.remove('sliding-in');
        });
    });
    
    // Get current blocks in the row
    const targetBlocks = Array.from(row.children);
    
    // If this row only had 4 blocks (the row we took from), just clear displaced area
    if (targetBlocks.length === 5) {
        document.getElementById('displacedBlock').innerHTML = '';
        displacedBlock = null;
    } else {
        // Otherwise, animate and move the first block to displaced area
        const firstBlock = targetBlocks[0];
        if (firstBlock && firstBlock !== newBlock) {
            firstBlock.classList.add('sliding-out');
            setTimeout(() => {
                document.getElementById('displacedBlock').innerHTML = '';
                const newDisplacedBlock = createBlock(firstBlock.textContent);
                document.getElementById('displacedBlock').appendChild(newDisplacedBlock);
                displacedBlock = parseInt(firstBlock.textContent);
                firstBlock.remove();
            }, 300);
        }
    }
    
    sourceBlock.remove();
    updateSlideButtons();
    checkWinCondition();
}

function checkWinCondition() {
    const rows = document.querySelectorAll('.row');
    let isWin = true;

    rows.forEach((row, rowIndex) => {
        const numbers = Array.from(row.children).map(block => parseInt(block.textContent));
        const start = rowIndex * 5 + 1;
        const expectedNumbers = Array.from({length: 5}, (_, i) => start + i);
        
        if (!numbers.every((num, i) => num === expectedNumbers[i])) {
            isWin = false;
        }
    });

    if (isWin && !displacedBlock) {
        document.getElementById('winMessage').style.display = 'block';
        stopTimer(); // Stop the timer when won
    }
}

function resetGame() {
    initializeGame();
}

// Initialize the game when the page loads
window.addEventListener('load', initializeGame);