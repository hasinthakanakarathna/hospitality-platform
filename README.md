# StayFlow — Hotel Management Web App

A full-stack hotel management platform with a ClickUp-inspired UI (collapsible sidebar navigation, Kanban boards, card-based layouts, and a clean workspace feel).

## Tech Stack
- **Frontend:** React 19 + Vite + TailwindCSS v4
- **Backend:** Node.js + Express (REST API)
- **Database:** Firebase Firestore
- **Auth:** Firebase Authentication (Email/Password + Role-based access control)
- **Icons & UI:** Lucide React, dnd-kit, Recharts

## Roles & Permissions
- **Admin:** Full access (rooms, staff, bookings, billing, reports)
- **Receptionist:** Bookings, check-in / check-out, guest management, billing
- **Housekeeping:** Room status updates (Clean / Dirty / Inspected / Out of Service), task board

## Project Structure
```
hospitality-platform/
├── client/           # React + Vite + TailwindCSS v4 frontend
│   ├── src/
│   │   ├── components/  # Layout and UI primitives
│   │   ├── contexts/    # Auth and state management
│   │   ├── services/    # API client and Firebase configuration
│   │   └── utils/       # Formatters, roles and helper utilities
│   ├── .env.example
│   └── package.json
├── server/           # Express REST API backend
│   ├── src/
│   ├── .env.example
│   └── package.json
├── firestore.rules   # Role-based Firestore security rules
├── .gitignore        # Ignores .env and node_modules
└── README.md
```

## Getting Started

### 1. Environment Setup
- Copy `client/.env.example` to `client/.env` and supply your Firebase web credentials.
- Copy `server/.env.example` to `server/.env` and provide your Firebase Admin credentials.

### 2. Client Setup
```bash
cd client
npm install
npm run dev
```

### 3. Server Setup
```bash
cd server
npm install
npm run dev
```
