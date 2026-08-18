import { Injectable } from "@nestjs/common";
import { AuthPrismaService } from "../../prisma/auth-prisma.service";

@Injectable()
export class TenantService {
  constructor(private prisma: AuthPrismaService) {}

  /**
   * 根据 userId 获取租户列表
   * 用户-租户归属在 auth_db，租户展示字段已冗余，无需跨库查 SysTenant
   */
  async getTenantListByUserId(userId: string) {
    // 先查用户（auth_db）
    const user = await this.prisma.sysUser.findUnique({
      where: { userId },
    });

    if (!user) {
      return [];
    }

    // 查用户关联的租户（auth_db，含冗余展示字段）
    const userTenants = await this.prisma.sysUserTenant.findMany({
      where: { userId: user.id },
    });

    return userTenants.map((ut) => ({
      id: ut.tenantId,
      name: ut.tenantName,
      code: ut.tenantCode,
      prvCode: ut.prvCode,
      regFullCode: ut.regFullCode,
      regFullName: ut.regFullName,
      teamFullCode: ut.teamFullCode,
    }));
  }
}
