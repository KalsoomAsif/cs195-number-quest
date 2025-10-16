/*
Number Quest: Guess the Number Game
-----------------------------------
WIN: Guess the correct number before attempts run out.
LOSE: Use all attempts without guessing correctly.
Tracks: secret number, remaining tries, guess history, best score (via localStorage).
*/

console.log("✅ script.js is connected");

document.addEventListener('DOMContentLoaded', () => {
  console.log('🎮 Number Quest JS fully loaded');

  const form = document.getElementById('guess-form');
  const input = document.getElementById('guess');
  const feedback = document.getElementById('feedback');
  const remainingEl = document.getElementById('remaining');
  const againBtn = document.getElementById('again');
  const historyList = document.getElementById('history');
  const bestEl = document.getElementById('best');
  const difficultySel = document.getElementById('difficulty');

  if (!form || !input || !feedback || !remainingEl || !againBtn || !historyList || !bestEl || !difficultySel) {
    console.error('❌ Missing one or more HTML elements. Check your IDs in game.html.');
    return;
  }

  let secretNumber = 0;
  let remaining = 0;
  let guessHistory = [];
  let isOver = false;
  const BEST_KEY = 'numberquest_best';

  function getBest() {
    const v = localStorage.getItem(BEST_KEY);
    return v ? parseInt(v, 10) : null;
  }

  function setBest(n) {
    localStorage.setItem(BEST_KEY, String(n));
  }

  function updateBestUI() {
    const b = getBest();
    bestEl.textContent = (b == null ? '—' : b);
  }

  function attemptsForDifficulty(d) {
    if (d === 'easy') return 12;
    if (d === 'hard') return 6;
    return 10;
  }

  function randomNumber() {
    return Math.floor(Math.random() * 100) + 1;
  }

  function setFeedback(msg, mode) {
    feedback.classList.remove('ok', 'warn', 'bad');
    if (mode) feedback.classList.add(mode);
    feedback.textContent = msg;
  }

  function addHistory(guess) {
    guessHistory.push(guess);
    const li = document.createElement('li');
    li.textContent = String(guess);
    historyList.prepend(li);
  }

  function endGame(win) {
    isOver = true;
    input.disabled = true;
    document.getElementById('check').disabled = true;

    if (win) {
      setFeedback(`🎉 Correct! The number was ${secretNumber}. You won in ${guessHistory.length} guesses.`, 'ok');
      const b = getBest();
      if (b == null || guessHistory.length < b) {
        setBest(guessHistory.length);
        updateBestUI();
      }
    } else {
      setFeedback(`❌ Out of attempts! The number was ${secretNumber}.`, 'bad');
    }
  }

  function resetGame() {
    secretNumber = randomNumber();
    remaining = attemptsForDifficulty(difficultySel.value);
    guessHistory = [];
    isOver = false;
    remainingEl.textContent = remaining;
    historyList.innerHTML = '';
    input.value = '';
    input.disabled = false;
    document.getElementById('check').disabled = false;
    setFeedback('Start guessing…');
    updateBestUI();
    console.log('🔢 New secret number:', secretNumber);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (isOver) return;

    const value = parseInt(input.value, 10);
    if (Number.isNaN(value) || value < 1 || value > 100) {
      setFeedback('⚠️ Please enter a number from 1 to 100.', 'warn');
      input.focus();
      return;
    }

    addHistory(value);

    if (value === secretNumber) {
      endGame(true);
      return;
    }

    remaining -= 1;
    remainingEl.textContent = remaining;

    if (remaining <= 0) {
      endGame(false);
      return;
    }

    setFeedback(value < secretNumber ? '⬆️ Higher…' : '⬇️ Lower…', 'warn');
    input.select();
  });

  againBtn.addEventListener('click', resetGame);
  difficultySel.addEventListener('change', resetGame);

  updateBestUI();
  resetGame();
});

