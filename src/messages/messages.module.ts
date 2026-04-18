import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './message.model';
import { MessageRepository } from './messages.repository';
import { ChatModule } from 'src/chat/chat.module';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  imports: [SequelizeModule.forFeature([Message]), ChatModule, RoomsModule],
  controllers: [MessagesController],
  providers: [MessagesService, MessageRepository],
  exports: [MessageRepository],
})
export class MessagesModule {}
