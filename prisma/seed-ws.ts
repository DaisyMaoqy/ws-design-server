import { PrismaClient as WsDesignPrismaClient } from "@prisma/ws-client";

const wsPrisma = new WsDesignPrismaClient();

/**
 * ws_design_db（BPM 业务库）种子数据初始化：
 * 创建租户、应用、设计包及部署配置等 Mock 数据。
 */
async function main() {
  // 清理旧数据（先删子表/关联表，再删主表；同层级可并行）
  await Promise.all([
    wsPrisma.sysApp.deleteMany(),
    wsPrisma.wsDesignDeploy.deleteMany(),
  ]);
  await Promise.all([
    wsPrisma.sysTenant.deleteMany(),
    wsPrisma.wsDesignPackage.deleteMany(),
  ]);

  // 创建租户
  await wsPrisma.sysTenant.create({
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

  await wsPrisma.sysTenant.create({
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

  // 创建应用
  await wsPrisma.sysApp.create({
    data: {
      appId: 'app_001',
      name: '工单设计器',
      code: 'ws_design',
      description: '通用工单引擎 - 表单设计器',
    },
  });

  await wsPrisma.sysApp.create({
    data: {
      appId: 'app_002',
      name: '流程管理',
      code: 'flow_mgr',
      description: '工作流管理应用',
    },
  });

  // 创建设计包 Mock 数据
  const designPkg1 = await wsPrisma.wsDesignPackage.create({
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

  await wsPrisma.wsDesignPackage.create({
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
  await wsPrisma.wsDesignDeploy.create({
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

  console.log('ws_design_db seed data created successfully!');
  console.log('租户: tenant_001 (默认租户), tenant_002 (测试租户)');
  console.log('设计包: 通用工单, 故障报修工单');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await wsPrisma.$disconnect();
  });
