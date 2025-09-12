# IT Career Recommender – Full Dockerized MVP

End-to-end project:
- **Frontend**: React + Vite + Tailwind
- **Backend**: Express + TypeScript + PostgreSQL (pgvector, pgcrypto)
- **Parsing**: FastAPI (Python) for resume parsing + embeddings
- **Seeds**: 60+ skills and 250+ courses (Coursera, Udemy, edX, YouTube, freeCodeCamp)

## Quick Start
```bash
cp .env.example .env
docker compose up --build
# In another terminal (after services are up):
docker compose exec backend npm run seed
```
Open **http://localhost:5173**

## Features
- Register / Login (JWT)
- Profile (name, target role, interests, hours/week, budget, language, **picture upload**)
- Resume upload (PDF/DOCX) → skills extraction (spaCy PhraseMatcher with synonyms)
- Recommendations (embedding retrieval + rules) with **Why recommended**, filters, Save/Hide/Completed

## Project Layout
```
.
├─ docker-compose.yml
├─ .env.example
├─ backend/        # Express + TS
├─ parsing/        # FastAPI + NLP
└─ frontend/       # React + Vite + Tailwind
```

## Seeding
`backend/seeds/skills.csv` and `backend/seeds/courses.csv` are ingested by `npm run seed`:
- Courses are embedded via parsing service `/embed` and saved in `course_embeddings` (pgvector, 384 dims).
- Adjust CSVs as needed and run `npm run seed` again.
