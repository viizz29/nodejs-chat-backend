import { Controller, Get, UseGuards } from '@nestjs/common';
import { RoomMembersService } from './room_members.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser, type JwtUser } from 'src/common/current-user.decorator';

@Controller('room-members')
export class RoomMembersController {
  constructor(private roomMemberService: RoomMembersService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Get()
  findAll(@CurrentUser() user: JwtUser) {
    return this.roomMemberService.findAll();
  }
}
