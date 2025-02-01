let keyboard = document.getElementById("keyboard");
let board = document.getElementById("board");
let scoreDisplay = document.getElementById("current-score");

let words = [];
let score = 0; // Initialize score

fetch('/words')
    .then(response => response.text())
    .then(data => {
        words = data.split("\n").map(word => word.trim()).filter(word => word); // Remove empty lines
        startGame(); // Start game after words are loaded
    })
    .catch(error => console.error('Error fetching the file:', error));

function GetRandomWord(WordList) {
    if (WordList.length === 0) {
        console.warn("Word list is empty!");
        return null;
    }
    return WordList[Math.floor(Math.random() * WordList.length)];
}

function startGame() {
    board.innerHTML = ""; // Clear the board for the next word
    const newWord = [...(GetRandomWord(words)).split("")];
    // console.log("New Word:", newWord);

    for (let i = 0; i < 6; i++) {
        let row = document.createElement("div");
        row.classList.add("rows");
        Array.from({ length: 5 }).map(() => {
            let square = document.createElement("div");
            let squareText = document.createElement("p");
            squareText.textContent = "";
            square.appendChild(squareText);
            square.classList.add("square");
            row.appendChild(square);
        });
        board.appendChild(row);
    }

    let currentRow = document.querySelector(".rows");
    let currentSquare = currentRow.querySelector(".square");
    currentSquare.classList.add("active");
    currentRow.classList.add("current");
    let clue = [];
    let clueText = document.getElementById("clue");

    function handleGuess(word) {
        let guess = word.split("");
        let correctWord = newWord.map(e => e.toUpperCase());
        clue = [];  // Reset clue array

        guess.forEach((letter, index) => {
            let square = currentRow.children[index];

            if (letter === correctWord[index]) {
                square.classList.add("correct")  // Correct letter, correct position
                clue.push(letter);
            } else if (correctWord.includes(letter)) {
                square.classList.add("worng")  // Correct letter, wrong position
                clue.push("-");
            } else {
                square.classList.add("incorrect")  // Incorrect letter
                clue.push("-");
            }
        });

        clueText.innerText = clue.join("");  // Display clue

        if (word === correctWord.join("")) {
            console.log("Congratulations! You've guessed the word!");
            score+=5;  // Increase score
            scoreDisplay.innerText = `Score: ${score}`;  // Update score display
            setTimeout(startGame, 2000);  // Start new game after 2 seconds
        } else if (!currentRow.nextElementSibling) {
            console.log("No more attempts! The correct word was:", correctWord.join(""));
            setTimeout(startGame, 2000);  // Start new game after 2 seconds
        } else {
            currentRow.classList.remove("current");
            currentRow = currentRow.nextElementSibling;
            currentRow.classList.add("current");
            currentSquare = currentRow.querySelector(".square");
            currentSquare.classList.add("active");
        }
    }

    if (newWord) {
        keyboard.innerHTML = ""; // Clear the keyboard to avoid duplicates
        const keyGrid = [
            ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
            ["A", "S", "D", "F", "G", "H", "J", "K", "L", "ENTER"],
            ["Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"]
        ];

        keyGrid.map(keyRow => {
            let row = document.createElement("div");
            row.classList.add("row");
            keyRow.map(key => {
                let button = document.createElement("button");
                button.classList.add("key");
                button.textContent = key;

                if (key === "ENTER") {
                    button.classList.add("enter-key");
                } else if (key === "BACKSPACE") {
                    button.classList.add("backspace-key");
                }

                button.addEventListener("click", () => {
                    if (document.querySelector(".active")) {
                        if (/^[a-zA-Z]$/.test(key)) {
                            currentSquare.querySelector("p").innerText = key.toUpperCase();
                            currentSquare.classList.remove("active");
                            if (currentSquare.nextElementSibling) {
                                currentSquare = currentSquare.nextElementSibling;
                                currentSquare.classList.add("active");
                            } else {
                                currentSquare = currentRow.lastChild;
                                currentSquare.classList.add("active");
                            }
                        } else if (key === "BACKSPACE") {
                            if (currentSquare != currentRow.firstChild) {
                                currentSquare.classList.remove("active");
                                currentSquare.querySelector("p").innerText = "";
                                currentSquare = currentSquare.previousElementSibling;
                                currentSquare.classList.add("active");
                            } else {
                                currentSquare.querySelector("p").innerText = "";
                            }
                        } else if (key === "ENTER") {
                            let word = [...currentRow.querySelectorAll(".square")].map(e => e.querySelector("p").innerText).join("");
                            if (word.length === 5 && words.includes(word.toLowerCase())) {
                                handleGuess(word);
                            } else {
                                console.log("INVALID WORD");
                            }
                        }
                    }
                });
                row.appendChild(button);
            });
            keyboard.appendChild(row);
        });
    }
}
