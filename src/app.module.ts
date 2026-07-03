import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { TenantModule } from "./tenant/tenant.module";
import { AppModule as ApplicationModule } from "./app/app.module";
import { PrismaModule } from "./prisma/prisma.module";
import { WsDesignModule } from "./ws-design/ws-design.module";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    TenantModule,
    ApplicationModule,
    WsDesignModule,
  ],
})

export class AppModule {}
