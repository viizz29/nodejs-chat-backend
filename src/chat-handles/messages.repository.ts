import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ChatHandle } from './dto/chat-handle';
import { QueryTypes } from 'sequelize';

@Injectable()
export class ChatHandleRepository {
  constructor(private readonly sequelize: Sequelize) {}

  async findByUserId(userId: number): Promise<ChatHandle[]> {
    const result = await this.sequelize.query(
      `SELECT 
      json_build_array(user_id, sn) as id, 
      title 
      FROM rooms 
      where user_id = :userId and type = :type
      `,
      {
        replacements: {
          userId,
          type: 'group',
        },
        type: QueryTypes.SELECT,
      },
    );

    const result2 = await this.sequelize.query(
      `SELECT
      json_build_array(rm.member_id) as id,
      u.name as title
      from rooms r
      left join room_members rm on (rm.user_id = r.user_id and rm.room_sn = r.sn)
      left join users u on u.id = rm.member_id
      where r.user_id = :userId and r.type = :type
      `,
      {
        replacements: {
          userId,
          type: 'self',
        },
        type: QueryTypes.SELECT,
      },
    );

    return [...result, ...result2] as ChatHandle[];
  }
}
