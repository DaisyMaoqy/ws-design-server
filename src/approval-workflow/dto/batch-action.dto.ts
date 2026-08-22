import { IsArray, IsString, IsIn, IsOptional, Length } from 'class-validator';
import { COMMENT_MAX } from './enums';

/** 批量 RPC（POST /aws/v1/requests/batch） */
export class BatchActionDto {
  @IsIn(['approve', 'reject', 'cancel'])
  action: 'approve' | 'reject' | 'cancel';
  @IsArray() @IsString({ each: true }) ids: string[];
  // reject 时必填（Service 层按 action 校验）
  @IsOptional() @IsString() @Length(0, COMMENT_MAX) comment?: string;
}
