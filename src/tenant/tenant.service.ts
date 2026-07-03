import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  /**
   * 根据 userId 获取租户列表
   */
  async getTenantListByUserId(userId: string) {
    // 先查用户
    const user = await this.prisma.sysUser.findUnique({
      where: { userId },
    });

    if (!user) {
      return [];
    }

    // 查用户关联的租户
    const userTenants = await this.prisma.sysUserTenant.findMany({
      where: { userId: user.id },
      include: { tenant: true },
    });

    return userTenants.map((ut) => ({
      id: ut.tenant.tenantId,
      name: ut.tenant.name,
      code: ut.tenant.code,
      prvCode: ut.tenant.prvCode,
      regFullCode: ut.tenant.regFullCode,
      regFullName: ut.tenant.regFullName,
      teamFullCode: ut.tenant.teamFullCode,
    }));
  }
}
