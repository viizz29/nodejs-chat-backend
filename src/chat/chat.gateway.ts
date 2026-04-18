import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { JWT_SECRET, SOCKETIO_ENDPOINT } from 'src/config';

@WebSocketGateway({
  path: `${SOCKETIO_ENDPOINT}`,
  cors: {
    origin: '*', // Adjust for production security
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private userSockets = new Map<string, Set<string>>();

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      // Extract token from handshake headers or auth object
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      // Verify the JWT
      const payload = await this.jwtService.verifyAsync(token, {
        secret: JWT_SECRET, // Match your AuthModule secret
      });

      // Attach user data to the client object for later use
      client.data.user = payload;
      console.log(`Client connected: ${client.id} (User: ${payload.sub})`);

      const userId = payload.sub;

      // if (!userId) return;

      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }

      this.userSockets.get(userId)?.add(client.id);
    } catch (e) {
      console.log(`Connection rejected: ${e.message}`);
      client.disconnect(); // Terminate connection if unauthorized
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, sockets] of this.userSockets.entries()) {
      if (sockets.has(client.id)) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
        break;
      }
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  // 1. Listen for the "hello" event
  @SubscribeMessage('hello')
  handleHello(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): string {
    // This logs on your terminal
    console.log(`Received hello from ${client.id}:`, data);

    // 2. This returns a response ONLY to the sender (Acknowledgement)
    return 'Hello from the WebSocket server!';
  }

  // 3. Alternatively, emit a message to everyone
  @SubscribeMessage('broadcast-hello')
  handleBroadcast(@MessageBody() data: { name: string }) {
    return this.server.emit('greetings', {
      message: `Hello ${data.name}! Welcome to the world.`,
    });
  }

  emitToUser(userId: string, event: string, payload: any) {
    const sockets = this.userSockets.get(userId);
    if (!sockets) return;

    sockets.forEach((socketId) => {
      this.server.to(socketId).emit(event, payload);
    });
  }
}
