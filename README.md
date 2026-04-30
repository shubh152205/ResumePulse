<div align="center">
  <h1>ResumePulse 📄✨</h1>
  <p><strong>An AI-powered resume analysis pipeline for automated CV reviews</strong></p>
</div>

---

## 🚀 Overview

**ResumePulse** is a cutting-edge web application that leverages advanced AI models to analyze, review, and extract insights from resumes. Built with a modern tech stack, it provides a seamless user experience for uploading PDF resumes, extracting text flawlessly, and generating actionable feedback via AI analysis.

## ✨ Features

- **📄 Robust PDF Parsing:** Utilizes `unpdf` and `pdf.js` for highly accurate text extraction from uploaded resumes.
- **🤖 AI Analysis Pipeline:** Integrates with powerful LLM APIs (like Google Gemini and NVIDIA NIM) to analyze resume content.
- **🔐 Secure Authentication & Storage:** Backed by Firebase for secure user authentication and Firestore database management.
- **⚡ Next.js App Router:** A high-performance, responsive frontend built with Next.js and React 19.
- **🎨 Beautiful UI:** Styled with Tailwind CSS 4 and Framer Motion for sleek aesthetics and smooth animations.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Framer Motion, Lucide React
- **Backend & Auth:** Firebase (Authentication, Firestore)
- **AI Integration:** `@google/genai`, `openai` (NIM API compatibility)
- **PDF Extraction:** `unpdf`, `pdfjs-dist`

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- A Firebase Project (with Auth & Firestore enabled)
- AI API Keys (Gemini, NVIDIA NIM, etc.)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shubh152205/ResumePulse.git
   cd ResumePulse
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add your required credentials:
   ```env
   # AI Provider Keys
   GEMINI_API_KEY=your_gemini_api_key
   NVIDIA_NIM_API_KEY=your_nvidia_nim_key
   
   # Firebase Client Config
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
