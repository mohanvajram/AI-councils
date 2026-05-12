# AI Council — Multi-AI Discussion Platform

A full-stack web application where ChatGPT, Gemini, and Claude discuss any topic and deliver a synthesized answer. All conversations are saved to Supabase.

---

## Project Structure

```
ai-council/
├── frontend/          # React app (Create React App)
│   ├── public/
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/         # Page-level views
│       ├── hooks/         # Custom React hooks
│       ├── services/      # API call functions
│       └── context/       # React context (auth, keys)
│
├── backend/           # Python FastAPI backend
│   ├── main.py
│   ├── routers/       # Route handlers
│   ├── models/        # Pydantic models
│   └── services/      # Business logic (AI calls, Supabase)
│
├── supabase/
│   └── schema.sql     # Database schema
│
└── docker-compose.yml
```

---

## Quick Start

### 1. Supabase Setup
- Create a project at https://supabase.com
- Run `supabase/schema.sql` in the Supabase SQL editor

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # Fill in your keys
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local      # Fill in backend URL
npm start
```

### 4. Open http://localhost:3000

---

## Environment Variables

### Backend `.env`
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AIza...
ANTHROPIC_API_KEY=sk-ant-...
ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend `.env.local`
```
REACT_APP_API_URL=http://localhost:8000
```
