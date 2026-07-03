import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 数据库种子数据初始化函数，用于创建系统基础测试数据
 * 按依赖关系依次清理旧数据并创建用户、租户、应用、设计包及部署配置等 Mock 数据
 * @throws {PrismaError} 当数据库操作失败时抛出异常
 */
async function main() {
  // 清理旧数据（先删子表/关联表，再删主表；同层级可并行）
  await prisma.sysUserTenant.deleteMany();
  await Promise.all([
    prisma.sysApp.deleteMany(),
    prisma.wsDesignDeploy.deleteMany(),
  ]);
  await Promise.all([
    prisma.sysTenant.deleteMany(),
    prisma.sysUser.deleteMany(),
    prisma.wsDesignPackage.deleteMany(),
  ]);

  // 创建用户
  // 密码: admin123 的 Base64 编码是 YWRtaW4xMjM=
  const user = await prisma.sysUser.create({
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

  // 创建租户
  const tenant1 = await prisma.sysTenant.create({
    data: {
      tenantId: 'tenant_001',
      name: '默认租户',
      code: 'default',
      prvCode: '440000',
      regFullCode: '440300',
      regFullName: '广东省/深圳市',
      teamFullCode: 'team_001',
    },
  });

  const tenant2 = await prisma.sysTenant.create({
    data: {
      tenantId: 'tenant_002',
      name: '测试租户',
      code: 'test',
      prvCode: '110000',
      regFullCode: '110100',
      regFullName: '北京市/市辖区',
      teamFullCode: 'team_002',
    },
  });

  // 创建用户-租户关联
  await prisma.sysUserTenant.create({
    data: {
      userId: user.id,
      tenantId: tenant1.id,
    },
  });

  await prisma.sysUserTenant.create({
    data: {
      userId: user.id,
      tenantId: tenant2.id,
    },
  });

  // 创建应用
  await prisma.sysApp.create({
    data: {
      appId: 'app_001',
      name: '工单设计器',
      code: 'ws_design',
      description: '通用工单引擎 - 表单设计器',
    },
  });

  await prisma.sysApp.create({
    data: {
      appId: 'app_002',
      name: '流程管理',
      code: 'flow_mgr',
      description: '工作流管理应用',
    },
  });

  // 创建设计包 Mock 数据
  const designPkg1 = await prisma.wsDesignPackage.create({
    data: {
      name: '通用工单',
      wsTypeName: '通用工单',
      wsTypeCode: 'common_ws',
      wsPrefix: 'GD',
      designGroup: '默认分组',
      remark: '这是一个示例设计包',
      processDesignId: 'process_common',
      usableRange: 'v2',
      taskForms: JSON.stringify([
        {
          taskName: '发起申请',
          formName: '申请表单',
          formKey: 'apply_form',
        },
      ]),
    },
  });

  const designPkg2 = await prisma.wsDesignPackage.create({
    data: {
      name: '故障报修工单',
      wsTypeName: '故障报修',
      wsTypeCode: 'repair_ws',
      wsPrefix: 'BX',
      designGroup: '运维分组',
      remark: '故障报修流程设计包',
      processDesignId: 'process_repair',
      usableRange: 'v2',
      taskForms: JSON.stringify([
        {
          taskName: '报修登记',
          formName: '报修单',
          formKey: 'repair_form',
        },
        {
          taskName: '维修处理',
          formName: '维修记录单',
          formKey: 'repair_record_form',
        },
      ]),
    },
  });

  // 创建部署配置 Mock 数据
  await prisma.wsDesignDeploy.create({
    data: {
      wsTypeCode: 'DesignDeploy',
      wsTypeName: '设计包部署',
      wsPrefix: 'DS',
      wsDesignPackageId: designPkg1.id,
      createFormInfo: JSON.stringify({
        configInfo: {
          form: {
            labelWidth: '120px',
            size: 'medium',
          },
          fields: [
            {
              type: 'input',
              label: '部署说明',
              model: 'description',
              placeholder: '请输入部署说明',
            },
          ],
        },
      }),
    },
  });

  console.log('Seed data created successfully!');
  console.log('---');
  console.log('测试账号: admin / admin123');
  console.log('租户: tenant_001 (默认租户), tenant_002 (测试租户)');
  console.log('设计包: 通用工单, 故障报修工单');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
