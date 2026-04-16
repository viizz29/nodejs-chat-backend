import { Injectable } from '@nestjs/common';
import { MessageRepository } from './messages.repository';

@Injectable()
export class MessagesService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async findAll() {
    return this.messageRepository.findAll();
  }

  async findAllPaginated(page: number, limit: number) {
    return this.messageRepository.findAllPaginated(page, limit);
  }

  async findAllPaginated2(
    userId: number,
    roomSn: number,
    cursor: number | null,
    limit: number,
  ) {
    return this.messageRepository.findAllPaginated2(
      userId,
      roomSn,
      cursor,
      limit,
    );
  }

  async findExchangedMessages(
    userId: number,
    memberId: number,
    cursor: number | null,
    limit: number,
  ) {
    const messages = await this.messageRepository.findExchangedMessages(
      userId,
      memberId,
      cursor,
      limit,
    );

    console.log(messages[0]);

    return {
      data: messages,
      prev_cursor_id: messages.length > 0 ? messages[0].id : [0],
    };
  }
}
