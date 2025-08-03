# GENIQ - AI-Powered Interview Preparation Platform

🚀 **Transform your interview preparation with AI-powered insights and comprehensive practice tools.**

[![Deploy to Render](https://render.com/images/deploy-to-render/button.svg)](https://render.com/deploy?repo=https://github.com/yourusername/geniq)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Render.com account (for deployment)
- Google AI API key (for Gemini AI features)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/geniq.git
   cd geniq
   ```

2. Install dependencies:
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in the root directory
   - Add your Google AI API key to the `.env` file

4. Start the development servers:
   ```bash
   # Start frontend (port 5173)
   npm run dev
   
   # In a new terminal, start the backend (port 5000)
   cd backend
   npm run dev
   ```

## 🚀 Deployment

### Deploy to Render (Recommended)

1. Fork this repository to your GitHub account
2. Sign up for a [Render](https://render.com) account if you haven't already
3. Click the "Deploy to Render" button above or run:
   ```bash
   # Make the deployment script executable
   chmod +x deploy.sh
   
   # Run the deployment script
   ./deploy.sh
   ```
4. Follow the prompts to complete the deployment

### Manual Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview`
   - **Environment Variables**: Add all variables from `.env.example`
4. Deploy!

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
