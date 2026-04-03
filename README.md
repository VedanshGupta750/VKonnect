<p align="center">
  <img src="Frontend/public/favicon.svg" alt="VKonnect Logo" width="80" height="80" />
</p>

<h1 align="center">VKonnect</h1>

<p align="center">
  <b>Real-time Peer-to-Peer Video Conferencing — Connect with anyone, anywhere.</b>
</p>

<p align="center">
  <a href="https://vkonnect-2.onrender.com/">🌐 Live Demo</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Get Started</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-api-reference">API</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.IO-4-010101?logo=socket.io&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/WebRTC-P2P-333333?logo=webrtc&logoColor=white" />
  <img src="https://img.shields.io/badge/Deployed-Render-46E3B7?logo=render&logoColor=white" />
</p>

---

## 📖 About

**VKonnect** is a full-stack, real-time video conferencing web application that enables users to create or join video calls directly in the browser. It leverages **WebRTC** for peer-to-peer media streaming and **Socket.IO** for signaling, ensuring low-latency, high-quality communication without routing media through a central server.

Whether you're hosting a team standup, catching up with friends, or collaborating remotely — VKonnect provides a seamless experience with video, audio, screen sharing, and in-call chat.

### 🔗 Live Application

> **[https://vkonnect-2.onrender.com/](https://vkonnect-2.onrender.com/)**

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎥 **Video Calling** | Real-time peer-to-peer video calls powered by WebRTC |
| 🎙️ **Audio Controls** | Toggle microphone on/off during a call |
| 📹 **Camera Controls** | Toggle camera on/off during a call |
| 🖥️ **Screen Sharing** | Share your screen with other participants |
| 💬 **In-Call Chat** | Send and receive text messages during a meeting |
| 👤 **Guest Access** | Join a meeting instantly without registration |
| 🔐 **Authentication** | Register and login with hashed credentials (bcrypt) |
| 📋 **Meeting History** | View past meetings with codes and dates |
| 🔗 **Shareable Links** | Every meeting has a unique URL — share to invite |
| 📱 **Responsive Design** | Fully responsive UI for mobile, tablet, and desktop |
| 🏠 **Landing Page** | Beautiful hero section with CTA and mobile preview |

---

## 🏗️ Architecture

VKonnect uses a **P2P (Peer-to-Peer) architecture** for media streaming. Here's how the components interact:

```
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENT A (Browser)                       │
│  ┌─────────┐   ┌──────────┐   ┌────────────┐   ┌─────────────┐ │
│  │  React   │──▶│ Socket.IO│──▶│  WebRTC    │──▶│ Media Stream│ │
│  │  UI      │   │  Client  │   │  Peer Conn │   │ (Video/Audio)│ │
│  └─────────┘   └────┬─────┘   └─────┬──────┘   └─────────────┘ │
│                      │               │                           │
└──────────────────────┼───────────────┼───────────────────────────┘
                       │               │
              Signaling│          P2P Media
              (SDP/ICE)│          (WebRTC)
                       │               │
              ┌────────▼────────┐      │
              │   Backend       │      │
              │   Node.js +     │      │
              │   Socket.IO     │      │
              │   Server        │      │
              │                 │      │
              │   ┌───────────┐ │      │
              │   │ MongoDB   │ │      │
              │   │ Atlas     │ │      │
              │   └───────────┘ │      │
              └────────┬────────┘      │
                       │               │
              Signaling│          P2P Media
              (SDP/ICE)│          (WebRTC)
                       │               │
┌──────────────────────┼───────────────┼───────────────────────────┐
│                      │               │                           │
│  ┌─────────┐   ┌────▼─────┐   ┌─────▼──────┐   ┌─────────────┐ │
│  │  React   │──▶│ Socket.IO│──▶│  WebRTC    │──▶│ Media Stream│ │
│  │  UI      │   │  Client  │   │  Peer Conn │   │ (Video/Audio)│ │
│  └─────────┘   └──────────┘   └────────────┘   └─────────────┘ │
│                         CLIENT B (Browser)                       │
└──────────────────────────────────────────────────────────────────┘
```

### How P2P Signaling Works

1. **User A** joins a room → Backend registers the socket in the room
2. **User B** joins the same room → Backend notifies all peers
3. Both clients create `RTCPeerConnection` instances
4. **SDP Offers/Answers** are exchanged via Socket.IO (signaling server)
5. **ICE Candidates** are exchanged for NAT traversal (using Google's public STUN server)
6. Once the connection is established, **media streams flow directly** between browsers (P2P)
7. The backend is **never in the media path** — it only handles signaling and chat relay

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **React 19** | UI component library |
| **Vite 8** | Fast build tool and dev server |
| **React Router v7** | Client-side routing |
| **MUI (Material UI) v7** | Pre-built UI components (Buttons, TextFields, Cards, Icons) |
| **Socket.IO Client** | Real-time bidirectional communication |
| **WebRTC API** | Peer-to-peer video/audio/screen streaming |
| **Axios** | HTTP client for REST API calls |
| **Three.js** | 3D graphics (asset available for enhancements) |

### Backend

| Technology | Purpose |
|---|---|
| **Node.js 22** | JavaScript runtime |
| **Express 5** | Web framework for REST API |
| **Socket.IO 4** | WebSocket-based signaling server |
| **Mongoose 9** | MongoDB ODM for data modeling |
| **MongoDB Atlas** | Cloud-hosted NoSQL database |
| **bcrypt** | Secure password hashing |
| **crypto** | Token generation for authentication |

---

## 📁 Project Structure

```
VKonnect/
├── Backend/
│   ├── package.json                    # Backend dependencies & scripts
│   └── src/
│       ├── app.js                      # Entry point — Express + Socket.IO + MongoDB
│       ├── controllers/
│       │   ├── socketManager.js        # Socket.IO signaling logic (rooms, P2P, chat)
│       │   └── user.controller.js      # Auth (register/login) & meeting history
│       ├── models/
│       │   ├── user.model.js           # User schema (name, username, password, token)
│       │   └── meeting.model.js        # Meeting schema (user_id, meetingCode, date)
│       └── routes/
│           └── users.routes.js         # REST API route definitions
│
├── Frontend/
│   ├── index.html                      # HTML entry point
│   ├── vite.config.js                  # Vite configuration
│   ├── package.json                    # Frontend dependencies & scripts
│   ├── public/
│   │   ├── Background.jpg              # Landing page hero background
│   │   ├── favicon.svg                 # Browser tab icon
│   │   ├── icons.svg                   # SVG icon sprite
│   │   ├── logo192.png                 # App logo
│   │   └── mobile.png                  # Mobile mockup for landing page
│   └── src/
│       ├── main.jsx                    # React DOM render entry
│       ├── App.jsx                     # Root component with React Router
│       ├── App.css                     # Landing page styles (responsive)
│       ├── index.css                   # Global CSS reset
│       ├── assets/                     # Static assets (images, SVGs)
│       ├── context/
│       │   └── AuthContext.jsx         # Auth context (login, register, history)
│       ├── utils/
│       │   └── Auth.jsx               # HOC — route guard for authenticated pages
│       ├── pages/
│       │   ├── LandingPage.jsx         # Public landing page with CTA
│       │   ├── Authentication.jsx      # Login / Sign Up form (MUI)
│       │   ├── HomeComponent.jsx       # Dashboard — join or create meetings
│       │   ├── VideoMeet.jsx           # Core video call page (WebRTC + Socket.IO)
│       │   └── History.jsx            # Meeting history cards
│       └── styles/
│           ├── homeComponent.module.css    # Home page styles (CSS Modules)
│           ├── videoComponent.module.css   # Video call page styles (CSS Modules)
│           └── History.css                 # History page styles
│
└── README.md                           # You are here!
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

| Tool | Version | Download |
|---|---|---|
| **Node.js** | v22+ | [nodejs.org](https://nodejs.org/) |
| **npm** | v10+ | Comes with Node.js |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |

### 1. Clone the Repository

```bash
git clone https://github.com/VedanshGupta750/VKonnect.git
cd VKonnect
```

### 2. Setup the Backend

```bash
# Navigate to the backend directory
cd Backend

# Install dependencies
npm install

# Start the development server (with auto-reload via nodemon)
npm run dev
```

The backend server will start at **`http://localhost:5000`**.

> **Note:** The backend connects to a MongoDB Atlas cluster. The connection string is pre-configured in `src/app.js`. For production use, consider moving it to environment variables.

### 3. Setup the Frontend

Open a **new terminal** and run:

```bash
# Navigate to the frontend directory
cd Frontend

# Install dependencies
npm install

# Start the Vite dev server
npm run dev
```

The frontend will start at **`http://localhost:5173`** (default Vite port).

### 4. Open the App

Navigate to [http://localhost:5173](http://localhost:5173) in your browser. You should see the VKonnect landing page!

---

## 🔑 Environment Variables (Optional)

For production deployments, consider using environment variables:

| Variable | Description | Default |
|---|---|---|
| `PORT` | Backend server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | Pre-configured (Atlas) |

---

## 📡 API Reference

All REST API routes are prefixed with `/api/v1/users/`.

### Authentication

#### Register a New User

```http
POST /api/v1/users/register
```

| Body Parameter | Type | Description |
|---|---|---|
| `name` | `string` | Full name of the user |
| `username` | `string` | Unique username |
| `password` | `string` | Password (hashed with bcrypt) |

**Response:**
```json
{
  "message": "New User Registered Successfully"
}
```

---

#### Login

```http
POST /api/v1/users/login
```

| Body Parameter | Type | Description |
|---|---|---|
| `username` | `string` | Registered username |
| `password` | `string` | Account password |

**Response:**
```json
{
  "token": "a1b2c3d4e5f6...",
  "message": "User has logged in Successfully!"
}
```

---

### Meeting History

#### Add Meeting to History

```http
POST /api/v1/users/add_to_activity
```

| Body Parameter | Type | Description |
|---|---|---|
| `token` | `string` | Auth token from login |
| `meeting_code` | `string` | Unique meeting code |

---

#### Get All Meeting History

```http
GET /api/v1/users/get_all_activity?token=<auth_token>
```

| Query Parameter | Type | Description |
|---|---|---|
| `token` | `string` | Auth token from login |

**Response:**
```json
[
  {
    "user_id": "john_doe",
    "meetingCode": "abc123",
    "date": "2026-04-03T19:00:00.000Z"
  }
]
```

---

## 🔌 Socket.IO Events

The signaling server handles the following real-time events:

| Event | Direction | Payload | Description |
|---|---|---|---|
| `join-call` | Client → Server | `path` (room URL) | Join a meeting room |
| `user-joined` | Server → Client | `socketId`, `clients[]` | Notify peers of new participant |
| `user-left` | Server → Client | `socketId` | Notify peers when someone disconnects |
| `signal` | Bidirectional | `toId`, `message` (SDP/ICE JSON) | Exchange WebRTC signaling data |
| `chat-message` | Bidirectional | `data`, `sender`, `socketId` | Send/receive in-call chat messages |

---

## 📱 App Pages & Routes

| Route | Page | Auth Required | Description |
|---|---|---|---|
| `/` | Landing Page | ❌ | Hero section with guest access and CTA |
| `/auth` | Authentication | ❌ | Login and registration forms |
| `/home` | Home Dashboard | ✅ | Join existing or create new meetings |
| `/history` | Meeting History | ✅ | View past meeting codes and dates |
| `/:url` | Video Meet | ❌ | Active video call room (dynamic URL) |

---

## 🔒 Authentication Flow

```
1. User registers → password hashed with bcrypt → saved to MongoDB
2. User logs in → credentials verified → random token generated (crypto)
3. Token stored in localStorage on the client
4. Protected routes check for token via `withAuth` HOC
5. API requests include token for user identification
```

---

## 📦 Key Dependencies

### Backend

| Package | Version | Purpose |
|---|---|---|
| `express` | ^5.2.1 | Web framework |
| `socket.io` | ^4.8.3 | Real-time WebSocket server |
| `mongoose` | ^9.3.0 | MongoDB object modeling |
| `bcrypt` | ^6.0.0 | Password hashing |
| `cors` | ^2.8.6 | Cross-Origin Resource Sharing |
| `nodemon` | ^3.1.14 | Dev server auto-restart |

### Frontend

| Package | Version | Purpose |
|---|---|---|
| `react` | ^19.2.4 | UI library |
| `react-dom` | ^19.2.4 | React DOM rendering |
| `react-router-dom` | ^7.13.1 | Client-side routing |
| `@mui/material` | ^7.3.9 | Material UI components |
| `@mui/icons-material` | ^7.3.9 | MUI icon pack |
| `socket.io-client` | ^4.8.3 | Socket.IO client |
| `axios` | ^1.13.6 | HTTP client |
| `vite` | ^8.0.0 | Build tool & dev server |

---

## 🧪 Running Scripts

### Backend

```bash
npm run dev       # Start with nodemon (auto-reload)
npm start         # Start with node (production)
```

### Frontend

```bash
npm run dev       # Start Vite dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

---

## 🌍 Deployment

VKonnect is deployed on **[Render](https://render.com/)**.

🔗 **Live URL:** [https://vkonnect-2.onrender.com/](https://vkonnect-2.onrender.com/)

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

## 👨‍💻 Author

**Vedansh Gupta**

- GitHub: [@VedanshGupta750](https://github.com/VedanshGupta750)

---


<p align="center">
  Made with ❤️ by Vedansh Gupta — <i>"Bringing hearts closer, one call at a time."</i>
</p>
