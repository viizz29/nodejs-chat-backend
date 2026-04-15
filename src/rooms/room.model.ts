import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
} from 'sequelize-typescript';

@Table({
  tableName: 'rooms',
  timestamps: true,
})
export class Room extends Model {
  @PrimaryKey
  @Column
  user_id!: number;

  @PrimaryKey
  @Column
  sn!: number;

  @Column
  type!: 'self' | 'group';

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  title!: string;
}
