// app.js

const userSelect = document.getElementById("userSelect");
const wordListEl = document.getElementById("wordList");
const statsEl = document.getElementById("stats");

function storageKeyForUser(userId) {
  return `greek_progress_${userId}`;
}

function loadProgress(userId) {
  const raw = localStorage.getItem(storageKeyForUser(userId));
  return raw ? JSON.parse(raw) : {};
}

function saveProgress(userId, progress) {
  localStorage.setItem(storageKeyForUser(userId), JSON.stringify(progress));
}

function render() {
  const userId = userSelect.value;
  const progress = loadProgress(userId);

  wordListEl.innerHTML = "";

  let masteredCount = 0;

  WORDS.forEach((word) => {
    const isMastered = !!progress[word.id];
    if (isMastered) masteredCount += 1;

    const card = document.createElement("div");
    card.className = "word-card";

    card.innerHTML = `
      <div class="word-main">
        <span class="greek">${word.greek}</span>
        <button class="audio-btn" data-id="${word.id}">🔊</button>
      </div>
      <div class="meta">
        ${word.translit} — ${word.english} (${word.part})
      </div>
      <div class="actions">
        <label>
          <input type="checkbox" class="mastered-checkbox" data-id="${word.id}"
            ${isMastered ? "checked" : ""} />
          Mark as mastered
        </label>
      </div>
    `;

    wordListEl.appendChild(card);
  });

  statsEl.textContent = `Mastered: ${masteredCount} / ${WORDS.length}`;
}

userSelect.addEventListener("change", () => {
  render();
});

wordListEl.addEventListener("change", (event) => {
  if (!event.target.classList.contains("mastered-checkbox")) return;

  const userId = userSelect.value;
  const progress = loadProgress(userId);
  const wordId = Number(event.target.dataset.id);
  progress[wordId] = event.target.checked;
  saveProgress(userId, progress);
  render(); // re-render stats
});

wordListEl.addEventListener("click", (event) => {
  if (!event.target.classList.contains("audio-btn")) return;

  const wordId = Number(event.target.dataset.id);
  const word = WORDS.find((w) => w.id === wordId);
  // TODO: later you’ll play audio from word.audioUrl
  alert(`Play audio for: ${word.greek}`);
});

// initial render
render();
