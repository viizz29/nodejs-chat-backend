import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Room } from './room.model';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class RoomRepository {
  constructor(
    @InjectModel(Room)
    private roomModel: typeof Room,
    private readonly sequelize: Sequelize,
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

  async findByUserId(userId: number): Promise<Room[]> {
    const individuals = await this.sequelize.query(
      `SELECT
      json_build_array(r.id) as id,
      type,
      'No title' as title
      from rooms r
      where (r.first_member_id = :userId or r.second_member_id = :userId) and r.type = :type
      `,
      {
        replacements: {
          userId,
          type: '1to1',
        },
        type: QueryTypes.SELECT,
      },
    );

    return individuals as Room[];
  }
}
