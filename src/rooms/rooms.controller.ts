import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser, type JwtUser } from 'src/common/current-user.decorator';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('v1/rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  // @Get()
  // findAll() {
  //   return this.roomsService.findAll();
  // }

  // works
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('access-token')
  // @Get()
  // findAll(@Request() req: { user: { userId: number } }) {
  //   return this.roomsService.findByUserId(Number(req.user.userId));
  // }

  //   @UseInterceptors(EncodeIdInterceptor)

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Get()
  findAll(@CurrentUser() user: JwtUser) {
    return this.roomsService.findAllByUserId(Number(user.userId));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Get(':roomId')
  findOne(@Param('roomId') roomId: number, @CurrentUser() user: JwtUser) {
    return this.roomsService.findOne(user.userId, roomId);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Post()
  create(@Body() body: CreateRoomDto, @CurrentUser() user: JwtUser) {
    return this.roomsService.create(user.userId, body.secondMemberId);
  }
}
