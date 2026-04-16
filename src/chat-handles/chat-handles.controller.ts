import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ChatHandlesService } from './chat-handles.service';
import { CurrentUser, type JwtUser } from 'src/common/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('v1/chat-handles')
export class ChatHandlesController {
  constructor(private chatHandleService: ChatHandlesService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Get()
  findAll(@CurrentUser() user: JwtUser) {
    return this.chatHandleService.findByUserId(user.userId);
  }

  // @Get()
  // test(@Req() req: Request) {
  //   console.log(req.headers); // 👈 ALL headers

  //   return { ok: true };
  // }
}
