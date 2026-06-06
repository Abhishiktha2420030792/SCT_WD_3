<img width="1919" height="867" alt="hero" src="https://github.com/user-attachments/assets/bcc90e97-d72f-4c9b-b3e0-e2d56a1d6b22" /># 🧠 QuizVerse — Interactive Quiz Game

> A modern, feature-rich quiz application built with vanilla HTML, CSS, and JavaScript.  
> Test your knowledge across multiple question types with a sleek cosmic UI.

---

## 📌 Project Description

**QuizVerse** is a responsive, single-page quiz game application that challenges users with 10 questions spanning three different formats: Multiple Choice, Multi-Select, and Fill-in-the-Blank. Each question is timed, scores are tracked live, and a detailed breakdown is shown at the end.

Designed to look like a polished portfolio project, it features a dark/light mode toggle, animated background particles, smooth screen transitions, and motivational result messages.

---

## ✨ Features

### Core Features
- 📝 10 questions displayed one at a time
- 🔘 Multiple-choice (single select) questions
- ☑️ Multi-select questions (select all that apply)
- ✏️ Fill-in-the-Blank questions (case-insensitive)
- 🔢 Question counter (e.g., "3 / 10")
- ➡️ Next button to advance questions
- 📊 Final score with percentage, correct count, incorrect count, and skipped count

### Advanced Features
- ⏱️ 20-second countdown timer per question (auto-advances on expiry)
- 📈 Animated progress bar showing quiz completion
- ✅❌ Instant visual feedback (green = correct, red = wrong)
- 🌗 Dark / Light mode toggle (preference saved to localStorage)
- 🏆 Motivational messages based on score:
  - **90%+** → Excellent! 🌟
  - **70–89%** → Great Job! 👏
  - **50–69%** → Good Effort! 💪
  - **Below 50%** → Keep Practicing! 📚
- 📋 Collapsible answer breakdown showing what you got right/wrong
- 📤 Share your score (Web Share API + clipboard fallback)
- 🔄 Restart quiz button
- ⚡ Live score indicator during the quiz
- 🎨 Animated background particles + smooth screen transitions

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Structure and semantic markup |
| CSS3 | Styling, animations, CSS variables, responsive layout |
| Vanilla JavaScript (ES6+) | App logic, DOM manipulation, timer, state management |
| Google Fonts | Orbitron (display) + DM Sans (body) |
| Web Share API | Native share functionality on mobile |
| localStorage | Persist dark/light theme preference |

---

## 📁 Project Structure

```
quiz-app/
│
├── index.html      # Main HTML file (3 screens: Welcome, Quiz, Result)
├── style.css       # All styles — CSS variables, animations, responsive design
├── script.js       # Full app logic — questions, state, timer, rendering, scoring
└── README.md       # Project documentation (this file)
```

---

## 🚀 How to Run

### Option 1 — Open Locally
1. Download or clone this repository
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari)
3. No build step or dependencies required — it just works!

### Option 2 — GitHub Pages
1. Push the project to a GitHub repository
2. Go to **Settings → Pages**
3. Set source to `main` branch, root folder
4. Your quiz will be live at `https://yourusername.github.io/quiz-app/`

### Option 3 — Render / Netlify
1. Connect your GitHub repo to [Render](https://render.com) or [Netlify](https://netlify.com)
2. Set the publish directory to `/` (root)
3. Deploy — no build command needed for static sites

---

## 📸 Screenshots

## Home Screen

![Home Screen](<img width="1919" height="867" alt="hero" src="https://github.com/user-attachments/assets/00b5080e-d544-42d6-92f1-ac8689a19402" />
)

## Question Screen

![Question Screen](<img width="1919" height="876" alt="Quiz" src="https://github.com/user-attachments/assets/8536499d-335f-4a7f-b88f-1991ba491367" />
)

## Result Screen

![Result Screen](<img width="1919" height="858" alt="Results page" src="https://github.com/user-attachments/assets/94e289fe-de82-4841-8722-eb529bcde437" />
)
---

## 🧩 Question Types Included

| # | Type | Count |
|---|---|---|
| MCQ (Single Select) | Choose one correct answer | 5 |
| Multi-Select | Choose all correct answers | 3 |
| Fill in the Blank | Type the missing word | 2 |
| **Total** | | **10** |

---

## 🔮 Future Enhancements

- [ ] Category selection (Science, Tech, History, etc.)
- [ ] Difficulty levels (Easy / Medium / Hard)
- [ ] Question shuffle / randomize option
- [ ] High score leaderboard with localStorage
- [ ] Sound effects (correct/wrong/timer beep)
- [ ] Hint system with point deduction
- [ ] Import custom questions via JSON file upload
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)
- [ ] PWA support (offline play)
- [ ] Backend integration for user accounts and global leaderboards

---

## DEPLOYMENT ON RENDER

https://sct-wd-3-p8im.onrender.com

## 👤 Author

Built as a portfolio project demonstrating modern front-end development skills.  
Feel free to fork, star ⭐, and use as a learning reference!

---

## 📄 License

MIT License — free to use, modify, and distribute.
