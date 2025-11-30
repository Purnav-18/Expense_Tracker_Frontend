# Expense Tracker Frontend

**Project:** `Expense_Tracker_Frontend`

**Live demo (Vercel):** [https://expense-tracker-frontend-859b.vercel.app/](https://expense-tracker-frontend-859b.vercel.app/)

---

## Table of Contents

* [Project Overview](#project-overview)
* [Key Features](#key-features)
* [Screenshots](#screenshots)
* [Tech Stack](#tech-stack)
* [Folder Structure](#folder-structure)
* [Local Setup](#local-setup)
* [Environment Variables](#environment-variables)
* [Available Scripts](#available-scripts)
* [How It Works (high level)](#how-it-works-high-level)

  * [Authentication](#authentication)
  * [Dashboard](#dashboard)
  * [Graphs & Visuals](#graphs--visuals)
  * [Expense Calculation & Percentages](#expense-calculation--percentages)
* [API / Backend Expectations](#api--backend-expectations)
* [Deployment (Vercel)](#deployment-vercel)
* [Common Issues & Troubleshooting](#common-issues--troubleshooting)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

---

## Project Overview

Expense Tracker Frontend is a React application that allows users to register/login and manage their personal expenses. The dashboard shows:

* Total expense (numeric)
* Expense breakdown by category (bar/line chart)
* Circular progress / donut that shows percentage of spent vs budget or category percentage
* Interactive charts and lists of recent transactions

This repository contains the frontend only. The app expects a backend API that exposes auth and expense endpoints.

---

## Key Features

* ✅ User registration and login (JWT-based expected)
* ✅ Secure token storage (HTTP-only cookie or localStorage — configurable)
* ✅ Dashboard with total expense summary
* ✅ Transaction list with add/edit/delete
* ✅ Charts: time-series (monthly) and category breakdown (donut/pie)
* ✅ Circular percentage visualization for budget usage or category share
* ✅ Responsive design (desktop & mobile)
* ✅ Deployed to Vercel (link above)

---

## Screenshots

> Replace these placeholders with actual screenshots from the `public/screenshots` folder.

* `screenshots/dashboard.png` — Dashboard (total expense + charts)
* `screenshots/login.png` — Login page
* `screenshots/register.png` — Register page

---

## Tech Stack

* React (Create React App / Vite — whichever your project uses)
* React Router for routing
* Context API / Redux for state management (project uses: **Context API** by default)
* Axios for HTTP requests
* Charting library: `recharts` or `chart.js` (project examples use `recharts`)
* UI: Tailwind CSS / plain CSS (adjust to your existing styles)

---

## Folder Structure (recommended)

```
Expense_Tracker_Frontend/
├─ public/
│  ├─ index.html
│  └─ screenshots/
├─ src/
│  ├─ api/                # axios instances
│  ├─ components/         # small reusable components (Button, Input, Card)
│  ├─ context/            # AuthContext, ExpenseContext
│  ├─ pages/              # Login, Register, Dashboard, Transactions
│  ├─ services/           # services calling backend endpoints
│  ├─ hooks/              # custom hooks (useAuth, useFetch)
│  ├─ styles/             # global css / tailwind
│  └─ App.jsx
├─ .env
├─ package.json
└─ README.md
```

---

## Local Setup

1. Clone the repo:

```bash
git clone https://github.com/<your-user>/Expense_Tracker_Frontend.git
cd Expense_Tracker_Frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file (see next section).

4. Start the dev server:

```bash
npm start
# or
yarn start
```

Open `http://localhost:3000`.

---

## Environment Variables

Create a `.env` at project root. Example variables used by the frontend:

```
REACT_APP_API_BASE_URL=https://expense-tracker-backend.example.com/api
REACT_APP_CLIENT_URL=http://localhost:3000
# If using Vercel with environment secrets, set same keys there
```

> Note: Replace the `REACT_APP_API_BASE_URL` with your backend URL. If your backend is deployed on Vercel or Heroku, use that URL.

---

## Available Scripts

* `npm start` — Run app in development mode.
* `npm run build` — Build for production.
* `npm test` — Run tests (if any).
* `npm run lint` — Lint the project (if configured).

---

## How It Works (high level)

### Authentication

* User registers via `/api/auth/register` with `{ name, email, password }`.
* User logs in via `/api/auth/login` and receives a JWT.
* JWT stored in `localStorage` (or via httpOnly cookie if backend sets cookie).
* AuthContext exposes `login`, `logout`, and `currentUser` to the app.

### Dashboard

* On login, the dashboard fetches expenses for the user from `/api/expenses`.
* A summary endpoint (optional) `/api/expenses/summary` may return totals grouped by month/category for faster charts.

### Graphs & Visuals

* **Time-series chart:** displays total expense per day/week/month using `LineChart` or `AreaChart`.
* **Category breakdown:** a `PieChart`/`Donut` shows each category's share.
* **Circular percentage:** a circular progress component (e.g., `react-circular-progressbar`) shows `spent / budget * 100` OR singular category percentage. The app also shows the raw numeric total near the donut.

### Expense Calculation & Percentages

* `totalExpense` is the sum of `amount` for all transactions fetched.
* Category percentage = `(categoryTotal / totalExpense) * 100` (rounded to 1–2 decimals).
* Budget percentage = `(totalExpense / monthlyBudget) * 100` (cap at 100% if you prefer).

---

## API / Backend Expectations

Your backend should expose these endpoints (paths are conventional; adapt if different):

* `POST /api/auth/register` — register user

* `POST /api/auth/login` — login (returns token / sets cookie)

* `GET /api/auth/me` — get current user (auth required)

* `GET /api/expenses` — list expenses (support query params: `from`, `to`, `page`, `limit`)

* `POST /api/expenses` — create expense `{ title, amount, date, category }`

* `PUT /api/expenses/:id` — update expense

* `DELETE /api/expenses/:id` — delete expense

* `GET /api/expenses/summary` — (optional) returns totals grouped by category or month for faster charting

If your backend uses JWT, the frontend should add `Authorization: Bearer <token>` header in requests.

---

## Deployment (Vercel)

1. Connect the GitHub repository to Vercel.
2. Set environment variables in Vercel dashboard (`REACT_APP_API_BASE_URL` etc.).
3. Build command: `npm run build`, Output directory: `build` (Create React App) or `dist` (Vite).
4. Ensure your backend CORS allows the deployed origin (`https://expense-tracker-frontend-859b.vercel.app`).

---

## Common Issues & Troubleshooting

* **CORS error:** Backend must set `Access-Control-Allow-Origin` to the frontend origin (or `*` in dev). For production prefer the specific origin.
* **401 / Unauthorized:** Confirm token is present and backend expects header format `Bearer <token>`.
* **Charts blank:** Ensure the summary endpoint returns numeric values and dates in ISO format. Charts expect arrays with consistent keys (e.g., `{ date: '2025-07-01', total: 320 }`).
* **Net::ERR_BLOCKED_BY_CLIENT:** Check adblockers or browser extensions.

---

## Contributing

Contributions are welcome! Suggested steps:

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes and open a Pull Request

Please include descriptions for bug fixes and screenshots for UI changes.

---

## License

This project is provided under the MIT License — adjust as needed.

---

## Contact

If you need help with integration or want me to customize this README with code snippets from your project, tell me which files to reference and I will update the doc.

---

> This README includes placeholders for screenshots and some endpoints — update them to match your backend routes and UI components. Happy coding!
