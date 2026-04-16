import { Injectable } from '@nestjs/common';
import { RoomMemberRepository } from './room_members.repository';

@Injectable()
export class RoomMembersService {
  constructor(private readonly roomMememberRepository: RoomMemberRepository) {}
  async findAll() {
    return this.roomMememberRepository.findAll();
  }
}
