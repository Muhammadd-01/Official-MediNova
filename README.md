# 🩺 MediNova – Your Intelligent Medical Companion

**MediNova** is a dynamic, full-stack health tech platform designed to empower users with personalized medical tools, real-time health updates, expert consultations, and smart AI-powered services. Built with performance, design, and accessibility in mind, it brings together reliable healthcare features and seamless user experience.

---

## 👩‍💻 Team

### 🧠 Neha Sheikh  
> 🧩 Co-Founder | 💻 Full-Stack & Backend Developer | 🎨 UI Experience Curator  
Neha leads both backend and frontend engineering, ensuring the platform is stable, scalable, and secure.

### 🧠 Muhammad Affan  
> 🔧 Co-Founder | ⚙️ Full-Stack Developer | 🤖 AI Logic & System Architect  
Affan crafts intelligent systems, UI performance, and seamless integrations for a complete medical experience.

---

## 🚀 Features

- 🌗 **Dark/Light Mode** — Fully theme-adaptive for user comfort  
- 💊 **Medicine Suggestion Engine** — Smart suggestions based on symptoms, age, allergies, etc.  
- 🧬 **AI Chatbot (Coming Soon)** — Natural health Q&A assistant  
- 📰 **Live Medical News** — Real-time fetch from external APIs with filtering/sorting  
- 📘 **Health Articles** — Educational content with filters and animations  
- ⚖️ **BMI Calculator** — Animated, responsive weight health checker  
- 📞 **Doctor Consultation Booking (WIP)** — Form-based expert connection  
- 🚨 **Emergency Help Section** — Includes location-based emergency resources  
- 💬 **Interactive Animations** — Smooth page transitions & hover effects with Framer Motion  
- 📱 **Fully Responsive UI** — Optimized for desktop, tablet, and mobile  

---

## 🛠 Tech Stack

| 🧪 Tech          | 🔍 Usage                           |
|------------------|-----------------------------------|
| **React 18**      | Core frontend framework           |
| **Vite**          | High-speed dev environment        |
| **TailwindCSS**   | Utility-first responsive styling  |
| **React Router**  | Client-side routing               |
| **Framer Motion** | Advanced UI animations            |
| **Lucide Icons**  | Lightweight icon system           |
| **Axios**         | API handling and external data    |
| **Context API**   | Global state for theme & logic    |

---

## 📂 Folder Structure

medinova/
├── public/
│ ├── favicon.ico
│ ├── index.html
│ └── ...
│
├── src/
│ ├── api/ # Axios services and external API functions
│ ├── assets/ # Images, logos, animations
│ ├── components/ # Reusable UI components (Header, Card, Footer, etc.)
│ │ ├── common/ # Shared utility components (buttons, inputs)
│ │ └── layout/ # Layout-specific components like Navbar, ThemeToggle
│ ├── pages/ # Page-level views (Home, Articles, News, BMI, Contact)
│ │ ├── Home.jsx
│ │ ├── Articles.jsx
│ │ ├── News.jsx
│ │ ├── BmiCalculator.jsx
│ │ ├── MedicineSuggestion.jsx
│ │ └── Emergency.jsx
│ ├── context/ # DarkModeContext and other global states
│ ├── App.jsx # Main App wrapper with routes
│ ├── main.jsx # React DOM render entry point
│ ├── App.css # Global Tailwind styles
│ └── index.css # Tailwind base + custom utilities
│
├── .gitignore
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md