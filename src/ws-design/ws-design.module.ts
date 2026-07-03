import { Module } from "@nestjs/common";
import { WsDesignController } from "./ws-design.controller";
import { WsDesignService } from "./ws-design.service";

@Module({
  controllers: [WsDesignController],
  providers: [WsDesignService],
})
export class WsDesignModule {}
