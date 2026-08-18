import { Global, Module } from "@nestjs/common";
import { AuthPrismaService } from "./auth-prisma.service";
import { WsDesignPrismaService } from "./ws-design-prisma.service";
import { AwsPrismaService } from "./approval-workflow-prisma.service";

/**
 * 全局数据库模块：统一提供并导出三个独立 Prisma client（对应三个物理库）。
 * 各业务模块按需注入其一，无需再各自 import：
 *   - AuthModule            → AuthPrismaService        (auth_db)
 *   - TenantModule/AppModule/WsDesignModule → WsDesignPrismaService (ws_design_db)
 *   - ApprovalWorkflowModule → AwsPrismaService        (approval-workflow_db)
 */
@Global()
@Module({
  providers: [AuthPrismaService, WsDesignPrismaService, AwsPrismaService],
  exports: [AuthPrismaService, WsDesignPrismaService, AwsPrismaService],
})
export class DatabaseModule {}
