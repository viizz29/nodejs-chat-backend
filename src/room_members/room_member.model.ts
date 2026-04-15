import { Column, Model, Table, PrimaryKey } from 'sequelize-typescript';

@Table({
  tableName: 'room_members',
  timestamps: true,
})
export class RoomMember extends Model {
  @PrimaryKey
  @Column
  userId!: number;

  @PrimaryKey
  @Column
  roomSn!: number;

  @PrimaryKey
  @Column
  memberId!: number;

  @Column
  isApproved!: boolean;

  @Column
  isBlocked!: boolean;
}
