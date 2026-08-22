import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./prisma/database.module";
import { WsDesignProductModule } from "./ws-design/ws-design.product.module";
import { ApprovalWorkflowProductModule } from "./approval-workflow/approval-workflow.product.module";

/**
 * 双产品开关：ENABLE_MODULE 逗号分隔列出要加载的产品模块
 *   ws-design          → 配置/设计端（前缀 ws/admin）
 *   approval-workflow  → 流程/审批端（前缀 aws）
 * 未设置时加载全部（开发默认）。
 */
const enabledModules = process.env.ENABLE_MODULE
  ? process.env.ENABLE_MODULE.split(",").map((m) => m.trim())
  : null;

const loadWsDesign = !enabledModules || enabledModules.includes("ws-design");
const loadApprovalWorkflow =
  !enabledModules || enabledModules.includes("approval-workflow");

@Module({
  imports: [
    // 自动加载 env 文件：默认 .env，可用 ENV_FILE 指定实例配置
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV_FILE || ".env",
    }),
    DatabaseModule,
    ...(loadWsDesign ? [WsDesignProductModule] : []),
    ...(loadApprovalWorkflow ? [ApprovalWorkflowProductModule] : []),
  ],
})
export class AppModule {}
