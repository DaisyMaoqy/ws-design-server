import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class WsDesignService {
  constructor(private prisma: PrismaService) {}

  /**
   * 分页查询设计包列表
   */
  async pageQuery(params: {
    pageNum: number;
    pageSize: number;
    total: number;
    wsTypeName?: string;
  }) {
    const { pageNum = 1, pageSize = 10, wsTypeName } = params;

    const where: any = {};
    if (wsTypeName) {
      where.wsTypeName = { contains: wsTypeName };
    }

    const [list, total] = await Promise.all([
      this.prisma.wsDesignPackage.findMany({
        where,
        skip: (pageNum - 1) * pageSize,
        take: pageSize,
        orderBy: { createTime: "desc" },
      }),
      this.prisma.wsDesignPackage.count({ where }),
    ]);

    return { list, total };
  }

  /**
   * 新增设计包
   */
  async addWsDesign(data: any) {
    const { taskFormReqs, ...rest } = data;
    const record = await this.prisma.wsDesignPackage.create({
      data: {
        ...rest,
        taskForms: taskFormReqs ? JSON.stringify(taskFormReqs) : null,
      },
    });
    return record;
  }

  /**
   * 修改设计包
   */
  async updateWsDesign(data: any) {
    const { id, taskFormReqs, taskForms, ...rest } = data;

    const existing = await this.prisma.wsDesignPackage.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException("设计包不存在");
    }

    const taskFormsData = taskFormReqs || taskForms;
    const record = await this.prisma.wsDesignPackage.update({
      where: { id },
      data: {
        ...rest,
        taskForms: taskFormsData ? JSON.stringify(taskFormsData) : undefined,
      },
    });
    return record;
  }

  /**
   * 根据ID查询设计包详情
   */
  async findById(designPackageId: number) {
    const record = await this.prisma.wsDesignPackage.findUnique({
      where: { id: designPackageId },
    });
    if (!record) {
      throw new NotFoundException("设计包不存在");
    }

    // 解析 taskForms 字段，前端需要 taskForms 数组
    let taskForms = [];
    try {
      if (record.taskForms) {
        taskForms = JSON.parse(record.taskForms);
      }
    } catch {}

    return {
      ...record,
      taskForms,
      taskFormReqs: taskForms,
    };
  }

  /**
   * 删除设计包
   */
  async deleteWsDesign(ids: number[]) {
    const result = await this.prisma.wsDesignPackage.deleteMany({
      where: { id: { in: ids } },
    });
    return result;
  }

  /**
   * 部署设计包（Mock）
   */
  async deploy(wsDesignPackageId: number) {
    // Mock: 只验证设计包存在
    const record = await this.prisma.wsDesignPackage.findUnique({
      where: { id: wsDesignPackageId },
    });
    if (!record) {
      throw new NotFoundException("设计包不存在");
    }
    return { success: true };
  }

  /**
   * 组部署（Mock）
   */
  async groupDeploy(wsDesignPackageId: number) {
    return this.deploy(wsDesignPackageId);
  }

  /**
   * 根据 BPM Key 查询表单信息
   */
  async queryFormByBpmKey(bpmKey: string) {
    // 查找关联该流程定义的设计包
    const record = await this.prisma.wsDesignPackage.findFirst({
      where: { processDesignId: bpmKey },
      orderBy: { createTime: "desc" },
    });

    let taskForms = [];
    if (record?.taskForms) {
      try {
        taskForms = JSON.parse(record.taskForms);
      } catch {}
    }

    return { taskForms };
  }

  /**
   * 查询最新部署配置
   */
  async queryLastByWsTypeCode(wsTypeCode: string) {
    const record = await this.prisma.wsDesignDeploy.findFirst({
      where: { wsTypeCode },
      orderBy: { createTime: "desc" },
    });

    if (!record) {
      throw new NotFoundException("未找到部署配置");
    }

    return record;
  }

  /**
   * 导出设计包（返回设计包数据，前端会处理成文件下载）
   */
  async exportWsDesign(designPackageId: number) {
    const record = await this.prisma.wsDesignPackage.findUnique({
      where: { id: designPackageId },
    });
    if (!record) {
      throw new NotFoundException("设计包不存在");
    }
    return record;
  }

  /**
   * 导入设计包
   */
  async importWsDesign(data: any) {
    const { taskFormReqs, taskForms, ...rest } = data;
    const taskFormsData = taskFormReqs || taskForms;
    const record = await this.prisma.wsDesignPackage.create({
      data: {
        ...rest,
        taskForms: taskFormsData ? JSON.stringify(taskFormsData) : null,
      },
    });
    return record;
  }
}
