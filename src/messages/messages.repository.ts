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

  async findAll(): Promise<Message[]> {
    return this.messageModel.findAll({
      attributes: [
        'userId',
        'sn',
        'roomSn',
        'secondParty',
        'direction',
        'content',
        'created_at',
        'updated_at',
      ],
    });
  }

  async findAllPaginated(page: number, limit: number) {
    const offset = (page - 1) * limit;

    const { rows, count } = await this.messageModel.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']], // important for consistency
    });

    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async findAllPaginated2(
    userId: number,
    roomSn: number,
    cursor: number | null,
    limit: number,
  ) {
    let where: any = { user_id: userId, room_sn: roomSn };

    if (cursor) {
      where = {
        ...where,
        sn: { [Op.lt]: cursor },
      };
    }

    const rows = await this.messageModel.findAll({
      where,
      limit,
      order: [['sn', 'DESC']],
    });

    return rows;
  }

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

  async recordIndividualTextMessage(
    userId: number,
    secondPartyId: number,
    text: string,
  ) {
    const content = {
      type: 'text',
      content: {
        text,
      },
    };

    // transaction
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const results = await this.sequelize.transaction(async (t: Transaction) => {
      // find the 'self' room sn of the sending user
      // const selfRoom1 = await this.messageModel.findOne({
      //   attributes:[

      //   ]
      // })

      const msg1 = await this.messageModel.create(
        {
          userId,
          sn: 1,
          roomSn: 1,
          secondParty: secondPartyId,
          direction: 'out',
          content,
        },
        { transaction: t },
      );

      // find the 'self' room sn of the second party

      return msg1;
    });

    return results;
  }
}
