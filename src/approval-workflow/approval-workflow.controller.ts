import { Controller, Get } from "@nestjs/common";

/**
 * approval-workflow 产品占位控制器（流程/审批端）
 * 真实审批领域（用户/角色、申请类型、步骤、申请单详情等）按阶段三 3.4 后续补充，
 * 此处先以 `aws` 前缀提供 health 端点，验证模块路由与双实例开关。
 */
@Controller("aws")
export class ApprovalWorkflowController {
  @Get("health")
  health() {
    return { code: "0000", msg: "approval-workflow ok", data: null };
  }
}
