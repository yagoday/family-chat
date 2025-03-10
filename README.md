# Family Chat Application

A real-time family chat application enabling pre-registered family members to communicate securely in a shared chat room. Built with React, Node.js, and Socket.IO.

## Features

- Secure authentication with JWT
- Real-time messaging with Socket.IO
- User avatars and online status
- Message typing indicators
- RTL support for Hebrew
- Admin user functionality
- Responsive design for all devices

## Tech Stack

### Frontend
- React 18
- TypeScript
- Material-UI
- Socket.IO Client
- React Router

### Backend
- Node.js
- Express
- TypeScript
- Socket.IO
- TypeORM
- PostgreSQL
- JWT Authentication

## Setup

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/family_chat
   JWT_SECRET=your_jwt_secret
   PORT=4000
   CLIENT_URL=http://localhost:3000
   ```

4. Run database migrations:
   ```bash
   npm run migration:run
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:4000/api
   REACT_APP_SOCKET_URL=http://localhost:4000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── entities/
│   │   ├── middleware/
│   │   ├── migrations/
│   │   ├── routes/
│   │   └── server.ts
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── services/
    │   └── App.tsx
    └── package.json
```

## Scripts

### Backend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run migration:run` - Run database migrations
- `npm run seed:users` - Seed initial users

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and for family use only. 