import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RoomMember } from './room_member.model';

@Injectable()
export class RoomMemberRepository {
  constructor(
    @InjectModel(RoomMember)
    private roomMemberModel: typeof RoomMember,
  ) {}

  async findAll(): Promise<RoomMember[]> {
    return this.roomMemberModel.findAll({
      attributes: [
        'user_id',
        'room_sn',
        'member_id',
        'is_approved',
        'is_blocked',
        'created_at',
        'updated_at',
      ],
    });
  }
}
