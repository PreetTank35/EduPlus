# 🧠 EduPulse AI

**A Context-Aware Diagnostic Assessment Platform for Holistic Skill Analytics**

EduPulse AI evaluates *how* students think — not just *what* they know. Using diagnostic assessments across 5 subjects and Google Gemini AI, it identifies cognitive performance patterns, pinpoints root-cause academic gaps, and generates personalized learning roadmaps.

---

## ✨ Features

- **Multi-Subject Diagnostic Quiz** — 15 questions across Mathematics, Physics, Chemistry, Biology, and English, testing recall, application, and analysis skills
- **AI-Powered Analysis** — Gemini AI identifies cross-subject patterns, strengths, weaknesses, and cognitive profiles in under 10 seconds
- **Interactive Dashboard** — Radar charts, bar charts, and detailed AI insights visualize performance
- **Custom Roadmap Generator** — Generate step-by-step learning paths for any topic with resources and milestones
- **Premium Dark-Mode UI** — Glassmorphic design with smooth animations and responsive layout

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Styling | Tailwind CSS 4 |
| Charts | Recharts |
| AI Engine | Google Gemini (via `@google/genai`) |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel |

## 📁 Project Structure

```
app/
├── layout.js                 # Root layout (fonts, navbar, metadata)
├── page.js                   # Landing page
├── globals.css               # Design system & Tailwind theme
├── api/
│   ├── analyze/route.js      # Quiz analysis API
│   └── roadmap/route.js      # Roadmap generation API
├── quiz/page.js              # Interactive quiz
├── dashboard/page.js         # Analytics dashboard
└── roadmap/page.js           # Roadmap generator

components/
├── Navbar.js                 # Navigation bar
├── PerformanceChart.js       # Radar + bar charts
└── RoadmapTimeline.js        # Learning path timeline

lib/
├── gemini.js                 # Gemini AI client
├── supabase.js               # Supabase client
├── questions.js              # Question bank & scoring engine
└── schema.sql                # Database schema
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Google Gemini API key ([get one here](https://aistudio.google.com/apikey))
- A Supabase project ([create one here](https://supabase.com)) — *optional for local dev*

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd ai-educational-platform
npm install
```

### 2. Configure Environment Variables

Copy the example env file and add your keys:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

> **Note:** The app works without Supabase credentials (data won't persist between sessions). The app also works without a Gemini API key (uses rule-based fallback analysis).

### 3. Set Up Database (Optional)

If using Supabase, run the schema SQL in your Supabase SQL Editor:

1. Go to **Supabase Dashboard → SQL Editor → New Query**
2. Paste the contents of `lib/schema.sql`
3. Click **Run**

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage Flow

1. **Landing Page** (`/`) — Learn about EduPulse AI and click "Start Assessment"
2. **Quiz** (`/quiz`) — Answer all 15 diagnostic questions
3. **Dashboard** (`/dashboard`) — View your AI-generated performance analysis
4. **Roadmap** (`/roadmap`) — Generate custom learning paths for any topic

## 🔌 API Endpoints

### `POST /api/analyze`

Processes quiz submissions and returns AI analysis.

**Request Body:**
```json
{
  "answers": { "1": 0, "2": 2, "3": 1, ... },
  "sessionId": "uuid-string"
}
```

**Response:**
```json
{
  "sessionId": "...",
  "scores": {
    "totalCorrect": 10,
    "totalQuestions": 15,
    "overallPercentage": 67,
    "subjectScores": { ... },
    "skillScores": { ... }
  },
  "analysis": {
    "strengths": ["..."],
    "weaknesses": ["..."],
    "cognitiveProfile": "...",
    "recommendations": ["..."]
  }
}
```

### `POST /api/roadmap`

Generates a custom learning roadmap.

**Request Body:**
```json
{
  "topic": "Organic Chemistry",
  "difficulty": "intermediate",
  "sessionId": "optional-uuid"
}
```

**Response:**
```json
{
  "roadmap": {
    "topic": "Organic Chemistry",
    "totalSteps": 6,
    "estimatedDuration": "4 weeks",
    "steps": [
      {
        "step": 1,
        "title": "...",
        "description": "...",
        "duration": "3 days",
        "resources": ["..."],
        "milestone": "..."
      }
    ]
  }
}
```

## 🚢 Deployment (Vercel)

1. Push your code to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add environment variables in Vercel's project settings
4. Deploy — Vercel auto-detects Next.js

## 📝 License

MIT
