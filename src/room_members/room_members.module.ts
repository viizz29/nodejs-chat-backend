import { Module } from '@nestjs/common';
import { RoomMembersService } from './room_members.service';
import { RoomMembersController } from './room_members.controller';

@Module({
  providers: [RoomMembersService],
  controllers: [RoomMembersController]
})
export class RoomMembersModule {}
