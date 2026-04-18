import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ChatHandle } from './dto/chat-handle';
import { QueryTypes } from 'sequelize';

@Injectable()
export class ChatHandleRepository {
  constructor(private readonly sequelize: Sequelize) {}

  async findByUserId(userId: number): Promise<ChatHandle[]> {
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

    return individuals as ChatHandle[];

    // const groups = await this.sequelize.query(
    //   `SELECT
    //   json_build_array(user_id, sn) as id,
    //   title
    //   FROM rooms
    //   where user_id = :userId and type = :type
    //   `,
    //   {
    //     replacements: {
    //       userId,
    //       type: 'group',
    //     },
    //     type: QueryTypes.SELECT,
    //   },
    // );

    // return [...groups, ...individuals] as ChatHandle[];
  }
}
