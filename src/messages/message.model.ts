import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'messages',
  timestamps: true,
})
export class Message extends Model {
  @Column
  room_id!: number;

  @Column
  fromUserId!: number;

  @Column
  toUserId!: number;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  content: any;
}
