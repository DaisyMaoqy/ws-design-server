import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { ApiResponse } from "../interfaces/response.interface";

/**
 * 全局异常过滤器
 * 捕获所有异常，统一返回 200 HTTP 状态码
 * 根据异常类型映射对应的业务错误码
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let code: string;
    let msg: string;

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // 提取错误信息
      if (typeof exceptionResponse === "string") {
        msg = exceptionResponse;
      } else if (
        typeof exceptionResponse === "object" &&
        exceptionResponse !== null
      ) {
        const resp = exceptionResponse as Record<string, any>;
        msg = resp.message || resp.msg || exception.message;
        // 如果是 ValidationPipe 返回的数组，取第一条
        if (Array.isArray(msg)) {
          msg = msg[0];
        }
      } else {
        msg = exception.message;
      }

      // 根据 HTTP 状态码映射业务错误码
      switch (status) {
        case HttpStatus.BAD_REQUEST:
          code = "400";
          break;
        case HttpStatus.UNAUTHORIZED:
          code = "401";
          break;
        case HttpStatus.FORBIDDEN:
          code = "403";
          break;
        case HttpStatus.NOT_FOUND:
          code = "404";
          break;
        case HttpStatus.CONFLICT:
          code = "409";
          break;
        case HttpStatus.UNPROCESSABLE_ENTITY:
          code = "422";
          break;
        default:
          code = String(status);
          break;
      }
    } else if (exception instanceof Error) {
      code = "500";
      msg = exception.message || "服务器内部错误";
    } else {
      code = "500";
      msg = "未知错误";
    }

    const errorResponse: ApiResponse = {
      code,
      msg,
      data: null,
    };

    // 统一返回 HTTP 200，业务错误码在 body 中体现
    response.status(HttpStatus.OK).json(errorResponse);
  }
}
