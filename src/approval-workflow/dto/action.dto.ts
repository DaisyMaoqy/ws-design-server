import { IsOptional, IsString, Length } from 'class-validator';
import { COMMENT_MAX } from './enums';

/** submit / approve / cancel / reedit：comment 可选 */
export class ActionDto {
  @IsOptional()
  @IsString()
  @Length(0, COMMENT_MAX)
  comment?: string;
}

/** reject：comment 必填（≤200，对齐前端 REJECT_COMMENT_MAX_LENGTH） */
export class RejectActionDto {
  @IsString()
  @Length(1, COMMENT_MAX)
  comment: string;
}
