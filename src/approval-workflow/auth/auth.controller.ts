import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { AwsAuthService } from './aws-auth.service';
import { LoginDto } from '../dto/login.dto';

@Controller('aws/v1/auth')
export class AuthController {
  constructor(private readonly authService: AwsAuthService) {}

  /** POST /aws/v1/auth/login —— 免鉴权 */
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
