import { PrismaClient as AwsPrismaClient } from '@prisma/approval-client';

const awsPrisma = new AwsPrismaClient();

/**
 * approval_workflow_db（审批工作流库）种子数据：
 * - User 组织表（D2 决策，role / managerId / department 存于此）
 * - 少量示例申请单，便于联调列表 / 待办 / 报表
 */
async function main() {
  // 清空（先删申请单，再删用户，避免外键约束）
  await awsPrisma.request.deleteMany();
  await awsPrisma.user.deleteMany();

  // ---- 用户 / 组织 ----
  const manager = await awsPrisma.user.create({
    data: {
      employeeId: 'M001',
      name: '王经理',
      title: '研发经理',
      department: '研发中心',
      role: 'manager',
    },
  });
  const finance = await awsPrisma.user.create({
    data: {
      employeeId: 'F001',
      name: '李财务',
      title: '财务专员',
      department: '财务部',
      role: 'finance',
    },
  });
  const zhang = await awsPrisma.user.create({
    data: {
      employeeId: 'E001',
      name: '张三',
      title: '软件工程师',
      department: '研发中心',
      role: 'employee',
      managerId: manager.id,
    },
  });
  const li = await awsPrisma.user.create({
    data: {
      employeeId: 'E002',
      name: '李四',
      title: '软件工程师',
      department: '研发中心',
      role: 'employee',
      managerId: manager.id,
    },
  });

  // ---- 示例申请单 ----
  await awsPrisma.request.create({
    data: {
      id: 'TR-0001',
      type: 'travel',
      applicantId: zhang.id,
      applicantName: zhang.name,
      department: zhang.department,
      status: 'draft',
      reason: '赴客户现场支持系统上线',
      urgency: 'normal',
      note: '含跨城高铁与三晚住宿',
      legs: {
        create: [
          {
            from: '北京',
            to: '上海',
            departDate: '2026-09-01',
            returnDate: '2026-09-03',
            transport: 'train',
          },
        ],
      },
      budget: {
        create: {
          transport: 55300,
          hotel: 90000,
          allowance: 30000,
          other: 0,
        },
      },
    },
  });

  const leave = await awsPrisma.request.create({
    data: {
      id: 'LV-0001',
      type: 'leave',
      applicantId: li.id,
      applicantName: li.name,
      department: li.department,
      status: 'pending_manager',
      reason: '家里有事需请假处理',
      leaveType: 'personal',
      leaveStart: '2026-09-10',
      leaveEnd: '2026-09-12',
      submittedAt: new Date('2026-08-20T08:00:00.000Z'),
      audit: {
        create: {
          at: new Date('2026-08-20T08:00:00.000Z'),
          actorId: li.id,
          actorName: li.name,
          action: 'submit',
          from: 'draft',
          to: 'pending_manager',
        },
      },
    },
  });

  await awsPrisma.request.create({
    data: {
      id: 'TR-0002',
      type: 'travel',
      applicantId: zhang.id,
      applicantName: zhang.name,
      department: zhang.department,
      status: 'pending_finance',
      reason: '参加行业技术大会并交流',
      urgency: 'urgent',
      note: '差旅合计超 1 万元，附说明',
      legs: {
        create: [
          {
            from: '深圳',
            to: '北京',
            departDate: '2026-10-01',
            returnDate: '2026-10-04',
            transport: 'flight',
          },
        ],
      },
      budget: {
        create: {
          transport: 200000,
          hotel: 120000,
          allowance: 40000,
          other: 30000,
        },
      },
      audit: {
        create: [
          {
            at: new Date('2026-08-18T08:00:00.000Z'),
            actorId: zhang.id,
            actorName: zhang.name,
            action: 'submit',
            from: 'draft',
            to: 'pending_manager',
          },
          {
            at: new Date('2026-08-19T08:00:00.000Z'),
            actorId: manager.id,
            actorName: manager.name,
            action: 'approve',
            from: 'pending_manager',
            to: 'pending_finance',
            comment: '同意，费用合理',
          },
        ],
      },
    },
  });

  console.log('approval_workflow_db seed 完成：');
  console.log('  用户：M001(经理) / F001(财务) / E001(张三) / E002(李四，张三同部门)');
  console.log('  申请单：TR-0001(草稿) / LV-0001(待主管) / TR-0002(待财务)');
  void leave;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await awsPrisma.$disconnect();
  });
