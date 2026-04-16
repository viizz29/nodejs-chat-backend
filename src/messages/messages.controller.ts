import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CurrentUser, type JwtUser } from 'src/common/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PaginationDto } from 'src/messages/dto/pagination.dto';
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
    const { handleId, cursorId } = query;
    // console.log({ handleId });
    const cursor: number | null = cursorId ? cursorId[1] : null;

    if (handleId.length == 1) {
      // memberId
      const memberId = handleId[0];

      return this.messageService.findExchangedMessages(
        user.userId,
        memberId,
        cursor,
        query.limit,
      );
    } else {
      // userId, roomSn
      const roomSn = handleId[1];
      return this.messageService.findAllPaginated2(
        user.userId,
        roomSn,
        cursor,
        query.limit,
      );
    }
  }
}
