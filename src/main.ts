import { NestFactory } from "@nestjs/core";
import { RequestMethod } from "@nestjs/common";
import { AppModule } from "./app.module";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局前缀，匹配前端请求路径 /ws/admin/xxx
  // 排除 /api/eoms 开头的路径（设计包管理等模块使用独立前缀）
  app.setGlobalPrefix("ws/admin", {
    exclude: [{ path: "api/eoms/wsDesign/(.*)", method: RequestMethod.ALL }],
  });

  // 全局响应拦截器：统一包装返回体为 { code, msg, data }
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 全局异常过滤器：捕获所有异常，统一返回 200，业务错误码在 body 中
  app.useGlobalFilters(new AllExceptionsFilter());

  // 允许跨域
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
  console.log(`API base: http://localhost:${port}/ws/admin`);
}

bootstrap();
