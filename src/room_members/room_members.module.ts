import { Module } from '@nestjs/common';
import { RoomMembersService } from './room_members.service';
import { RoomMembersController } from './room_members.controller';
import { RoomMember } from './room_member.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoomMemberRepository } from './room_members.repository';

@Module({
  imports: [SequelizeModule.forFeature([RoomMember])],
  providers: [RoomMembersService, RoomMemberRepository],
  controllers: [RoomMembersController],
  exports: [RoomMemberRepository],
})
export class RoomMembersModule {}
