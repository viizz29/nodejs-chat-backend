import { Controller, Get, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser, type JwtUser } from 'src/common/current-user.decorator';

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
    return this.roomsService.findByUserId(Number(user.userId));
  }
}
