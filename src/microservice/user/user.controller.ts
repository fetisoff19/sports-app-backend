import { CustomRequest, PublicUser } from '@common/types'
import { Controller, Delete, Get, Request } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { UserService } from './user.service'

@Controller('user')
// @UseGuards(AuthGuard)
@ApiTags('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get user info' })
  async getOne(@Request() req: CustomRequest) {
    return this.usersService.findAndGetPublicUser(req.user.id)
  }

  @Get('all')
  async getAll() {
    return this.usersService.findAll()
  }

  @Delete()
  async remove(@Request() req: CustomRequest) {
    return this.usersService.remove(req.user)
  }

  // @ApiOperation({ summary: 'Delete user and all workouts' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Return the email of the deleted user. Need remove tokens in local storage',
  // })
  // @ExcludeRoles('demo')
  // @UseGuards(RolesGuard)
  // @Delete()
  // @HttpCode(200)
  // async deleteUser(@HttpUser() user): Promise<string> {
  //   return this.usersService.deleteUser(user.id)
  // }
}
