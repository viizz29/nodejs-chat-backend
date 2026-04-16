import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './message.model';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectModel(Message)
    private messageModel: typeof Message,
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
    memberId: number,
    cursor: number | null,
    limit: number,
  ) {
    let where: any = { user_id: userId, second_party: memberId };

    if (cursor) {
      where = {
        ...where,
        sn: { [Op.lt]: cursor },
      };
    }

    const rows = await this.messageModel.findAll({
      attributes: [
        [
          Sequelize.fn(
            'json_build_array',
            Sequelize.col('user_id'),
            Sequelize.col('sn'),
          ),
          'id',
        ],
        'direction',
        'content',
        'createdAt',
        'updatedAt',
      ],
      where,
      limit,
      order: [['sn', 'DESC']],
    });

    return rows;
  }
}
