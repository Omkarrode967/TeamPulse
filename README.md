# TeamPulse

A modern project management application built with React and Node.js.

## Features

- User authentication and authorization
- Project creation and management
- Task management with Kanban board
- Ticket system for bug tracking
- Real-time dashboard with analytics

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Radix UI
**Backend:** Node.js, Express, MongoDB, JWT

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Omkarrode967/TeamPulse.git
   cd TeamPulse
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

## Environment Variables

Create `.env` file in Backend directory:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/teampulse
JWT_SECRET=your_jwt_secret_here
``` 