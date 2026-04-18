import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './message.model';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectModel(Message)
    private messageModel: typeof Message,
    private readonly sequelize: Sequelize,
  ) {}

  // async findAllPaginated(page: number, limit: number) {
  //   const offset = (page - 1) * limit;

  //   const { rows, count } = await this.messageModel.findAndCountAll({
  //     limit,
  //     offset,
  //     order: [['createdAt', 'DESC']], // important for consistency
  //   });

  //   return {
  //     data: rows,
  //     meta: {
  //       total: count,
  //       page,
  //       limit,
  //       totalPages: Math.ceil(count / limit),
  //     },
  //   };
  // }

  async findExchangedMessages(
    userId: number,
    roomId: number,
    cursor: number | null,
    limit: number,
  ) {
    let where: any = {
      room_id: roomId,
    };

    console.log({ cursor });

    if (cursor) {
      where = {
        ...where,
        id: { [Op.lt]: cursor },
      };
    }

    const rows = await this.messageModel.findAll({
      attributes: {
        include: [
          'id',
          // 'fromUserId',
          // 'toUserId',
          'content',
          'createdAt',
          'updatedAt',
          [
            Sequelize.literal(`
        CASE 
          WHEN "from_user_id" = :userId THEN 'out'
          ELSE 'in'
        END
      `),
            'direction',
          ],
        ],
      },
      where,
      limit,
      order: [['id', 'DESC']],
      raw: true,
      replacements: {
        userId,
      },
    });

    return rows.reverse();
  }

  async recordTextMessage(userId: number, roomId: number, content: any) {
    // transaction
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

    const results = await this.sequelize.transaction(async (t: Transaction) => {
      const msg1 = await this.messageModel.create(
        {
          room_id: roomId,
          fromUserId: userId,
          content,
        },
        { transaction: t },
      );

      return msg1;
    });

    return results;
  }
}
