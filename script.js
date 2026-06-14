(function () {
  const screens = {
    start: document.getElementById('screen-start'),
    mode: document.getElementById('screen-mode'),
    age: document.getElementById('screen-age'),
    quiz: document.getElementById('screen-quiz'),
    results: document.getElementById('screen-results'),
  };

  const state = {
    mode: null,
    age: null,
    questions: [],
    index: 0,
    score: 0,
  };

  // Map sport emojis to the custom icon images
  const ICON_IMAGES = {
    '🏑': { src: 'images/hurling-icon.png', alt: 'Hurling' },
    '⚽': { src: 'images/football-icon.png', alt: 'Gaelic Football' },
  };

  function setQuestionEmoji(emoji) {
    const el = document.getElementById('question-emoji');
    const icon = ICON_IMAGES[emoji];
    if (icon) {
      el.innerHTML = '';
      const img = document.createElement('img');
      img.src = icon.src;
      img.alt = icon.alt;
      img.className = 'icon-img icon-question';
      el.appendChild(img);
    } else {
      el.textContent = emoji;
    }
  }

  function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove('active'));
    screens[name].classList.add('active');
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Navigation
  document.getElementById('btn-start').addEventListener('click', () => showScreen('mode'));
  document.getElementById('btn-back-start').addEventListener('click', () => showScreen('start'));
  document.getElementById('btn-back-mode').addEventListener('click', () => showScreen('mode'));

  document.querySelectorAll('#screen-mode [data-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.mode = btn.dataset.mode;
      showScreen('age');
    });
  });

  document.querySelectorAll('#screen-age [data-age]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.age = btn.dataset.age;
      startQuiz();
    });
  });

  document.getElementById('btn-play-again').addEventListener('click', startQuiz);
  document.getElementById('btn-change-mode').addEventListener('click', () => showScreen('mode'));

  document.getElementById('btn-next').addEventListener('click', () => {
    state.index++;
    if (state.index < state.questions.length) {
      renderQuestion();
    } else {
      showResults();
    }
  });

  // Build the pool of questions for this round
  function buildQuestionPool() {
    let pool;
    if (state.mode === 'hurling') pool = HURLING_QUESTIONS;
    else if (state.mode === 'football') pool = FOOTBALL_QUESTIONS;
    else pool = HURLING_QUESTIONS.concat(FOOTBALL_QUESTIONS);

    if (state.age === 'junior') {
      pool = pool.filter((q) => q.difficulty === 'easy');
    } else {
      pool = pool.filter((q) => q.difficulty === 'medium' || q.difficulty === 'hard');
    }

    pool = shuffle(pool);

    const max = state.mode === 'mixed' ? 12 : 8;
    return pool.slice(0, Math.min(max, pool.length));
  }

  function startQuiz() {
    state.questions = buildQuestionPool().map((q) => {
      const optionsWithFlag = q.options.map((text, i) => ({ text, isCorrect: i === q.correct }));
      return { ...q, shuffledOptions: shuffle(optionsWithFlag) };
    });
    state.index = 0;
    state.score = 0;
    showScreen('quiz');
    renderQuestion();
  }

  function renderQuestion() {
    const total = state.questions.length;
    const q = state.questions[state.index];

    document.getElementById('progress-label').textContent = `Question ${state.index + 1} of ${total}`;
    document.getElementById('progress-fill').style.width = `${(state.index / total) * 100}%`;
    document.getElementById('score-label').textContent = state.score;
    setQuestionEmoji(q.emoji);
    document.getElementById('question-text').textContent = q.q;

    const grid = document.getElementById('answers-grid');
    grid.innerHTML = '';
    q.shuffledOptions.forEach((opt) => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-answer';
      btn.textContent = opt.text;
      btn.addEventListener('click', () => selectAnswer(opt, btn));
      grid.appendChild(btn);
    });

    const feedback = document.getElementById('feedback');
    feedback.textContent = '';
    feedback.className = 'feedback';

    document.getElementById('btn-next').hidden = true;
  }

  function selectAnswer(opt, btn) {
    const allBtns = document.querySelectorAll('#answers-grid .btn-answer');
    allBtns.forEach((b) => (b.disabled = true));

    const feedback = document.getElementById('feedback');
    const q = state.questions[state.index];

    if (opt.isCorrect) {
      state.score++;
      btn.classList.add('correct');
      feedback.textContent = `🎉 Yes! ${q.fact}`;
      feedback.className = 'feedback feedback-correct';
      playSound('correct');
    } else {
      btn.classList.add('incorrect');
      allBtns.forEach((b) => {
        const match = q.shuffledOptions.find((o) => o.isCorrect);
        if (b.textContent === match.text) b.classList.add('correct');
      });
      feedback.textContent = `Not quite! ${q.fact}`;
      feedback.className = 'feedback feedback-incorrect';
      playSound('incorrect');
    }

    document.getElementById('score-label').textContent = state.score;

    const nextBtn = document.getElementById('btn-next');
    nextBtn.textContent = state.index === state.questions.length - 1 ? 'See My Score! 🏁' : 'Next ➡';
    nextBtn.hidden = false;
  }

  function showResults() {
    const total = state.questions.length;
    document.getElementById('progress-fill').style.width = '100%';
    showScreen('results');

    const pct = state.score / total;
    let emoji, title, message, stars;

    if (pct === 1) {
      emoji = '🏆🌟🏆';
      title = 'PERFECT SCORE!';
      message = "You're a true GAA champion! Amazing work!";
      stars = '⭐⭐⭐';
    } else if (pct >= 0.7) {
      emoji = '🎉';
      title = 'Awesome!';
      message = 'You really know your hurling and football!';
      stars = '⭐⭐⭐';
    } else if (pct >= 0.4) {
      emoji = '👍';
      title = 'Nice try!';
      message = 'Keep playing to learn even more!';
      stars = '⭐⭐';
    } else {
      emoji = '🍀';
      title = 'Good start!';
      message = 'Play again to become a GAA expert!';
      stars = '⭐';
    }

    document.getElementById('results-emoji').textContent = emoji;
    document.getElementById('results-title').textContent = title;
    document.getElementById('results-score').textContent = `You scored ${state.score} out of ${total}!`;
    document.getElementById('results-stars').textContent = stars;
    document.getElementById('results-message').textContent = message;

    if (pct >= 0.7) launchConfetti();
  }

  // Web Audio sound effects (no audio files needed)
  let audioCtx;
  function playSound(type) {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'correct') {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.setValueAtTime(150, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {
      // Audio not supported - ignore
    }
  }

  // Confetti celebration
  function launchConfetti() {
    const root = document.getElementById('confetti-root');
    const colors = ['#1a7d3a', '#ffc72c', '#ffffff', '#e6452f', '#8ed3f5'];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 0.5 + 's';
      piece.style.animationDuration = 2 + Math.random() * 2 + 's';
      root.appendChild(piece);
      setTimeout(() => piece.remove(), 5000);
    }
  }
})();
