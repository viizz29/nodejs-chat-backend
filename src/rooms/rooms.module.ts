import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Room } from './room.model';
import { RoomRepository } from './rooms.repository';

@Module({
  imports: [SequelizeModule.forFeature([Room])],
  providers: [RoomsService, RoomRepository],
  controllers: [RoomsController],
  exports: [RoomRepository],
})
export class RoomsModule {}
