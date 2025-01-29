import { daily, storage, updateExportData } from "./config.js";

// Load today's puzzle
daily.loadPuzzle().then(puzzle => {
    // Show the game board
    document.getElementById("title").innerText = puzzle.title;

    // HTML modals are really good
    document.getElementById("instructions").showModal();

    // Set a win and lose condition
    document.getElementById("win").addEventListener("click", () => {
        daily.onWin();
        endGame();
    });
    document.getElementById("cheat").addEventListener("click", () => {
        daily.onCheat();
        endGame();
    });
}).catch(error => {
    console.error(error);
    alert("Unable to load puzzle");
});

function endGame() {
    for (const el of document.getElementsByClassName("update-on-end"))
        el.update();
    document.getElementById("game-over").showModal();
}

document.getElementById("close-instructions").addEventListener("click", () => {
    // Log the puzzle as started
    daily.onStart();

    document.getElementById("instructions").close();
});

document.getElementById("export-button").addEventListener("click", () => {
    updateExportData();
    document.getElementById("export").showModal();
});

// Here's a customisable setting that's stored in the game's storage
const option = document.getElementById("option");
option.checked = storage.someSetting;
option.addEventListener("change", () => {
    storage.someSetting = option.checked;
});
