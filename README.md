# Vibe Thought Collector 🧠✨

> **Your AI-powered second brain.** Capture thoughts, visualize connections, and synthesize insights with the power of Google Gemini.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg?logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28.svg?logo=firebase&logoColor=black)
![Gemini](https://img.shields.io/badge/Powered%20by-Gemini%20AI-8E75B2.svg)

**Vibe Thought Collector** is a modern web application designed to help you declutter your mind. It goes beyond simple note-taking by using AI to automatically organize your thoughts, tag them, and even synthesize new insights from your collection.

---

## 🌟 Key Features

- **🤖 AI-Powered Capture**: Simply type your raw thought. The app automatically extracts a concise title and relevant tags using Google Gemini.
- **🧠 Insight Synthesis**: Ask questions about your collected thoughts (e.g., *"What have I been thinking about regarding productivity?"*) and get a comprehensive AI-generated summary with source citations.
- **🌅 Thought of the Day**: Receive a "Daily Summary" based on random themes from your own tag cloud, offering a punchy, insightful reflection on your past ideas.
- **☁️ Dynamic Tag Cloud**: Visualize your thought landscape with an interactive tag cloud that lets you filter and explore connections.
- **🔒 Secure & Private**: Built with Firebase Authentication and Firestore for secure, real-time data syncing across devices.
- **⚡ Instant Demo Mode**: Works seamlessly in restricted environments (like iframes) with a local-storage based "Demo Mode" that bypasses authentication.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **AI Model**: Google Gemini 2.5 Flash (via `@google/genai`)
- **Backend**: Firebase (Authentication, Firestore)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Google Cloud Project with the **Gemini API** enabled.
- A **Firebase Project** with Authentication (Google Provider) and Firestore enabled.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vibe-thought-collector.git
   cd vibe-thought-collector
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your API keys:

   ```env
   # Google Gemini API Key
   GEMINI_API_KEY=your_gemini_api_key_here

   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 📖 Usage Guide

1. **Login**: Sign in with your Google account to sync data to the cloud. (Or use Demo Mode without login).
2. **Add a Thought**: Type anything in the input box. The AI will categorize it for you.
3. **Explore**: Click tags in the cloud to filter your list.
4. **Synthesize**: Click the "Synthesize" button (sparkles icon) to ask the AI questions about your notes.
5. **Daily Insight**: Check the "Thought of the Day" at the top of your feed for a fresh perspective on your existing notes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
