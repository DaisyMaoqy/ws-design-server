import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { AwsAuthGuard } from '../common/aws-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { AwsUser } from '../common/aws-auth.guard';
import { QueryRequestsDto } from '../dto/query-request.dto';
import { BatchActionDto } from '../dto/batch-action.dto';

@Controller('aws/v1/requests')
@UseGuards(AwsAuthGuard)
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  /** GET /aws/v1/requests（跨类型列表：?type=&status=&scope=&keyword=...） */
  @Get()
  list(@CurrentUser() user: AwsUser, @Query() q: QueryRequestsDto) {
    return this.requestService.queryRequests(user, q);
  }

  /** POST /aws/v1/requests/batch */
  @Post('batch')
  batch(@CurrentUser() user: AwsUser, @Body() dto: BatchActionDto) {
    return this.requestService.batch(user, dto);
  }
}
