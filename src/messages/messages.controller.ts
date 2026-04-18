import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CurrentUser, type JwtUser } from 'src/common/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PaginationCursorDto } from './dto/pagination-cursor.dto';

@Controller('v1/messages')
export class MessagesController {
  constructor(private messageService: MessagesService) {}

  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('access-token')
  // @Get()
  // findAll(@CurrentUser() user: JwtUser) {
  //   return this.messageService.findAll();
  // }

  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('access-token')
  // @Get()
  // findAll(@Query() query: PaginationDto) {
  //   const { handleId } = query;
  //   console.log({ handleId });
  //   return this.messageService.findAllPaginated(query.page, query.limit);
  // }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Get()
  findAll(@Query() query: PaginationCursorDto, @CurrentUser() user: JwtUser) {
    const { roomId, cursorId } = query;
    // console.log({ cursorId });

    return this.messageService.findExchangedMessages(
      user.userId,
      roomId,
      cursorId,
      query.limit,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Post(':roomId')
  handleAction(
    @Param('roomId') roomId: number,
    @Body() body: { text: string },
    @CurrentUser() user: JwtUser,
  ) {
    const { text } = body;

    console.log({ roomId, userId: user.userId });

    return this.messageService.recordTextMessage(user.userId, roomId, text);
  }
}
