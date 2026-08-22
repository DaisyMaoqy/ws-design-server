import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { AwsAuthGuard } from '../common/aws-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { AwsUser } from '../common/aws-auth.guard';
import { QueryRequestsDto } from '../dto/query-request.dto';
import {
  CreateLeaveRequestDto,
  UpdateLeaveRequestDto,
} from '../dto/leave-request.dto';
import { ActionDto, RejectActionDto } from '../dto/action.dto';

@Controller('aws/v1/leave-requests')
@UseGuards(AwsAuthGuard)
export class LeaveRequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get()
  list(@CurrentUser() user: AwsUser, @Query() q: QueryRequestsDto) {
    return this.requestService.queryRequests(user, q, 'leave');
  }

  @Post()
  create(@CurrentUser() user: AwsUser, @Body() dto: CreateLeaveRequestDto) {
    return this.requestService.createLeave(user, dto);
  }

  @Get('meta')
  meta() {
    return this.requestService.meta('leave');
  }

  @Get(':id')
  get(@CurrentUser() user: AwsUser, @Param('id') id: string) {
    return this.requestService.findOne(id, user);
  }

  @Put(':id')
  update(
    @CurrentUser() user: AwsUser,
    @Param('id') id: string,
    @Body() dto: UpdateLeaveRequestDto,
  ) {
    return this.requestService.updateLeave(id, user, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AwsUser, @Param('id') id: string) {
    return this.requestService.remove(id, user);
  }

  @Post(':id/submit')
  submit(
    @CurrentUser() user: AwsUser,
    @Param('id') id: string,
    @Body() dto: ActionDto,
  ) {
    return this.requestService.submit(id, user, dto);
  }

  @Post(':id/approve')
  approve(
    @CurrentUser() user: AwsUser,
    @Param('id') id: string,
    @Body() dto: ActionDto,
  ) {
    return this.requestService.approve(id, user, dto);
  }

  @Post(':id/reject')
  reject(
    @CurrentUser() user: AwsUser,
    @Param('id') id: string,
    @Body() dto: RejectActionDto,
  ) {
    return this.requestService.reject(id, user, dto);
  }

  @Post(':id/cancel')
  cancel(
    @CurrentUser() user: AwsUser,
    @Param('id') id: string,
    @Body() dto: ActionDto,
  ) {
    return this.requestService.cancel(id, user, dto);
  }

  @Post(':id/reedit')
  reedit(
    @CurrentUser() user: AwsUser,
    @Param('id') id: string,
    @Body() dto: ActionDto,
  ) {
    return this.requestService.reedit(id, user, dto);
  }
}
