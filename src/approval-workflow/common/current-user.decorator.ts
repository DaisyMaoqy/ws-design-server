import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AwsUser } from './aws-auth.guard';

/** 从请求中取出 AwsAuthGuard 注入的当前用户 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AwsUser => {
    const req = ctx.switchToHttp().getRequest();
    return req.user as AwsUser;
  },
);
