import {
  IsOptional,
  IsIn,
  IsString,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { APPLICATION_TYPES, REQUEST_STATUSES } from './enums';

/** 跨类型列表 / scope 查询（GET /aws/v1/requests） */
export class QueryRequestsDto {
  @IsOptional() @IsIn([...APPLICATION_TYPES]) type?: string;
  // 'all' | 'pending' | 单状态
  @IsOptional()
  @IsIn(['all', 'pending', ...REQUEST_STATUSES])
  status?: string;
  @IsOptional() @IsString() keyword?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(2000) year?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(12) month?: number;
  @IsOptional() @IsString() applicantId?: string;
  @IsOptional() @IsString() department?: string;
  @IsOptional() @IsIn(['all', 'mine', 'todo']) scope?: 'all' | 'mine' | 'todo';
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) pageSize?: number = 20;
  @IsOptional() @IsIn(['updated', 'submitted']) sort?: 'updated' | 'submitted';
}
