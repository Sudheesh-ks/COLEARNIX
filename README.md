# 🎓 COLEARNIX

COLEARNIX is a collaborative online learning platform that enables students to learn, code, communicate, and collaborate in real time. It combines live video conferencing, collaborative coding, digital whiteboarding, AI assistance, and note sharing into a single workspace for an engaging virtual learning experience.

---

## 🚀 Features

### 👥 Collaboration
- 🎥 Real-time Video Conferencing using WebRTC
- 💬 Live Chat with Socket.IO
- 👨‍💻 Collaborative Code Editor
- 🖍️ Interactive Whiteboard
- 📝 Shared Notes
- 👥 Multi-user Collaboration

### 🤖 AI Features
- 🤖 AI Chat Assistant powered by Google Gemini
- 💡 Instant Coding Assistance
- 📚 Learning Support & Q&A

### 👤 User Features
- 🔐 Secure JWT Authentication
- 👤 User Profile Management
- 📚 Create & Join Study Rooms
- 🔗 Room Invitation Sharing
- 📱 Responsive User Interface

---

## 🧰 Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Material UI
- Socket.IO Client
- Monaco Editor
- HTML5 Canvas
- Axios

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- Socket.IO
- WebRTC
- JWT Authentication
- Google Gemini API
- Redis
- Docker

---

## 🏗️ Architecture Overview

The backend follows the **Repository Pattern**, ensuring clean separation of concerns.

- **Controllers** – Handle incoming requests and responses.
- **Services** – Contain business logic.
- **Repositories** – Handle database operations.
- **Models** – Define MongoDB schemas.
- **Middlewares** – Authentication, validation, and error handling.
- **Socket Layer** – Manages real-time communication.

This architecture makes the application scalable, modular, and easy to maintain.

---

## 🚀 Core Features

### 🎥 Real-Time Video Calls
- WebRTC-based peer-to-peer communication
- Low-latency audio & video streaming
- Multiple participants

### 👨‍💻 Collaborative Code Editor
- Monaco Editor integration
- Real-time synchronized editing
- Syntax highlighting
- Multi-language support

### 🖍️ Digital Whiteboard
- HTML5 Canvas
- Live drawing synchronization
- Collaborative brainstorming

### 💬 Real-Time Messaging
- Instant messaging with Socket.IO
- Live room communication
- Typing synchronization

### 🤖 AI Learning Assistant
- Google Gemini integration
- Coding help
- Concept explanations
- Study assistance

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Sudheesh-ks/COLEARNIX.git
cd COLEARNIX
```

---

### 2. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

---

### 3. Configure Environment Variables

Create a `.env` file inside the **backend** directory.

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:3001

REDIS_URL=your_redis_url

GOOGLE_GEMINI_API_KEY=your_gemini_api_key
```

If your application uses additional services (STUN/TURN servers, Docker, etc.), configure those variables as required.

---

### 4. Run the Application

#### Backend

```bash
npm run dev
```

#### Frontend

```bash
npm run dev
```

---

## 📁 Project Structure

```
COLEARNIX
│
├── frontend
│   ├── src
│   ├── app
│   ├── components
│   ├── hooks
│   ├── services
│   └── utils
│
├── backend
│   ├── controllers
│   ├── services
│   ├── repositories
│   ├── models
│   ├── socket
│   ├── middlewares
│   ├── routes
│   └── utils
│
└── README.md
```
