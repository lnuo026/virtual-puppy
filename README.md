# Virtual Puppy

[![CI](https://github.com/lnuo026/virtual-puppy/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/lnuo026/virtual-puppy/actions/workflows/ci.yml)
![React](https://img.shields.io/badge/React-20232A?logo=react)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb)
![Three.js](https://img.shields.io/badge/Three.js-000000?logo=threedotjs)
![Gemini API](https://img.shields.io/badge/Gemini_API-4285F4?logo=googlegemini)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker)
![AWS EC2](https://img.shields.io/badge/AWS_EC2-FF9900?logo=amazonec2)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel)

A full-stack virtual pet application where persistent pet state, a reactive 3D
scene, and Gemini-powered chat create a living companion experience.

[Live Demo](https://puppy.lnuo.me) ·
[API Health](https://api-puppy.lnuo.me/health) ·
[Source Code](https://github.com/lnuo026/virtual-puppy)

<img src="./docs/VirtualPuppyDemo.gif" alt="Virtual Puppy demo" width="900" />

## What You Can Experience

- Sign in with Google and meet a uniquely generated puppy.
- Care for it by feeding, playing, letting it sleep, or giving it a bath.
- See its hunger, mood, energy, hygiene, health, and derived status update.
- Explore a 3D scene whose lighting and care hints react to the puppy's state.
- Chat with a Gemini-powered companion that receives its current server-side
  condition, breed, and personality as context.
- Return on another device and continue caring for the same puppy.

## Built Around Real State, Not Frontend Illusions

Pet creation, offline decay, daily check-ins, status derivation, and interaction
updates are handled by the NestJS API and persisted in MongoDB.

The React client renders the state returned by the server instead of deciding
what the puppy's condition should be. This keeps pet state consistent across
sessions and prevents client-side values from becoming the source of truth.

## Engineering Highlights

### Server-authoritative pet lifecycle

A puppy is generated lazily by the backend for the authenticated user. The API
calculates offline decay from persisted timestamps before returning the latest
state, so a pet cannot be recreated or manipulated by changing browser data.

### State priority and UI truth

`status` is a derived, priority-based label: a sick puppy can still be sleeping,
but `sick` may take precedence as the displayed status. The frontend therefore
uses the underlying `sleepUntil` timestamp when it needs to determine whether
the sleep action is active, instead of treating one derived label as every
possible fact about the pet.

### AI context stays on the server

Gemini is called only from the backend. The API key never reaches the browser,
and the prompt is built from server-derived pet context rather than state
submitted by the client.

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Zustand, Axios
- 3D: Three.js, React Three Fiber, React Three Drei
- Backend: NestJS, Mongoose, MongoDB Atlas
- Authentication: Google OAuth 2.0, JWT, httpOnly cookies
- AI: Google Gemini API
- Delivery: Docker, GitHub Actions, GitHub Container Registry, AWS EC2, AWS SSM,
  Nginx, Vercel

## Local Setup

### Prerequisites

- Node.js 24
- A MongoDB Atlas connection string
- A Google OAuth web application
- A Gemini API key

### Backend

Create `app/backend/.env` with values for:

```text
MONGODB_URI
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL
JWT_SECRET
FRONTEND_URL
GEMINI_API_KEY
```

Then run:

```bash
cd app/backend
npm install
npm run start:dev
```

### Frontend

```bash
cd app/frontend
cp .env.example .env
npm install
npm run dev
```

For local development, set `VITE_API_BASE_URL=http://localhost:3000` in
`app/frontend/.env`.

## Roadmap

- Enrich the adoption ceremony with a more cinematic reveal.
- Give AI conversations stronger continuity from recent pet interactions.
- Show a return-summary card based on real offline state changes.
- Add a persistent seven-day growth timeline backed by server-side snapshots.

## Project Structure

```text
virtual-puppy/
├── app/
│   ├── frontend/                 # React, Vite, Three.js client
│   │   ├── src/
│   │   │   ├── api/              # Auth, pet, and chat HTTP clients
│   │   │   ├── components/       # 3D scene, adoption, chat, and UI components
│   │   │   ├── pages/            # Login and protected home screens
│   │   │   ├── store/            # Zustand user and pet state
│   │   │   └── router/           # Route protection
│   │   └── public/models/        # 3D pet assets
│   └── backend/                  # NestJS API
│       └── src/
│           ├── common/           # Guards, decorators, logging, filters
│           ├── config/           # Environment validation
│           ├── health/           # Health endpoint
│           └── modules/
│               ├── auth/         # Google OAuth and JWT
│               ├── chat/         # Gemini integration and prompt building
│               ├── pet/          # State, decay, interactions, persistence
│               └── user/         # User model and profile endpoints
├── infra/docker/                 # Dockerfile and production Compose config
└── .github/workflows/            # CI and CD workflows
```
