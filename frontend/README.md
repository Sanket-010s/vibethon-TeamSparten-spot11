# AIML Nexus - React Frontend

Clean React application with organized folder structure.

## 📁 Project Structure

```
src/
├── pages/           # All page components
│   ├── HomePage.js
│   ├── AuthPage.js
│   ├── DashboardPage.js
│   ├── ModulesPage.js
│   ├── PlaygroundPage.js
│   ├── GamesPage.js
│   ├── QuizPage.js
│   ├── TutorPage.js
│   └── LeaderboardPage.js
├── components/      # Reusable components
│   ├── Navbar.js
│   ├── ProtectedRoute.js
│   ├── LoadingSpinner.js
│   └── ActivityHeatmap.js
├── hooks/           # Custom React hooks
│   └── useUserProgress.js
├── context/         # React Context providers
│   ├── AuthContext.js
│   └── AppProviders.js
├── services/        # API and Firebase services
│   ├── firestoreService.js
│   └── analytics.js
├── config/          # Configuration files
│   └── firebase.js
├── constants/       # Data constants
│   └── data.js
├── styles/          # CSS modules
│   ├── globals.css
│   └── *.module.css
├── App.js           # Main app with routing
└── index.js         # Entry point
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 🔧 Environment Variables

Create `.env.local` file:

```
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_API_URL=http://localhost:5000
```

## 📝 Features

- ✅ Clean React architecture
- ✅ React Router for navigation
- ✅ Firebase Authentication
- ✅ Firestore database
- ✅ CSS Modules for styling
- ✅ Framer Motion animations
- ✅ Recharts for analytics
- ✅ Form validation with React Hook Form + Zod

## 🌐 Routes

- `/` - Home page
- `/auth` - Login/Signup
- `/dashboard` - User dashboard
- `/modules` - Learning modules
- `/playground` - Python playground
- `/games` - Mini-games
- `/quiz` - Quizzes
- `/tutor` - AI Tutor
- `/leaderboard` - Leaderboard

---
*Built for Vibethon by Team SpartEn-Spot11*
