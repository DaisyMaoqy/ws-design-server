import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { TenantModule } from "./tenant/tenant.module";
import { AppModule } from "./app/app.module";
import { WsDesignModule } from "./ws-design.module";

/**
 * ws-design 产品模块（配置/设计端）
 * 聚合原 auth / tenant / app(authorization) / ws-design(设计包) 子模块，
 * 统一以 `ws/admin` 前缀对外（前缀写在各 Controller 上，见阶段三 3.2）。
 */
@Module({
  imports: [AuthModule, TenantModule, AppModule, WsDesignModule],
})
export class WsDesignProductModule {}
