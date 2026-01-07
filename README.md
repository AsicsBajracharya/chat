# Real-Time Chat Application

A full-stack real-time chat application built with Next.js and Node.js, featuring instant messaging, user authentication, contact management, and online status tracking.

## Features

- 🔐 **User Authentication** - Secure signup and login with JWT-based authentication
- 💬 **Real-Time Messaging** - Instant messaging using Socket.io
- 👥 **Contact Management** - Add and manage contacts
- 📸 **Image Sharing** - Share images in conversations (Cloudinary integration)
- 🔔 **Notifications** - Sound notifications for new messages
- 🌐 **Online Status** - See which users are online in real-time
- 📱 **Responsive Design** - Modern UI built with TailwindCSS and DaisyUI
- 🔒 **Secure** - Rate limiting and secure cookie-based authentication

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **React Query (TanStack Query)** - Server state management
- **Socket.io Client** - Real-time communication
- **TailwindCSS** - Utility-first CSS framework
- **DaisyUI** - Component library for TailwindCSS
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - Real-time bidirectional communication
- **MongoDB** - Database (with Mongoose ODM)
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Cloudinary** - Image storage and management
- **Resend** - Email service
- **Express Rate Limit** - API rate limiting
- **CORS** - Cross-origin resource sharing

## Project Structure

```
chat/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Authentication & validation
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── lib/            # Utilities (DB, Socket, Cloudinary, etc.)
│   │   └── emails/         # Email templates and handlers
│   └── package.json
│
└── next/                   # Next.js frontend
    ├── app/                # Next.js App Router
    │   ├── (protected)/    # Protected routes
    │   ├── (public)/       # Public routes (login, signup)
    │   └── ui/             # UI components
    ├── components/         # React components
    ├── features/           # Feature modules (auth, chat, contacts)
    ├── hooks/              # Custom React hooks
    ├── lib/                # Utilities
    └── package.json
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB database
- Cloudinary account (for image storage)
- Resend account (for email services)

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd chat
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3001
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RESEND_API_KEY=your_resend_api_key
```

### 3. Frontend Setup

```bash
cd ../next
npm install
```

Create a `.env.local` file in the `next` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Running the Application

### Development Mode

1. **Start the backend server:**

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:3001`

2. **Start the frontend server:**

```bash
cd next
npm run dev
```

The frontend will run on `http://localhost:3000` (or the next available port)

### Production Mode

1. **Build and start the backend:**

```bash
cd backend
npm start
```

2. **Build and start the frontend:**

```bash
cd next
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Messages
- `GET /api/messages/:userId` - Get messages with a user
- `POST /api/messages` - Send a message

### Health Check
- `GET /health` - Server health check

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 3000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLIENT_URL` - Frontend URL for CORS
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `RESEND_API_KEY` - Resend API key for emails

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Features in Detail

### Real-Time Communication
- Socket.io is used for bidirectional real-time communication
- Users receive instant message notifications
- Online/offline status is tracked in real-time

### Authentication
- JWT-based authentication with secure HTTP-only cookies
- Password hashing with bcryptjs
- Protected routes on both frontend and backend

### Image Sharing
- Images are uploaded to Cloudinary
- Support for image messages in conversations

### User Interface
- Modern, responsive design
- Sound notifications for new messages
- Contact list with online status
- Chat interface with message history

## Development

### Backend Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Frontend Scripts
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Real-time features powered by [Socket.io](https://socket.io/)
- UI components from [DaisyUI](https://daisyui.com/)

