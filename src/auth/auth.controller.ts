import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  // 直接初始化，不用构造注入
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
  ) {}

  /**
   * POST /ws/admin/auth/token
   * 用户密码登录
   */
  @Post("token")
  async login(
    @Body() body: { userId: string; password: string; tenantId: string },
  ) {
    const { userId, password, tenantId } = body;
    // 打印userId
    this.logger.log('userId:', userId);
    // 打印password
    this.logger.log('password:', password);
    if (!userId || !password) {
      throw new BadRequestException("用户名和密码不能为空");
    }

    return this.authService.login(userId, password, tenantId);
  }

  /**
   * GET /ws/admin/auth/token/ticket
   * SSO Ticket 登录
   */
  @Get("token/ticket")
  async loginByTicket(
    @Query("ticket") ticket: string,
    @Query("ssoId") ssoId: string,
  ) {
    return this.authService.loginByTicket(ticket, ssoId);
  }

  /**
   * GET /ws/admin/auth/user/getUserByNetuserid
   * 根据 netuserId 获取用户信息
   */
  @Get("user/getUserByNetuserid")
  async getUserByNetuserid(@Query("netuserid") netuserid: string) {
    return this.authService.getUserByNetuserId(netuserid);
  }
}
