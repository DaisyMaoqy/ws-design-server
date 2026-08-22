import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { AwsAuthGuard } from '../common/aws-auth.guard';
import { DashboardQueryDto } from '../dto/dashboard.dto';

@Controller('aws/v1/reports')
@UseGuards(AwsAuthGuard)
export class ReportController {
  constructor(private readonly requestService: RequestService) {}

  /** GET /aws/v1/reports/dashboard */
  @Get('dashboard')
  dashboard(@Query() q: DashboardQueryDto) {
    return this.requestService.dashboard(q);
  }
}
