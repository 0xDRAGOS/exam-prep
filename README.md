# 🧠 Exam Preparation App – Web Version

A modern React-based web application for exam preparation. Offers multiple-choice question training, test simulations, PDF viewer, and progress analytics — with full light/dark theme support.

🔗 **Live demo**: [https://0xDRAGOS.github.io/exam-prep](https://0xDRAGOS.github.io/exam-prep)

## 🌟 Features

- **Learning Mode**
    - Select subject and go through questions
    - Instant feedback with correct/incorrect highlights
    - Show answer explanations

- **Test Mode**
    - 30 randomized questions
    - 30-minute countdown timer
    - Real-time scoring and final performance summary
    - Score history stored in `localStorage`

- **PDF Viewer**
    - View original exam PDFs
    - Page-by-page navigation
    - File dropdown selector

- **Progress Analytics**
    - Line chart of score history
    - Detailed table of all test attempts

- **Dark/Light Theme**
    - Quick toggle for user preference
    - All components adapt to theme context

## ⚙️ Technologies Used

- React + Vite
- TailwindCSS (with dark mode support)
- React Router DOM
- Chart.js
- `lucide-react` icons
- `pdfjs-dist` for PDF rendering
- Context API for theme management

## 📁 Project Structure

```
📂 src/
│
├── assets/                 # Images, PDFs, mock JSON data
│
├── components/
│   ├── Header.jsx
│   └── Footer.jsx
│   └── ResumePopup.jsx
│
├── constants/
│   └── constants.js         # Global constants (test time, paths, PDF list)
│
├── context/
│   └── ThemeContext.jsx    # Light/dark mode context provider
│
├── pages/
│   ├── HomePage.jsx
│   ├── LearningPage.jsx
│   ├── TestPage.jsx
│   ├── ProgressPage.jsx
│   └── ResourcesPage.jsx
│
├── App.jsx                 # Layout & routing
├── main.jsx                # App entry point
└── index.css               # TailwindCSS config
```

## 📦 Installation

```bash
npm install
```

If you see a PostCSS error, make sure `@tailwindcss/postcss` is installed.

## 🚀 Start the App

```bash
npm run dev
```

Opens at `http://localhost:5173`

## 🧪 Configuration

All global values can be configured in `src/constants/constants.js`:

```js
export const TEST_DURATION_SECONDS = 30 * 60;
export const TEST_QUESTION_COUNT = 30;
export const PDF_FILES = [...];
export const QUESTIONS_PATH = "/assets/mock_questions.json";
export const IMAGE_PATH = "/assets/images/";
export const PDF_PATH = "/assets/pdf/";
export const ROUTES = {
  home: "/",
  learn: "/invata",
  test: "/simulare-test",
  materials: "/materiale",
  progress: "/progres",
};
```

## 🧼 Reset Progress

Go to the "Progress" page and press the "Clear History" button to reset your test score history.