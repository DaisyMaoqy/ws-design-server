import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  /**
   * 获取应用列表
   */
  async getApps() {
    const apps = await this.prisma.sysApp.findMany({
      where: { status: 1 },
    });

    return apps.map((app) => ({
      id: app.appId,
      name: app.name,
      code: app.code,
      description: app.description,
    }));
  }
}
