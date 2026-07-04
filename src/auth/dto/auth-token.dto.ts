import { IsString, IsEmail } from 'class-validator';
/**
 * 安装 class-validator
 * npm install class-validator class-transformer
 * 
 * class-validator：提供验证装饰器（如 @IsString()、@IsEmail() 等）
 * class-transformer：配合 ValidationPipe 进行数据转换
 * 
 * 在src/main.ts
 * import { ValidationPipe } from '@nestjs/common';
 * app.useGlobalPipes(new ValidationPipe());
 * 全局配置后，单模块的'class-validator'才会生效
 * */

export class AuthTokenDto {
  @IsString()
  userId: string;
  @IsString()
  password: string;
//   @IsEmail({}, { message: 'tenantId的邮箱格式无效'})
  @IsString()
  tenantId: string;
}