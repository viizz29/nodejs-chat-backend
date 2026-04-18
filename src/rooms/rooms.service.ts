import { Injectable } from '@nestjs/common';
import { RoomRepository } from './rooms.repository';

@Injectable()
export class RoomsService {
  constructor(private readonly roomRepository: RoomRepository) {}

  async create(firstMemberId: number, secondMemberID: number) {
    return this.roomRepository.create(firstMemberId, secondMemberID);
  }

  async findAllByUserId(userId: number) {
    return this.roomRepository.findAllByUserId(userId);
  }

  async findOne(userId: number, roomId: number) {
    return this.roomRepository.findOneByUserIdAndRoomId(userId, roomId);
  }
}
