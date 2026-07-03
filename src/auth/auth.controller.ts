import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  BadRequestException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /ws/admin/auth/token
   * 用户密码登录
   */
  @Post("token")
  async login(
    @Body() body: { userId: string; password: string; tenantId: string },
  ) {
    const { userId, password, tenantId } = body;

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
