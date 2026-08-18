import { Module } from "@nestjs/common";
import { ApprovalWorkflowController } from "./approval-workflow.controller";

/**
 * approval-workflow 产品模块（流程/审批端）
 * 以 `aws` 前缀对外。真实业务模块（auth / 审批流程等）按阶段三 3.4 后续接入。
 */
@Module({
  controllers: [ApprovalWorkflowController],
})
export class ApprovalWorkflowProductModule {}
