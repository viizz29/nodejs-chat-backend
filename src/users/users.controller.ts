import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { SearchUserDto } from './dto/search-user.dto';

@Controller('v1/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAllByNameOrEmail(@Query() query: SearchUserDto) {
    return this.usersService.findAllByNameOrEmail(query.q);
  }
}
