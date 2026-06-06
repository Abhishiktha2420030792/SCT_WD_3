/**
 * QuizVerse — script.js
 * A feature-rich quiz application with MCQ, Multi-Select, and Fill-in-the-Blank questions.
 * Features: countdown timer, progress bar, live score, dark/light mode, score breakdown.
 */

'use strict';

/* ══════════════════════════════════════════════
   1. QUESTION BANK
   Each question object:
     id       : unique identifier
     type     : 'mcq' | 'multi' | 'fib'
     question : string
     options  : array (mcq/multi only)
     answer   : string | array of strings (fib: lowercase string)
     explain  : short explanation shown in breakdown
══════════════════════════════════════════════ */
const QUESTIONS = [
  /* ── 5 MCQ ── */
  {
    id: 1,
    type: 'mcq',
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    answer: 'Mars',
    explain: 'Mars appears red due to iron oxide (rust) on its surface.'
  },
  {
    id: 2,
    type: 'mcq',
    question: 'What does "CPU" stand for in computing?',
    options: [
      'Central Processing Unit',
      'Core Parallel Unit',
      'Central Program Utility',
      'Compiled Processing Unit'
    ],
    answer: 'Central Processing Unit',
    explain: 'The CPU is the primary component that executes instructions in a computer.'
  },
  {
    id: 3,
    type: 'mcq',
    question: 'Which language is primarily used to style web pages?',
    options: ['HTML', 'JavaScript', 'Python', 'CSS'],
    answer: 'CSS',
    explain: 'CSS (Cascading Style Sheets) controls the visual presentation of HTML elements.'
  },
  {
    id: 4,
    type: 'mcq',
    question: 'In which year was the first iPhone released?',
    options: ['2005', '2006', '2007', '2008'],
    answer: '2007',
    explain: 'Apple launched the original iPhone on June 29, 2007.'
  },
  {
    id: 5,
    type: 'mcq',
    question: 'Which data structure follows the LIFO (Last In, First Out) principle?',
    options: ['Queue', 'Stack', 'Linked List', 'Tree'],
    answer: 'Stack',
    explain: 'A stack pushes and pops from the same end, making it LIFO.'
  },

  /* ── 3 Multi-Select ── */
  {
    id: 6,
    type: 'multi',
    question: 'Which of the following are JavaScript frameworks or libraries? (Select all that apply)',
    options: ['React', 'Django', 'Vue', 'Angular', 'Laravel'],
    answer: ['React', 'Vue', 'Angular'],
    explain: 'React, Vue, and Angular are JS-based; Django and Laravel are Python/PHP frameworks.'
  },
  {
    id: 7,
    type: 'multi',
    question: 'Which of the following are valid CSS units? (Select all that apply)',
    options: ['px', 'em', 'kg', 'rem', 'vw'],
    answer: ['px', 'em', 'rem', 'vw'],
    explain: 'kg is a unit of mass, not a CSS measurement unit.'
  },
  {
    id: 8,
    type: 'multi',
    question: 'Which of these are primitive data types in JavaScript? (Select all that apply)',
    options: ['String', 'Object', 'Number', 'Array', 'Boolean'],
    answer: ['String', 'Number', 'Boolean'],
    explain: 'Object and Array are reference types, not primitives in JavaScript.'
  },

  /* ── 2 Fill-in-the-Blank ── */
  {
    id: 9,
    type: 'fib',
    question: 'The command used to initialize a new Git repository is "git _____".',
    answer: 'init',
    explain: '"git init" creates a new local Git repository in the current directory.'
  },
  {
    id: 10,
    type: 'fib',
    question: 'In Python, the keyword used to define a function is "_____".',
    answer: 'def',
    explain: 'Python uses "def" to declare functions, e.g., def my_function(): ...'
  }
];

/* ══════════════════════════════════════════════
   2. APP STATE
══════════════════════════════════════════════ */
const state = {
  currentIndex : 0,       // Current question index
  score        : 0,       // Points earned
  answers      : [],      // User answers per question {selected, correct, skipped}
  selectedOpts : [],      // Temp: selected options for current question
  fibValue     : '',      // Temp: FIB input value
  answered     : false,   // Has the user submitted the current answer?
  timerInterval: null,    // Interval ID for countdown
  timeLeft     : 20,      // Seconds remaining
  TIMER_MAX    : 20       // Maximum timer per question
};

/* ══════════════════════════════════════════════
   3. DOM REFERENCES
══════════════════════════════════════════════ */
const dom = {
  // Screens
  welcome : document.getElementById('welcomeScreen'),
  quiz    : document.getElementById('quizScreen'),
  result  : document.getElementById('resultScreen'),

  // Welcome
  startBtn : document.getElementById('startBtn'),

  // Quiz
  currentQ   : document.getElementById('currentQ'),
  totalQ     : document.getElementById('totalQ'),
  timerRing  : document.getElementById('timerRing'),
  timerNum   : document.getElementById('timerNum'),
  liveScore  : document.getElementById('liveScore'),
  progressFill: document.getElementById('progressFill'),
  typeBadge  : document.getElementById('typeBadge'),
  questionText: document.getElementById('questionText'),
  multiHint  : document.getElementById('multiHint'),
  optionsGrid: document.getElementById('optionsGrid'),
  fibWrap    : document.getElementById('fibWrap'),
  fibInput   : document.getElementById('fibInput'),
  feedbackBar : document.getElementById('feedbackBar'),
  feedbackIcon: document.getElementById('feedbackIcon'),
  feedbackText: document.getElementById('feedbackText'),
  nextBtn    : document.getElementById('nextBtn'),

  // Result
  trophyAnim     : document.getElementById('trophyAnim'),
  resultTitle    : document.getElementById('resultTitle'),
  resultSub      : document.getElementById('resultSub'),
  scoreRing      : document.getElementById('scoreRing'),
  scorePct       : document.getElementById('scorePct'),
  correctCount   : document.getElementById('correctCount'),
  incorrectCount : document.getElementById('incorrectCount'),
  skippedCount   : document.getElementById('skippedCount'),
  breakdownList  : document.getElementById('breakdownList'),
  restartBtn     : document.getElementById('restartBtn'),
  shareBtn       : document.getElementById('shareBtn'),

  // Theme
  themeToggle : document.getElementById('themeToggle'),
  themeIcon   : document.querySelector('.theme-icon'),

  // BG
  bgParticles : document.getElementById('bgParticles')
};

/* ══════════════════════════════════════════════
   4. SCREEN TRANSITIONS
══════════════════════════════════════════════ */

/**
 * Switch from one screen to another with exit/enter animation.
 * @param {HTMLElement} from - Screen to hide
 * @param {HTMLElement} to   - Screen to show
 */
function goToScreen(from, to) {
  from.classList.add('exit');
  setTimeout(() => {
    from.classList.remove('active', 'exit');
    to.classList.add('active');
  }, 420);
}

/* ══════════════════════════════════════════════
   5. BACKGROUND PARTICLES
══════════════════════════════════════════════ */
function spawnParticles() {
  const colors = ['#00f5d4', '#7b5ea7', '#f7b731', '#ff4d6d', '#00b4d8'];
  const count = 30;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 5 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * -20}%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      animation-duration: ${Math.random() * 14 + 10}s;
      animation-delay: ${Math.random() * 10}s;
    `;
    dom.bgParticles.appendChild(p);
  }
}

/* ══════════════════════════════════════════════
   6. THEME TOGGLE
══════════════════════════════════════════════ */
function initTheme() {
  // Check localStorage for saved theme preference
  const saved = localStorage.getItem('qv-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  dom.themeIcon.textContent = saved === 'dark' ? '☀️' : '🌙';
}

dom.themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  dom.themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('qv-theme', next);
});

/* ══════════════════════════════════════════════
   7. TIMER
══════════════════════════════════════════════ */
const TIMER_CIRCUMFERENCE = 125.66; // 2π × r(20)

/**
 * Start the per-question countdown timer.
 */
function startTimer() {
  clearInterval(state.timerInterval);
  state.timeLeft = state.TIMER_MAX;
  updateTimerDisplay();

  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    updateTimerDisplay();

    if (state.timeLeft <= 0) {
      clearInterval(state.timerInterval);
      if (!state.answered) autoSubmit();
    }
  }, 1000);
}

/**
 * Update the visual timer ring and number.
 */
function updateTimerDisplay() {
  const { timeLeft, TIMER_MAX } = state;
  const ratio = timeLeft / TIMER_MAX;
  const offset = TIMER_CIRCUMFERENCE * (1 - ratio);

  dom.timerNum.textContent = timeLeft;
  dom.timerRing.style.strokeDashoffset = offset;

  // Color zones
  dom.timerRing.classList.remove('warning', 'danger');
  if (timeLeft <= 5)       dom.timerRing.classList.add('danger');
  else if (timeLeft <= 10) dom.timerRing.classList.add('warning');
}

/**
 * Called when timer expires — auto-submit as skipped.
 */
function autoSubmit() {
  state.answered = true;
  const q = QUESTIONS[state.currentIndex];

  // Record as skipped
  state.answers.push({
    question : q.question,
    type     : q.type,
    selected : q.type === 'multi' ? [] : (q.type === 'fib' ? '' : null),
    correct  : q.answer,
    isCorrect: false,
    skipped  : true
  });

  // Show timeout feedback
  showFeedback(false, '⏰ Time\'s up! Moving on…', true);
  lockOptions();
  dom.nextBtn.disabled = false;
}

/* ══════════════════════════════════════════════
   8. QUESTION RENDERING
══════════════════════════════════════════════ */

/**
 * Render the question at `state.currentIndex`.
 */
function renderQuestion() {
  const q = QUESTIONS[state.currentIndex];

  // Reset state for this question
  state.selectedOpts = [];
  state.fibValue = '';
  state.answered = false;

  // Update counter + progress
  dom.currentQ.textContent = state.currentIndex + 1;
  dom.totalQ.textContent = QUESTIONS.length;
  const pct = (state.currentIndex / QUESTIONS.length) * 100;
  dom.progressFill.style.width = pct + '%';

  // Badge
  const badges = { mcq: 'Multiple Choice', multi: 'Multi-Select', fib: 'Fill in the Blank' };
  const badgeClasses = { mcq: 'mcq', multi: 'multi', fib: 'fib' };
  dom.typeBadge.textContent = badges[q.type];
  dom.typeBadge.className = 'type-badge ' + badgeClasses[q.type];

  // Question text
  dom.questionText.textContent = q.question;

  // Hide/show sections
  dom.multiHint.classList.toggle('hidden', q.type !== 'multi');
  dom.fibWrap.classList.toggle('hidden', q.type !== 'fib');
  dom.optionsGrid.classList.toggle('hidden', q.type === 'fib');
  hideFeedback();

  dom.nextBtn.disabled = true;

  // Render by type
  if (q.type === 'fib') {
    renderFIB();
  } else {
    renderOptions(q);
  }

  // Start timer
  startTimer();
}

/**
 * Render MCQ or Multi-Select options.
 * @param {Object} q - Question object
 */
function renderOptions(q) {
  dom.optionsGrid.innerHTML = '';
  const labels = ['A', 'B', 'C', 'D', 'E'];

  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `
      <span class="option-label">${labels[idx]}</span>
      <span class="option-text">${opt}</span>
    `;
    btn.dataset.value = opt;

    btn.addEventListener('click', () => onOptionClick(btn, opt, q));
    dom.optionsGrid.appendChild(btn);
  });
}

/**
 * Render Fill-in-the-Blank input.
 */
function renderFIB() {
  dom.fibInput.value = '';
  dom.fibInput.className = 'fib-input';
  dom.fibInput.focus();

  // Enable Next on any input
  dom.fibInput.oninput = () => {
    state.fibValue = dom.fibInput.value.trim();
    if (!state.answered) {
      dom.nextBtn.disabled = state.fibValue.length === 0;
    }
  };

  // Submit on Enter key
  dom.fibInput.onkeydown = (e) => {
    if (e.key === 'Enter' && !state.answered && state.fibValue.length > 0) {
      submitAnswer();
    }
  };
}

/* ══════════════════════════════════════════════
   9. ANSWER HANDLING
══════════════════════════════════════════════ */

/**
 * Handle option button click (MCQ or Multi-Select).
 * @param {HTMLElement} btn - Clicked button
 * @param {string} value    - Option value
 * @param {Object} q        - Question object
 */
function onOptionClick(btn, value, q) {
  if (state.answered) return;

  if (q.type === 'mcq') {
    // Single select — deselect others
    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    state.selectedOpts = [value];
    dom.nextBtn.disabled = false;
  } else {
    // Multi-select — toggle
    if (state.selectedOpts.includes(value)) {
      state.selectedOpts = state.selectedOpts.filter(v => v !== value);
      btn.classList.remove('selected');
    } else {
      state.selectedOpts.push(value);
      btn.classList.add('selected');
    }
    dom.nextBtn.disabled = state.selectedOpts.length === 0;
  }
}

/**
 * Submit the current answer when Next is clicked.
 */
function submitAnswer() {
  if (state.answered) return;
  state.answered = true;
  clearInterval(state.timerInterval);

  const q = QUESTIONS[state.currentIndex];
  let isCorrect = false;
  let userAnswer;

  if (q.type === 'mcq') {
    userAnswer = state.selectedOpts[0] || null;
    isCorrect = userAnswer === q.answer;
    markMCQOptions(q.answer, userAnswer);

  } else if (q.type === 'multi') {
    userAnswer = [...state.selectedOpts];
    // Correct only if exact match (same elements, order-independent)
    const correctSet = new Set(q.answer);
    const userSet = new Set(userAnswer);
    isCorrect =
      correctSet.size === userSet.size &&
      [...correctSet].every(v => userSet.has(v));
    markMultiOptions(q.answer, userAnswer);

  } else {
    // FIB
    userAnswer = state.fibValue;
    isCorrect = userAnswer.toLowerCase() === q.answer.toLowerCase();
    dom.fibInput.disabled = true;
    dom.fibInput.className = 'fib-input ' + (isCorrect ? 'correct-input' : 'wrong-input');
  }

  // Update score
  if (isCorrect) {
    state.score++;
    dom.liveScore.textContent = state.score;
  }

  // Record answer
  state.answers.push({
    question : q.question,
    type     : q.type,
    selected : userAnswer,
    correct  : q.answer,
    explain  : q.explain,
    isCorrect,
    skipped  : false
  });

  // Show feedback
  if (q.type === 'fib' && !isCorrect) {
    showFeedback(isCorrect, isCorrect
      ? `✅ Correct! "${q.answer}"`
      : `❌ Correct answer: "${q.answer}"`
    );
  } else {
    showFeedback(isCorrect,
      isCorrect ? '✅ Correct! Well done!' : `❌ Incorrect. ${q.explain}`
    );
  }

  dom.nextBtn.disabled = false;
}

/**
 * Visually mark MCQ options as correct/wrong after submission.
 * @param {string} correct  - Correct option value
 * @param {string} selected - User's selected value
 */
function markMCQOptions(correct, selected) {
  document.querySelectorAll('.option-btn').forEach(btn => {
    const val = btn.dataset.value;
    btn.disabled = true;
    if (val === correct) btn.classList.add('correct');
    else if (val === selected && selected !== correct) btn.classList.add('wrong');
    else btn.classList.remove('selected');
  });
}

/**
 * Visually mark Multi-Select options as correct/wrong after submission.
 * @param {string[]} correct  - Array of correct values
 * @param {string[]} selected - Array of user-selected values
 */
function markMultiOptions(correct, selected) {
  document.querySelectorAll('.option-btn').forEach(btn => {
    const val = btn.dataset.value;
    btn.disabled = true;
    if (correct.includes(val)) {
      btn.classList.add('correct');
    } else if (selected.includes(val) && !correct.includes(val)) {
      btn.classList.add('wrong');
    } else {
      btn.classList.remove('selected');
    }
  });
}

/**
 * Lock all option buttons (used on auto-submit / timeout).
 */
function lockOptions() {
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.disabled = true;
    btn.classList.remove('selected');
  });
  if (dom.fibInput) {
    dom.fibInput.disabled = true;
  }
}

/* ══════════════════════════════════════════════
   10. FEEDBACK
══════════════════════════════════════════════ */

/**
 * Show the inline feedback bar below options.
 * @param {boolean} correct     - Was the answer correct?
 * @param {string}  message     - Message text
 * @param {boolean} [isTimeout] - Is this a timeout message?
 */
function showFeedback(correct, message, isTimeout = false) {
  dom.feedbackBar.classList.remove('hidden', 'correct-fb', 'wrong-fb');
  dom.feedbackBar.classList.add(correct ? 'correct-fb' : 'wrong-fb');
  dom.feedbackIcon.textContent = isTimeout ? '⏰' : (correct ? '✅' : '❌');
  dom.feedbackText.textContent = message;
}

function hideFeedback() {
  dom.feedbackBar.classList.add('hidden');
}

/* ══════════════════════════════════════════════
   11. NAVIGATION
══════════════════════════════════════════════ */

/**
 * Move to the next question or show results if quiz is done.
 */
function nextQuestion() {
  // If user hasn't answered yet, submit first
  if (!state.answered) {
    submitAnswer();
    // Short delay so they see feedback before advancing
    dom.nextBtn.disabled = true;
    setTimeout(advance, 700);
    return;
  }
  advance();
}

function advance() {
  state.currentIndex++;
  if (state.currentIndex >= QUESTIONS.length) {
    showResults();
  } else {
    renderQuestion();
  }
}

/* ══════════════════════════════════════════════
   12. RESULTS
══════════════════════════════════════════════ */

/**
 * Calculate and display the final results screen.
 */
function showResults() {
  clearInterval(state.timerInterval);

  const total     = QUESTIONS.length;
  const correct   = state.answers.filter(a => a.isCorrect).length;
  const skipped   = state.answers.filter(a => a.skipped).length;
  const incorrect = total - correct - skipped;
  const pct       = Math.round((correct / total) * 100);

  // Motivational message
  let title, sub, trophy;
  if (pct >= 90)      { title = 'Excellent! 🌟'; sub = 'You\'re a QuizVerse legend!'; trophy = '🏆'; }
  else if (pct >= 70) { title = 'Great Job! 👏'; sub = 'Nearly mastered it!'; trophy = '🥈'; }
  else if (pct >= 50) { title = 'Good Effort! 💪'; sub = 'Keep pushing, you\'ll get there!'; trophy = '🥉'; }
  else                { title = 'Keep Practicing! 📚'; sub = 'Every attempt makes you better!'; trophy = '🎯'; }

  dom.trophyAnim.textContent = trophy;
  dom.resultTitle.textContent = title;
  dom.resultSub.textContent = sub;

  dom.correctCount.textContent   = correct;
  dom.incorrectCount.textContent = incorrect;
  dom.skippedCount.textContent   = skipped;
  dom.scorePct.textContent       = pct + '%';

  // Animate score ring
  const circ = 427.26; // 2π × 68
  const offset = circ - (circ * pct / 100);
  // Allow DOM paint before animating
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      dom.scoreRing.style.strokeDashoffset = offset;
    });
  });

  // Build breakdown
  buildBreakdown();

  // Update progress bar to 100%
  dom.progressFill.style.width = '100%';

  goToScreen(dom.quiz, dom.result);
}

/**
 * Build the answer breakdown list for the result screen.
 */
function buildBreakdown() {
  dom.breakdownList.innerHTML = '';

  state.answers.forEach((ans, idx) => {
    const div = document.createElement('div');

    let cls = 'bd-item ';
    if (ans.skipped)       cls += 'bd-skipped';
    else if (ans.isCorrect) cls += 'bd-correct';
    else                   cls += 'bd-incorrect';

    div.className = cls;

    // Format correct answer for display
    const correctStr = Array.isArray(ans.correct)
      ? ans.correct.join(', ')
      : ans.correct;

    // Format user answer for display
    let selectedStr;
    if (ans.skipped) {
      selectedStr = '(skipped / timed out)';
    } else if (Array.isArray(ans.selected)) {
      selectedStr = ans.selected.length ? ans.selected.join(', ') : '(none)';
    } else {
      selectedStr = ans.selected || '(no answer)';
    }

    div.innerHTML = `
      <div class="bd-q">Q${idx + 1}. ${ans.question}</div>
      <div class="bd-a">
        Your answer: <span class="your">${selectedStr}</span>
        ${!ans.isCorrect ? ` | Correct: <span class="right">${correctStr}</span>` : ''}
      </div>
    `;
    dom.breakdownList.appendChild(div);
  });
}

/* ══════════════════════════════════════════════
   13. RESTART
══════════════════════════════════════════════ */

/**
 * Reset all state and go back to the welcome screen.
 */
function restartQuiz() {
  // Reset state
  state.currentIndex  = 0;
  state.score         = 0;
  state.answers       = [];
  state.selectedOpts  = [];
  state.fibValue      = '';
  state.answered      = false;
  clearInterval(state.timerInterval);

  // Reset UI
  dom.liveScore.textContent  = '0';
  dom.progressFill.style.width = '0%';
  dom.scoreRing.style.strokeDashoffset = '427.26';

  goToScreen(dom.result, dom.welcome);
}

/* ══════════════════════════════════════════════
   14. SHARE SCORE
══════════════════════════════════════════════ */
dom.shareBtn.addEventListener('click', () => {
  const correct = state.answers.filter(a => a.isCorrect).length;
  const pct     = Math.round((correct / QUESTIONS.length) * 100);
  const text    = `🧠 I scored ${pct}% on QuizVerse (${correct}/${QUESTIONS.length} correct)! Can you beat me? #QuizVerse`;

  if (navigator.share) {
    navigator.share({ title: 'QuizVerse Score', text }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => {
      dom.shareBtn.textContent = '✅ Copied!';
      setTimeout(() => { dom.shareBtn.textContent = '📤 Share Score'; }, 2200);
    });
  }
});

/* ══════════════════════════════════════════════
   15. SVG GRADIENT INJECTION
   Inject a <defs> SVG with gradient for score ring.
══════════════════════════════════════════════ */
function injectSVGDefs() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  svg.innerHTML = `
    <defs>
      <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stop-color="#00f5d4"/>
        <stop offset="100%" stop-color="#f7b731"/>
      </linearGradient>
    </defs>
  `;
  document.body.prepend(svg);
}

/* ══════════════════════════════════════════════
   16. EVENT LISTENERS
══════════════════════════════════════════════ */
dom.startBtn.addEventListener('click', () => {
  goToScreen(dom.welcome, dom.quiz);
  // Short delay to let screen transition start
  setTimeout(renderQuestion, 200);
});

dom.nextBtn.addEventListener('click', nextQuestion);

dom.restartBtn.addEventListener('click', restartQuiz);

/* ══════════════════════════════════════════════
   17. INIT
══════════════════════════════════════════════ */
(function init() {
  initTheme();
  spawnParticles();
  injectSVGDefs();
  dom.totalQ.textContent = QUESTIONS.length;
  console.log('%c🧠 QuizVerse loaded — ' + QUESTIONS.length + ' questions ready!', 'color:#00f5d4;font-weight:bold;font-size:14px;');
})();
