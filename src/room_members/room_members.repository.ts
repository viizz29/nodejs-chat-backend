import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
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
        'sn',
        'type',
        'title',
        'created_at',
        'updated_at',
      ],
    });
  }

  async findByUserId(user_id: number): Promise<RoomMember[]> {
    return this.roomMemberModel.findAll({
      attributes: [
        [
          Sequelize.fn(
            'json_build_array',
            Sequelize.col('user_id'),
            Sequelize.col('sn'),
          ),
          'id',
        ],
        'type',
        'title',
      ],
      where: { user_id },
    });
  }
}
