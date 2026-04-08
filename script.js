// --- DOM Elements: Scenes ---
const mainMenu = document.getElementById('main-menu');
const selectionScene = document.getElementById('selection-scene');
const dialogueScene = document.getElementById('dialogue-scene');
const bgLayer = document.getElementById('bg-layer');

// --- DOM Elements: UI ---
const charNameUI = document.getElementById('character-name');
const dialogueTextUI = document.getElementById('dialogue-text');
const btnTalk = document.getElementById('btn-talk');
const userInputUI = document.getElementById('user-input');

// --- DOM Elements: New Features ---
const choicesContainer = document.getElementById('choices-container');
const searchInput = document.getElementById('search-input');
const btnSort = document.getElementById('btn-sort');
const themeToggle = document.getElementById('theme-toggle');

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

// --- MILESTONE 3: Dynamic Characters (Using Array Higher-Order Functions) ---
const characters = ["The Philosopher", "The Barista", "The Uncle"];

// Feature 1: Dynamic Rendering (Uses .map)
function renderCharacters(charArray) {
    choicesContainer.innerHTML = ""; 
    
    // REQUIREMENT: Must use map(), no for/while loops
    charArray.map(name => {
        const btn = document.createElement('button');
        btn.innerText = name;
        btn.className = 'char-btn';
        
        let bgKey = name.split(' ')[1].toLowerCase(); 
        
        btn.onclick = () => approachCharacter(name, bgKey);
        choicesContainer.appendChild(btn);
    });
}

// Feature 2: Searching & Filtering (Uses .filter)
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    // REQUIREMENT: Must use filter(), no for/while loops
    const filteredChars = characters.filter(char => 
        char.toLowerCase().includes(searchTerm)
    );
    renderCharacters(filteredChars);
});

// Feature 3: Sorting (Uses .sort)
let isSorted = false;
btnSort.addEventListener('click', () => {
    isSorted = !isSorted;
    if (isSorted) {
        // REQUIREMENT: Must use sort(), no for/while loops
        const sortedChars = [...characters].sort((a, b) => a.localeCompare(b));
        renderCharacters(sortedChars);
        btnSort.innerText = "Sort Default";
    } else {
        renderCharacters(characters);
        btnSort.innerText = "Sort A-Z";
    }
});

renderCharacters(characters);

// Feature 4: Theme Toggle (Dark/Light Mode)
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('light-mode')) {
        themeToggle.innerText = "🌙 Dark Mode";
    } else {
        themeToggle.innerText = "☀️ Light Mode";
    }
});

// --- Character Setup ---
function approachCharacter(name, bgKey) {
    currentCharacter = name;
    switchScene(dialogueScene, bgKey);
    charNameUI.innerText = name;
    dialogueTextUI.innerText = "*They look up as you approach.*";
    userInputUI.value = ""; 
}

// --- API Logic: Bulletproof Fallback Chat ---
function setLoading(isLoading) {
    btnTalk.disabled = isLoading;
    userInputUI.disabled = isLoading;
}

btnTalk.addEventListener('click', sendMessage);
userInputUI.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
    const userMessage = userInputUI.value.trim();
    if (!userMessage) return;

    dialogueTextUI.innerHTML = `<strong>You:</strong> ${userMessage}<br><br><em>*Thinking...*</em>`;
    userInputUI.value = "";
    setLoading(true);

    try {
        let responseText = "";
        if (currentCharacter === "The Philosopher") {
            const res = await fetch('https://dummyjson.com/quotes/random');
            const data = await res.json();
            responseText = `"${data.quote}"`;
        } 
        else if (currentCharacter === "The Barista") {
            const res = await fetch('https://thirdwavecoffeebase.com/roasters/Sightglass%20Coffee');
            if (!res.ok) throw new Error("Coffee API Down");
            
            const data = await res.json();
            
            if (data.coffees && data.coffees.length > 0) {
                const randomCoffee = data.coffees[Math.floor(Math.random() * data.coffees.length)];
                const coffeeName = randomCoffee.name || "our house blend";
                
                let notes = "It's highly exclusive.";
                if (randomCoffee.tastingNotes && randomCoffee.tastingNotes.length > 0) {
                    notes = `It has notes of ${randomCoffee.tastingNotes.join(", ")}.`;
                }
                
                responseText = `"(Unamused) Have you tried the ${coffeeName} from ${data.name}? ${notes} But honestly, your palate probably isn't refined enough for it."`;
            } else {
                responseText = `"(Sighs) We are entirely out of beans right now. Just order water."`;
            }
        }
        else if (currentCharacter === "The Uncle") {
            const res = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random');
            const data = await res.json();
            responseText = `"Hey kid, did you know? ${data.text}"`;
        }

        dialogueTextUI.innerHTML = `<strong>You:</strong> ${userMessage}<br><br><strong>${currentCharacter}:</strong> ${responseText}`;
        
    } catch (error) {
        console.error("API Error:", error);
        dialogueTextUI.innerHTML = `<strong>${currentCharacter}:</strong> "Sorry, I lost my train of thought."`;
    } finally {
        setLoading(false);
    }
}

setBackground(backgrounds.menu);