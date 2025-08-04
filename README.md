# GENIQ - AI-Powered Interview Preparation Platform

🚀 **Transform your interview preparation with AI-powered insights and comprehensive practice tools.**

## 🌐 Live Demo
- **Backend API**: https://geniq-mtkc.onrender.com
- **Frontend**: Deploy your own using the instructions below

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google AI API key (for Gemini AI features)
- Hosting account (Render, Netlify, Vercel, etc.)

### Local Development

1. **Clone and setup**:
   ```bash
   git clone https://github.com/vinayj16/GENIQ.git
   cd GENIQ
   npm install
   cd backend && npm install && cd ..
   ```

2. **Setup environment**:
   ```bash
   npm run setup
   # This creates .env file - edit it to add your Google AI API key
   ```

3. **Start development servers**:
   ```bash
   npm run start-full
   # This starts both frontend (5173) and backend (5000)
   ```

4. **Visit**: http://localhost:5173

## 🚀 Deployment

### 🎯 Single-Service Deployment (Recommended)

Deploy both frontend and backend together on Render:

#### Update Your Render Service:
1. **Build Command**: `cd backend && npm run build`
2. **Start Command**: `cd backend && npm start`
3. **Environment Variables**:
   ```bash
   NODE_ENV=production
   VITE_API_KEY=prod_geniq_api_key_2024
   GOOGLE_AI_API_KEY=your_actual_google_ai_api_key_here
   ```

#### Test Your Deployment:
```bash
node scripts/test-single-deployment.js
```

**📖 For detailed single-service deployment, see [RENDER_SINGLE_DEPLOYMENT.md](./RENDER_SINGLE_DEPLOYMENT.md)**

### 🔄 Alternative: Separate Services
If you prefer separate frontend/backend services, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📦 Project Structure

```
geniq/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── services/           # API services
│   └── utils/              # Utility functions
├── backend/                # Backend server
│   ├── src/                # Source files
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── public/                 # Static files
├── .env.example           # Example environment variables
├── deploy.sh              # Deployment script
├── render.yaml            # Render deployment config
└── package.json           # Frontend dependencies
```

## Features

### 🧠 AI-Powered Learning
- **Code Analysis**: Get instant feedback on your coding solutions with Gemini AI
- **Smart Hints**: Receive contextual hints when stuck on problems
- **Resume Optimization**: Generate ATS-optimized resumes with AI assistance
- **Interview Questions**: Get personalized interview questions based on company and role

### 💻 Comprehensive Practice
- **Coding Problems**: LeetCode-style problems with multiple language support
- **MCQ Tests**: Company-specific multiple choice questions
- **Mock Interviews**: Practice with AI-generated questions
- **System Design**: Learn scalable architecture patterns

### 📊 Progress Tracking
- **Dashboard Analytics**: Track your progress and performance
- **Streak Monitoring**: Maintain daily coding streaks
- **Performance Metrics**: Detailed insights into your preparation
- **Goal Setting**: Set and track weekly goals

### 🎯 Targeted Preparation
- **Company-Specific**: Filter content by target companies (Google, Amazon, Microsoft, etc.)
- **Role-Based**: Customize preparation based on your target role
- **Difficulty Levels**: Progress from Easy to Hard problems
- **Learning Roadmaps**: Structured paths for different domains

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd geniq
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   Server will run on http://localhost:5000

2. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   Application will run on http://localhost:5173

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling with custom design system
- **React Router** for navigation
- **Radix UI** for accessible components
- **React Query** for data fetching
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **Google Gemini AI** for intelligent features
- **CORS** for cross-origin requests
- **RESTful API** design

---

**Built with ❤️ for the developer community**# GENIQ
