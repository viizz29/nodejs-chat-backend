import { Injectable } from '@nestjs/common';
import { ChatHandleRepository } from './chat-handles.repository';

@Injectable()
export class ChatHandlesService {
  constructor(private readonly chatHandleRepository: ChatHandleRepository) {}

  async findByUserId(userId: number) {
    return this.chatHandleRepository.findByUserId(userId);
  }
}
