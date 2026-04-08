Talk With Me

A dynamic, interactive cafe dialogue simulator built for my Web Application Programming (WAP) Milestone 3 project. Enter the cafe, choose a character, and strike up a conversation. 

## Features (Milestone 3 Implementations)

This project strictly adheres to the milestone requirements, utilizing Higher-Order Array functions without relying on traditional `for` or `while` loops:

*  Dynamic Searching (`.filter`):** Users can search the character list in real-time.
* Sorting (`.sort`):** Users can toggle the character list between its default state and an alphabetical A-Z sort.
* Dynamic Rendering (`.map`):** The character selection menu is dynamically generated from an array of character data.
* Theme Toggle:** A fully functional Dark Mode / Light Mode switch that updates the UI globally.

## The Great "AI" Incident

I attempted to integrate real, dynamic Generative AI into this project so users could have open-ended chats with the characters. **I failed miserably.** Here is what happened 30 minutes before the deadline:
1. I successfully integrated the **Google Gemini 1.5 Flash API**, but Google's free-tier servers experienced a massive spike in traffic and threw a `503 Service Unavailable` error.
2. Panicking, I hot-swapped the entire backend to use a **Hugging Face (`zephyr-7b-beta`) model**. 
3. The Hugging Face API immediately rejected the requests due to strict CORS (Cross-Origin Resource Sharing) policies because I was running it on a local development server.

With the midnight deadline approaching, I pulled the plug on the AI revolution. I ripped out the LLM logic and hard-wired the characters to reliable, old-school REST APIs. 

**Current Character APIs:**
* **The Philosopher:** Powered by `dummyjson.com/quotes`
* **The Barista:** Powered by `thirdwavecoffeebase.com`
* **The Uncle:** Powered by `uselessfacts.jsph.pl`

They aren't sentient, but they get the job done (and they don't throw CORS errors).

## 🚀 How to Run

1. Clone or download this repository.
2. Open `index.html` in any modern web browser.
3. No build steps, `npm install`, or server required.

## 🛠️ Tech Stack
* HTML5
* CSS3 (Vanilla)
* JavaScript (ES6+, Fetch API)
