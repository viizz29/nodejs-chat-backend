# NestJS Chat Backend (Socket.IO)

## Overview

This is a scalable chat backend built using **NestJS**, **Socket.IO**, and **PostgreSQL (via Sequelize)**.  
It supports real-time messaging, user presence, message delivery status, and modular architecture.

---

## Features

- Real-time messaging using WebSockets (Socket.IO)
- Modular architecture (Users, Messages, Chat Gateway)
- REST APIs + WebSocket events
- PostgreSQL with Sequelize ORM
- JWT-based authentication
- Scalable and production-ready structure

---

## Tech Stack

- NestJS
- Socket.IO
- PostgreSQL
- Sequelize
- TypeScript

---

## Project Structure

```
src/
├── app.module.ts
├── main.ts
├── modules/
│   ├── users/
│   ├── messages/
│   ├── auth/
│   └── chat/
│       ├── chat.gateway.ts
│       ├── chat.service.ts
│       └── chat.module.ts
├── common/
│   ├── interceptors/
│   ├── filters/
│   └── guards/
```

---

## Installation

```bash
git clone https://github.com/viizz29/nodejs-chat-backend
cd chat-backend
npm install
```

---

## Environment Variables

Create a `.env` file:

```
APP_ENV=dev
PORT=3000
API_BASE_URL=/api
DOCS_URL=/docs
SOCKETIO_ENDPOINT=/ws
SOCKETIO_ENDPOINT_ON=true

JWT_SECRET=jwtsecret


DB_DATABASE=chat223
DB_USERNAME=postgres
DB_PASSWORD=thepassword
DB_HOST=127.0.0.1
```

---

## Running the App

```bash
# development
npm run start:dev

# production
npm run build
npm run start:prod
```

---

## WebSocket Events

### Client → Server

- `send_message`
- `join_room`
- `leave_room`
- `typing`

### Server → Client

- `receive_message`
- `user_online`
- `user_offline`
- `message_delivered`
- `message_read`

---

## Sample Gateway

```ts
@WebSocketGateway({
  cors: true,
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('send_message')
  handleMessage(@MessageBody() payload: any) {
    this.server.to(payload.room).emit('receive_message', payload);
  }
}
```

---

## REST APIs

### Auth

- POST `/auth/login`
- POST `/auth/register`

### Users

- GET `/users`
- GET `/users/:id`

### Messages

- GET `/messages/:roomId`
- POST `/messages`

---

## Database Models

### User

- id
- name
- email
- password

### Message

- id
- fromUserId
- toUserId
- content
- status
- createdAt

---

## Scaling Strategy

- Use Redis adapter for Socket.IO
- Horizontal scaling with load balancer
- Store messages in DB, not memory
- Use message queues (Kafka/RabbitMQ) for heavy workloads

---

## Testing

```bash
npm run test
npm run test:e2e
```

---

## Future Improvements

- Group chat support
- File/media sharing
- Push notifications
- End-to-end encryption

---

## License

MIT
