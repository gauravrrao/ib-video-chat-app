# 🎥 Video Calling & Real-Time Chat Application

A full-stack real-time communication application built with **Node.js and Express.js**, with the goal of supporting **1-to-1 video calling, real-time chat, authentication, and WebRTC-based peer-to-peer communication**.

The project is being developed incrementally, starting with the backend authentication and API foundation and gradually adding real-time communication capabilities.

> 🚧 **Project Status:** In Development

---

## 📌 Overview

This project is designed to explore how modern real-time communication applications work under the hood.

The application will allow users to:

- Create an account
- Sign in securely
- Authenticate API requests using JWT
- Communicate through real-time chat
- Initiate and receive video calls
- Establish peer-to-peer connections using WebRTC
- Exchange WebRTC signaling information through a real-time communication layer
- Manage call and connection state

The main goal of the project is not only to build a working video-chat application, but also to understand the **backend architecture behind real-time communication systems**.

---

# 🚀 Planned Features

## 🔐 Authentication

- User registration
- User login
- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes
- Authentication middleware

## 💬 Real-Time Chat

- 1-to-1 messaging
- Real-time message delivery
- Online/offline presence
- Message timestamps
- Typing indicators
- Message delivery status

## 📹 Video Calling

- 1-to-1 video calls
- Camera and microphone access
- Incoming call handling
- Call accept/reject functionality
- End call functionality
- Mute/unmute microphone
- Enable/disable camera

## 🌐 WebRTC

The video communication layer will use **WebRTC** for peer-to-peer media communication.

WebRTC allows browsers to establish a direct connection for exchanging:

```text
Audio
Video
Data
```

The backend does not need to continuously proxy the actual video stream.

Instead, the backend will primarily be responsible for **signaling**.

---

# 🏗️ High-Level Architecture

The planned architecture looks like this:

```text
                    ┌─────────────────────┐
                    │      Client A       │
                    │                     │
                    │  Browser            │
                    │  Camera / Mic       │
                    └──────────┬──────────┘
                               │
                               │
                         Signaling
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Node.js Server   │
                    │                     │
                    │      Express        │
                    │                     │
                    │ Authentication      │
                    │ Signaling           │
                    │ Chat                │
                    └──────────┬──────────┘
                               │
                               │
                         Signaling
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Client B       │
                    │                     │
                    │  Browser            │
                    │  Camera / Mic       │
                    └─────────────────────┘

                         WebRTC
                 Client A ←──────→ Client B
                    Audio / Video
```

The important distinction is:

```text
Node.js
   │
   └── Signaling

WebRTC
   │
   └── Audio / Video
```

The Node.js server coordinates the connection, while WebRTC handles the peer-to-peer media communication.

---

# 🔄 How Video Calling Will Work

A WebRTC call generally follows this sequence:

```text
User A
   │
   │ 1. Start Call
   ▼
Backend / Signaling Server
   │
   │ 2. Notify User B
   ▼
User B
   │
   │ 3. Accept Call
   ▼
WebRTC Negotiation
   │
   ├── SDP Offer
   ├── SDP Answer
   └── ICE Candidates
   │
   ▼
Peer Connection Established
   │
   ▼
Audio + Video
User A ←────────────────→ User B
```

---

# 🧠 WebRTC Signaling

WebRTC itself does not define a specific signaling server.

The application needs a mechanism for two clients to exchange information required to establish a peer connection.

Typical signaling data includes:

```text
SDP Offer
SDP Answer
ICE Candidates
Call Events
```

For example:

```text
User A
   │
   │ SDP Offer
   ▼
Signaling Server
   │
   │ SDP Offer
   ▼
User B
```

User B generates an answer:

```text
User B
   │
   │ SDP Answer
   ▼
Signaling Server
   │
   │ SDP Answer
   ▼
User A
```

After ICE candidate exchange and successful negotiation, the browsers can establish the WebRTC connection.

---

# 🔐 Authentication

The current backend contains JWT-based authentication.

The authentication flow is:

```text
Signup
   │
   ▼
Password
   │
   ▼
bcrypt hashing
   │
   ▼
User stored
```

Login:

```text
Username + Password
        │
        ▼
   Password check
        │
        ▼
      JWT
        │
        ▼
      Client
```

Protected request:

```text
Client
   │
   │ JWT
   ▼
Authentication Middleware
   │
   ├── Valid token → next()
   │
   └── Invalid token → reject
```

---

# 🔑 JWT Authentication

The backend uses JSON Web Tokens to authenticate protected requests.

Conceptually:

```text
POST /signin
        │
        ▼
Validate credentials
        │
        ▼
Generate JWT
        │
        ▼
Return token
```

The client can then send the token with subsequent requests.

The authentication middleware validates the token before allowing access to protected endpoints.

---

# 🔒 Password Security

Passwords should never be stored as plain text.

Instead:

```text
Password
   │
   ▼
bcrypt
   │
   ▼
Password Hash
   │
   ▼
Database
```

During login:

```text
Password entered
       │
       ▼
bcrypt comparison
       │
       ▼
Hash matches?
    /       \
  Yes        No
   │          │
   ▼          ▼
Generate     Reject
JWT          login
```

---

# 📡 Planned Real-Time Communication

The application will use a persistent real-time communication mechanism for events such as:

```text
MESSAGE_SENT
MESSAGE_RECEIVED

CALL_STARTED
CALL_ACCEPTED
CALL_REJECTED
CALL_ENDED

SDP_OFFER
SDP_ANSWER
ICE_CANDIDATE

USER_ONLINE
USER_OFFLINE

TYPING_STARTED
TYPING_STOPPED
```

A simplified event flow:

```text
Client A
   │
   │ emit("message")
   ▼
Real-Time Server
   │
   │ emit("message")
   ▼
Client B
```

---

# 💬 Chat Architecture

The planned chat system will separate the communication layer from persistent message storage.

```text
                Client A
                   │
                   │ Message
                   ▼
             Real-Time Layer
                   │
            ┌──────┴──────┐
            │             │
            ▼             ▼
        Client B       Database
```

The real-time layer is responsible for immediate delivery.

The database is responsible for persistent message history.

This distinction is important:

```text
Real-time communication
        ≠
Persistent storage
```

---

# 📞 Call State

A video call can be modeled as a state machine.

```text
IDLE
 │
 │ initiate call
 ▼
RINGING
 │
 ├───────────────┐
 │               │
 │ accept        │ reject
 ▼               ▼
CONNECTING      ENDED
 │
 │ WebRTC connected
 ▼
CONNECTED
 │
 │ end call
 ▼
ENDED
```

Possible states:

```text
IDLE
RINGING
ACCEPTED
CONNECTING
CONNECTED
REJECTED
ENDED
FAILED
```

This makes call behavior easier to reason about than having unrelated boolean flags.

---

# 📁 Current Project Structure

The repository is currently intentionally small:

```text
ib-video-chat-app/
│
├── index.js
│
├── package.json
│
├── package-lock.json
│
└── .gitignore
```

The current backend is implemented primarily in:

```text
index.js
```

The project will evolve toward a structure similar to:

```text
ib-video-chat-app/
│
├── src/
│   │
│   ├── controllers/
│   │
│   ├── routes/
│   │
│   ├── middleware/
│   │
│   ├── services/
│   │
│   ├── models/
│   │
│   ├── sockets/
│   │
│   ├── utils/
│   │
│   └── app.js
│
├── public/
│
├── package.json
├── package-lock.json
└── README.md
```

---

# 🛠️ Tech Stack

## Backend

- **Node.js**
- **Express.js**
- **JWT**
- **bcrypt**

The current repository already contains Express, JWT, bcrypt, and CORS dependencies.

## Planned Real-Time Layer

- WebSocket / Socket-based signaling
- WebRTC

## Planned Frontend

- React
- WebRTC Browser APIs
- Real-time communication client

## Planned Persistence

A database will be introduced as the application moves beyond the current in-memory user implementation.

---

# 📡 Current API

## Signup

```http
POST /signup
```

Request:

```json
{
  "name": "gaurav",
  "password": "password123"
}
```

Response:

```text
user created successfully
```

---

## Signin

```http
POST /signin
```

Request:

```json
{
  "name": "gaurav",
  "password": "password123"
}
```

Response:

```json
{
  "token": "JWT_TOKEN"
}
```

---

## Protected Route

```http
GET /me
```

The endpoint is protected by the authentication middleware.

The current implementation expects the JWT in the request's `token` header.

---

# ▶️ Getting Started

## Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/gauravrrao/ib-video-chat-app.git
```

```bash
cd ib-video-chat-app
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Start the Backend

```bash
node index.js
```

The current Express server listens on:

```text
http://localhost:3000
```

---

# 🧪 Current Development Status

The project is being developed incrementally.

### Completed

- [x] Express server
- [x] JSON request parsing
- [x] User signup endpoint
- [x] Password hashing with bcrypt
- [x] JWT generation
- [x] JWT authentication middleware
- [x] Protected `/me` endpoint

### In Progress

- [ ] Persistent database
- [ ] User model
- [ ] Frontend
- [ ] Real-time messaging
- [ ] Socket-based signaling
- [ ] WebRTC peer connection
- [ ] Video call UI
- [ ] Call state management

### Future Improvements

- [ ] Refresh tokens
- [ ] Secure environment variables
- [ ] Input validation
- [ ] Centralized error handling
- [ ] Rate limiting
- [ ] User presence
- [ ] Call history
- [ ] Message persistence
- [ ] Typing indicators
- [ ] Screen sharing
- [ ] File sharing
- [ ] Reconnection handling
- [ ] TURN server support
- [ ] Production deployment

---

# 🧩 Engineering Concepts

This project is also being used to understand several backend and real-time system concepts.

### Authentication

```text
JWT
bcrypt
Middleware
Protected routes
```

### Real-Time Systems

```text
Persistent connections
Event-driven communication
Connection lifecycle
Presence
Message delivery
```

### WebRTC

```text
PeerConnection
SDP
ICE
STUN
TURN
NAT traversal
Media streams
```

### Backend Architecture

```text
API layer
Authentication
Business logic
Real-time communication
Persistence
Error handling
```

---

# 🌐 WebRTC Architecture

A simplified production architecture can eventually look like:

```text
                         ┌──────────────────┐
                         │   Node.js API    │
                         │                  │
                         │ Authentication   │
                         │ User Management  │
                         └────────┬─────────┘
                                  │
                                  │
                         ┌────────▼─────────┐
                         │ Signaling Layer  │
                         │                  │
                         │ Offer / Answer   │
                         │ ICE Candidates   │
                         │ Call Events      │
                         └────────┬─────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
              ┌───────────┐               ┌───────────┐
              │  Client A  │               │  Client B  │
              │            │               │            │
              │ Camera     │               │ Camera     │
              │ Microphone │               │ Microphone │
              └─────┬─────┘               └─────┬─────┘
                    │                             │
                    │                             │
                    └────── WebRTC P2P ──────────┘
                          Audio / Video
```

For users behind restrictive NAT/firewall environments, a production WebRTC deployment may require STUN/TURN infrastructure.

---

# 🎯 Project Goals

The primary goal of this project is to build a complete real-time communication system while understanding the engineering behind it.

The project focuses on:

1. Building REST APIs with Node.js and Express
2. Implementing authentication
3. Understanding JWT-based authorization
4. Building real-time communication
5. Understanding WebRTC signaling
6. Establishing peer-to-peer video connections
7. Handling connection failures
8. Managing call state
9. Persisting chat messages
10. Designing the system for multiple concurrent users

---

# 📚 Learning Objectives

By completing this project, the following concepts will be explored:

```text
HTTP
 │
 ├── REST APIs
 ├── Authentication
 └── Authorization
       │
       ▼
Real-Time Communication
 │
 ├── WebSockets
 ├── Events
 └── Connection Management
       │
       ▼
WebRTC
 │
 ├── SDP
 ├── ICE
 ├── STUN
 ├── TURN
 └── PeerConnection
       │
       ▼
Distributed System Concerns
 │
 ├── Presence
 ├── Reconnection
 ├── Race Conditions
 ├── Scalability
 └── Failure Handling
```

---

# 🚧 Roadmap

### Phase 1 — Backend Foundation

- [x] Express server
- [x] Signup
- [x] Login
- [x] Password hashing
- [x] JWT authentication

### Phase 2 — Database

- [ ] Add database
- [ ] User model
- [ ] Conversation model
- [ ] Message model
- [ ] Call model

### Phase 3 — Real-Time Chat

- [ ] Persistent connections
- [ ] Message events
- [ ] Online presence
- [ ] Typing indicators
- [ ] Message persistence

### Phase 4 — Video Calling

- [ ] WebRTC integration
- [ ] Signaling server
- [ ] SDP offer/answer
- [ ] ICE candidate exchange
- [ ] Local media stream
- [ ] Remote media stream
- [ ] Call lifecycle

### Phase 5 — Production Improvements

- [ ] Input validation
- [ ] Centralized error handling
- [ ] Rate limiting
- [ ] Secure secrets
- [ ] Logging
- [ ] Monitoring
- [ ] TURN infrastructure
- [ ] Horizontal scaling
- [ ] Redis for distributed real-time state

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

If you find a bug or have an idea for improving the architecture, feel free to open an issue or submit a pull request.

---

# 📄 License

This project is currently licensed under the terms specified in the repository.

---

## 👨‍💻 Author

**Gaurav Rao**

Built as a hands-on project to understand:

**Node.js + Express + Authentication + Real-Time Communication + WebRTC + System Design**

---