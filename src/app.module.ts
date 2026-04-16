import {
  DB_DATABASE,
  DB_PASSWORD,
  DB_USERNAME,
  SOCKETIO_ENDPOINT_ON,
} from './config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatModule } from './chat/chat.module';
import { RoomsModule } from './rooms/rooms.module';
import { RoomMembersModule } from './room_members/room_members.module';
import { MessagesModule } from './messages/messages.module';
import { ChatHandlesModule } from './chat-handles/chat-handles.module';

const imports = [
  AuthModule,
  UsersModule,
  RoomsModule,
  RoomMembersModule,
  MessagesModule,
  ChatHandlesModule,
  SequelizeModule.forRoot({
    dialect: 'postgres', // or 'mysql', 'sqlite', etc.
    host: 'localhost',
    port: 5432,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    autoLoadModels: true, // Automatically load models registered in modules
    synchronize: false, // Sync models with DB (don't use true in production!)
    define: {
      underscored: true, // This automatically maps isActive to is_active globally
    },
  }),
];

if (SOCKETIO_ENDPOINT_ON) {
  imports.push(ChatModule);
}

@Module({
  imports,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
