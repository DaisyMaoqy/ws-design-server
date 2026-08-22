import { PrismaClient as AuthPrismaClient } from "@prisma/auth-client";

const authPrisma = new AuthPrismaClient();

/**
 * auth_db（认证/用户身份库）种子数据初始化：
 * 创建系统管理员用户及用户-租户关联（tenantId 为逻辑外键字符串，
 * 对应 ws_design seed 中创建的 SysTenant.tenantId）。
 */
async function main() {
  // 清理旧数据（先删关联表，再删主表）
  await authPrisma.sysUserTenant.deleteMany();
  await authPrisma.sysUser.deleteMany();

  // 创建用户
  // 密码: admin123 的 Base64 编码是 YWRtaW4xMjM=
  const user = await authPrisma.sysUser.create({
    data: {
      userId: 'admin',
      username: '管理员',
      password: 'admin123', // 明文存储，后端验证时对比 Base64 解码后的值
      email: 'admin@example.com',
      mobilephone: '13800138000',
      companyName: '中盈科技',
      companyCode: 'zy_tech',
      netuserId: 'admin',
      userType: 'admin',
      prvId: 'prv_001',
      prvName: '广东省',
      regId: 'reg_001',
      regName: '深圳市',
    },
  });

  // 创建用户-租户关联（tenantId/tenantName 与 ws_design seed 保持一致）
  await authPrisma.sysUserTenant.create({
    data: {
      user: { connect: { id: user.id } },
      tenantId: 'tenant_001',
      tenantName: '默认租户',
    },
  });

  await authPrisma.sysUserTenant.create({
    data: {
      user: { connect: { id: user.id } },
      tenantId: 'tenant_002',
      tenantName: '测试租户',
    },
  });

  console.log('auth_db seed data created successfully!');
  console.log('测试账号: admin / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await authPrisma.$disconnect();
  });
