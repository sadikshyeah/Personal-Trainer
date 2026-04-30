# Personal Trainer App

A React + TypeScript app for managing customers and training sessions.

## Features

- Manage customers (add, edit, delete)
- Manage training sessions (add, edit, delete)
- View all trainings in a calendar
- View activity-based training statistics
- Dashboard summary for total customers and trainings

## Tech Stack

- React
- TypeScript
- Vite
- Material UI (MUI)
- MUI Data Grid and Date Pickers
- FullCalendar
- Recharts
- Day.js
- Lodash

## Getting Started

Install dependencies and run locally:

```bash
npm install
npm run dev
```

Build and preview production version:

```bash
npm run build
npm run preview
```

## API

Default API base URL:

`https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api`

To use a different backend, set:

```bash
VITE_API_URL=your_api_url
```

## Deployment

Deploy the built app to GitHub Pages:

```bash
npm run deploy
```
