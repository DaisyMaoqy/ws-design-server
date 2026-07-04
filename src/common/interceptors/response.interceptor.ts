import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiResponse } from "../interfaces/response.interface";

/**
 * 全局响应拦截器
 * 统一包装所有成功响应为 { code: '200', msg: '成功', data: xxx }
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    // 统一成功响应的 HTTP 状态码为 200，与全局异常过滤器对称
    // （否则 @Post 路由会走 NestJS 默认的 201）
    context.switchToHttp().getResponse().status(200);

    return next.handle().pipe(
      map((data) => {
        // 如果返回值已经是标准格式，则不再包装
        if (
          data &&
          typeof data === "object" &&
          "code" in data &&
          "msg" in data &&
          "data" in data
        ) {
          return data;
        }
        
        const successResponse: ApiResponse = {
          code: "200",
          msg: "成功",
          data: data ?? null,
        };
        return successResponse;
      }),
    );
  }
}
