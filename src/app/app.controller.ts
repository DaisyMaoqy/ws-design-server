import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller("authorization")
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * GET /ws/admin/authorization/apps
   */
  @Get("apps")
  async getApps() {
    return this.appService.getApps();
  }
}
