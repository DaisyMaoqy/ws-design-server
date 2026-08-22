import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AwsAuthGuard } from '../common/aws-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { AwsUser } from '../common/aws-auth.guard';

@Controller('aws/v1/users')
@UseGuards(AwsAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** GET /aws/v1/users/me */
  @Get('me')
  getMe(@CurrentUser() user: AwsUser) {
    return this.userService.getMe(user);
  }

  /** GET /aws/v1/users?department=&role= */
  @Get()
  list(@Query('department') department?: string, @Query('role') role?: string) {
    return this.userService.listUsers(department, role);
  }

  /** GET /aws/v1/users/:id/requests */
  @Get(':id/requests')
  requests(@Param('id') id: string) {
    return this.userService.getUserRequests(id);
  }

  /** GET /aws/v1/users/:id */
  @Get(':id')
  get(@Param('id') id: string) {
    return this.userService.getUser(id);
  }
}
