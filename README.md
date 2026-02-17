# 🚀 AI CareerBoost - Intelligent Resume Analyzer & Career Coach

**AI CareerBoost** is a next-generation AI-powered career assistant designed to help job seekers optimize their resumes, plan their career paths, and prepare for technical interviews. Powered by **Google Gemini** and **Groq (Llama-3)**, it provides deep, actionable insights tailored specifically to the **Indian Tech Market**.

![Dashboard Preview](public/images/dashboard-preview.png)

> Replace `public/images/dashboard-preview.png` with the correct screenshot path if needed.

---

## ✨ Key Features

### 📄 1. AI Resume Analysis (Strict ATS Mode)

- **ATS Scoring:** Scans resumes against job descriptions and calculates an ATS compatibility score (0–100).
- **Deep Feedback:** Detailed breakdown on Content, Structure, Skills, and Tone.
- **Missing Keywords:** Detects critical missing technical keywords (React, AWS, Python, etc.).

---

### 🗺️ 2. Personalized Career Roadmap (Indian Context)

- **5-Phase Execution Plan:** Based on resume gaps.
- **Salary Insights (₹ LPA):** Fresher vs Experienced estimates (Indian Market).
- **Curated Resources:** Suggested courses, documentation, and real-world projects.

---

### 💻 3. CodeQuest – AI Technical Interviewer

- **Mock Coding Tests:** Medium-level challenges (Python / JavaScript).
- **AI Code Review:** Bug detection, quality rating, and optimized solutions.

---

### 🔗 4. LinkedIn Optimizer

- Professional Headlines
- Optimized “About” Summary
- Skill Recommendations for better visibility

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI Models | Google Gemini (Flash), Groq (Llama-3) |
| Database | Vercel KV / MongoDB (Optional) |
| PDF Processing | pdfjs-dist |
| File Uploads | react-dropzone |

---

## 🚀 Installation & Setup Guide

### ✅ Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Google Gemini API Key
- Groq API Key

---

### 📥 Step 1: Clone the Repository

```bash
git clone https://github.com/AbhishekChoudhary989/Resume_Analyzer_NEXT.git
cd Resume_Analyzer_NEXT
```

---

### 📦 Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

---

### 🔐 Step 3: Configure Environment Variables

Create a file named `.env.local` in the root directory and add:

```env
# AI Service Keys
GEMINI_API_KEY=your_google_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here

# Database Configuration (Optional)
KV_REST_API_URL=your_vercel_kv_url
KV_REST_API_TOKEN=your_vercel_kv_token
# OR
MONGODB_URI=your_mongodb_connection_string
```

⚠️ Never commit `.env.local` to GitHub.

---

### ▶️ Step 4: Run the Development Server

```bash
npm run dev
```

---

### 🌐 Step 5: Open the Application

Visit:

```
http://localhost:3000
```

---

## 📂 Project Structure

```
.
├── app/
│   ├── api/              # Backend API routes
│   ├── lib/              # AI services & utilities
│   ├── resume/           # Resume analysis module
│   ├── components/       # Reusable UI components
│   └── page.tsx          # Landing page
├── public/               # Static assets
├── .env.local            # Environment variables (ignored)
├── next.config.ts        # Next.js config
├── package.json          # Dependencies
└── README.md             # Documentation
```

---

## 🌍 Deployment

You can deploy this project easily on:

- Vercel (Recommended)
- Netlify
- Any Node.js-supported hosting platform

For Vercel:

```bash
vercel
```

Make sure to configure Environment Variables in the Vercel dashboard.

---

## 🤝 Contributing

1. Fork the repository
2. Create your branch

```bash
git checkout -b feature/YourFeatureName
```

3. Commit changes

```bash
git commit -m "Add YourFeatureName"
```

4. Push branch

```bash
git push origin feature/YourFeatureName
```

5. Open Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## ❤️ Author

Built with ❤️ by **Abhishek Choudhary**

---

⭐ If you like this project, give it a star on GitHub!
