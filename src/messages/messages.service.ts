import { Injectable } from '@nestjs/common';
import { MessageRepository } from './messages.repository';
import { ChatGateway } from 'src/chat/chat.gateway';
import { RoomRepository } from 'src/rooms/rooms.repository';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly chatGateway: ChatGateway,
    private readonly roomRepository: RoomRepository,
  ) {}

  async findExchangedMessages(
    userId: number,
    roomId: number,
    cursor: number | null,
    limit: number,
  ) {
    const messages = await this.messageRepository.findExchangedMessages(
      userId,
      roomId,
      cursor,
      limit,
    );

    // console.log(messages[0]);

    return {
      data: messages,
      prev_cursor_id: messages.length > 0 ? messages[0].id : [0],
    };
  }

  async recordTextMessage(userId: number, roomId: number, text: string) {
    const content = {
      type: 'text',
      content: {
        text,
      },
    };

    const result = await this.messageRepository.recordTextMessage(
      userId,
      roomId,
      content,
    );

    // send notifications to all the concerned users
    const roomRecord = await this.roomRepository.findOne(roomId);
    if (roomRecord) {
      const { firstMemberId, secondMemberId } = roomRecord;

      const secondUserId =
        firstMemberId == userId ? secondMemberId : firstMemberId;

      this.chatGateway.emitToUser(`${secondUserId}`, 'new_message', {
        roomId,
        content,
      });
    }

    return result;
  }
}
