// --- DOM Elements: Scenes ---
const mainMenu = document.getElementById('main-menu');
const selectionScene = document.getElementById('selection-scene');
const dialogueScene = document.getElementById('dialogue-scene');
const bgLayer = document.getElementById('bg-layer');

// --- DOM Elements: UI ---
const charNameUI = document.getElementById('character-name');
const dialogueTextUI = document.getElementById('dialogue-text');
const btnTalk = document.getElementById('btn-talk');

// --- State ---

let currentCharacter = "";

// --- Background Image Manager ---

const backgrounds = {
    menu: 'Assets/cafe_outdoors.png',
    cafe: 'Assets/cafe_indoors.png',
    philosopher: 'Assets/Oldlady.png',
    barista: 'Assets/theBarista.png',
    uncle: 'Assets/Uncle.png'
};

function setBackground(imageUrl) {
    bgLayer.style.backgroundImage = `url('${imageUrl}')`;
}

// --- Scene Manager ---
function switchScene(sceneToShow, bgKey) {
    mainMenu.classList.replace('active', 'hidden');
    selectionScene.classList.replace('active', 'hidden');
    dialogueScene.classList.replace('active', 'hidden');

    sceneToShow.classList.replace('hidden', 'active');
    if (bgKey) setBackground(backgrounds[bgKey]);
}

// --- Navigation Listeners ---
document.getElementById('btn-start').addEventListener('click', () => {
    switchScene(selectionScene, 'cafe');
});

document.getElementById('btn-back').addEventListener('click', () => {
    switchScene(selectionScene, 'cafe');
});

// --- Character Setup ---
function approachCharacter(name, bgKey) {
    currentCharacter = name;
    switchScene(dialogueScene, bgKey);
    charNameUI.innerText = name;
    dialogueTextUI.innerText = "*They look up as you approach.*";
    btnTalk.innerText = `Speak to ${name}`;
    btnTalk.disabled = false;
}

document.getElementById('btn-philosopher').addEventListener('click', () => approachCharacter("The Philosopher", "philosopher"));
document.getElementById('btn-barista').addEventListener('click', () => approachCharacter("The Barista", "barista"));
document.getElementById('btn-uncle').addEventListener('click', () => approachCharacter("The Uncle", "uncle"));


// --- API Logic & Loading States ---
function setLoading(isLoading) {
    if (isLoading) {
        btnTalk.disabled = true;
        dialogueTextUI.innerText = "...";
    } else {
        btnTalk.disabled = false;
    }
}

// Main talk router
btnTalk.addEventListener('click', () => {
    if (currentCharacter === "The Philosopher") fetchQuote();
    if (currentCharacter === "The Barista") fetchCoffeeFact();
    if (currentCharacter === "The Uncle") fetchUselessFact();
});

// 1. Quotes API - OLDlady
async function fetchQuote() {
    setLoading(true);
    try {
        const response = await fetch('https://dummyjson.com/quotes/random');
        if (!response.ok) throw new Error("API Error");
        const data = await response.json();
        dialogueTextUI.innerText = `"${data.quote}"`;
    } catch (error) {
        dialogueTextUI.innerText = "My mind is clouded today.";
    } finally {
        setLoading(false);
    }
}

// 2. Coffee API 
async function fetchCoffeeFact() {
    setLoading(true);
    try {
        const response = await fetch('https://api.sampleapis.com/coffee/hot');
        if (!response.ok) throw new Error("API Error");
        const allCoffees = await response.json();

        const validCoffees = allCoffees.filter(coffee => coffee.description && coffee.description.length > 10);
        
        const randomCoffee = validCoffees[Math.floor(Math.random() * validCoffees.length)];
        
        dialogueTextUI.innerText = `"(With an un ammused face) Have you tried a ${randomCoffee.title}? ${randomCoffee.description}"`;
    } catch (error) {
        dialogueTextUI.innerText = "The espresso machine is broken, I can't talk right now...";
    } finally {
        setLoading(false);
    }
}

// 3. Useless Facts API
async function fetchUselessFact() {
    setLoading(true);
    try {
        const response = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random');
        if (!response.ok) throw new Error("API Error");
        const data = await response.json();
        dialogueTextUI.innerText = `"Hey kid, did you know? ${data.text}"`;
    } catch (error) {
        dialogueTextUI.innerText = "*He stares off into space, forgetting what he was saying.*";
    } finally {
        setLoading(false);
    }
}

// Initialize first screen background
setBackground(backgrounds.menu);