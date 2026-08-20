import { PrismaClient as AwsPrismaClient } from "@prisma/approval-client";

const awsPrisma = new AwsPrismaClient();

/**
 * approval_workflow_db（审批工作流库）种子数据初始化：
 * 当前 schema 仅含占位模型 AwsProcess，后续域模型补充后扩展。
 */
async function main() {
  // 清理旧数据
  await awsPrisma.awsProcess.deleteMany();

  // 创建占位数据
  await awsPrisma.awsProcess.create({
    data: {
      code: 'common_approval',
      name: '通用审批流程',
    },
  });

  console.log('approval_workflow_db seed data created successfully!');
  console.log('流程: common_approval (通用审批流程)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await awsPrisma.$disconnect();
  });
