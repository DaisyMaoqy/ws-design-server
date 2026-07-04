import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { AuthTokenDto } from "./dto/auth-token.dto";

@Injectable()
export class AuthService {
    // 直接初始化，不用构造注入
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * 用户登录
   * 前端使用 Base64 编码密码后传输，这里解码后对比
   */
  // async login(userId: string, passwordBase64: string, tenantId: string) {
  async login(body: AuthTokenDto) {
    // 1. Base64 解码密码
    let plainPassword: string;
    const { userId, password, tenantId } = body;

    try {
      plainPassword = Buffer.from(password, "base64").toString("utf-8");
    } catch {
      throw new UnauthorizedException("密码格式错误");
    }

    // 2. 查找用户
    const user = await this.prisma.sysUser.findUnique({
      where: { userId },
    });

    if (!user) {
      throw new UnauthorizedException("用户名或密码错误");
    }

    // 3. 验证密码（简单明文对比，生产环境应使用 bcrypt）
    this.logger.debug('plainPassword：', plainPassword);
    this.logger.debug('user.password：', user.password);
    if (user.password !== plainPassword) {
      throw new UnauthorizedException("用户名或密码错误");
    }

    // 4. 查找用户关联的租户
    const userTenants = await this.prisma.sysUserTenant.findMany({
      where: { userId: user.id },
      include: { tenant: true },
    });

    if (userTenants.length === 0) {
      throw new UnauthorizedException("该用户未关联任何租户");
    }

    // 5. 如果没有指定 tenantId，使用第一个租户
    const selectedTenantExt = tenantId
      ? userTenants.find((ut) => ut.tenant.tenantId === tenantId)
      : userTenants[0];

    if (!selectedTenantExt) {
      throw new UnauthorizedException("用户未关联该租户");
    }

    // 6. 查找该租户下的默认省份信息
    const tenant = selectedTenantExt.tenant;

    // 7. 生成 JWT Token
    const payload = {
      userId: user.userId,
      username: user.username,
      name: user.username,
      tenantId: tenant.tenantId,
      sub: user.id,
    };
    const token = this.jwtService.sign(payload);

    // 8. 构建响应数据，匹配前端期望的字段结构
    const tenantExtList = userTenants.map((ut) => ({
      id: ut.tenant.tenantId,
      name: ut.tenant.name,
      code: ut.tenant.code,
      prvCode: ut.tenant.prvCode,
      regFullCode: ut.tenant.regFullCode,
      regFullName: ut.tenant.regFullName,
      teamFullCode: ut.tenant.teamFullCode,
    }));

    const defaultProv = {
      prvCode: tenant.prvCode || "440000",
      prvName: "广东省",
    };

    const defaultRegion = {
      regFullCode: tenant.regFullCode || "440300",
      regFullName: tenant.regFullName || "广东省/深圳市",
    };

    const defaultTeam = {
      teamFullCode: tenant.teamFullCode || "team_001",
    };

    return {
      token,
      userId: user.userId,
      id: user.userId,
      username: user.username,
      name: user.username,
      netuserId: user.netuserId,
      userType: user.userType,
      email: user.email,
      mobilephone: user.mobilephone,
      companyName: user.companyName,
      companyCode: user.companyCode,
      prvId: user.prvId,
      prvName: user.prvName,
      regId: user.regId,
      regName: user.regName,
      tenantExtList,
      defaultProv,
      defaultRegion,
      defaultTeam,
      teams: tenantExtList.map((t) => ({
        ...t,
        typecode: "default",
      })),
      grps: [],
      originUserInfo: {
        username: user.username,
        name: user.username,
        userId: user.userId,
        email: user.email,
        mobilephone: user.mobilephone,
      },
    };
  }

  /**
   * SSO Ticket 登录（简化版，仅用于 Mock）
   */
  async loginByTicket(ticket: string, ssoId: string) {
    // Mock: 直接返回 admin 用户的登录信息
    return this.login({
      userId: "admin",
      password: Buffer.from("admin123").toString("base64"),
      tenantId: "tenant_001"}
    );
  }

  /**
   * 获取用户信息
   */
  async getUserByNetuserId(netuserId: string) {
    const user = await this.prisma.sysUser.findFirst({
      where: { netuserId },
    });

    if (!user) {
      throw new UnauthorizedException("用户不存在");
    }

    return {
      username: user.username,
      name: user.username,
      userId: user.userId,
      email: user.email,
      mobilephone: user.mobilephone,
    };
  }
}
