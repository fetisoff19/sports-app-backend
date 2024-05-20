import { CustomRequest } from '@/common/types';
import { Controller, Delete, Get, Request } from '@nestjs/common';

import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  async getOne(@Request() req: CustomRequest) {
    return this.usersService.findAndGetPublicUser(req.user.uuid);
  }

  @Get('all')
  async getAll() {
    return this.usersService.findAll();
  }

  @Delete()
  async remove(@Request() req: CustomRequest) {
    return this.usersService.remove(req.user);
  }
}
