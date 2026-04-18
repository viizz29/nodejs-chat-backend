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

  async findOne(roomId: number) {
    return this.roomModel.findOne({ where: { id: roomId }, raw: true });
  }

  async findOneByUserIdAndRoomId(userId: number, roomId: number) {
    return await this.sequelize.query(
      `
      select 
      r.id,
      CASE 
          WHEN u1.id = :userId THEN u2.name
          ELSE u1.name
      END as Title
      from 
      rooms r
      left join users u1 on u1.id = r.first_member_id
      left join users u2 on u2.id = r.second_member_id
      where r.id = :id`,
      {
        replacements: { id: roomId, userId },
      },
    );
  }

  async create(firstMemberId: number, secondMemberId: number): Promise<Room> {
    return this.roomModel.create({
      firstMemberId,
      secondMemberId,
    });
  }

  async findAllByUserId(userId: number): Promise<Room[]> {
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
