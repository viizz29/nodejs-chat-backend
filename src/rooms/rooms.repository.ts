import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Room } from './room.model';
import { Sequelize } from 'sequelize';

@Injectable()
export class RoomRepository {
  constructor(
    @InjectModel(Room)
    private roomModel: typeof Room,
  ) {}

  async findAll(): Promise<Room[]> {
    return this.roomModel.findAll({
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

  async findByUserId(user_id: number): Promise<Room[]> {
    return this.roomModel.findAll({
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
