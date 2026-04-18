import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'rooms',
  timestamps: true,
})
export class Room extends Model {
  @Column
  type!: '1to1' | 'group';

  @Column
  firstMemberId!: number;

  @Column
  secondMemberId!: number;
}
