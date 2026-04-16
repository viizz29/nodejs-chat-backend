import {
  Column,
  Model,
  Table,
  PrimaryKey,
  DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'messages',
  timestamps: true,
})
export class Message extends Model {
  @PrimaryKey
  @Column
  userId!: number;

  @PrimaryKey
  @Column
  sn!: number;

  @Column
  roomSn!: number;

  @Column
  secondParty!: number;

  @Column
  direction!: 'in' | 'out';

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  content: any;
}
