import { Controller, Get, Query } from "@nestjs/common";
import { TenantService } from "./tenant.service";

@Controller("tenant")
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  /**
   * GET /ws/admin/tenant/getTenantListByUserId?userId=xxx
   */
  @Get("getTenantListByUserId")
  async getTenantListByUserId(@Query("userId") userId: string) {
    return this.tenantService.getTenantListByUserId(userId);
  }
}
