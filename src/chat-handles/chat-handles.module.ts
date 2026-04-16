import { Module } from '@nestjs/common';
import { ChatHandlesService } from './chat-handles.service';
import { ChatHandlesController } from './chat-handles.controller';
import { ChatHandleRepository } from './messages.repository';

@Module({
  providers: [ChatHandlesService, ChatHandleRepository],
  controllers: [ChatHandlesController],
  exports: [ChatHandleRepository],
})
export class ChatHandlesModule {}
