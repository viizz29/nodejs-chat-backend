import { Injectable } from '@nestjs/common';
import { RoomRepository } from './rooms.repository';

@Injectable()
export class RoomsService {
  constructor(private readonly roomRepository: RoomRepository) {}

  async findAll() {
    return this.roomRepository.findAll();
  }

  async findByUserId(userId: number) {
    return this.roomRepository.findByUserId(userId);
  }
}
