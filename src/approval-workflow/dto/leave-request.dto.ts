import {
  IsString,
  Length,
  IsEnum,
  IsOptional,
  ValidateNested,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  LEAVE_TYPES,
  DATE_REGEX,
  REASON_MIN_LEAVE,
  REASON_MAX,
  NOTE_MAX,
} from './enums';

/** 创建请假：fields 包裹（E 决策） */
export class LeaveFieldsDto {
  // 请假事由下界为 5（已与用户确认取 5，与差旅的 10 不同）
  @IsString() @Length(REASON_MIN_LEAVE, REASON_MAX) reason: string;
  @IsEnum(LEAVE_TYPES) leaveType: string;
  @IsString() @Matches(DATE_REGEX, { message: 'leaveStart 格式应为 YYYY-MM-DD' })
  leaveStart: string;
  @IsString() @Matches(DATE_REGEX, { message: 'leaveEnd 格式应为 YYYY-MM-DD' })
  leaveEnd: string;
  @IsOptional() @IsString() @Length(0, NOTE_MAX) note?: string;
}

/** 编辑请假：所有字段可选 */
export class LeaveFieldsUpdateDto {
  @IsOptional() @IsString() @Length(REASON_MIN_LEAVE, REASON_MAX) reason?: string;
  @IsOptional() @IsEnum(LEAVE_TYPES) leaveType?: string;
  @IsOptional() @IsString() @Matches(DATE_REGEX) leaveStart?: string;
  @IsOptional() @IsString() @Matches(DATE_REGEX) leaveEnd?: string;
  @IsOptional() @IsString() @Length(0, NOTE_MAX) note?: string;
}

export class CreateLeaveRequestDto {
  @ValidateNested() @Type(() => LeaveFieldsDto) fields: LeaveFieldsDto;
}

export class UpdateLeaveRequestDto {
  @IsOptional() @ValidateNested() @Type(() => LeaveFieldsUpdateDto)
  fields?: LeaveFieldsUpdateDto;
}
